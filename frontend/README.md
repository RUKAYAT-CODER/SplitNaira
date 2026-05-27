# SplitNaira Frontend

Next.js app scaffold for the SplitNaira web experience.

## Scripts
- `npm ci`
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`

## Notes
- Dependencies are pinned to exact versions in `package.json` and `package-lock.json`.
- Always install with `npm ci` locally and in CI to guarantee the same dependency graph.
- Propose dependency upgrades in dedicated PRs by running `npm install <name>@<version>` (or `npm install -D <name>@<version>`), committing both manifest and lockfile changes together.
- Configure `NEXT_PUBLIC_*` variables in `.env.local` based on `.env.example`.
- i18n is powered by `next-intl`; locale-prefixed routes are enabled (e.g. `/en`, `/fr`).
- To add another language, update `src/i18n/routing.ts` and add a matching `messages/<locale>.json`.

## Structure
- `src/app` - App Router pages and layout
- `src/proxy.ts` - Locale detection and redirects for `next-intl`
- `src/i18n` - Routing, navigation helpers, and request config for locales
- `src/components` - Reusable UI components
- `src/lib` - Stellar/Soroban helpers and client utilities
- `messages` - Translation dictionaries by locale

## Deployment

The frontend is deployed to **Vercel** via GitHub Actions.

| Event | Job | Result |
|---|---|---|
| Push to `main` | `deploy-production` | Production deployment |
| Pull request opened or updated | `deploy-preview` | Preview deployment; URL posted as PR comment |
| Manual `workflow_dispatch` | `deploy-production` or `deploy-preview` | Controlled by the `environment` input |

All deploy jobs are gated on `verify-frontend` (lint + build + test) passing first.

### Required GitHub Secrets

Three secrets must be configured in the repository before deployments will work:

- `VERCEL_TOKEN` — Vercel personal access token
- `VERCEL_ORG_ID` — Vercel team or account ID
- `VERCEL_PROJECT_ID` — Vercel project ID

Run `vercel link` from this directory to generate `.vercel/project.json`, which contains `orgId` and `projectId`.

### Environment Variables

All `NEXT_PUBLIC_*` variables are configured in the Vercel dashboard (Project → Settings → Environment Variables), not in GitHub secrets. They are statically inlined at build time by Next.js.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Production | Set to `mainnet` for production; defaults to `testnet` |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Production | Mainnet Soroban RPC URL |
| `NEXT_PUBLIC_HORIZON_URL` | Production | Mainnet Horizon URL |
| `NEXT_PUBLIC_API_BASE_URL` | Both | Deployed backend URL — app cannot reach the backend without this |
| `NEXT_PUBLIC_CONTRACT_ID` | Both | Deployed Soroban contract address |

See [docs/deployment.md](../docs/deployment.md) for the complete setup guide including one-time Vercel project configuration steps.
