# my-cv

Tech stack: React, TypeScript, Vite, Tailwind CSS. Tooling: ESLint, Prettier, GitHub Actions.

## GitHub activity

The compact header activity display reads the public profile of `tkorsi` and three selected
public, personally owned repositories. It refreshes on page load and every 15 minutes
while the tab is visible; visitors can also refresh manually. No token, account, or
additional access is required.

- Calendar: [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api),
  which reads GitHub's public contribution calendar and caches responses for up to an hour.
  The checked timestamp is the browser's successful retrieval time, not a guarantee of
  instant GitHub updates. The displayed date range and totals come from the validated daily data.
- Repository details: the public GitHub REST API. Only the named allowlist in
  `src/data/githubActivity.ts` is fetched. Private repositories, forks, ownership
  mismatches, and confirmed missing repositories are excluded.
- GitHub contributions include several forms of activity, and the public calendar can
  include anonymous counts of private work. They are not publication counts. No private
  names, commit messages, or organization activity are requested or displayed.

Each source has a separate checked/saved date. Ten-second request timeouts, a validated
seven-day browser cache, and a bundled dated snapshot keep the section useful during
outages or GitHub rate limits. Saved data is explicitly labeled, and links to GitHub
remain available. The cache is optional: disabled browser storage does not break the section.
The calendar scrolls horizontally on small screens, starting with recent weeks, and
offers a keyboard-accessible table of every daily count. The Details & daily counts
disclosure also includes source information, repository descriptions, and manual refresh.

Run `npm run refresh:github` to refresh the bundled fallback using public endpoints.
This is only a fallback maintenance command; the page continues to refresh live without it.
Run `npm run check` for formatting, lint, data-safety tests, and a production build.

## Deployment

The existing deployment uses the `gh-pages` branch: `npm run deploy` builds the site
and publishes `dist` there. GitHub Pages serves that branch. CI on `main` validates
the source; it does not publish it. No new scheduled workflow or credentials are needed
for live activity updates.
