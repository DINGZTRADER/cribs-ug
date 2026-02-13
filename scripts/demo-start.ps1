$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$apiDir = Join-Path $root "apps\api"
$demoEnvPath = Join-Path $apiDir ".env.demo"
$demoExamplePath = Join-Path $apiDir ".env.demo.example"

if (-not (Test-Path $demoEnvPath)) {
  if (Test-Path $demoExamplePath) {
    Copy-Item $demoExamplePath $demoEnvPath
    Write-Host "Created apps/api/.env.demo from template. Review values, then rerun demo:start."
    exit 1
  }
  Write-Error "Missing apps/api/.env.demo and .env.demo.example."
}

function Set-EnvFromFile([string]$path) {
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $parts = $line.Split("=", 2)
    if ($parts.Count -ne 2) { return }
    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"')
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
  }
}

Set-EnvFromFile $demoEnvPath

if (-not $env:ENABLE_DEV_ENDPOINTS) {
  $env:ENABLE_DEV_ENDPOINTS = "0"
}

Set-Location $root

Write-Host "Building API..."
pnpm --filter api run build

Write-Host "Starting API in demo-safe mode on port $($env:PORT)..."
pnpm --filter api run dev
