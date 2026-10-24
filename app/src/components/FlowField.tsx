import { useEffect, useRef } from "react";
import { useTheme } from "../theme";

/** Glowing particle strands drifting along a flow field (decorative). */
export function FlowField({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { dark } = useTheme();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = dark ? ["#ff6b35", "#ff9a3d", "#ff3d7f", "#ffd166"] : ["#ff6b35", "#ff3d7f", "#8b5cf6", "#3a86ff"];
    type P = { x: number; y: number; life: number; c: string };
    let ps: P[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(((w * h) / 2600) * density);
      ps = Array.from({ length: Math.min(n, 700) }, () => spawn());
      ctx.fillStyle = dark ? "#0d0b14" : "#f6efe2";
      ctx.fillRect(0, 0, w, h);
    };
    const spawn = (): P => ({ x: Math.random() * w, y: Math.random() * h, life: 60 + Math.random() * 220, c: colors[(Math.random() * colors.length) | 0] });

    let t = 0;
    const field = (x: number, y: number) => {
      // two loops like a figure eight, plus slow drift
      const nx = x / w - 0.5;
      const ny = y / h - 0.5;
      return Math.sin(nx * 6.2 + t * 0.0007) * 1.6 + Math.cos(ny * 8.5 - t * 0.0005) * 1.4 + Math.atan2(ny, nx) * 0.6;
    };

    const step = () => {
      t += 16;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = dark ? "rgba(13,11,20,0.08)" : "rgba(246,239,226,0.10)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = dark ? "lighter" : "multiply";
      ctx.lineWidth = dark ? 0.9 : 0.8;
      for (const p of ps) {
        const a = field(p.x, p.y);
        const nx = p.x + Math.cos(a) * 1.3;
        const ny = p.y + Math.sin(a) * 1.3;
        ctx.strokeStyle = p.c + (dark ? "88" : "55");
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        if (--p.life < 0 || p.x < 0 || p.y < 0 || p.x > w || p.y > h) Object.assign(p, spawn());
      }
      raf = requestAnimationFrame(step);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (reduce) for (let i = 0; i < 120; i++) step(), cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dark, density]);

  return <canvas ref={ref} className={`flow-field ${className}`} aria-hidden />;
}
