# CoinTrack - The Only CryptoTracker You Need!

## Description
CoinTrack is the tool you've always needed. Compare different cryptocurrencies, view their graphs—prices, total volumes, market cap, etc. Search from the top 100 cryptocurrencies in real-time and add them to your watchlist.

## Objective
Build a responsive and live crypto tracker using React JS to help users analyze, compare, and learn about cryptocurrencies all in one place.

## Technologies Used
- **React JS**: Frontend framework.
- **Material UI**: For reusable components.
- **Chart.js**: For creating interactive graphs.
- **Axios**: To make API calls to fetch real-time data.
- **React Router**: For managing routing in the application.
- **Coingecko API**: To fetch cryptocurrency data.
- **Framer Motion**: For smooth animations.

## Project Context
The world is moving towards Web3 and crypto, making it essential to stay updated. Cryptack provides real-time data, enabling users to make informed decisions. It’s a comprehensive tool for crypto enthusiasts and investors.

## Project Stages
1. **Basic React Project Setup**: Initial project setup using Create React App.
2. **API Review**: Go through the Coingecko API documentation.
3. **Folder Structure**: Organize the project structure.
4. **Styling Setup**: Add global styling, fonts, and root variables.
5. **React Router Integration**: Implement routing.
6. **Header**: Add MUI drawer for the mobile navbar.
7. **Landing Page**: Develop components for the landing page.
8. **Dashboard Page**: Create the dashboard with MUI tabs.
9. **Fetching Coin Data**: Use Axios to fetch data from the Coingecko API.
10. **Grid and List Views**: Implement views for displaying cryptocurrencies.
11. **Coin Page**: Integrate Chart.js for coin visualizations.

## Project Links and References
- **Project Link**: [CoinTrack](https://cointrack.shrijit.tech/)
- **Dribbble**: [Design Inspirations](https://www.framer.com/motion/)
- **API Documentation**: [Coingecko API](https://www.coingecko.com/en/api)
- **Chart.js Documentation**: [Chart.js](https://www.chartjs.org/docs/latest/)
- **Material UI Documentation**: [Material UI](https://mui.com/material-ui/)
- **Framer Motion Documentation**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started
### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository.
    ```bash
    git clone https://github.com/shrijit37/CoinTrack.git
    cd cointrack
    ```
2. Install dependencies.
    ```bash
    npm install
    ```
3. Start the development server.
    ```bash
    npm start
    ```

### Available Scripts
Use the `make` targets, which wrap the standard `scripts/` contract. CI calls
these and never a framework command directly.

- `make setup`: install dependencies from the lockfile.
- `make dev`: dev server on :3000 with hot reload.
- `make test`: test suite (`CI=true`, non-watch).
- `make lint`: eslint via the react-app config.
- `make build`: production build into `build/`.

The underlying `npm` scripts still work if you prefer them directly.

## Class and deploy path

`STATIC`. No container, no database, no server process. Deployed by Cloudflare
Pages:

```text
push to main → GitHub Actions (test → lint → build → Pages) → Cloudflare Pages
PR            → test + lint + Pages preview
```

Nothing is built on the deploy server, and Dokploy is not involved.

Because routing is client-side (`BrowserRouter`), `public/_redirects` provides
the SPA fallback. Without it, refreshing or sharing `/dashboard`, `/compare`,
`/watchlist` or `/coin/:id` 404s at the CDN.

## Configuration

Non-secret values are documented in `.env.example`. This project has no
secrets. Note that any `COINGECKO_API_KEY` used in a CRA build is inlined into
the browser bundle and is therefore public.

| Repo variable | Purpose |
|---|---|
| `PAGES_PROJECT` | Pages project name (`cointrack`) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |
| `APP_URL` | production URL, used by the CI health gate |
| `CLOUDFLARE_API_TOKEN` | *(secret)* Pages deploy token |

## Health

STATIC repos have no `/health` endpoint. `make health` asserts the deployed
URL serves the app shell *and* that a deep link resolves, which is what
catches a missing SPA fallback.

## Rollback

Cloudflare Pages retains every deployment; promote a previous one from the
Pages dashboard or API. No rebuild needed.

## Known issues

See [STATE.md](./STATE.md) for the full list, including the
`allorigins.win` CORS proxy in `getCoinData.js` and the fact that
`react-scripts@5` is unmaintained.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Live Deployment

**Production**: https://cointrack.shrijit.tech