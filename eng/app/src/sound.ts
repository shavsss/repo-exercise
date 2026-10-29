// Quiet interface sounds, synthesized in the browser (no files): a soft wooden tick when typing,
// a muted tap on buttons, a short rising pair when an answer or a block opens, a faint rustle while
// a 3D scene is dragged, and a small chord when a lesson is finished. Only on actions, never while
// reading or scrolling. Turned off from the reading settings (data-sound="off" on the root).
// Chosen in docs/sound-cursor.html ("soft"). Identical in both labs.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const VOLUME = 0.3;

const enabled = () => document.documentElement.dataset.sound !== "off";

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(f: number, dur: number, { gain = 0.2, glide = 0, delay = 0 } = {}) {
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.setValueAtTime(f, t);
  if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * glide), t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, { freq = 3000, q = 1, gain = 0.15, type = "bandpass" as BiquadFilterType, delay = 0 } = {}) {
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime + delay;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const s = c.createBufferSource();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  s.buffer = buf;
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  g.gain.value = gain;
  s.connect(f);
  f.connect(g);
  g.connect(master);
  s.start(t);
}

const CUES = {
  key: () => noise(0.03, { freq: 1800 + Math.random() * 500, q: 3, gain: 0.08 }),
  click: () => tone(520, 0.07, { gain: 0.12, glide: 0.7 }),
  open: () => {
    tone(440, 0.12, { gain: 0.09 });
    tone(660, 0.16, { gain: 0.07, delay: 0.05 });
  },
  drag: () => noise(0.05, { freq: 900, q: 0.8, gain: 0.03, type: "lowpass" }),
  done: () => [523, 659, 784].forEach((f, i) => tone(f, 0.5, { gain: 0.08, delay: i * 0.07 })),
};
export type Cue = keyof typeof CUES;

export function play(cue: Cue) {
  if (!enabled()) return;
  try {
    CUES[cue]();
  } catch {
    // no sound in this view
  }
}

let installed = false;
/** Listens once on the document: typing, buttons, opened answers and dragged 3D scenes. */
export function installSounds() {
  if (installed) return;
  installed = true;
  document.addEventListener(
    "keydown",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (!t || e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = t.matches?.("textarea, input:not([type=range]):not([type=checkbox]):not([type=radio]), [contenteditable=''], [contenteditable='true']") || !!t.closest?.("[contenteditable='true'], math-field");
      if (typing && (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter")) play("key");
    },
    true,
  );
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("button, summary, [role=button], a.btn, .seg button");
      if (!el || (el as HTMLButtonElement).disabled) return;
      if (el.matches("summary") || /הצג|תשובה|פתח|רמז|פתרון/.test(el.textContent ?? "")) play("open");
      else play("click");
    },
    true,
  );
  let last = 0;
  document.addEventListener(
    "pointermove",
    (e) => {
      if (!e.buttons) return;
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.(".s3d canvas, .s3d")) return;
      const now = performance.now();
      if (now - last > 80) {
        last = now;
        play("drag");
      }
    },
    true,
  );
}
