# Upload books from a local folder to the repo (Windows PowerShell).
# Usage (from the sparse clone root): powershell -ExecutionPolicy Bypass -File tools\upload\upload_books.ps1 "C:\path\to\books"
# Each file goes to library/incoming/ on its own new branch (books-incoming-<time>),
# one commit and push per file. Files over 90MB are split into .part-aa, .part-ab ...
param([Parameter(Mandatory=$true)][string]$Src)
$ErrorActionPreference = "Stop"
if (-not (Test-Path $Src -PathType Container)) { Write-Host "folder not found: $Src"; exit 1 }
Set-Location (git rev-parse --show-toplevel)
$branch = "books-incoming-" + (Get-Date -Format "yyyyMMdd-HHmmss")
git sparse-checkout add library/incoming 2>$null
git checkout -q -b $branch
New-Item -ItemType Directory -Force library/incoming | Out-Null
$limit = 90MB; $n = 0
Get-ChildItem -Path $Src -File -Recurse | Where-Object { -not $_.Name.StartsWith(".") } | ForEach-Object {
  $dest = Join-Path "library/incoming" $_.Name
  if ($_.Length -gt $limit) {
    $in = [IO.File]::OpenRead($_.FullName); $buf = New-Object byte[] $limit; $k = 0
    while (($r = $in.Read($buf, 0, $limit)) -gt 0) {
      $suffix = [char](97 + [math]::Floor($k / 26)) + [string][char](97 + ($k % 26))
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
