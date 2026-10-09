# STATE.md

Truthful current state. This file wins over any other doc in this repo when
they disagree. Last verified **2026-10-09**.

## Live endpoints (probed)

| What | URL | Status |
|---|---|---|
| Site | https://cointrack.shrijit.tech | 200 |
| SPA fallback (deep link) | https://cointrack.shrijit.tech/dashboard | 200 |
| Pages fallback | https://cointrack.pages.dev | 200 |

## Class

`STATIC` — no container, no database, no server process. Served by Cloudflare
Pages from CRA's `build/` output.

## Feature truth table

| Feature | State |
|---|---|
| Home / coin list (top 100 by market cap) | implemented |
| Coin detail page with price chart | implemented |
| Dashboard | implemented |
| Compare view | implemented |
| Watchlist | implemented |
| Light/dark theme toggle | implemented |
| Unit tests | **missing** — `scripts/test` passes with `--passWithNoTests` |
| E2E tests | missing |

## Data layer

None. No database, no ORM. All data comes from the CoinGecko public API,
called directly from the browser.

## Runtime dependencies

- `https://api.coingecko.com/api/v3/...` — direct from browser in
  `get100Coins.js` and `getCoinPrices.js`.
- `https://api.allorigins.win/get?url=...` — a **third-party CORS proxy** in
  `getCoinData.js`, used to dodge CoinGecko's CORS policy. This is a
  reliability and privacy liability; flagged below.

## Deploy path

```text
push to main → GitHub Actions (test → lint → build → Pages) → Cloudflare Pages
PR            → test + lint + Pages preview
```

No Dokploy involvement. No Docker. Nothing is built on the deploy server.

## Hostname

`cointrack.shrijit.tech` — the frontend/static slot per the
`standards/platform.md` domain convention. No `api.` record: this project has
no backend.

DNS: CNAME `cointrack.shrijit.tech` → `cointrack-4lf.pages.dev`, **proxied**.
Replaces a stale CNAME to `cointrack-545.netlify.app`.

## Routing

Client-side routing via `BrowserRouter`. `public/_redirects` supplies the SPA
fallback (`/* /index.html 200`), verified by the CI health gate probing
`/dashboard`. Without it, shared links and hard refreshes 404 at the CDN.

## Secrets

None required. CI uses `CLOUDFLARE_API_TOKEN` (scoped Pages/Workers edit on
this one account) to deploy; canonical copy in Infisical `platform/prod` as
`CLOUDFLARE_PAGES_API_TOKEN`.

## GitHub config

| Name | Type | Value |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | secret | Infisical-backed Pages deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | variable | account id |
| `PAGES_PROJECT` | variable | `cointrack` |
| `APP_URL` | variable | `https://cointrack.shrijit.tech` |

## History

- `cointrack.shrijit.tech` pointed at Netlify (`cointrack-545.netlify.app`),
  a stale deployment. Repointed to Cloudflare Pages 2026-10-09.
- Repo had no CI at all before this migration.

## CI behaviour worth knowing

`scripts/build` exports `CI=true`. GitHub Actions sets `CI` automatically, and
CRA promotes every lint warning to a hard build error when it is truthy. That
made the first CI run fail on warnings that never failed locally. Exporting it
in the script means local and CI builds behave identically.

To keep that useful, the source is now warning-free. Fixed during this
migration:

| File | Problem | Fix |
|---|---|---|
| `components/Coin/CoinChart` | `import { Chart as ChartJS }` bound a name only to dodge unused-var | bare side-effect `import "chart.js/auto"` |
| `components/Coin/PriceType`, `SelectDays`, `Common/Button`, `Common/Header` | unused `useState` import | removed |
| `App.js`, `Dashboard/Grid`, `Dashboard/Search`, `Header` | destructured `_` from `useTheme()`, which the context stopped returning | destructure `darkMode` only |
| `ComparePage/SelectCoins` | `!=` / `!==` inconsistency | normalised to `!==` |
| `Dashboard/Pagination` | anonymous default export | named function |
| `pages/Coin`, `pages/Compare` | `react-hooks/exhaustive-deps` on `getData()` | effect body inlined, plus a `cancelled` flag so a slow response for an old coin/range cannot overwrite newer state |

`scripts/lint` caps warnings at 100 rather than 0 so one stray warning cannot
hard-fail CI while the rest are being cleaned up. Lower it as the tree improves.

## Known issues

- **`allorigins.win` CORS proxy.** `getCoinData.js` routes coin detail
  requests through a third-party service. It can be slow, rate-limited, or
  down, and it sees every request. Should be replaced with a Pages Function
  proxying CoinGecko, the same pattern used for LeetCode in
  `portfolio-v1.1`. Not done yet — deliberately left out of this migration so
  the deploy path is not changed and re-verified in the same commit.
- **`react-scripts@5` is unmaintained.** The upstream `babel-preset-react-app`
  warning appears on every install. Migrating to Vite is the obvious next
  step; blocked only on wanting a dedicated commit.
- `process.env.COINGECKO_API_KEY` is referenced in `getCoinPrices.js`. In a
  CRA build any `process.env` value is **inlined into the browser bundle**, so
  this must never hold a real secret. Currently unset; leave it unset. The
  `.env.example` says so explicitly.
- `npm audit` reports vulnerabilities, not yet triaged.
- No Gitleaks / dependency / container scanning configured yet.
- README is still the stock create-react-app README.