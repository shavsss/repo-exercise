#!/usr/bin/env bash
# Upload books from a local folder to the repo, so the cloud session can process them.
# Usage (from the sparse clone root): bash tools/upload/upload_books.sh "/path/to/books"
# Each file goes to library/incoming/ on its own new branch (books-incoming-<time>),
# one commit and push per file. Files over 90MB are split into .part-aa, .part-ab ...
set -euo pipefail
SRC="${1:?usage: bash tools/upload/upload_books.sh \"/path/to/books\"}"
[ -d "$SRC" ] || { echo "folder not found: $SRC"; exit 1; }
cd "$(git rev-parse --show-toplevel)"
BRANCH="books-incoming-$(date +%Y%m%d-%H%M%S)"
git sparse-checkout add library/incoming >/dev/null 2>&1 || true
git checkout -q -b "$BRANCH"
mkdir -p library/incoming
LIMIT=${UPLOAD_LIMIT:-$((90*1024*1024))}
n=0
while IFS= read -r -d '' f; do
  name="$(basename "$f")"
  case "$name" in .*) continue;; esac
  dest="library/incoming/$name"
  size=$(wc -c < "$f" | tr -d ' ')
  if [ "$size" -gt "$LIMIT" ]; then
    split -b "$LIMIT" "$f" "$dest.part-"
  else
    cp "$f" "$dest"
  fi
  git add -- "library/incoming/$name"*
  git commit -q -m "books: $name"
  for i in 1 2 3 4; do git push -q -u origin "$BRANCH" && break || { echo "push failed, retry $i"; sleep $((i*5)); }; done
  n=$((n+1)); echo "[$n] uploaded: $name"
done < <(find "$SRC" -type f -print0)
echo "done: $n files on branch $BRANCH"
