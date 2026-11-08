#!/usr/bin/env python3
"""UserPromptSubmit hook: warns when the conversation context gets large.

Reads the transcript, takes the context size of the last main-thread reply
(input + cache read + cache write tokens) and, above a threshold, adds a note
that tells Claude to suggest /handoff and a new session. Silent otherwise.
Thresholds can be changed with CONTEXT_WARN / CONTEXT_STOP (tokens).
"""
import json
import os
import sys

WARN = int(os.environ.get("CONTEXT_WARN", 120_000))
STOP = int(os.environ.get("CONTEXT_STOP", 200_000))


def last_context(path):
    try:
        with open(path, "rb") as f:
            f.seek(0, 2)
            f.seek(max(0, f.tell() - 2_000_000))
            lines = f.read().decode("utf-8", "ignore").splitlines()
    except OSError:
        return 0
    for line in reversed(lines):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if d.get("type") != "assistant" or d.get("isSidechain"):
            continue
        u = (d.get("message") or {}).get("usage") or {}
        if u:
            return (u.get("input_tokens", 0) + u.get("cache_read_input_tokens", 0)
                    + u.get("cache_creation_input_tokens", 0))
    return 0


def main():
    try:
        data = json.load(sys.stdin)
    except ValueError:
        return
    ctx = last_context(data.get("transcript_path", ""))
    k = ctx // 1000
    if ctx >= STOP:
        print(f"[context-guard] השיחה בגודל כ-{k} אלף טוקנים (סף עצירה {STOP // 1000} אלף). "
              "פתח את התשובה בשורה אחת שאומרת למשתמש שהשיחה יקרה מדי, והצע להריץ /handoff "
              "ולעבור לשיחה חדשה. אל תתחיל משימה גדולה חדשה בשיחה הזו.")
    elif ctx >= WARN:
        print(f"[context-guard] השיחה בגודל כ-{k} אלף טוקנים. בסוף התשובה הוסף שורה אחת: "
              "השיחה מתארכת, כדאי לסיים את המשימה הנוכחית ואז /handoff ושיחה חדשה.")


if __name__ == "__main__":
    main()
