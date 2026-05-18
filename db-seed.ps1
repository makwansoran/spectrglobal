# Seed Supabase + local DB (no npm in PATH required)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root

$node = Join-Path ${env:ProgramFiles} "nodejs\node.exe"
$npm = Join-Path ${env:ProgramFiles} "nodejs\npm.cmd"

if (-not (Test-Path $node)) {
  Write-Host "Node.js not found. Install LTS from https://nodejs.org/" -ForegroundColor Red
  exit 1
}

$env:Path = "$(Split-Path $node -Parent);$env:Path"

if (-not (Test-Path (Join-Path $Root "node_modules"))) {
  Write-Host "Installing dependencies..." -ForegroundColor Cyan
  & $npm install
  & $npm rebuild better-sqlite3
}

if (-not (Test-Path (Join-Path $Root "profile\node_modules"))) {
  Write-Host "Installing profile dependencies..." -ForegroundColor Cyan
  & $npm install --prefix profile
}

$envFile = Join-Path $Root ".env"
if (Test-Path $envFile) {
  $envText = Get-Content $envFile -Raw
  if ($envText -match "SUPABASE_SERVICE_ROLE_KEY=\s*$" -or $envText -match "SUPABASE_SERVICE_ROLE_KEY=\r?\n") {
    Write-Host "Warning: SUPABASE_SERVICE_ROLE_KEY is empty in .env" -ForegroundColor Yellow
    Write-Host "  Paste service_role from:" -ForegroundColor Yellow
    Write-Host "  https://supabase.com/dashboard/project/xwqpubpydrngmcfquwgb/settings/api" -ForegroundColor Yellow
    Write-Host ""
  }
}

Write-Host "Seeding database..." -ForegroundColor Cyan
& $node (Join-Path $Root "scripts\seed-database.js")
exit $LASTEXITCODE
