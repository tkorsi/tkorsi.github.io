import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, BookOpen, Code2, Github, RefreshCw } from 'lucide-react'
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
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null)
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const columns = Math.ceil((offset + days.length) / 7)
  const total = days.reduce((sum, day) => sum + day.count, 0)

  useEffect(() => {
    // On narrow screens, start at the most recent weeks. The whole year remains scrollable.
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth
  }, [])

  return (
    <>
      <div
        className="activity-calendar-scroll"
        ref={scroll}
        tabIndex={0}
        role="region"
        aria-label="Contribution calendar. Scroll horizontally to explore earlier weeks."
      >
        <div
          className="activity-calendar"
          style={{ gridTemplateColumns: `26px repeat(${columns}, minmax(9px, 1fr))` }}
        >
          {days.map((day, index) => {
            const date = new Date(`${day.date}T00:00:00Z`)
            if (date.getUTCDate() !== 1 && index !== 0) return null
            // Omit a short opening month so adjacent month labels never collide.
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
          {['Mon', 'Wed', 'Fri'].map((day, index) => (
            <span
              key={day}
              className="activity-weekday"
              style={{ gridColumn: 1, gridRow: index * 2 + 3 }}
            >
              {day}
            </span>
          ))}
          <div
            className="activity-cells"
            role="img"
            aria-label={`${number(total)} GitHub contributions from ${formatDate(days[0].date)} to ${formatDate(days[days.length - 1].date)}. Daily values are available below.`}
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
                onMouseEnter={() => setSelectedDay(day)}
                onMouseLeave={() => setSelectedDay(null)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="activity-calendar-footer">
        <span className="activity-hover-date" aria-hidden="true">
          {selectedDay
            ? `${formatDate(selectedDay.date)} · ${number(selectedDay.count)} contributions`
            : 'One square. One day.'}
        </span>
        <div className="activity-legend" aria-label="Color scale: fewer to more contributions">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`activity-day activity-level-${level}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      <details className="activity-daily">
        <summary>Explore daily contribution counts</summary>
        <div
          className="activity-daily-scroll"
          tabIndex={0}
          role="region"
          aria-label="Daily contribution counts"
        >
          <table>
            <caption className="sr-only">GitHub contributions by date, most recent first</caption>
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
      </details>
    </>
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
  const activeDays = days.filter((day) => day.count > 0).length
  const latest = days.slice(-30).reduce((sum, day) => sum + day.count, 0)
  const live = contributions.status === 'live'

  return (
    <section className="github-activity" id="research" aria-labelledby="activity-title">
      <div className="activity-heading">
        <div>
          <p className="activity-eyebrow">
            <span aria-hidden="true" /> Building in the open
          </p>
          <h2 id="activity-title">Code &amp; research</h2>
          <p className="activity-intro">Experiments, implementations, and the work in between.</p>
        </div>
        <a
          className="activity-profile"
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={17} aria-hidden="true" /> Follow the work{' '}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className="activity-chart-panel">
        <div className="activity-stats">
          <div className="activity-total">
            <strong>{days.length ? number(total) : '—'}</strong>
            <span>
              GitHub contributions
              <small>
                {days.length
                  ? `${formatDate(days[0].date)} – ${formatDate(days[days.length - 1].date)}`
                  : loading
                    ? 'Waiting for contribution data'
                    : 'Calendar unavailable'}
              </small>
            </span>
          </div>
          <div className="activity-stat">
            <strong>{days.length ? number(activeDays) : '—'}</strong>
            <span>active days</span>
          </div>
          <div className="activity-stat">
            <strong>{days.length ? number(latest) : '—'}</strong>
            <span>in the last 30 days shown</span>
          </div>
        </div>

        {days.length ? (
          <ContributionCalendar days={days} />
        ) : (
          <div className="activity-empty">
            {loading
              ? 'Loading GitHub contributions…'
              : 'The contribution calendar is temporarily unavailable. You can still explore the work on GitHub.'}
          </div>
        )}
        {days.length > 0 && total === 0 && (
          <p className="activity-note">No contributions recorded in this period.</p>
        )}

        <div className="activity-freshness">
          <p role="status" aria-live="polite">
            <span className={`activity-status-dot ${live ? 'is-live' : ''}`} aria-hidden="true" />
            {loading
              ? 'Checking for updates…'
              : live
                ? 'Auto-updating'
                : contributions.data
                  ? 'Saved snapshot · live update unavailable'
                  : 'Live activity unavailable'}
            {contributions.fetchedAt && (
              <span>
                {' '}
                · {live ? 'Checked' : 'Saved'}{' '}
                <time dateTime={contributions.fetchedAt}>
                  {formatDate(contributions.fetchedAt)} at{' '}
                  {new Date(contributions.fetchedAt).toISOString().slice(11, 16)} UTC
                </time>
              </span>
            )}
          </p>
          <button
            className="activity-refresh"
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
            disabled={loading}
          >
            <RefreshCw size={13} aria-hidden="true" /> {loading ? 'Checking' : 'Refresh'}
          </button>
        </div>
        <p className="activity-note">
          Contributions are GitHub activity, including commits, pull requests, and issues. The
          public profile may include anonymous private contribution counts. These are not
          publication counts.{' '}
          <a href={`${PROFILE_URL}?tab=overview`} target="_blank" rel="noopener noreferrer">
            View the source
          </a>
          .
        </p>
        <p className="activity-note activity-source-note">
          Refreshes on visit and every 15 minutes while visible. Calendar source may be cached for
          up to an hour.
        </p>
      </div>

      <div className="activity-repos-heading">
        <h3>
          <Code2 size={18} aria-hidden="true" /> Selected public work
        </h3>
        <a href={`${PROFILE_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer">
          All repositories <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="activity-repos">
        {repositories.data?.map((repo) => (
          <a
            className="activity-repo"
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="activity-repo-top">
              <BookOpen size={16} aria-hidden="true" />
              <ArrowUpRight size={16} aria-hidden="true" />
            </div>
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
            <div className="activity-repo-meta">
              <span>{repo.language || 'Code & notebooks'}</span>
              <span>Updated {formatDate(repo.pushedAt)}</span>
            </div>
          </a>
        ))}
        {repositories.data?.length === 0 && (
          <p className="activity-repos-empty">
            No selected public repositories are currently available. Explore the GitHub profile for
            more.
          </p>
        )}
        {!repositories.data && (
          <p className="activity-repos-empty">
            {loading
              ? 'Loading public repositories…'
              : 'Repository details are temporarily unavailable. Explore all repositories on GitHub.'}
          </p>
        )}
      </div>
      {repositories.fetchedAt && (
        <p className="activity-repo-freshness">
          Repository details {repositories.status === 'live' ? 'checked' : 'saved'}{' '}
          {formatDate(repositories.fetchedAt)}.
          {!loading &&
            repositories.status !== 'live' &&
            ' Live details are temporarily unavailable.'}
        </p>
      )}
    </section>
  )
}
