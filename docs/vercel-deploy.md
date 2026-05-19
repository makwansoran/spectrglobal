# Deploy to Vercel

Production is **https://www.spectr.no** (project `spectrglobal`).

## If pushes to `main` do not deploy

1. **Vercel Dashboard** → [spectrglobal](https://vercel.com/makwansorans-projects/spectrglobal) → **Deployments**  
   Check for failed builds (red). Common fix: invalid `vercel.json` crons (Hobby plan allows **once per day** per cron, not hourly).

2. **Reconnect Git** → Project **Settings** → **Git** → confirm `makwansoran/spectrglobal` and branch `main` for Production.

3. **GitHub Actions deploy** (optional backup) — add secrets under **Repository → Settings → Secrets → Actions**:

   | Secret | Where to find it |
   |--------|------------------|
   | `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
   | `VERCEL_ORG_ID` | `team_xX5o0QigpuHYVvXkyolZJM2b` (or Team Settings → General) |
   | `VERCEL_PROJECT_ID` | `prj_Gbbz78Q70l5mtrByBWYDQV4hTXIJ` (Project Settings → General) |

   Workflow: `.github/workflows/vercel-deploy.yml` runs on every push to `main`.

## Manual deploy from your machine

```bash
npm install -g vercel
vercel link
vercel --prod
```
