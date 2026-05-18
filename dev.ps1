# Spectr local dev — http://127.0.0.1:3000
# Usage: .\dev.ps1
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root
$env:PORT = "3000"

function Find-NodeToolchain {
  $candidates = @(
    @{ Node = Join-Path $env:ProgramFiles "nodejs\node.exe"; Npm = Join-Path $env:ProgramFiles "nodejs\npm.cmd" },
    @{ Node = (Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source); Npm = (Get-Command npm -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source) }
  )

  foreach ($c in $candidates) {
    if ($c.Node -and (Test-Path $c.Node)) {
      $npm = $c.Npm
      if (-not $npm -or -not (Test-Path $npm)) {
        $npm = Join-Path (Split-Path $c.Node -Parent) "npm.cmd"
      }
      if (Test-Path $npm) {
        return @{ Node = $c.Node; Npm = $npm; BinDir = Split-Path $c.Node -Parent }
      }
    }
  }

  $cursorNode = Join-Path $env:LOCALAPPDATA "Programs\cursor\resources\app\resources\helpers\node.exe"
  if (Test-Path $cursorNode) {
    Write-Host "Warning: using Cursor bundled Node (no npm). Install Node.js LTS from https://nodejs.org/" -ForegroundColor Yellow
    return @{ Node = $cursorNode; Npm = $null; BinDir = $null }
  }

  return $null
}

function Invoke-Npm([string[]]$NpmArgs) {
  if (-not $script:Toolchain.Npm) {
    throw "npm not found. Install Node.js LTS from https://nodejs.org/ and restart PowerShell."
  }
  & $script:Toolchain.Npm @NpmArgs
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$script:Toolchain = Find-NodeToolchain
if (-not $script:Toolchain) {
  Write-Host "Node.js not found. Install LTS from https://nodejs.org/ (check 'Add to PATH'), then reopen PowerShell." -ForegroundColor Red
  exit 1
}

if ($script:Toolchain.BinDir) {
  $env:Path = "$($script:Toolchain.BinDir);$env:Path"
  Write-Host "Using Node: $($script:Toolchain.Node)" -ForegroundColor DarkGray
}

$rootModules = Join-Path $Root "node_modules"
if (-not (Test-Path $rootModules)) {
  Write-Host "Installing dependencies (first run)..." -ForegroundColor Cyan
  Invoke-Npm @("install")
  Invoke-Npm @("rebuild", "better-sqlite3")
}

$profileModules = Join-Path $Root "profile\node_modules"
if (-not (Test-Path $profileModules)) {
  Write-Host "Installing profile dependencies..." -ForegroundColor Cyan
  Invoke-Npm @("install", "--prefix", "profile")
}

$companySpa = Join-Path $Root "company\index.html"
if (-not (Test-Path $companySpa)) {
  Write-Host "Building company profile app..." -ForegroundColor Cyan
  Invoke-Npm @("run", "build:profile")
}

if (-not (Test-Path (Join-Path $Root "data\spectr.db")) -and -not (Test-Path (Join-Path $Root "data\companies\equinor.json"))) {
  Write-Host "Seeding company database..." -ForegroundColor Cyan
  & $script:Toolchain.Node (Join-Path $Root "scripts\seed-database.js")
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: seed failed. Try: .\db-seed.ps1" -ForegroundColor Yellow
  }
  Write-Host ""
}

$envFile = Join-Path $Root ".env"
if (Test-Path $envFile) {
  $keyLine = Select-String -Path $envFile -Pattern "^SUPABASE_SERVICE_ROLE_KEY=(.+)$" | Select-Object -First 1
  $keyValue = if ($keyLine) { $keyLine.Matches.Groups[1].Value.Trim() } else { "" }
  if ($keyValue.Length -lt 20) {
    Write-Host "Warning: SUPABASE_SERVICE_ROLE_KEY missing in .env - paste service_role from Supabase API settings." -ForegroundColor Yellow
  }
}

Write-Host "Starting dev server at http://127.0.0.1:$($env:PORT)/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

& $script:Toolchain.Node (Join-Path $Root "scripts\dev-server.js")
exit $LASTEXITCODE
