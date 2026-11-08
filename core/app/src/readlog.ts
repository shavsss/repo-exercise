// The reading log as a hook: loaded once per view, refreshed when anything marks a reading as read.
// Same file in both apps.
import { useEffect, useState } from "react";
import { loadReadLog, type ReadEntry } from "./events";

export function useReadLog(): Record<string, ReadEntry> | null {
  const [log, setLog] = useState<Record<string, ReadEntry> | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () => loadReadLog().then((l) => alive && setLog(l));
    load();
    window.addEventListener("readlog:changed", load);
    return () => {
      alive = false;
      window.removeEventListener("readlog:changed", load);
    };
  }, []);
  return log;
}
