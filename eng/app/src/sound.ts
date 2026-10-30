// Quiet interface sounds, synthesized in the browser (no files): SOUND v2 (docs/research/round5/ux/F3_sound.md,
// proto_sound_v2.html). Soft typing that never sounds the same twice, a muted tap on buttons, a paper rustle when an
// answer or a block opens, a faint texture while a 3D scene is dragged, and the soft two-tone pair for judgments
// (right, confident-wrong, end of a lesson). Only on actions, never while reading or scrolling. Turned off from the
// reading settings (data-sound="off" on the root), and the volume (0–100, data-volume on the root) is set there too.
// The background noise for reading ("library room", brown, pink, rain) is generative: grains from a random place in
// a pool, so no moment ever repeats exactly. Lanchester's chimes are "wood", Gilua's "glass" (data-lab on the root).
// Identical in both labs.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBus: GainNode | null = null;

const root = () => document.documentElement;
const enabled = () => root().dataset.sound !== "off" && volume() > 0;
/** master gain from the 0–100 setting, on a curve the ear hears as even steps (94 is about 0.8) */
const volume = () => {
  const v = Number(root().dataset.volume ?? 94);
  return Number.isFinite(v) ? Math.pow(Math.min(100, Math.max(0, v)) / 100, 2) * 0.9 : 0.8;
};
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const db = (x: number) => Math.pow(10, x / 20);
const glass = () => root().dataset.lab === "eng";

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    // a limiter after the volume, so loud keys at full volume never clip
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -6;
    limit.knee.value = 0;
    limit.ratio.value = 12;
    limit.attack.value = 0.001;
    limit.release.value = 0.05;
    master.connect(limit);
    limit.connect(ctx.destination);
    noiseBus = ctx.createGain();
    noiseBus.gain.value = 0;
    noiseBus.connect(ctx.destination);
  }
  if (master) master.gain.value = volume();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuf(c: BaseAudioContext, dur: number, shape = 0) {
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (shape ? Math.pow(1 - i / len, shape) : 1);
  return b;
}
function biq(c: BaseAudioContext, type: BiquadFilterType, f: number, q?: number) {
  const n = c.createBiquadFilter();
  n.type = type;
  n.frequency.value = f;
  if (q != null) n.Q.value = q;
  return n;
}
function gainN(c: BaseAudioContext, g: number) {
  const n = c.createGain();
  n.gain.value = g;
  return n;
}

/* ---- typing: the soft key, v2 ----
 * A muted keycap: a short noise burst ringing at two resonances (lowered ×0.78 and ×0.7 from a mechanical key)
 * under a low-pass, and a lighter click when the key comes back up. Each key keeps its own voice; around it level,
 * resonances, body, damping and timing all vary a little, fast runs are lighter, the first key after a pause lands
 * a little firmer, and past 9 keys a second the level eases down (to −4 dB), so a burst never builds a wall. */
type Voice = { lo: number; hi: number };
const VOICES: Voice[] = Array.from({ length: 14 }, (_, i) => ({ lo: 880 + ((i * 37) % 260), hi: 2250 + ((i * 113) % 700) }));
const WIDE: Voice = { lo: 620, hi: 1700 };
const WIDE_KEYS = new Set(["Space", "Enter", "NumpadEnter", "Backspace", "ShiftLeft", "ShiftRight", "Tab"]);

function voiceOf(code: string): Voice {
  if (WIDE_KEYS.has(code)) return WIDE;
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return VOICES[h % VOICES.length];
}

function clack(c: AudioContext, t: number, v: Voice, level: number, length: number, o: { lp: number; shape: number; jit: [number, number]; qlo?: number; qhi?: number }) {
  if (!master) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuf(c, length, o.shape);
  const out = gainN(c, level);
  const lp = biq(c, "lowpass", o.lp);
  out.connect(lp);
  lp.connect(master);
  const band = (f: number, q: number, g: number) => {
    const fl = biq(c, "bandpass", f, q);
    const gg = gainN(c, g);
    src.connect(fl);
    fl.connect(gg);
    gg.connect(out);
  };
  band(v.lo * o.jit[0], o.qlo ?? 5, 4.2);
  band(v.hi * o.jit[1], o.qhi ?? 6, 5.5);
  src.start(t);
}

const typing = { lastDown: -9, recent: [] as number[], upLvl: 0 };
function keyDown(code: string) {
  const c = audio();
  if (!c) return;
  const v = voiceOf(code);
  const now = c.currentTime;
  const iki = now - typing.lastDown;
  typing.lastDown = now;
  typing.recent = typing.recent.filter((x) => now - x < 1);
  typing.recent.push(now);
  let lvl = rnd(-1.5, 1.5);
  if (iki < 0.11) lvl -= rnd(1, 2.5);
  else if (iki > 1.5) lvl += 0.8;
  const over = typing.recent.length - 9;
  if (over > 0) lvl -= Math.min(4, over * 0.5);
  typing.upLvl = lvl;
  clack(c, now + rnd(0.01, 0.016), { lo: v.lo * 0.78, hi: v.hi * 0.7 }, 0.32 * db(lvl), (v === WIDE ? 0.06 : 0.04) * rnd(0.9, 1.1), {
    lp: rnd(2300, 2900),
    shape: rnd(7, 9),
    jit: [rnd(0.96, 1.04), rnd(0.96, 1.04)],
    qlo: rnd(4.2, 5.8),
    qhi: rnd(5, 7),
  });
}
function keyUp(code: string) {
  const c = audio();
  if (!c) return;
  const v = voiceOf(code);
  clack(c, c.currentTime + rnd(0, 0.006), { lo: v.lo * 0.85, hi: v.hi * 0.75 }, 0.07 * db(rnd(-2, 1) + Math.min(0, typing.upLvl) * 0.5), 0.025 * rnd(0.85, 1.15), {
    lp: rnd(2200, 2600),
    shape: rnd(7, 9),
    jit: [rnd(0.96, 1.04), rnd(0.96, 1.04)],
  });
}

/* ---- tones: the soft pair ---- */
function tone(c: AudioContext, t: number, f: number, dur: number, o: { gain?: number; att?: number; detune?: number; lp?: number; glide?: number; type?: OscillatorType } = {}) {
  if (!master) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(f, t);
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, f * o.glide), t + dur);
  if (o.detune) osc.detune.setValueAtTime(o.detune, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(o.gain ?? 0.2, t + (o.att ?? 0.004));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  if (o.lp) {
    const lp = biq(c, "lowpass", o.lp, 0.5);
    g.connect(lp);
    lp.connect(master);
  } else g.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

/** One note of the pair: a fixed pitch, a few cents of drift, a soft attack and a quiet upper partial (wood or glass). */
function note(c: AudioContext, t: number, f: number, dur: number, g: number, k: { level: number; len: number }) {
  const det = rnd(-8, 8);
  const gg = g * db(rnd(-1, 1)) * k.level;
  const lp = glass() ? 3200 : 2400;
  tone(c, t, f, dur * k.len, { gain: gg, att: 0.01, detune: det, lp });
  if (glass()) tone(c, t, f * 2, dur * 0.6 * k.len, { gain: gg * db(-18), att: 0.01, detune: det, lp });
  else tone(c, t, f * 4, 0.05, { gain: gg * db(-16), att: 0.003, detune: det, lp });
}

/** The same judgment within 20 s comes back 3 dB softer and 15% shorter; nothing faster than one per 1.2 s, and the end chord wins. */
const pacing = { last: {} as Record<string, number>, lastAny: -9 };
function paced(kind: "right" | "hot" | "end", now: number) {
  if (now - pacing.lastAny < 1.2 && kind !== "end") return null;
  const rep = pacing.last[kind] != null && now - pacing.last[kind] < 20;
  pacing.last[kind] = now;
  pacing.lastAny = now;
  return { level: rep ? db(-3) : 1, len: rep ? 0.85 : 1 };
}

let lastClick = -9;
const CUES = {
  key: () => {
    keyDown("KeyA");
    setTimeout(() => safely(() => keyUp("KeyA")), 90);
  },
  /** a muted tap: 520 Hz gliding down, ±1 dB and ±15 cents, at most one per 150 ms */
  click: () => {
    const c = audio();
    if (!c || c.currentTime - lastClick < 0.15) return;
    lastClick = c.currentTime;
    tone(c, c.currentTime, 520, 0.07, { gain: 0.12 * db(rnd(-1, 1)), glide: 0.7, detune: rnd(-15, 15) });
  },
  /** paper, not a note: a short band of noise, so "opened" never sounds like "right" (round-5 issue 1) */
  open: () => {
    const c = audio();
    if (!c || !master) return;
    const t = c.currentTime;
    const dur = 0.09 * rnd(0.9, 1.1);
    const s = c.createBufferSource();
    s.buffer = noiseBuf(c, dur + 0.02);
    const bp = biq(c, "bandpass", rnd(900, 1400), 1.6);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.21 * db(rnd(-1, 1)), t + 0.015);
    g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(bp);
    bp.connect(g);
    g.connect(master);
    s.start(t);
    s.stop(t + dur + 0.03);
  },
  drag: () => dragTexture(),
  /** the pair, 3 dB above round 4 so a rare judgment sits above the frequent typing (round-5 issue 2) */
  right: () => {
    const c = audio();
    const k = c && paced("right", c.currentTime);
    if (!c || !k) return;
    const t = c.currentTime;
    note(c, t, 440, 0.13, 0.085 * db(3), k);
    note(c, t + rnd(0.052, 0.068), 660, 0.2, 0.075 * db(3), k);
  },
  hot: () => {
    const c = audio();
    const k = c && paced("hot", c.currentTime);
    if (!c || !k) return;
    const t = c.currentTime;
    note(c, t, 330, 0.24, 0.085 * db(3), k);
    note(c, t + rnd(0.11, 0.13), 247, 0.34, 0.08 * db(3), k);
  },
  done: () => {
    const c = audio();
    const k = c && paced("end", c.currentTime);
    if (!c || !k) return;
    const sp = rnd(0.062, 0.078);
    [523.25, 659.25, 783.99].forEach((f, i) => note(c, c.currentTime + i * sp, f, 0.55, 0.07 * db(2), k));
  },
  /** closing the day: the same chord, slower and falling, then the room fades (the day sound) */
  close: () => {
    const c = audio();
    if (!c) return;
    const k = { level: 1, len: 1.6 };
    [783.99, 659.25, 523.25].forEach((f, i) => note(c, c.currentTime + i * 0.13, f, 0.6, 0.06 * db(2), k));
  },
  /** the stamp when the day is closed: a soft low thud, and the closing chord, falling, after it */
  stamp: () => {
    const c = audio();
    if (!c || !master) return;
    const t = c.currentTime;
    const s = c.createBufferSource();
    s.buffer = noiseBuf(c, 0.06, 1);
    const lp = biq(c, "lowpass", 200);
    const g = gainN(c, 0.5);
    s.connect(lp);
    lp.connect(g);
    g.connect(master);
    s.start(t);
    const k = { level: 1, len: 1.5 };
    [783.99, 659.25, 523.25].forEach((f, i) => note(c, t + 0.14 + i * 0.13, f, 0.6, 0.055 * db(2), k));
  },
};
export type Cue = keyof typeof CUES;

function safely(f: () => void) {
  if (!enabled()) return;
  try {
    f();
  } catch {
    // no sound in this view
  }
}
export function play(cue: Cue) {
  safely(CUES[cue]);
}

/* ---- dragging a 3D scene: one continuous texture whose level follows the speed, gone 150 ms after the pointer stops ---- */
let drag: { g: GainNode; src: AudioBufferSourceNode; stop: number } | null = null;
let dragSpeed = 0;
function dragTexture() {
  const c = audio();
  if (!c || !master) return;
  if (!drag) {
    const src = c.createBufferSource();
    src.buffer = noiseBuf(c, 2);
    src.loop = true;
    const lp = biq(c, "lowpass", 900, 0.8);
    const g = gainN(c, 0);
    src.connect(lp);
    lp.connect(g);
    g.connect(master);
    src.start();
    drag = { g, src, stop: 0 };
  }
  const level = Math.min(0.05, 0.012 + dragSpeed * 0.00002);
  drag.g.gain.setTargetAtTime(level, c.currentTime, 0.1);
  window.clearTimeout(drag.stop);
  drag.stop = window.setTimeout(() => {
    if (!drag || !ctx) return;
    const d = drag;
    drag = null;
    d.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
    d.src.stop(ctx.currentTime + 0.4);
  }, 150);
}

/* ---- background noise for reading: its own channel and volume, apart from the cues ----
 * A pool of 24 s of independent stereo noise is only grain material: every 2.5 s a 5 s grain starts from a random
 * place at a random rate (0.97–1.03), under a sine window at 50% overlap, so the power stays flat and nothing loops.
 * "library" is the air of a room (deep brown plus a little pink) under a slowly wandering low-pass (900–1600 Hz,
 * ±1 dB, each target 25–60 s away), with rare far events on a Poisson clock: a page, someone shifting in a chair,
 * a book set down, a door two rooms away. Never a voice, steps, a creak, a hum or a clock. Brown, pink and rain use
 * the same grains without events. Set in the reading settings (data-noise, data-noise-volume on the root); with
 * data-focus-noise="on" the room eases 3 dB down after 25 minutes without typing. */
type NoiseKind = "library" | "brown" | "pink" | "rain";
const pools = new Map<NoiseKind, AudioBuffer>();

function pinkGen() {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  return (white: number) => {
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
    return v;
  };
}

function pool(c: AudioContext, kind: NoiseKind) {
  const cached = pools.get(kind);
  if (cached) return cached;
  const sr = c.sampleRate;
  const len = sr * 24;
  const buf = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    const pink = pinkGen();
    let last = 0, lp = 0, lp2 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      const pk = pink(white);
      last = (last + 0.02 * white) / 1.02;
      if (kind === "library") {
        lp += 0.04 * (last * 3.5 - lp);
        lp2 += 0.25 * (pk - lp2);
        d[i] = lp * 1.6 + lp2 * 0.12;
      } else if (kind === "brown") d[i] = last * 3.5;
      else d[i] = pk + (kind === "rain" && Math.random() < 0.0009 ? (Math.random() * 2 - 1) * 0.5 : 0);
    }
  }
  pools.set(kind, buf);
  return buf;
}

let SINE: Float32Array | null = null;
const sineWindow = () => {
  if (!SINE) {
    SINE = new Float32Array(256);
    for (let i = 0; i < 256; i++) SINE[i] = Math.sin((Math.PI * i) / 255);
  }
  return SINE;
};

/** a small room for the far events (RT about 0.7 s) */
function roomIR(c: AudioContext) {
  const sr = c.sampleRate;
  const len = Math.floor(sr * 0.9);
  const b = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.1)) * 0.35;
  }
  return b;
}

type EventKind = "page" | "shift" | "book" | "door";
/** mean and minimum seconds between events of each kind; together about 85 an hour */
const EVENTS: Record<EventKind, { mean: number; min: number }> = { page: { mean: 75, min: 22 }, shift: { mean: 160, min: 45 }, book: { mean: 330, min: 90 }, door: { mean: 720, min: 240 } };
const GLOBAL_GAP = 9;
/** event levels, calibrated in the prototype so none peaks more than ~3 dB above the air */
const EVG: Record<EventKind, number> = { page: 0.7, shift: 1.25, book: 0.45, door: 3.5 };
const SYNTH: Record<EventKind, (c: AudioContext, dest: AudioNode, t: number) => void> = {
  page(c, dest, t) {
    const dur = rnd(0.35, 0.7), n = 2 + (Math.random() < 0.5 ? 1 : 0), cf = rnd(1100, 2400), lvl = rnd(-4, 0);
    const p = c.createStereoPanner();
    p.pan.value = rnd(-0.7, 0.7);
    const lp = biq(c, "lowpass", rnd(3000, 4200), 0.5);
    lp.connect(p);
    p.connect(dest);
    for (let i = 0; i < n; i++) {
      const s = c.createBufferSource();
      s.buffer = noiseBuf(c, dur);
      const bp = biq(c, "bandpass", cf * rnd(0.8, 1.25), rnd(0.5, 0.9));
      const hp = biq(c, "highpass", 450, 0.7);
      const g = c.createGain();
      const t0 = t + (i / n) * dur * rnd(0.6, 0.9), len = dur * rnd(0.35, 0.6);
      const peak = EVG.page * db(lvl) * (i === n - 1 ? 1 : 0.6);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + len * 0.35);
      g.gain.linearRampToValueAtTime(0, t0 + len);
      s.connect(hp);
      hp.connect(bp);
      bp.connect(g);
      g.connect(lp);
      s.start(t0);
      s.stop(t0 + len + 0.02);
    }
  },
  shift(c, dest, t) {
    const dur = rnd(0.6, 1.2);
    const s = c.createBufferSource();
    s.buffer = noiseBuf(c, dur);
    const lp = biq(c, "lowpass", rnd(500, 850), 0.6), g = c.createGain(), p = c.createStereoPanner();
    p.pan.value = rnd(-0.8, 0.8);
    const pk = EVG.shift * db(rnd(-5, -1));
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(pk, t + dur * 0.4);
    g.gain.linearRampToValueAtTime(pk * 0.5, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(lp);
    lp.connect(g);
    g.connect(p);
    p.connect(dest);
    s.start(t);
    s.stop(t + dur + 0.02);
  },
  book(c, dest, t) {
    const f = rnd(90, 140), lvl = rnd(-6, -2);
    const p = c.createStereoPanner();
    p.pan.value = rnd(-0.6, 0.6);
    p.connect(dest);
    const o = c.createOscillator();
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.8, t + 0.18);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(EVG.book * db(lvl), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g);
    g.connect(p);
    o.start(t);
    o.stop(t + 0.25);
    const s = c.createBufferSource();
    s.buffer = noiseBuf(c, 0.12, 3);
    const lp = biq(c, "lowpass", rnd(250, 400), 0.7);
    const g2 = gainN(c, EVG.book * 0.8 * db(lvl));
    s.connect(lp);
    lp.connect(g2);
    g2.connect(p);
    s.start(t + 0.004);
  },
  door(c, dest, t) {
    const dur = rnd(0.3, 0.5);
    const s = c.createBufferSource();
    s.buffer = noiseBuf(c, dur, 2);
    const lp = biq(c, "lowpass", rnd(160, 240), 0.9), g = c.createGain(), p = c.createStereoPanner();
    p.pan.value = rnd(-0.9, 0.9);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(EVG.door * db(rnd(-8, -4)), t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(lp);
    lp.connect(g);
    g.connect(p);
    p.connect(dest);
    s.start(t);
  },
};

interface Room {
  kind: NoiseKind;
  out: GainNode;
  drift: GainNode;
  hvac: BiquadFilterNode;
  busBed: GainNode;
  busEv: GainNode | null;
  buf: AudioBuffer;
  grainT: number;
  driftT: number;
  next: Partial<Record<EventKind, number>>;
  lastEv: number;
  focusDb: number;
  timer: number;
}
let room: Room | null = null;
/** the day's own fades (a break, closing the day): the room is held down while true */
let held = false;
let hidden = false;
let backFromHold = false;
let lastTyped = Date.now();

function makeRoom(c: AudioContext, kind: NoiseKind): Room {
  const out = gainN(c, 0);
  const drift = gainN(c, 1);
  const hvac = biq(c, "lowpass", kind === "library" ? 1200 : kind === "rain" ? 7000 : 20000, 0.4);
  drift.connect(out);
  out.connect(noiseBus!);
  const busBed = gainN(c, 1);
  let tail: AudioNode = busBed;
  if (kind === "rain") {
    // rain sits in the middle and the top, without the rumble
    const hp = biq(c, "highpass", 400);
    busBed.connect(hp);
    tail = hp;
  }
  tail.connect(hvac);
  hvac.connect(drift);
  let busEv: GainNode | null = null;
  if (kind === "library") {
    busEv = gainN(c, 1);
    const verb = c.createConvolver();
    verb.buffer = roomIR(c);
    const wet = gainN(c, 0.32), dry = gainN(c, 0.68);
    busEv.connect(dry);
    dry.connect(drift);
    busEv.connect(verb);
    verb.connect(wet);
    wet.connect(drift);
  }
  const r: Room = { kind, out, drift, hvac, busBed, busEv, buf: pool(c, kind), grainT: 0, driftT: 0, next: {}, lastEv: -99, focusDb: 0, timer: 0 };
  if (busEv) (Object.keys(EVENTS) as EventKind[]).forEach((k) => schedule(r, k, c.currentTime + rnd(4, 10)));
  return r;
}

function schedule(r: Room, k: EventKind, from: number) {
  const e = EVENTS[k];
  const mean = e.mean * (r.focusDb < -0.5 ? 2 : 1);
  r.next[k] = from + Math.max(e.min, -Math.log(1 - Math.random()) * mean);
}

function grain(c: AudioContext, r: Room, t: number) {
  const s = c.createBufferSource();
  s.buffer = r.buf;
  s.playbackRate.value = rnd(0.97, 1.03);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.setValueCurveAtTime(sineWindow(), t, 5);
  s.connect(g);
  g.connect(r.busBed);
  s.start(t, rnd(0, r.buf.duration - 5.4));
  s.stop(t + 5.05);
}

function tick(c: AudioContext, r: Room) {
  const now = c.currentTime;
  const until = now + 6;
  // a tab in the background is throttled: start again from now, never from a backlog
  if (r.grainT < now) r.grainT = now + 0.05;
  while (r.grainT < until) {
    grain(c, r, r.grainT);
    r.grainT += 2.5;
  }
  // focus noise: 3 dB down over 5 minutes after 25 minutes without typing; back in 20 s
  const wantFocus = root().dataset.focusNoise === "on" && Date.now() - lastTyped > 25 * 60_000 ? -3 : 0;
  if (wantFocus !== r.focusDb) {
    r.focusDb = wantFocus;
    const dur = wantFocus ? 300 : 20;
    r.drift.gain.cancelScheduledValues(now);
    r.drift.gain.setValueAtTime(r.drift.gain.value, now);
    r.drift.gain.linearRampToValueAtTime(db(wantFocus), now + dur);
    r.driftT = now + dur;
  }
  if (r.driftT < until) {
    // the slow wander: the low-pass and ±1 dB, each new target 25–60 s away, a straight glide all the way
    const t = Math.max(r.driftT, now);
    const dur = rnd(25, 60);
    if (r.kind === "library") {
      r.hvac.frequency.setValueAtTime(r.hvac.frequency.value, t);
      r.hvac.frequency.linearRampToValueAtTime(rnd(900, 1600), t + dur);
    }
    r.drift.gain.setValueAtTime(r.drift.gain.value, t);
    r.drift.gain.linearRampToValueAtTime(db(rnd(-1, 1) + r.focusDb), t + dur);
    r.driftT = t + dur;
  }
  if (!r.busEv) return;
  for (const k of Object.keys(EVENTS) as EventKind[]) {
    while ((r.next[k] ?? Infinity) < until) {
      const t = r.next[k]!;
      if (t > now - 0.5 && t - r.lastEv >= GLOBAL_GAP) {
        SYNTH[k](c, r.busEv, Math.max(t, now));
        r.lastEv = t;
      }
      schedule(r, k, Math.max(t, now));
    }
  }
}

function noiseLevel() {
  const v = Number(root().dataset.noiseVolume ?? 35);
  return Number.isFinite(v) ? Math.pow(Math.min(100, Math.max(0, v)) / 100, 2) * 0.6 : 0.07;
}

function stopRoom(fade: number) {
  if (!room || !ctx) return;
  const r = room;
  room = null;
  window.clearInterval(r.timer);
  const t = ctx.currentTime;
  r.out.gain.cancelScheduledValues(t);
  r.out.gain.setValueAtTime(r.out.gain.value, t);
  r.out.gain.linearRampToValueAtTime(0, t + fade);
  window.setTimeout(() => r.out.disconnect(), (fade + 0.5) * 1000);
}

/** Starts, changes or stops the background noise to match the reading settings, the day's fades and the tab. */
function syncNoise() {
  const raw = root().dataset.noise;
  const want = (raw && raw !== "off" ? raw : null) as NoiseKind | null;
  const c = want ? audio() : ctx;
  if (!c || !noiseBus) return;
  const now = c.currentTime;
  noiseBus.gain.cancelScheduledValues(now);
  noiseBus.gain.setValueAtTime(noiseBus.gain.value, now);
  noiseBus.gain.linearRampToValueAtTime(noiseLevel(), now + 0.3);
  if (room && room.kind !== want) stopRoom(room.kind === "library" ? 3 : 0.8);
  if (!want) return;
  if (!room) {
    room = makeRoom(c, want);
    const r = room;
    tick(c, r);
    r.timer = window.setInterval(() => ctx && tick(ctx, r), 1000);
  }
  const quiet = held || hidden;
  // into the room over 8 s, back from a break in 3 s; out in 2 s for a break and 3 s for a hidden tab
  const fade = quiet ? (held ? 2 : 3) : backFromHold ? 3 : room.out.gain.value < 0.01 ? 8 : 1.5;
  backFromHold = false;
  room.out.gain.cancelScheduledValues(now);
  room.out.gain.setValueAtTime(room.out.gain.value, now);
  room.out.gain.linearRampToValueAtTime(quiet ? 0 : 1, now + fade);
}

/**
 * The day sound: during a break and after closing the day the room fades to silence in 2 s, and when the learner
 * is back it rises again in 3 s. No new sound, only the room.
 */
export function holdNoise(on: boolean) {
  if (held === on) return;
  held = on;
  if (!on) backFromHold = true;
  syncNoise();
}

let installed = false;
/** Listens once on the document: typing, buttons, opened answers and dragged 3D scenes. */
export function installSounds() {
  if (installed) return;
  installed = true;
  // the noise follows the settings; a browser lets it start only after the first touch or key
  new MutationObserver(syncNoise).observe(document.documentElement, { attributes: true, attributeFilter: ["data-noise", "data-noise-volume"] });
  document.addEventListener("visibilitychange", () => {
    hidden = document.visibilityState === "hidden";
    if (ctx) syncNoise();
  });
  const first = () => {
    syncNoise();
    document.removeEventListener("pointerdown", first, true);
    document.removeEventListener("keydown", first, true);
  };
  document.addEventListener("pointerdown", first, true);
  document.addEventListener("keydown", first, true);
  const down = new Set<string>();
  document.addEventListener(
    "keydown",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (!t || e.ctrlKey || e.metaKey || e.altKey) return;
      const typingHere = t.matches?.("textarea, input:not([type=range]):not([type=checkbox]):not([type=radio]), [contenteditable=''], [contenteditable='true']") || !!t.closest?.("[contenteditable='true'], math-field");
      if (typingHere) lastTyped = Date.now();
      if (typingHere && !e.repeat && (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter")) {
        down.add(e.code);
        safely(() => keyDown(e.code));
      }
    },
    true,
  );
  // the key coming back up, only for keys whose press was heard
  document.addEventListener(
    "keyup",
    (e) => {
      if (down.delete(e.code)) safely(() => keyUp(e.code));
    },
    true,
  );
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("button, summary, [role=button], a.btn, .seg button");
      if (!el || (el as HTMLButtonElement).disabled || el.closest("[data-silent]")) return;
      if (el.matches("summary") || /הצג|תשובה|פתח|רמז|פתרון/.test(el.textContent ?? "")) play("open");
      else play("click");
    },
    true,
  );
  let last = 0;
  let lastXY: [number, number] | null = null;
  document.addEventListener(
    "pointermove",
    (e) => {
      if (!e.buttons) {
        lastXY = null;
        return;
      }
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.(".s3d canvas, .s3d")) return;
      const now = performance.now();
      if (lastXY && now > last) dragSpeed = Math.hypot(e.clientX - lastXY[0], e.clientY - lastXY[1]) / ((now - last) / 1000);
      lastXY = [e.clientX, e.clientY];
      last = now;
      play("drag");
    },
    true,
  );
}
