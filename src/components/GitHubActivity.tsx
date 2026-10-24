import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Github, RefreshCw } from 'lucide-react'
import {
  initialContributions,
  initialRepositories,
  loadContributions,
  loadRepositories,
  PROFILE_URL,
  type ContributionDay,
} from '../data/githubActivity'
import './github-activity.css'

const dateFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const shortDate = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' })
const formatDate = (date: string) => dateFormat.format(new Date(date))
const number = (value: number) => value.toLocaleString('en')

function ContributionCalendar({ days }: { days: ContributionDay[] }) {
  const scroll = useRef<HTMLDivElement>(null)
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const columns = Math.ceil((offset + days.length) / 7)
  const total = days.reduce((sum, day) => sum + day.count, 0)

  useEffect(() => {
    // Start narrow screens at the latest weeks; the full calendar stays scrollable.
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth
  }, [])

  return (
    <div
      className="activity-calendar-scroll"
      ref={scroll}
      tabIndex={0}
      role="region"
      aria-label="Contribution calendar. Scroll horizontally to explore earlier weeks."
    >
      <div
        className="activity-calendar"
        style={{ gridTemplateColumns: `20px repeat(${columns}, minmax(6px, 1fr))` }}
      >
        {days.map((day, index) => {
          const date = new Date(`${day.date}T00:00:00Z`)
          if (date.getUTCDate() !== 1 && index !== 0) return null
          if (index === 0 && date.getUTCDate() > 10) return null
          return (
            <span
              className="activity-month"
              key={`month-${day.date}`}
              style={{ gridColumn: Math.floor((offset + index) / 7) + 2, gridRow: 1 }}
            >
              {shortDate.format(date)}
            </span>
          )
        })}
        {['M', 'W', 'F'].map((day, index) => (
          <span
            key={day}
            className="activity-weekday"
            aria-hidden="true"
            style={{ gridColumn: 1, gridRow: index * 2 + 3 }}
          >
            {day}
          </span>
        ))}
        <div
          className="activity-cells"
          role="img"
          aria-label={`${number(total)} GitHub contributions from ${formatDate(days[0].date)} to ${formatDate(days[days.length - 1].date)}. Open Details and daily counts for a text table.`}
        >
          {days.map((day, index) => (
            <span
              key={day.date}
              className={`activity-day activity-level-${day.level}`}
              style={{
                gridColumn: Math.floor((offset + index) / 7) + 2,
                gridRow: ((offset + index) % 7) + 2,
              }}
              title={`${formatDate(day.date)}: ${number(day.count)} contribution${day.count === 1 ? '' : 's'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GitHubActivity() {
  const [contributions, setContributions] = useState(initialContributions)
  const [repositories, setRepositories] = useState(initialRepositories)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setLoading(true)
    void Promise.all([
      loadContributions({ signal: controller.signal }).then((state) => {
        if (active) setContributions(state)
      }),
      loadRepositories({ signal: controller.signal }).then((state) => {
        if (active) setRepositories(state)
      }),
    ]).finally(() => {
      if (active) setLoading(false)
    })
    const interval = window.setInterval(
      () => {
        if (document.visibilityState === 'visible') setRefresh((value) => value + 1)
      },
      15 * 60 * 1000,
    )
    return () => {
      active = false
      controller.abort()
      window.clearInterval(interval)
    }
  }, [refresh])

  const days = contributions.data?.days ?? []
  const total = days.reduce((sum, day) => sum + day.count, 0)
  const live = contributions.status === 'live'

  return (
    <section className="github-activity" id="research" aria-labelledby="activity-title">
      <div className="activity-heading">
        <h2 id="activity-title">
          <Github size={15} aria-hidden="true" /> Building in the open
        </h2>
        <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
          View GitHub <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="activity-total">
        <p>
          <strong>{days.length ? number(total) : '—'}</strong> <span>GitHub contributions</span>
        </p>
        {days.length > 0 && (
          <p className="activity-range">
            {formatDate(days[0].date)} – {formatDate(days[days.length - 1].date)}
          </p>
        )}
      </div>
      {days.length ? (
        <ContributionCalendar days={days} />
      ) : (
        <p className="activity-empty">
          {loading
            ? 'Loading GitHub contributions…'
            : 'Activity is temporarily unavailable. Explore the work on GitHub.'}
        </p>
      )}
      {days.length > 0 && total === 0 && (
        <p className="activity-note">No contributions recorded in this period.</p>
      )}
      <div className="activity-meta">
        <p className="activity-freshness" role="status" aria-live="polite">
          <span className={`activity-status-dot ${live ? 'is-live' : ''}`} aria-hidden="true" />
          {loading
            ? 'Checking for updates…'
            : live
              ? 'Live'
              : contributions.data
                ? 'Saved snapshot · update unavailable'
                : 'Live activity unavailable'}
          {!loading && contributions.fetchedAt && (
            <span>
              {' '}
              ·{' '}
              <time
                dateTime={contributions.fetchedAt}
                title={`${live ? 'Checked' : 'Saved'} ${formatDate(contributions.fetchedAt)} at ${new Date(contributions.fetchedAt).toISOString().slice(11, 16)} UTC`}
              >
                {formatDate(contributions.fetchedAt)}
                {live && `, ${new Date(contributions.fetchedAt).toISOString().slice(11, 16)} UTC`}
              </time>
            </span>
          )}
        </p>
        <div className="activity-legend" aria-label="Color scale: fewer to more contributions">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`activity-day activity-level-${level}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <nav className="activity-repos" aria-label="Recently updated public repositories">
        <span className="activity-repos-label">Public work</span>
        {repositories.data?.map((repo) => (
          <a
            className="activity-repo"
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${repo.description} · Updated ${formatDate(repo.pushedAt)}`}
          >
            {repo.name}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        ))}
        {repositories.data?.length === 0 && <span>No eligible public repositories available.</span>}
        {!repositories.data && (
          <span>{loading ? 'Loading repositories…' : 'Repository details unavailable.'}</span>
        )}
      </nav>

      <details className="activity-details">
        <summary>Details &amp; daily counts</summary>
        <div className="activity-details-content">
          <p>
            GitHub activity includes commits, pull requests, and issues; it is not a publication
            count. The public profile may include anonymous private contribution counts.{' '}
            <a href={`${PROFILE_URL}?tab=overview`} target="_blank" rel="noopener noreferrer">
              View the source
            </a>
            .
          </p>
          <p>
            Refreshes on visit and every 15 minutes while visible. The calendar source may be cached
            for up to an hour. The timestamp above is when this page checked the data.
          </p>
          <p>
            Public work automatically shows up to three recently pushed repositories owned by
            tkorsi. Forks, archived or empty repositories, and this website are excluded. The
            selection comes from the 100 most recently pushed public repositories; it does not
            classify projects as research or publications.
          </p>
          {repositories.fetchedAt && (
            <p>
              Repository details {repositories.status === 'live' ? 'checked' : 'saved'}{' '}
              {formatDate(repositories.fetchedAt)}.
              {!loading &&
                repositories.status !== 'live' &&
                ' Live details are temporarily unavailable.'}
            </p>
          )}
          {repositories.data && repositories.data.length > 0 && (
            <ul className="activity-repo-details" aria-label="Public repository descriptions">
              {repositories.data.map((repo) => (
                <li key={repo.name}>
                  <strong>{repo.name}</strong>
                  {repo.description && ` — ${repo.description}`}
                  <span>
                    Updated {formatDate(repo.pushedAt)}
                    {repo.language && ` · ${repo.language}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button
            className="activity-refresh"
            type="button"
            disabled={loading}
            onClick={() => setRefresh((value) => value + 1)}
          >
            <RefreshCw size={13} aria-hidden="true" /> {loading ? 'Checking…' : 'Refresh activity'}
          </button>
          {days.length > 0 && (
            <div
              className="activity-daily-scroll"
              tabIndex={0}
              role="region"
              aria-label="Daily contribution counts"
            >
              <table>
                <caption className="sr-only">
                  GitHub contributions by date, most recent first
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...days].reverse().map((day) => (
                    <tr key={day.date}>
                      <th scope="row">{formatDate(day.date)}</th>
                      <td>{number(day.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>
    </section>
  )
}
