// Technical line icons (24×24, stroke only), drawn in currentColor.
const PATHS: Record<string, string> = {
  plan: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14",
  story: "M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-5a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h5z",
  history: "M12 7v5l3 2M3.5 12a8.5 8.5 0 1 0 2.5-6M3 4v4h4",
  formula: "M17 5H7l5 7-5 7h10",
  think: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z",
  refresh: "M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4",
  domain: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  casestudy: "M12 3v3M12 18v3M3 12h3M18 12h3M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 11v2",
  model: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 17h6M17 14v6",
  erratum: "M12 4l9 16H3zM12 10v4M12 17v.5",
  fieldsystems: "M5 19l3-6M5 13a7 7 0 0 0 9 4M8 9.5a4 4 0 0 1 5.5 5.5M11 12l6-6M16 4l3 3M4 21h8",
  coverage: "M4 6h2M4 12h2M4 18h2M9 6h11M9 12h11M9 18h7",
  exercise: "M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3",
  figure: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6",
  sim: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6",
  anim: "M5 4l14 8-14 8z",
  check: "M5 12l5 5 9-10",
  lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  dot: "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  sun: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z",
  book: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11",
  memory: "M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6zM9 3v18M12 8h3M12 12h3",
  prev: "M9 6l6 6-6 6",
  next: "M15 6l-6 6 6 6",
  search: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.5 15.5L20 20",
  calc: "M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2",
  pin: "M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11zM12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  quiz: "M7 4h10v16H7zM10 8h4M10 12h4M10 16h2",
  side: "M3 4h18v16H3zM15 4v16",
  send: "M12 19V5M6 11l6-6 6 6",
  stop: "M7 7h10v10H7z",
  image: "M4 5h16v14H4zM8 10a1.5 1.5 0 1 0 0-.01M20 16l-5-5-7 8",
  expand: "M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6",
};

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg className={`icon ${className ?? ""}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[name] ?? PATHS.dot} />
    </svg>
  );
}
