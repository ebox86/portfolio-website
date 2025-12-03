# portfolio-website

## Environment variables
- Build-time (public): `NEXT_PUBLIC_CAPTCHA_KEY`
- Runtime (secret): `CAT_API_KEY`, `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `CAPTCHA_SECRET` (and also set `NEXT_PUBLIC_CAPTCHA_KEY` so the app sees it at runtime).

### Local development
1. Copy `.env.example` to `.env.local` and fill in values.
2. Run `npm run dev` (Next.js will load `.env.local` automatically).

### Cloud Run / prod envs
- Copy `.env.example` to `.env` (or any filename you prefer), fill in runtime values.
- Update env vars on the service via CLI:
  ```
  ./scripts/update-cloud-run-env.sh
  ```
  (Override SERVICE/REGION/PROJECT/ENV_FILE via env vars if needed; defaults are service `portfolio`, region `us-east4`, project `portfolio-website-403402`, env file `.env`.)

### Container build
- Build with only the public key:  
  `docker build --build-arg NEXT_PUBLIC_CAPTCHA_KEY=... -t ghcr.io/ebox86/portfolio-website:latest .`

### Deploying (Cloud Run example)
- Set runtime env vars (from secrets or the console):  
  `CAT_API_KEY`, `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `CAPTCHA_SECRET`, `NEXT_PUBLIC_CAPTCHA_KEY`
- Deploy from GHCR via CLI:  
  `gcloud run deploy portfolio --region=us-central1 --image=ghcr.io/ebox86/portfolio-website:latest --allow-unauthenticated --set-env-vars CAT_API_KEY=...,MJ_APIKEY_PUBLIC=...,MJ_APIKEY_PRIVATE=...,CAPTCHA_SECRET=...,NEXT_PUBLIC_CAPTCHA_KEY=...`
