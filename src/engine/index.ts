// `@binnicordova/expo-thinking-orbs/engine`: pure geometry — zero React, zero React Native,
// zero DOM. Use it to drive your own renderer (a custom Skia canvas, an
// offscreen canvas, an SVG exporter, a server-side rasteriser…).
//
//   import { MODE_FRAMES, resolvePreset } from '@binnicordova/expo-thinking-orbs/engine';
//
//   const { mode, speed, opts } = resolvePreset('searching', 64);
//   const { dots, lines } = MODE_FRAMES[mode](64, elapsedSeconds * speed, opts);
//
// Ink convention: `white` is the paper-theme ink value in [0,1]; on a dark
// substrate mirror it (`inkGrey(white, true)`) so near dots read bright.

export { MODE_FRAMES } from './registry';
export { PRESETS, resolvePreset, STATE_TO_MODE } from './presets';
export type { Preset, Resolved } from './presets';
export { BASE_PROFILES, scaleCounts, scaleRadii } from './profiles';
export { finalizeFrame, inkGrey, makeProj, radiusScale } from './core';
export type { Dot, Line, ModeFrame, ModeKey, ModeOpts, OrbFrame, OrbSize, OrbState } from './types';

/** Every state, in the order the original demo presents them. */
export const ORB_STATES = [
  'working',
  'searching',
  'solving',
  'listening',
  'connecting',
  'weaving',
  'composing',
  'breathing',
  'shaping',
] as const;

/** The two tuned size presets. */
export const ORB_SIZES = [64, 20] as const;

/** Default accessibility label per state. */
export const ORB_LABELS = {
  working: 'Working…',
  searching: 'Searching…',
  solving: 'Solving…',
  listening: 'Listening…',
  connecting: 'Connecting…',
  weaving: 'Weaving…',
  composing: 'Composing…',
  breathing: 'Thinking…',
  shaping: 'Shaping…',
} as const;

/** The deterministic instant reduced-motion users see. */
export const REDUCED_MOTION_T = 0.6;
