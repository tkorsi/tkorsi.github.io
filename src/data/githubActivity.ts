import snapshot from './githubActivitySnapshot.json' with { type: 'json' }

export const PROFILE_URL = 'https://github.com/tkorsi'
export const CONTRIBUTIONS_URL = 'https://github-contributions-api.jogruber.de/v4/tkorsi?y=last'
export const REPOSITORY_NAMES = ['heroes-rl', 'hybridrag', 'Machine-Learning-Seminars'] as const

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
const UNAVAILABLE_REPOSITORIES_KEY = CACHE_PREFIX + 'unavailable-repositories'
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

function knownRepository(name: string): boolean {
  return REPOSITORY_NAMES.some((item) => item === name)
}

function unavailableRepositories(): Set<string> {
  try {
    const raw = globalThis.localStorage.getItem(UNAVAILABLE_REPOSITORIES_KEY)
    if (raw && raw.length < 1000) {
      const value: unknown = JSON.parse(raw)
      if (Array.isArray(value)) {
        const names: unknown[] = value
        return new Set(
          names.filter((name): name is string => typeof name === 'string' && knownRepository(name)),
        )
      }
    }
  } catch {
    // Storage may be disabled; the active request still excludes unavailable repositories.
  }
  return new Set()
}

function rememberRepositoryAvailability(name: string, available: boolean): void {
  if (!knownRepository(name)) return
  const unavailable = unavailableRepositories()
  if (available) unavailable.delete(name)
  else unavailable.add(name)
  try {
    // Unlike activity data, exclusions must survive cache expiry and old bundled snapshots.
    globalThis.localStorage.setItem(UNAVAILABLE_REPOSITORIES_KEY, JSON.stringify([...unavailable]))
  } catch {
    // Local storage is an optional enhancement, never a requirement for live data.
  }
}

function parseSavedRepositories(value: unknown): Repository[] {
  if (!Array.isArray(value) || value.length > REPOSITORY_NAMES.length) {
    throw new Error('Invalid saved repositories.')
  }
  const values: unknown[] = value
  const seen = new Set<string>()
  return values.map((repo): Repository => {
    if (
      !record(repo) ||
      typeof repo.name !== 'string' ||
      !knownRepository(repo.name) ||
      seen.has(repo.name) ||
      repo.url !== `${PROFILE_URL}/${repo.name}` ||
      typeof repo.description !== 'string' ||
      repo.description.length > 1000 ||
      !(repo.language === null || typeof repo.language === 'string') ||
      !validTime(repo.pushedAt)
    ) {
      throw new Error('Invalid saved repository metadata.')
    }
    seen.add(repo.name)
    return {
      name: repo.name,
      url: repo.url,
      description: repo.description,
      language: repo.language,
      pushedAt: repo.pushedAt,
    }
  })
}

/** A fixed allowlist and public-only responses keep private or unrelated names out of the page. */
export function parsePublicRepository(value: unknown, expectedName: string): Repository | null {
  if (!record(value)) throw new Error('Repository metadata is unavailable.')
  if (
    value.private !== false ||
    value.fork !== false ||
    !record(value.owner) ||
    value.owner.login !== 'tkorsi' ||
    value.name !== expectedName ||
    !knownRepository(expectedName)
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
  const state = initial('repositories', snapshot.repositories, parseSavedRepositories)
  const unavailable = unavailableRepositories()
  return { ...state, data: state.data?.filter((repo) => !unavailable.has(repo.name)) ?? null }
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
  const unavailable = new Set<string>()
  try {
    // allSettled ensures a confirmed 404 is also excluded from a partial-error fallback.
    const results = await Promise.allSettled(
      REPOSITORY_NAMES.map(async (name) => {
        const response = await request(
          `https://api.github.com/repos/tkorsi/${name}`,
          options.signal,
        )
        if (response.status === 404 || response.status === 410) {
          unavailable.add(name)
          rememberRepositoryAvailability(name, false)
          return null
        }
        if (!response.ok) throw new Error('Public repository refresh unavailable.')
        const repository = parsePublicRepository(response.value, name)
        if (!repository) unavailable.add(name)
        rememberRepositoryAvailability(name, repository !== null)
        return repository
      }),
    )
    if (results.some((result) => result.status === 'rejected')) {
      throw new Error('Public repository refresh unavailable.')
    }
    const data = results.flatMap((result) =>
      result.status === 'fulfilled' && result.value ? [result.value] : [],
    )
    const state: SourceState<Repository[]> = {
      data,
      fetchedAt: new Date().toISOString(),
      status: 'live',
      error: null,
    }
    save('repositories', state)
    return state
  } catch {
    const fallback = initialRepositories()
    const state = {
      ...fallback,
      data: fallback.data?.filter((repo) => !unavailable.has(repo.name)) ?? null,
      error: 'Live refresh unavailable. Showing saved repository details.',
    }
    if (unavailable.size > 0) save('repositories', state)
    return state
  }
}
