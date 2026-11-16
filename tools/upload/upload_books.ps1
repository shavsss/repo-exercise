# Upload books from a local folder to the repo (Windows PowerShell).
# Usage (from the sparse clone root): powershell -ExecutionPolicy Bypass -File tools\upload\upload_books.ps1 "C:\path\to\books" [-Since 2026-11-16]
# -Since uploads only files added or changed on or after that date (files already uploaded are skipped anyway).
# Each file goes to library/incoming/ on its own new branch (books-incoming-<time>),
# one commit and push per file. Files over 90MB are split into .part-aa, .part-ab ...
param([Parameter(Mandatory=$true)][string]$Src, [datetime]$Since = [datetime]::MinValue)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $Src -PathType Container)) { Write-Host "folder not found: $Src"; exit 1 }
Set-Location (git rev-parse --show-toplevel)
$branch = "books-incoming-" + (Get-Date -Format "yyyyMMdd-HHmmss")
git sparse-checkout add library/incoming 2>$null
git checkout -q -b $branch
New-Item -ItemType Directory -Force library/incoming | Out-Null
$limit = 90MB; $n = 0
Get-ChildItem -Path $Src -File -Recurse | Where-Object { -not $_.Name.StartsWith(".") -and ($_.CreationTime -ge $Since -or $_.LastWriteTime -ge $Since) } | ForEach-Object {
  $dest = Join-Path "library/incoming" $_.Name
  if ((Test-Path $dest) -or (Test-Path "$dest.part-aa")) { Write-Host "skip (already uploaded): $($_.Name)"; return }
  if ($_.Length -gt $limit) {
    $in = [IO.File]::OpenRead($_.FullName); $buf = New-Object byte[] $limit; $k = 0
    while (($r = $in.Read($buf, 0, $limit)) -gt 0) {
      $a = [int][math]::Floor($k / 26); $b = [int]($k % 26)
      $suffix = [string][char](97 + $a) + [string][char](97 + $b)
      $out = [IO.File]::Create("$dest.part-$suffix"); $out.Write($buf, 0, $r); $out.Close(); $k++
    }
    $in.Close()
  } else { Copy-Item $_.FullName $dest }
  git add -- "library/incoming/$($_.Name)*"
  git commit -q -m "books: $($_.Name)"
  foreach ($i in 1..4) { git push -q -u origin $branch; if ($LASTEXITCODE -eq 0) { break }; Write-Host "push failed, retry $i"; Start-Sleep ($i*5) }
  $n++; Write-Host "[$n] uploaded: $($_.Name)"
}
Write-Host "done: $n files on branch $branch"
