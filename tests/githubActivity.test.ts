import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  initialContributions,
  initialRepositories,
  loadContributions,
  loadRepositories,
  parseContributions,
  parsePublicRepository,
} from '../src/data/githubActivity.ts'

const days = Array.from({ length: 365 }, (_, index) => ({
  date: new Date(Date.UTC(2025, 0, index + 1)).toISOString().slice(0, 10),
  count: index % 3,
  level: index % 3,
}))

test('calendar sums displayed days, rejecting missing, duplicate, invalid and negative values', () => {
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

test('repository exclusions survive expired fallback caches and clear after public verification', async () => {
  const originalFetch = globalThis.fetch
  const originalNow = Date.now
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const bundled = initialRepositories()
  const storage = new Map<string, string>()
  const oldTime = Date.parse(bundled.fetchedAt!)
  storage.set(
    'tkorsi-public-activity-v1:repositories',
    JSON.stringify({ data: bundled.data, fetchedAt: new Date(oldTime).toISOString() }),
  )
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  })
  try {
    Date.now = () => oldTime + 15 * 86_400_000
    assert.equal(initialRepositories().status, 'snapshot')
    globalThis.fetch = (input) =>
      String(input).endsWith('/heroes-rl')
        ? Promise.resolve(new Response(null, { status: 404 }))
        : Promise.reject(new Error('offline'))
    await loadRepositories()
    assert.equal(
      initialRepositories().data?.some((repo) => repo.name === 'heroes-rl'),
      false,
    )
    Date.now = () => oldTime + 30 * 86_400_000
    assert.equal(
      initialRepositories().data?.some((repo) => repo.name === 'heroes-rl'),
      false,
    )

    globalThis.fetch = (input) => {
      const name = String(input).split('/').at(-1)
      const repo = bundled.data!.find((item) => item.name === name)!
      return Promise.resolve(
        Response.json({
          name: repo.name,
          html_url: repo.url,
          description: repo.description,
          language: repo.language,
          pushed_at: repo.pushedAt,
          private: false,
          fork: false,
          owner: { login: 'tkorsi' },
        }),
      )
    }
    const restored = await loadRepositories()
    assert.equal(
      restored.data?.some((repo) => repo.name === 'heroes-rl'),
      true,
    )
    assert.equal(
      initialRepositories().data?.some((repo) => repo.name === 'heroes-rl'),
      true,
    )
    assert.deepEqual(
      JSON.parse(storage.get('tkorsi-public-activity-v1:unavailable-repositories')!),
      [],
    )
  } finally {
    globalThis.fetch = originalFetch
    Date.now = originalNow
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})

test('public repository allowlist rejects private, forked and unrelated repositories', () => {
  const repo = {
    name: 'heroes-rl',
    html_url: 'https://github.com/tkorsi/heroes-rl',
    private: false,
    fork: false,
    owner: { login: 'tkorsi' },
    description: 'Public experiments',
    language: 'Python',
    pushed_at: '2026-10-24T02:08:34Z',
  }
  assert.equal(parsePublicRepository(repo, 'heroes-rl')?.name, 'heroes-rl')
  assert.equal(parsePublicRepository({ ...repo, private: true }, 'heroes-rl'), null)
  assert.equal(parsePublicRepository({ ...repo, fork: true }, 'heroes-rl'), null)
  assert.equal(parsePublicRepository({ ...repo, owner: { login: 'another' } }, 'heroes-rl'), null)
  assert.equal(parsePublicRepository(repo, 'unapproved-repository'), null)
  assert.throws(() =>
    parsePublicRepository({ ...repo, html_url: 'javascript:alert(1)' }, 'heroes-rl'),
  )
})

test('network failure preserves dated snapshot and confirmed 404 removes repository', async () => {
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = () => Promise.reject(new Error('offline'))
    const fallback = await loadContributions()
    assert.equal(fallback.status, 'snapshot')
    assert.equal(fallback.fetchedAt, initialContributions().fetchedAt)
    assert.ok(fallback.error)
    assert.ok(fallback.data?.days.length)

    globalThis.fetch = (input) =>
      String(input).endsWith('/heroes-rl')
        ? Promise.resolve(new Response(null, { status: 404 }))
        : Promise.reject(new Error('offline'))
    const repos = await loadRepositories()
    assert.ok(repos.error)
    assert.equal(
      repos.data?.some((repo) => repo.name === 'heroes-rl'),
      false,
    )

    globalThis.fetch = () => Promise.resolve(new Response(null, { status: 404 }))
    const empty = await loadRepositories()
    assert.equal(empty.status, 'live')
    assert.deepEqual(empty.data, [])
  } finally {
    globalThis.fetch = originalFetch
  }
})
