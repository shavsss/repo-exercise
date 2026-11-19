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

# every "- פרסום:" line in STATUS.md names a commit that was live at some point: HEAD must contain all of them
# (the lines are newest-first, so checking only one of them missed publishes; fixed 19.11.2026)
git fetch -q origin '+refs/heads/*:refs/remotes/origin/*' 2>/dev/null || echo "warning: could not fetch all branches"
lines=$(grep -E '^- פרסום:' docs/STATUS.md)
if [ -z "$lines" ]; then
  echo "warning: no '- פרסום:' line in docs/STATUS.md; cannot tell which commit is live"
else
  echo "latest recorded publish: $(printf '%s\n' "$lines" | head -1 | cut -c3-200)"
  for commit in $(printf '%s\n' "$lines" | grep -oE 'commit `?[0-9a-f]{7,40}' | grep -oE '[0-9a-f]{7,40}$'); do
    if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
      echo "FAIL: published commit $commit is not in this clone; fetch its branch and merge it"; fail=1
    elif ! git merge-base --is-ancestor "$commit" HEAD; then
      echo "FAIL: HEAD does not contain published commit $commit; merge its branch first"; fail=1
    fi
  done
  [ $fail -eq 0 ] && echo "ok: HEAD contains every recorded published commit"
fi

# a branch that says it published (in its STATUS.md) but is not merged here: its work would be dropped
for b in $(git branch -r --no-merged HEAD | grep -E 'origin/(claude|integrate)/'); do
  if git diff "HEAD...$b" -- docs/STATUS.md 2>/dev/null | grep -qE '^\+.*(פורסמ|פרסום:|[Pp]ublished)'; then
    echo "FAIL: $b records a publish and is not merged into HEAD; merge it first"; fail=1
  fi
done
exit $fail
