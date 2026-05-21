# Spectr Parts local dev — http://127.0.0.1:3000
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
  return $null
}

function Invoke-Npm([string[]]$NpmArgs) {
  if (-not $script:Toolchain.Npm) {
    throw "npm not found. Install Node.js LTS from https://nodejs.org/"
  }
  & $script:Toolchain.Npm @NpmArgs
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$script:Toolchain = Find-NodeToolchain
if (-not $script:Toolchain) {
  Write-Host "Node.js not found. Install LTS from https://nodejs.org/" -ForegroundColor Red
  exit 1
}

if ($script:Toolchain.BinDir) {
  $env:Path = "$($script:Toolchain.BinDir);$env:Path"
}

$rootModules = Join-Path $Root "node_modules"
if (-not (Test-Path $rootModules)) {
  Write-Host "Installing dependencies (first run)..." -ForegroundColor Cyan
  Invoke-Npm @("install")
}

$envFile = Join-Path $Root ".env"
if (Test-Path $envFile) {
  $keyLine = Select-String -Path $envFile -Pattern "^SUPABASE_SERVICE_ROLE_KEY=(.+)$" | Select-Object -First 1
  $keyValue = if ($keyLine) { $keyLine.Matches.Groups[1].Value.Trim() } else { "" }
  if ($keyValue.Length -lt 20) {
    Write-Host "Warning: SUPABASE_SERVICE_ROLE_KEY missing in .env — customer sign-in saves will fail." -ForegroundColor Yellow
  }
}

Write-Host "Starting Spectr Parts at http://127.0.0.1:$($env:PORT)/" -ForegroundColor Green
& $script:Toolchain.Node (Join-Path $Root "scripts\dev-server.js")
exit $LASTEXITCODE
