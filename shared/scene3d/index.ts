// The shared 3D component of the Engineering Lab and the Core Lab: the engine, the
// library of checked scenes, and the spec format for scenes the tutor writes. Each app
// wraps it in its own React block (`scene3d` fenced blocks in lessons).
export { mount, loadThree, setPaused, lite, coarse, reduceMotion, type View, type Info, type Param, type TourStop, type Look } from "./engine";
export { SCENES, SCENE_BY_ID, sceneCatalog, type SceneDef } from "./scenes";
export { specBuilder, specCamera, specTour, checkSpec, compile, type Spec, type SpecObject } from "./spec";

/** The rules for the tutor's instructions: how to call a scene, and the spec format. */
export const SCENE3D_PROTOCOL = String.raw`- \`\`\`scene3d — a live 3D scene, drawn inside the lesson where the text discusses it. Use it where the third dimension adds understanding (fields, rotations, flow, robots, structures, crystals, optimization landscapes, antennas, orbits); keep signals, Bode plots and spectra in 2D (chart). Body is JSON, one of two kinds:
  1. A checked scene from the library (preferred whenever one fits): {"id": "wing_vortex", "title": "…", "caption": "one or two Hebrew sentences: what to look at", "params": {"alpha": 8}, "tour": true}
     "params" sets initial values (the learner moves them with sliders). "tour": true plays the scene's built-in guided tour, or give your own tour (below).
  2. Your own scene, when no library scene fits. It is drawn in the same style and marked to the learner as written by the tutor:
     {"title": "…", "caption": "…", "axes": true,
      "params": [{"id": "w", "label": "ω (rad/s)", "min": 0.5, "max": 4, "value": 2}],
      "view": {"cam": [3, -4, 2.5], "target": [0, 0, 0]},
      "objects": [
        {"type": "surface", "z": "0.5*sin(2*pi*x)*sin(pi*y)*cos(w*t)", "x": [0, 1], "y": [0, 1], "colormap": "diverge", "label": "…", "info": "what this is, shown when clicked"},
        {"type": "curve", "x": "cos(s)", "y": "sin(s)", "z": "s/(2*pi)", "s": [0, 12.57], "label": "…"},
        {"type": "vector", "from": [0, 0, 0], "to": ["cos(w*t)", "sin(w*t)", 0], "label": "…"},
        {"type": "point", "at": ["cos(w*t)", "sin(w*t)", "0.2*t"], "trail": 300, "label": "…"},
        {"type": "field", "vx": "-y", "vy": "x", "vz": 0, "box": [[-1, 1], [-1, 1], [0, 0]], "n": 7, "scale": 0.3},
        {"type": "plane", "normal": [0, 0, 1], "point": [0, 0, 0], "size": 3, "opacity": 0.15}
      ],
      "tour": [{"cam": [0, -5, 1], "target": [0, 0, 0], "text": "Hebrew: what to see from here"}]}
     Coordinates are mathematical (z up). Every coordinate is an expression (+ - * / ^, sin cos tan exp log sqrt abs min max atan2 hypot, pi, e) in t (seconds, running), the params, and x, y (surface) or s (curve). Give every object a short Hebrew "label" or "info": the learner clicks a part to see what it is. A point with "trail" draws its path. Keep it to what teaches: a few objects, numbers that match the text.
  Write the caption so the learner knows what to look at; explain the scene in the text after it, as with every graphic.`;
