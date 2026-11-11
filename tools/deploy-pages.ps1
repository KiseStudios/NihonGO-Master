$ErrorActionPreference = "Stop"

$source = Join-Path $PSScriptRoot "..\Site japones estudo"
$deploy = Join-Path $env:TEMP "kise-japan-pages"

if (Test-Path -LiteralPath $deploy) {
  Remove-Item -LiteralPath $deploy -Recurse -Force
}

New-Item -ItemType Directory -Path $deploy | Out-Null
Copy-Item -LiteralPath (Join-Path $source "index.html") -Destination $deploy

foreach ($folder in @("css", "js", "assets", "telainicial2")) {
  Copy-Item -LiteralPath (Join-Path $source $folder) -Destination $deploy -Recurse
}

try {
  & npx wrangler pages deploy $deploy --project-name kise-japan --branch main --commit-dirty=true
  if ($LASTEXITCODE -ne 0) {
    throw "Cloudflare Pages deployment failed with exit code $LASTEXITCODE."
  }
}
finally {
  if (Test-Path -LiteralPath $deploy) {
    Remove-Item -LiteralPath $deploy -Recurse -Force
  }
}
