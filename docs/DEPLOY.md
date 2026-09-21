# Deploying ShopLite (free tier)

GitHub itself only serves static files, so it can't run the FastAPI backend or
a Postgres database. This project deploys as three connected free-tier
services instead, each of which auto-deploys straight from this GitHub repo
on every push to `main` — no separate CI workflow needed, since Render and
Vercel both watch the repo directly:

| Piece                  | Provider | Why                                                             |
| ----------------------- | -------- | ---------------------------------------------------------------- |
| Postgres database       | [Neon](https://neon.tech) | Free tier doesn't expire (Render's free Postgres is deleted after 30 days) |
| FastAPI backend         | [Render](https://render.com) | Free Docker web services run indefinitely (with cold starts after 15 min idle) |
| Next.js frontend        | [Vercel](https://vercel.com) | Built for Next.js, free forever for personal projects |

Total cost: **$0/month**. Tradeoffs of the free tier: the Render API spins
down after 15 minutes of no traffic, so the first request after idle takes
~30-60s to wake up; Neon's compute also scales to zero after 5 minutes idle
and wakes on the next query.

## 1. Create the database (Neon)

1. Sign up at [neon.tech](https://neon.tech) (GitHub login is fine) and create a project.
2. Open the project's **Connection Details** and copy the connection string.
   It looks like:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
   ```
3. Convert it to the `asyncpg` driver form the backend expects (swap
   `postgresql://` for `postgresql+asyncpg://` — keep the rest, the app strips
   `sslmode` itself and negotiates TLS automatically for non-local hosts):
   ```
   postgresql+asyncpg://<user>:<password>@<host>.neon.tech/<dbname>
   ```
   Save this string — it's the `DATABASE_URL` for the next step.

## 2. Deploy the backend (Render)

1. Sign up at [render.com](https://render.com) and connect your GitHub account.
2. **New > Blueprint**, pick this repo. Render reads `render.yaml` at the repo
   root and provisions a free Docker web service named `shoplite-api`.
3. When prompted for the env vars the blueprint leaves blank, set:
   - `DATABASE_URL` — the connection string from step 1.
   - `CORS_ORIGINS` — `["https://YOUR-VERCEL-DOMAIN.vercel.app"]` (you can
     come back and fill this in after step 3, once you know the domain).
4. Deploy. Once live, note the service URL, e.g. `https://shoplite-api.onrender.com`.
   Confirm it's healthy: `curl https://shoplite-api.onrender.com/health`.

## 3. Deploy the frontend (Vercel)

1. Sign up at [vercel.com](https://vercel.com) and connect your GitHub account.
2. **Add New > Project**, import this repo, and set **Root Directory** to
   `frontend` (Vercel auto-detects Next.js from there).
3. Add environment variables:
   - `NEXT_PUBLIC_API_MOCK` = `false`
   - `BACKEND_URL` = the Render URL from step 2 (e.g. `https://shoplite-api.onrender.com`)
4. Deploy. Vercel gives you a `https://<project>.vercel.app` domain.
5. Go back to Render and update `CORS_ORIGINS` to
   `["https://<project>.vercel.app"]`, then redeploy the API so the browser
   is allowed to call it directly if needed (the app's own `/api/*` requests
   are same-origin via Next.js rewrites, so this mainly guards direct calls).

## 4. Verify

Visit your Vercel URL. The storefront should load real data from the FastAPI
+ Neon backend (categories, products, reviews seeded by `scripts/seed.py`,
which only seeds an empty database — safe to redeploy repeatedly).

## Redeploying

Every `git push` to `main` triggers both Render and Vercel to rebuild and
redeploy automatically — nothing else to run.
