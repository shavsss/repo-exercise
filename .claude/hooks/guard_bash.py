#!/usr/bin/env python3
"""PreToolUse hook for Bash: blocks pushes to protected branches and commands that destroy work for good.
Reads the hook JSON on stdin; exit code 2 blocks the call and the stderr text goes back to Claude."""
import json, re, sys

PROTECTED = r"(main|master)"
RULES = [
    (rf"git\s+push\b[^\n;&|]*\b{PROTECTED}\b", "push to a protected branch (main/master): push a work branch instead"),
    (r"git\s+push\b[^\n;&|]*(--force\b|-f\b|--force-with-lease\b[^\n;&|]*\b" + PROTECTED + r"\b)", "force push"),
    (r"git\s+reset\s+--hard", "git reset --hard discards uncommitted work"),
    (r"git\s+clean\s+-[a-z]*f", "git clean -f deletes untracked files for good"),
    (r"git\s+branch\s+-D\b", "git branch -D deletes unmerged work"),
    (r"rm\s+-[a-z]*r[a-z]*f?[a-z]*\s+(/|~|\$HOME|\.|\*|\.\.)(\s|$)", "recursive delete of a root, home or the whole tree"),
]

try:
    cmd = json.load(sys.stdin).get("tool_input", {}).get("command", "")
except Exception:
    sys.exit(0)
for pat, why in RULES:
    if re.search(pat, cmd):
        print(f"Blocked: {why}. If the user really wants this, they run it themselves.", file=sys.stderr)
        sys.exit(2)
