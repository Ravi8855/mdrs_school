# Prints SHA-256 certificate fingerprint for Digital Asset Links (TWA).
# Usage:
#   .\scripts\print-twa-sha256-fingerprint.ps1 -KeystorePath "D:\path\android.keystore" -Alias "android"
# Default storepass/keypass for Android debug keystore: "android"

param(
  [Parameter(Mandatory = $true)]
  [string] $KeystorePath,
  [Parameter(Mandatory = $true)]
  [string] $Alias,
  [string] $StorePass = "",
  [string] $KeyPass = ""
)

$keytool = $null
if ($env:JAVA_HOME) {
  $c = Join-Path $env:JAVA_HOME "bin\keytool.exe"
  if (Test-Path $c) { $keytool = $c }
}
if (-not $keytool) {
  $fixed = @(
    "${env:ProgramFiles}\Android\Android Studio\jbr\bin\keytool.exe",
    "${env:LocalAppData}\Programs\Android\Android Studio\jbr\bin\keytool.exe"
  )
  foreach ($p in $fixed) {
    if (Test-Path $p) { $keytool = $p; break }
  }
}
if (-not $keytool) {
  $adopt = Get-ChildItem "${env:ProgramFiles}\Eclipse Adoptium" -Filter "jdk-17*\bin\keytool.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($adopt) { $keytool = $adopt.FullName }
}
if (-not $keytool -or -not (Test-Path $keytool)) {
  Write-Error "keytool.exe not found. Install JDK 17 or Android Studio JBR and set JAVA_HOME, then retry."
  exit 1
}

if (-not (Test-Path $KeystorePath)) {
  Write-Error "Keystore not found: $KeystorePath"
  exit 1
}

$args = @("-list", "-v", "-keystore", $KeystorePath, "-alias", $Alias)
if ($StorePass) { $args += @("-storepass", $StorePass) }
if ($KeyPass) { $args += @("-keypass", $KeyPass) }

Write-Host "Using: $keytool"
$out = & $keytool @args 2>&1
$out | Out-String | Write-Host

$line = $out | Where-Object { $_ -match "SHA256:" } | Select-Object -First 1
if ($line) {
  Write-Host ""
  Write-Host "Paste this value into public/.well-known/assetlinks.json -> sha256_cert_fingerprints array:"
  Write-Host ($line -replace "^\s*SHA256:\s*", "").Trim()
} else {
  Write-Warning "No SHA256 line found; check alias and passwords."
}
