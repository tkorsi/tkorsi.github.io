import snapshot from './githubActivitySnapshot.json' with { type: 'json' }

export const PROFILE_URL = 'https://github.com/tkorsi'
export const CONTRIBUTIONS_URL = 'https://github-contributions-api.jogruber.de/v4/tkorsi?y=last'
// One public API page: newest 100 owned repositories, then the three eligible projects.
export const REPOSITORIES_URL =
  'https://api.github.com/users/tkorsi/repos?type=owner&sort=pushed&direction=desc&per_page=100'

export type ContributionDay = { date: string; count: number; level: number }
export type ContributionData = {
  days: ContributionDay[]
  total: number
  from: string
  to: string
}
export type Repository = {
  name: string
  url: string
  description: string
  language: string | null
  pushedAt: string
}
export type SourceState<T> = {
  data: T | null
  fetchedAt: string | null
  status: 'live' | 'cached' | 'snapshot' | 'unavailable'
  error: string | null
}

const DAY_MS = 86_400_000
const CACHE_TTL = 7 * DAY_MS
const CACHE_PREFIX = 'tkorsi-public-activity-v1:'
const REPOSITORIES_CACHE_KEY = CACHE_PREFIX + 'repositories-auto-v2'
const LEGACY_EXCLUSIONS_KEY = CACHE_PREFIX + 'unavailable-repositories'
type RepositorySelection = { data: Repository[]; fetchedAt: string; selectionCheckedAt: string }
let repositorySelection: RepositorySelection | null = null
const TIMEOUT_MS = 10_000

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validTime(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

/** Reject incomplete or malformed calendars instead of silently inventing missing zero days. */
export function parseContributions(value: unknown): ContributionData {
  if (!record(value) || !Array.isArray(value.contributions)) {
    throw new Error('Contribution data is unavailable.')
  }
  const values: unknown[] = value.contributions
  if (values.length < 350 || values.length > 380) {
    throw new Error('The contribution calendar is incomplete.')
  }
  const days = values.map((day): ContributionDay => {
    if (
      !record(day) ||
      typeof day.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
      !validTime(day.date) ||
      new Date(day.date).toISOString().slice(0, 10) !== day.date ||
      typeof day.count !== 'number' ||
      !Number.isSafeInteger(day.count) ||
      day.count < 0 ||
      typeof day.level !== 'number' ||
      !Number.isInteger(day.level) ||
      day.level < 0 ||
      day.level > 4
    ) {
      throw new Error('The contribution calendar could not be verified.')
    }
    return { date: day.date, count: day.count, level: day.level }
  })
  for (let index = 1; index < days.length; index++) {
    if (Date.parse(days[index].date) - Date.parse(days[index - 1].date) !== DAY_MS) {
      throw new Error('The contribution calendar has missing or duplicate days.')
    }
  }
  const total = days.reduce((sum, day) => sum + day.count, 0)
  if (!Number.isSafeInteger(total)) throw new Error('Invalid contribution total.')
  return { days, total, from: days[0].date, to: days[days.length - 1].date }
}

function parseCalendarCache(value: unknown): ContributionData {
  if (!record(value)) throw new Error('Invalid saved calendar.')
  return parseContributions({ contributions: value.days })
}

function safeRepositoryName(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[A-Za-z0-9._-]{1,100}$/.test(value) &&
    value !== '.' &&
    value !== '..' &&
    value.toLowerCase() !== 'tkorsi.github.io'
  )
}

function parseSavedRepositories(value: unknown): Repository[] {
  if (!Array.isArray(value) || value.length > 3) throw new Error('Invalid saved repositories.')
  const values: unknown[] = value
  const seen = new Set<string>()
  return values.map((repo): Repository => {
    if (
      !record(repo) ||
      !safeRepositoryName(repo.name) ||
      seen.has(repo.name.toLowerCase()) ||
      repo.url !== `${PROFILE_URL}/${repo.name}` ||
      typeof repo.description !== 'string' ||
      repo.description.length > 1000 ||
      !(
        repo.language === null ||
        (typeof repo.language === 'string' && repo.language.length <= 100)
      ) ||
      !validTime(repo.pushedAt)
    ) {
      throw new Error('Invalid saved repository metadata.')
    }
    seen.add(repo.name.toLowerCase())
    return {
      name: repo.name,
      url: repo.url,
      description: repo.description,
      language: repo.language,
      pushedAt: repo.pushedAt,
    }
  })
}

/** Normalize only eligible public personal projects; never persist raw API responses. */
export function parsePublicRepository(value: unknown): Repository | null {
  if (
    !record(value) ||
    typeof value.name !== 'string' ||
    !record(value.owner) ||
    typeof value.owner.login !== 'string' ||
    typeof value.private !== 'boolean' ||
    typeof value.fork !== 'boolean' ||
    typeof value.archived !== 'boolean' ||
    typeof value.disabled !== 'boolean' ||
    typeof value.size !== 'number' ||
    !Number.isSafeInteger(value.size) ||
    value.size < 0
  ) {
    throw new Error('Repository metadata could not be verified.')
  }
  if (
    value.private !== false ||
    value.owner.login !== 'tkorsi' ||
    value.fork ||
    value.archived ||
    value.disabled ||
    value.pushed_at === null ||
    value.name.toLowerCase() === 'tkorsi.github.io'
  ) {
    return null
  }
  return parseSavedRepositories([
    {
      name: value.name,
      url: value.html_url,
      description: value.description ?? '',
      language: value.language ?? null,
      pushedAt: value.pushed_at,
    },
  ])[0]
}

/** GitHub can report size:0 shortly after a first push; commits establish actual content. */
async function hasPublicCommit(name: string, signal?: AbortSignal): Promise<boolean> {
  const response = await request(
    `https://api.github.com/repos/tkorsi/${name}/commits?per_page=1`,
    signal,
  )
  if (response.status === 404 || response.status === 409) return false
  if (!response.ok || !Array.isArray(response.value) || response.value.length > 1) {
    throw new Error('Repository contents could not be verified.')
  }
  const values: unknown[] = response.value
  if (values.length === 0) return false
  const commit = values[0]
  if (!record(commit) || typeof commit.sha !== 'string' || !/^[a-f0-9]{40}$/i.test(commit.sha)) {
    throw new Error('Repository contents could not be verified.')
  }
  return true
}

type RepositoryCandidate = { repo: Repository; needsCommitCheck: boolean }

function publicCandidates(value: unknown): RepositoryCandidate[] {
  if (!Array.isArray(value) || value.length > 100) {
    throw new Error('The public repository list could not be verified.')
  }
  const values: unknown[] = value
  const candidates = values.flatMap((item) => {
    const repo = parsePublicRepository(item)
    return repo && record(item) ? [{ repo, needsCommitCheck: item.size === 0 }] : []
  })
  return candidates.sort((a, b) => {
    const byPush = Date.parse(b.repo.pushedAt) - Date.parse(a.repo.pushedAt)
    if (byPush) return byPush
    return a.repo.name < b.repo.name ? -1 : a.repo.name > b.repo.name ? 1 : 0
  })
}

async function selectCandidates(
  candidates: RepositoryCandidate[],
  options: { signal?: AbortSignal } = {},
  onUnavailable?: (name: string) => void,
): Promise<Repository[]> {
  const seen = new Set<string>()
  const selected: Repository[] = []
  let probes = 0
  for (const { repo, needsCommitCheck } of candidates) {
    const name = repo.name.toLowerCase()
    if (seen.has(name)) continue
    seen.add(name)
    if (needsCommitCheck) {
      if (probes >= 5) continue
      probes++
      if (!(await hasPublicCommit(repo.name, options.signal))) {
        onUnavailable?.(name)
        continue
      }
    }
    selected.push(repo)
    if (selected.length === 3) break
  }
  return selected
}

/** Scan only the newest 100 public repos; probe at most five zero-size candidates per refresh. */
export async function selectPublicRepositories(
  value: unknown,
  options: { signal?: AbortSignal } = {},
): Promise<Repository[]> {
  return selectCandidates(publicCandidates(value), options)
}

function initial<T>(
  key: string,
  bundled: { data: unknown; fetchedAt: string },
  parse: (value: unknown) => T,
): SourceState<T> {
  try {
    const raw = globalThis.localStorage.getItem(CACHE_PREFIX + key)
    if (raw && raw.length < 100_000) {
      const cached: unknown = JSON.parse(raw)
      if (record(cached) && validTime(cached.fetchedAt)) {
        const age = Date.now() - Date.parse(cached.fetchedAt)
        if (
          age >= 0 &&
          age < CACHE_TTL &&
          Date.parse(cached.fetchedAt) >= Date.parse(bundled.fetchedAt)
        ) {
          return {
            data: parse(cached.data),
            fetchedAt: cached.fetchedAt,
            status: 'cached',
            error: null,
          }
        }
      }
    }
  } catch {
    // Storage can be disabled or stale; the public bundled snapshot is still usable.
  }
  try {
    return {
      data: parse(bundled.data),
      fetchedAt: bundled.fetchedAt,
      status: 'snapshot',
      error: null,
    }
  } catch {
    return { data: null, fetchedAt: null, status: 'unavailable', error: null }
  }
}

export function initialContributions(): SourceState<ContributionData> {
  return initial('calendar', snapshot.calendar, parseCalendarCache)
}

export function initialRepositories(): SourceState<Repository[]> {
  let latest = repositorySelection
  try {
    const raw = globalThis.localStorage.getItem(REPOSITORIES_CACHE_KEY)
    if (raw && raw.length < 10_000) {
      const cached: unknown = JSON.parse(raw)
      if (record(cached) && validTime(cached.fetchedAt)) {
        const selectionCheckedAt = cached.selectionCheckedAt ?? cached.fetchedAt
        if (
          validTime(selectionCheckedAt) &&
          Date.parse(cached.fetchedAt) <= Date.parse(selectionCheckedAt) &&
          Date.parse(selectionCheckedAt) <= Date.now() &&
          (!latest || Date.parse(selectionCheckedAt) > Date.parse(latest.selectionCheckedAt))
        ) {
          latest = {
            data: parseSavedRepositories(cached.data),
            fetchedAt: cached.fetchedAt,
            selectionCheckedAt,
          }
        }
      }
    }
  } catch {
    // Storage may be blocked or malformed. In-memory verified data remains usable.
  }
  if (
    latest &&
    Date.parse(latest.selectionCheckedAt) >= Date.parse(snapshot.repositories.fetchedAt)
  ) {
    // A newer successful selection, including [], supersedes all older bundled names.
    // Keep this bounded record after its display TTL so old names cannot reappear.
    repositorySelection = latest
    if (Date.now() - Date.parse(latest.fetchedAt) >= CACHE_TTL) {
      return { data: null, fetchedAt: latest.fetchedAt, status: 'unavailable', error: null }
    }
    return { data: latest.data, fetchedAt: latest.fetchedAt, status: 'cached', error: null }
  }
  try {
    let data = parseSavedRepositories(snapshot.repositories.data)
    // Preserve removals learned by the previous fixed-project version until a fresh list arrives.
    try {
      const raw = globalThis.localStorage.getItem(LEGACY_EXCLUSIONS_KEY)
      if (raw && raw.length < 1000) {
        const old: unknown = JSON.parse(raw)
        if (Array.isArray(old)) {
          const names: unknown[] = old
          const excluded = new Set(names.filter(safeRepositoryName))
          data = data.filter((repo) => !excluded.has(repo.name))
        }
      }
    } catch {
      // A restricted storage environment can still show the public bundled snapshot.
    }
    return { data, fetchedAt: snapshot.repositories.fetchedAt, status: 'snapshot', error: null }
  } catch {
    return { data: null, fetchedAt: null, status: 'unavailable', error: null }
  }
}

function saveRepositorySelection(selection: RepositorySelection): void {
  repositorySelection = selection
  try {
    globalThis.localStorage.setItem(REPOSITORIES_CACHE_KEY, JSON.stringify(selection))
  } catch {
    // Retain the verified selection in memory even if storage is disabled.
  }
}

function retainObservedRepositories(eligibleNames: Set<string>): void {
  const fallback = initialRepositories()
  // Keep the bounded durable record even when its metadata is too old to display.
  const previous =
    fallback.data !== null && fallback.fetchedAt
      ? { data: fallback.data, fetchedAt: fallback.fetchedAt }
      : repositorySelection
  if (!previous) return
  const data = previous.data.filter((repo) => eligibleNames.has(repo.name.toLowerCase()))
  if (data.length === previous.data.length) return
  saveRepositorySelection({
    data,
    fetchedAt: previous.fetchedAt,
    selectionCheckedAt: new Date().toISOString(),
  })
}

function save<T>(key: string, state: SourceState<T>): void {
  try {
    globalThis.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data: state.data, fetchedAt: state.fetchedAt }),
    )
  } catch {
    // A failed cache write must not hide successfully fetched public data.
  }
}

async function request(url: string, signal?: AbortSignal) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  const timeout = setTimeout(abort, TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    })
    const value: unknown = response.ok ? await response.json() : null
    return { status: response.status, ok: response.ok, value }
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

export async function loadContributions(
  options: { signal?: AbortSignal } = {},
): Promise<SourceState<ContributionData>> {
  try {
    const response = await request(CONTRIBUTIONS_URL, options.signal)
    if (!response.ok) throw new Error('Contribution service is temporarily unavailable.')
    const data = parseContributions(response.value)
    // A successful HTTP response is not enough to call an outdated upstream calendar current.
    const lastDayAge = Date.now() - Date.parse(`${data.to}T00:00:00Z`)
    if (lastDayAge < -DAY_MS || lastDayAge > 2 * DAY_MS) {
      throw new Error('The contribution service has not refreshed its calendar yet.')
    }
    const state: SourceState<ContributionData> = {
      data,
      fetchedAt: new Date().toISOString(),
      status: 'live',
      error: null,
    }
    save('calendar', state)
    return state
  } catch {
    return { ...initialContributions(), error: 'Live refresh unavailable. Showing saved activity.' }
  }
}

export async function loadRepositories(
  options: { signal?: AbortSignal } = {},
): Promise<SourceState<Repository[]>> {
  try {
    const response = await request(REPOSITORIES_URL, options.signal)
    if (!response.ok) throw new Error('Public repository refresh unavailable.')
    // Validate the entire list before learning omissions. Later probe failures must not revive them.
    const candidates = publicCandidates(response.value)
    const eligibleNames = new Set(candidates.map(({ repo }) => repo.name.toLowerCase()))
    retainObservedRepositories(eligibleNames)
    const data = await selectCandidates(candidates, options, (name) => {
      eligibleNames.delete(name)
      retainObservedRepositories(eligibleNames)
    })
    const fetchedAt = new Date().toISOString()
    saveRepositorySelection({ data, fetchedAt, selectionCheckedAt: fetchedAt })
    return { data, fetchedAt, status: 'live', error: null }
  } catch {
    const fallback = initialRepositories()
    return {
      ...fallback,
      error:
        fallback.data === null
          ? 'Live refresh unavailable. Visit GitHub for current projects.'
          : 'Live refresh unavailable. Showing saved repository details.',
    }
  }
}
