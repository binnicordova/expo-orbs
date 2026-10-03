// Engine-level contracts shared by every mode implementation. Pure types:
// no React, no React Native, no DOM.

import type { OrbFrame } from './core';
import type { ModeOpts } from './profiles';

export type { Dot, Line, OrbFrame } from './core';
export type { ModeOpts } from './profiles';

/**
 * The nine shipped states — each a hand-tuned animation:
 * - `working`    — particles on tilted orbits
 * - `searching`  — a scan meridian sweeps a dotted globe
 * - `solving`    — bands scramble in quarter turns, then click back
 * - `listening`  — a waveform rolls through latitude rings
 * - `connecting` — a constellation wires itself, packets running the edges
 * - `weaving`    — three strands plait around the sphere
 * - `composing`  — an undulating multi-band sash
 * - `breathing`  — a face-on ring slowly morphing
 * - `shaping`    — a dotted outline morphs circle → triangle → square
 */
export type OrbState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping';

/**
 * Rendered size in dp / CSS px. Exactly two tuned presets ship: 64
 * (chat-avatar scale) and 20 (inline-text scale). Each carries its own dot
 * count, dot size and speed — separate designs, not a scale factor.
 */
export type OrbSize = 64 | 20;

/** Internal geometry family a state maps to. */
export type ModeKey =
  'orbits' | 'globe' | 'rubik' | 'wave' | 'web' | 'braid' | 'ribbon' | 'ring' | 'morph';

/**
 * Geometry for one instant: pure math over (size, t, opts). Closure-free and
 * `Math`-only, so it runs identically on Hermes, JSC and V8.
 */
export type ModeFrame = (size: number, t: number, opts: ModeOpts) => OrbFrame;
