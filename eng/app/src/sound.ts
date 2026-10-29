// Quiet interface sounds, synthesized in the browser (no files): the sound of a mechanical keyboard when typing,
// a muted tap on buttons, a short rising pair when an answer or a block opens, a faint rustle while
// a 3D scene is dragged, and a small chord when a lesson is finished. Only on actions, never while
// reading or scrolling. Turned off from the reading settings (data-sound="off" on the root), and the
// volume (0–100, data-volume on the root) is set there too.
// Chosen in docs/sound-cursor.html ("soft"). Identical in both labs.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

const enabled = () => document.documentElement.dataset.sound !== "off" && volume() > 0;
/** master gain from the 0–100 setting, on a curve the ear hears as even steps (60 is about 0.33) */
const volume = () => {
  const v = Number(document.documentElement.dataset.volume ?? 60);
  return Number.isFinite(v) ? Math.pow(Math.min(100, Math.max(0, v)) / 100, 2) * 0.9 : 0.33;
};

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
  }
  if (master) master.gain.value = volume();
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

/**
 * A mechanical key (a tactile, "brown" switch), modelled on a recorded keyboard: a faint tactile bump,
 * ~20ms later the loud bottom-out clack (a noise burst ringing at two resonances of the keycap and case,
 * ~1kHz and ~2.5kHz, gone in ~15ms, with a little air above 6kHz), and a lighter clack when the key comes
 * back up. Each key has its own voice, so the same key always sounds the same; the long keys are deeper.
 */
type Voice = { lo: number; hi: number; air: number };
const VOICES: Voice[] = Array.from({ length: 14 }, (_, i) => ({
  lo: 880 + ((i * 37) % 260),
  hi: 2250 + ((i * 113) % 700),
  air: 0.35 + ((i * 7) % 5) * 0.08,
}));
const WIDE: Voice = { lo: 620, hi: 1700, air: 0.25 };
const WIDE_KEYS = new Set(["Space", "Enter", "NumpadEnter", "Backspace", "ShiftLeft", "ShiftRight", "Tab"]);

function voiceOf(code: string): Voice {
  if (WIDE_KEYS.has(code)) return WIDE;
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return VOICES[h % VOICES.length];
}

/** one clack: a decaying noise burst through the two resonances, plus a band of air */
function clack(v: Voice, level: number, delay: number, length = 0.04) {
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime + delay;
  const len = Math.floor(c.sampleRate * length);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
  const src = c.createBufferSource();
  src.buffer = buf;
  const out = c.createGain();
  out.gain.value = level;
  out.connect(master);
  const band = (type: BiquadFilterType, freq: number, q: number, gain: number) => {
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.value = gain;
    src.connect(f);
    f.connect(g);
    g.connect(out);
  };
  const jitter = () => 0.97 + Math.random() * 0.06;
  band("bandpass", v.lo * jitter(), 5, 4.2);
  band("bandpass", v.hi * jitter(), 6, 5.5);
  band("highpass", 6500, 0.7, v.air);
  src.start(t);
}

function keyDown(code: string) {
  const v = voiceOf(code);
  noise(0.012, { freq: 3200, q: 1.5, gain: 0.25 }); // the tactile bump
  clack(v, 0.65, 0.02, v === WIDE ? 0.07 : 0.045);
}
function keyUp(code: string) {
  const v = voiceOf(code);
  clack({ ...v, lo: v.lo * 1.15, hi: v.hi * 1.08 }, 0.2, 0, 0.03);
}

const CUES = {
  key: () => keyDown("KeyA"),
  click: () => tone(520, 0.07, { gain: 0.12, glide: 0.7 }),
  open: () => {
    tone(440, 0.12, { gain: 0.09 });
    tone(660, 0.16, { gain: 0.07, delay: 0.05 });
  },
  drag: () => noise(0.05, { freq: 900, q: 0.8, gain: 0.03, type: "lowpass" }),
  done: () => [523, 659, 784].forEach((f, i) => tone(f, 0.5, { gain: 0.08, delay: i * 0.07 })),
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

/* ---- background noise for reading: its own channel and volume, apart from the cues ----
 * Steady broadband noise masks the small sounds around (talk, a fan, steps) that pull attention;
 * brown is the deepest and the gentlest, pink is brighter, rain is pink noise shaped like rain on a
 * window. Set in the reading settings (data-noise, data-noise-volume on the root). */
type NoiseKind = "brown" | "pink" | "rain";
let bed: { kind: NoiseKind; src: AudioBufferSourceNode; gain: GainNode } | null = null;
const buffers = new Map<NoiseKind, AudioBuffer>();

function noiseBuffer(c: AudioContext, kind: NoiseKind) {
  const cached = buffers.get(kind);
  if (cached) return cached;
  const sr = c.sampleRate;
  const len = sr * 12;
  const fade = Math.floor(sr * 0.5);
  const buf = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let last = 0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len + fade; i++) {
      const white = Math.random() * 2 - 1;
      let v: number;
      if (kind === "brown") {
        last = (last + 0.02 * white) / 1.02;
        v = last * 3.5;
      } else {
        // pink: Paul Kellet's filter
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
        // rain: the pink bed, plus soft drops here and there
        if (kind === "rain" && Math.random() < 0.0009) v += (Math.random() * 2 - 1) * 0.5;
      }
      // the loop's end fades into its start, so it never clicks
      if (i < len) d[i] = v;
      else {
        const k = (i - len) / fade;
        d[i - len] = d[i - len] * k + v * (1 - k);
      }
    }
  }
  buffers.set(kind, buf);
  return buf;
}

function noiseLevel() {
  const v = Number(document.documentElement.dataset.noiseVolume ?? 35);
  return Number.isFinite(v) ? Math.pow(Math.min(100, Math.max(0, v)) / 100, 2) * 0.6 : 0.07;
}

/** Starts, changes or stops the background noise to match the reading settings. */
function syncNoise() {
  const want = document.documentElement.dataset.noise as NoiseKind | "off" | undefined;
  const c = want && want !== "off" ? audio() : ctx;
  if (!c) return;
  const now = c.currentTime;
  if (bed && bed.kind !== want) {
    const old = bed;
    old.gain.gain.cancelScheduledValues(now);
    old.gain.gain.setValueAtTime(old.gain.gain.value, now);
    old.gain.gain.linearRampToValueAtTime(0, now + 0.8);
    old.src.stop(now + 0.9);
    bed = null;
  }
  if (!want || want === "off") return;
  if (!bed) {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, want);
    src.loop = true;
    const gain = c.createGain();
    gain.gain.value = 0;
    let out: AudioNode = src;
    if (want === "rain") {
      // rain sits in the middle and the top, without the rumble
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 400;
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 7000;
      src.connect(hp);
      hp.connect(lp);
      out = lp;
    }
    out.connect(gain);
    gain.connect(c.destination);
    src.start();
    bed = { kind: want, src, gain };
  }
  bed.gain.gain.cancelScheduledValues(now);
  bed.gain.gain.setValueAtTime(bed.gain.gain.value, now);
  bed.gain.gain.linearRampToValueAtTime(noiseLevel(), now + 1.5);
}

let installed = false;
/** Listens once on the document: typing, buttons, opened answers and dragged 3D scenes. */
export function installSounds() {
  if (installed) return;
  installed = true;
  // the noise follows the settings; a browser lets it start only after the first touch or key
  new MutationObserver(syncNoise).observe(document.documentElement, { attributes: true, attributeFilter: ["data-noise", "data-noise-volume"] });
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
      const typing = t.matches?.("textarea, input:not([type=range]):not([type=checkbox]):not([type=radio]), [contenteditable=''], [contenteditable='true']") || !!t.closest?.("[contenteditable='true'], math-field");
      if (typing && !e.repeat && (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter")) {
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
