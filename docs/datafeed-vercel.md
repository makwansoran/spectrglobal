# Market datafeed on Vercel (no local machine)

The datafeed runs **entirely on Vercel** via scheduled Cron Jobs. You do not need your laptop or GitHub Actions for normal operation.

## What runs on Vercel

| Source | Method | Updates |
|--------|--------|---------|
| Euronext (Oslo, Amsterdam, Paris, …) | Official CSV download over HTTP | Prices, tickers, ISINs → `euronext_listings` |
| Finnhub | REST API | US quote fields on `companies` |
| User search | On-demand API | Missing Oslo ticker synced when someone searches |

## What does **not** run on Vercel

**agent-browser** (headless Chrome) cannot run in serverless functions. Full HTML page scrapes need a machine with Chrome (local dev or GitHub Actions). For the product datafeed, the CSV/API path is enough.

## GitHub Actions (`datafeed-sync.yml`)

Repository → **Settings → Secrets and variables → Actions**:

| Secret | Required |
|--------|----------|
| `SUPABASE_URL` | Yes — `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes — Supabase → Project Settings → API |
| `FINNHUB_API_KEY` | No — US quote refresh in CI |

The workflow syncs **Oslo only** by default (fast, fits CI). Use **Run workflow** to change markets.

## One-time setup (Vercel)

1. **Vercel → Project → Settings → Environment Variables**
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FINNHUB_API_KEY` (optional, for US quotes)
   - `CRON_SECRET` — random string; Vercel sends it as `Authorization: Bearer …` on cron requests

2. **Deploy** (push to `main` or redeploy).

3. **Check health:** `GET https://www.spectr.no/api/datafeed/status`  
   (use `www` — bare `spectr.no` redirects)

### Test from PowerShell

```powershell
# Status (no secret)
Invoke-RestMethod "https://www.spectr.no/api/datafeed/status"

# Sync (replace with your CRON_SECRET from Vercel)
$secret = "your-secret-from-vercel-env"
Invoke-RestMethod `
  -Uri "https://www.spectr.no/api/datafeed/sync?sources=euronext&markets=oslo" `
  -Headers @{ Authorization = "Bearer $secret" }
```

Or with curl:

```powershell
curl.exe -L -H "Authorization: Bearer YOUR_SECRET" "https://www.spectr.no/api/datafeed/sync?sources=euronext&markets=oslo"
```

Use **`-L`** to follow redirects. Use **`curl.exe`**, not `curl` (PowerShell alias).

## Cron schedule (`vercel.json`)

- **Oslo + Finnhub:** every hour (`0 * * * *`) — requires **Vercel Pro** (Hobby only allows once per day).
- **Other Euronext markets:** once daily, staggered (06:15–07:30 UTC).

### Vercel Hobby

If deploy fails with a cron error, change the Oslo job to daily:

```json
{ "path": "/api/datafeed/sync?sources=euronext,finnhub&markets=oslo", "schedule": "0 6 * * *" }
```

Remove or merge the other cron entries into a single daily `markets=oslo,amsterdam,paris,...` job.

### Vercel Pro

You can make Oslo even more frequent, e.g. every 15 minutes:

```json
"schedule": "*/15 * * * *"
```

## Manual trigger (production)

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://spectr.no/api/datafeed/sync?sources=euronext&markets=oslo"
```
