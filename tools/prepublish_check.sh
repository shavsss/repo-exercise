#!/usr/bin/env bash
# Before publishing Lanchester or Gilua: HEAD must contain the latest origin/main,
# and it should contain the commit of the live version (recorded in docs/STATUS.md).
# Usage: tools/prepublish_check.sh   (exit 1 when publishing would drop work)
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

git fetch -q origin main || echo "warning: could not fetch origin/main; checking against the local copy"

fail=0
if git merge-base --is-ancestor origin/main HEAD; then
  echo "ok: HEAD contains origin/main ($(git rev-parse --short origin/main))"
else
  echo "FAIL: HEAD does not contain origin/main ($(git rev-parse --short origin/main)). Merge main first: git merge origin/main"
  fail=1
fi

# the last "פרסום:" line in STATUS.md names version, branch and commit
line=$(grep -E '^- פרסום:' docs/STATUS.md | tail -1)
if [ -z "$line" ]; then
  echo "warning: no '- פרסום:' line in docs/STATUS.md; cannot tell which commit is live"
else
  echo "last recorded publish: ${line#- }"
  commit=$(printf '%s\n' "$line" | grep -oE 'commit `?[0-9a-f]{7,40}' | tail -1 | grep -oE '[0-9a-f]{7,40}$')
  if [ -n "$commit" ]; then
    if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
      echo "FAIL: live commit $commit is not in this clone; fetch its branch and merge it"
      fail=1
    elif git merge-base --is-ancestor "$commit" HEAD; then
      echo "ok: HEAD contains the live commit $commit"
    else
      echo "FAIL: HEAD does not contain the live commit $commit; merge its branch first"
      fail=1
    fi
  fi
fi
exit $fail
