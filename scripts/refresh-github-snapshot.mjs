// Node 22.6+; no credentials. Run from any directory with --experimental-strip-types.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import {
  CONTRIBUTIONS_URL,
  REPOSITORIES_URL,
  parseContributions,
  selectPublicRepositories,
} from '../src/data/githubActivity.ts'

async function publicJson(url) {
  const response = await fetch(url, {
    credentials: 'omit',
    signal: AbortSignal.timeout(15_000),
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.json()
}

const calendar = {
  fetchedAt: new Date().toISOString(),
  source: CONTRIBUTIONS_URL,
  data: parseContributions(await publicJson(CONTRIBUTIONS_URL)),
}
const data = await selectPublicRepositories(await publicJson(REPOSITORIES_URL))
const repositories = {
  fetchedAt: new Date().toISOString(),
  source: REPOSITORIES_URL,
  data,
}
const path = fileURLToPath(new URL('../src/data/githubActivitySnapshot.json', import.meta.url))
// All requests and validation must succeed before replacing the last known good fallback.
await writeFile(path, JSON.stringify({ version: 1, calendar, repositories }, null, 2) + '\n')
const prettier = fileURLToPath(
  new URL('../node_modules/prettier/bin/prettier.cjs', import.meta.url),
)
execFileSync(process.execPath, [prettier, '--write', path], { stdio: 'inherit' })
console.log(`Saved ${calendar.data.days.length} contribution days and ${data.length} repositories.`)
