# my-cv

Tech stack: React, TypeScript, Vite, Tailwind CSS. Tooling: ESLint, Prettier, GitHub Actions.

## GitHub activity

The compact header activity display reads the public profile of `tkorsi` and automatically
discovers up to three recently pushed public repositories owned by `tkorsi`. It refreshes on page load and every 15 minutes
while the tab is visible; visitors can also refresh manually. No token, account, or
additional access is required.

- Calendar: [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api),
  which reads GitHub's public contribution calendar and caches responses for up to an hour.
  The checked timestamp is the browser's successful retrieval time, not a guarantee of
  instant GitHub updates. The displayed date range and totals come from the validated daily data.
- Repository discovery: an unauthenticated public GitHub REST request to
  `/users/tkorsi/repos?type=owner&sort=pushed&direction=desc&per_page=100`.
  From those 100 most recently pushed repositories, select the latest three eligible
  entries by `pushed_at`. Only public repositories owned by `tkorsi` with content
  are eligible. Forks, archived/disabled repositories, and `tkorsi.github.io`
  itself are excluded. For repositories that GitHub reports with zero size, a public
  commit check confirms whether content exists (at most five checks per refresh,
  stopping when three eligible projects have been found). This handles delayed size
  metadata without promoting empty repositories. Names and canonical GitHub URLs are
  validated. No automatic research or publication categorization is performed.
- GitHub contributions include several forms of activity, and the public calendar can
  include anonymous counts of private work. They are not publication counts. No private
  repository names or organization activity are requested or displayed. Public commit
  checks inspect only commit identifiers; messages and author metadata are not retained
  or displayed.

Each source has a separate checked/saved date. Ten-second request timeouts, a validated
seven-day browser cache, and a bundled dated snapshot keep the section useful during
outages or GitHub rate limits. A successful repository selection replaces the previous
selection, including when it is empty. An expired selection does not revive repositories
from the older bundled snapshot. Saved data is explicitly labeled, and links to GitHub
remain available. The cache is optional: disabled browser storage does not break the section.
The calendar scrolls horizontally on small screens, starting with recent weeks, and
offers a keyboard-accessible table of every daily count. The Details & daily counts
disclosure also includes source information, repository descriptions, and manual refresh.

### Adding a new project

Create a **public** repository under `tkorsi` and push its first content. Once GitHub's
public API makes the first commit available, it can appear among the three most recently pushed
eligible projects on the next visit, a manual refresh, or the next 15-minute visible-tab
refresh. Pushing to an existing project can also move it into the selection. There is no
site rebuild or repository-name list to edit. Other public repositories remain accessible
through the GitHub profile link. GitHub's metadata may lag a push; API outages and rate
limits can delay discovery, with saved data labeled accordingly.

Run `npm run refresh:github` to refresh the bundled fallback using public endpoints.
This is only a fallback maintenance command; the page continues to refresh live without it.
Run `npm run check` for formatting, lint, data-safety tests, and a production build.

## Deployment

The existing deployment uses the `gh-pages` branch: `npm run deploy` builds the site
and publishes `dist` there. GitHub Pages serves that branch. CI on `main` validates
the source; it does not publish it. No new scheduled workflow or credentials are needed
for live activity updates.
