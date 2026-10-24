import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  parseContributions,
  parsePublicRepository,
  selectPublicRepositories,
} from '../src/data/githubActivity.ts'

const days = Array.from({ length: 365 }, (_, index) => ({
  date: new Date(Date.UTC(2025, 0, index + 1)).toISOString().slice(0, 10),
  count: index % 3,
  level: index % 3,
}))

function publicRepo(name = 'new-project', changes: Record<string, unknown> = {}) {
  return {
    name,
    html_url: `https://github.com/tkorsi/${name}`,
    private: false,
    fork: false,
    archived: false,
    disabled: false,
    owner: { login: 'tkorsi' },
    size: 10,
    description: 'Public project',
    language: 'Python',
    pushed_at: '2026-10-24T02:08:34Z',
    ...changes,
  }
}

async function freshModule(name: string) {
  const module: typeof import('../src/data/githubActivity.ts') = await import(
    new URL(`../src/data/githubActivity.ts?test=${name}`, import.meta.url).href
  )
  return module
}

function useStorage() {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  })
  return {
    values,
    restore() {
      if (original) Object.defineProperty(globalThis, 'localStorage', original)
      else Reflect.deleteProperty(globalThis, 'localStorage')
    },
  }
}

test('calendar sums displayed days and rejects missing, duplicate and invalid values', () => {
  assert.equal(parseContributions({ contributions: days }).total, 364)
  assert.throws(() => parseContributions({ contributions: [] }))
  assert.throws(() => parseContributions({ contributions: days.slice(1, 100) }))
  assert.throws(() => parseContributions({ contributions: [days[0], ...days.slice(0, -1)] }))
  for (const invalid of [
    { ...days[0], count: -1 },
    { ...days[0], count: 1.5 },
    { ...days[0], level: 5 },
    { ...days[0], date: '2025-02-30' },
  ]) {
    assert.throws(() => parseContributions({ contributions: [invalid, ...days.slice(1)] }))
  }
})

test('discovery includes new projects, deduplicates and selects the latest three deterministically', async () => {
  const selected = await selectPublicRepositories([
    publicRepo('older', { pushed_at: '2025-01-01T00:00:00Z' }),
    publicRepo('beta'),
    publicRepo('brand-new', { pushed_at: '2026-10-24T03:00:00Z' }),
    publicRepo('alpha'),
    publicRepo('alpha'),
  ])
  assert.deepEqual(
    selected.map((repo) => repo.name),
    ['brand-new', 'alpha', 'beta'],
  )
  assert.deepEqual(Object.keys(selected[0]).sort(), [
    'description',
    'language',
    'name',
    'pushedAt',
    'url',
  ])
})

test('discovery excludes private, forked, archived, disabled, unpushed and nonpersonal projects', async () => {
  const selected = await selectPublicRepositories([
    publicRepo('private', { private: true }),
    publicRepo('fork', { fork: true }),
    publicRepo('archive', { archived: true }),
    publicRepo('disabled', { disabled: true }),
    publicRepo('other-owner', { owner: { login: 'other' } }),
    publicRepo('never-pushed', { pushed_at: null }),
    publicRepo('tkorsi.github.io'),
    publicRepo('eligible'),
  ])
  assert.deepEqual(
    selected.map((repo) => repo.name),
    ['eligible'],
  )
  assert.throws(() => parsePublicRepository(publicRepo('../unsafe')))
  assert.throws(() =>
    parsePublicRepository(publicRepo('safe', { html_url: 'javascript:alert(1)' })),
  )
  await assert.rejects(selectPublicRepositories({ message: 'Rate limit' }))
  await assert.rejects(selectPublicRepositories([{}]))
  await assert.rejects(selectPublicRepositories(Array.from({ length: 101 }, () => publicRepo())))
})

test('zero-size first pushes are verified while truly empty repos are excluded', async () => {
  const originalFetch = globalThis.fetch
  const calls: string[] = []
  try {
    globalThis.fetch = (input) => {
      calls.push(String(input))
      return Promise.resolve(
        String(input).includes('/new-code/')
          ? Response.json([{ sha: 'a'.repeat(40) }])
          : new Response(null, { status: 409 }),
      )
    }
    const selected = await selectPublicRepositories([
      publicRepo('empty', { size: 0 }),
      publicRepo('new-code', { size: 0 }),
      publicRepo('existing'),
    ])
    assert.deepEqual(
      selected.map((repo) => repo.name),
      ['existing', 'new-code'],
    )
    assert.deepEqual(calls, [
      'https://api.github.com/repos/tkorsi/empty/commits?per_page=1',
      'https://api.github.com/repos/tkorsi/new-code/commits?per_page=1',
    ])
    globalThis.fetch = () => Promise.resolve(Response.json([{ nope: true }]))
    await assert.rejects(selectPublicRepositories([publicRepo('malformed', { size: 0 })]))
    globalThis.fetch = () => Promise.resolve(new Response(null, { status: 403 }))
    await assert.rejects(selectPublicRepositories([publicRepo('rate-limit', { size: 0 })]))
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('commit probes stop at five and remaining nonempty projects can fill all three cards', async () => {
  const originalFetch = globalThis.fetch
  let probes = 0
  try {
    globalThis.fetch = () => {
      probes++
      return Promise.resolve(new Response(null, { status: 404 }))
    }
    const selected = await selectPublicRepositories([
      ...Array.from({ length: 7 }, (_, index) => publicRepo(`empty-${index}`, { size: 0 })),
      ...['x', 'y', 'z'].map((name) => publicRepo(name, { pushed_at: '2025-01-01T00:00:00Z' })),
    ])
    assert.equal(probes, 5)
    assert.deepEqual(
      selected.map((repo) => repo.name),
      ['x', 'y', 'z'],
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('offline, malformed and rate-limited refreshes keep the last verified dated selection', async () => {
  const originalFetch = globalThis.fetch
  const storage = useStorage()
  try {
    const module = await freshModule('failure')
    globalThis.fetch = (input, options) => {
      assert.equal(String(input), module.REPOSITORIES_URL)
      assert.equal(options?.credentials, 'omit')
      return Promise.resolve(Response.json([publicRepo('automatically-discovered')]))
    }
    const live = await module.loadRepositories()
    assert.equal(live.status, 'live')
    for (const failure of [
      () => Promise.reject(new Error('offline')),
      () => Promise.resolve(Response.json({ malformed: true })),
      () => Promise.resolve(new Response(null, { status: 403 })),
    ]) {
      globalThis.fetch = failure
      const fallback = await module.loadRepositories()
      assert.equal(fallback.status, 'cached')
      assert.equal(fallback.fetchedAt, live.fetchedAt)
      assert.deepEqual(fallback.data, live.data)
      assert.ok(fallback.error)
    }
    globalThis.fetch = (input) =>
      Promise.resolve(
        String(input).includes('/commits?')
          ? new Response(null, { status: 403 })
          : Response.json([
              publicRepo('automatically-discovered'),
              publicRepo('probe-failure', { size: 0 }),
            ]),
      )
    assert.deepEqual((await module.loadRepositories()).data, live.data)
  } finally {
    globalThis.fetch = originalFetch
    storage.restore()
  }
})

test('a valid list removes old projects even when a new project commit probe fails', async () => {
  const originalFetch = globalThis.fetch
  const originalNow = Date.now
  const storage = useStorage()
  try {
    const module = await freshModule('omission-probe-failure')
    globalThis.fetch = () => Promise.resolve(Response.json([publicRepo('previous-project')]))
    const previous = await module.loadRepositories()
    globalThis.fetch = (input) =>
      Promise.resolve(
        String(input).includes('/commits?')
          ? new Response(null, { status: 503 })
          : Response.json([publicRepo('new-project', { size: 0 })]),
      )
    const failed = await module.loadRepositories()
    assert.ok(failed.error)
    assert.equal(failed.status, 'cached')
    assert.deepEqual(failed.data, [])
    assert.equal(failed.fetchedAt, previous.fetchedAt, 'removal does not refresh old metadata')
    const saved = JSON.parse(storage.values.get('tkorsi-public-activity-v1:repositories-auto-v2')!)
    assert.deepEqual(saved.data, [])
    assert.equal(saved.fetchedAt, previous.fetchedAt)
    assert.ok(Date.parse(saved.selectionCheckedAt) >= Date.parse(saved.fetchedAt))
    const revisit = await freshModule('omission-probe-failure-revisit')
    assert.deepEqual(revisit.initialRepositories().data, [])
    Date.now = () => Date.parse(previous.fetchedAt!) + 8 * 86_400_000
    const expired = await freshModule('omission-probe-failure-expired')
    assert.equal(expired.initialRepositories().status, 'unavailable')
    assert.equal(expired.initialRepositories().data, null)
  } finally {
    globalThis.fetch = originalFetch
    Date.now = originalNow
    storage.restore()
  }
})

test('successful omissions and empty lists never resurrect old bundled names after cache expiry', async () => {
  const originalFetch = globalThis.fetch
  const originalNow = Date.now
  const storage = useStorage()
  try {
    const module = await freshModule('omissions')
    globalThis.fetch = () => Promise.resolve(Response.json([publicRepo('brand-new')]))
    const first = await module.loadRepositories()
    globalThis.fetch = () => Promise.resolve(Response.json([publicRepo('replacement')]))
    const next = await module.loadRepositories()
    assert.deepEqual(
      next.data?.map((repo) => repo.name),
      ['replacement'],
    )
    globalThis.fetch = () => Promise.reject(new Error('offline'))
    const revisit = await freshModule('omissions-revisit')
    assert.deepEqual(
      revisit.initialRepositories().data?.map((repo) => repo.name),
      ['replacement'],
    )
    Date.now = () => Date.parse(first.fetchedAt!) + 8 * 86_400_000
    const expiredVisit = await freshModule('omissions-expired')
    assert.equal(expiredVisit.initialRepositories().status, 'unavailable')
    assert.equal(expiredVisit.initialRepositories().data, null)
    assert.equal((await expiredVisit.loadRepositories()).data, null)
    Date.now = originalNow
    globalThis.fetch = () => Promise.resolve(Response.json([]))
    const empty = await module.loadRepositories()
    assert.equal(empty.status, 'live')
    assert.deepEqual(empty.data, [])
    const emptyVisit = await freshModule('empty-revisit')
    assert.deepEqual(emptyVisit.initialRepositories().data, [])
  } finally {
    globalThis.fetch = originalFetch
    Date.now = originalNow
    storage.restore()
  }
})

test('disabled storage still permits live discovery and in-memory fallback', async () => {
  const originalFetch = globalThis.fetch
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage blocked')
    },
  })
  try {
    const module = await freshModule('storage-disabled')
    globalThis.fetch = () => Promise.resolve(Response.json([publicRepo('new-project')]))
    const live = await module.loadRepositories()
    assert.equal(live.status, 'live')
    globalThis.fetch = () => Promise.reject(new Error('offline'))
    assert.deepEqual((await module.loadRepositories()).data, live.data)
    const calendar = await module.loadContributions()
    assert.equal(calendar.status, 'snapshot')
    assert.equal(calendar.fetchedAt, module.initialContributions().fetchedAt)
  } finally {
    globalThis.fetch = originalFetch
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
