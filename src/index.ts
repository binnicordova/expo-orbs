// expo-orbs — dotted thought-orb loading indicators for Expo.
// iOS & Android render with Skia, web with a plain 2D canvas; all shared
// state (theme, pause, speed, OS signals, the animation clock) lives in Jotai
// atoms. Pure TypeScript: works in Expo Go and ships over expo-updates.

export { ThinkingOrb } from './ThinkingOrb';
export type { ThinkingOrbProps, OrbState, OrbSize, OrbTheme } from './types';

// Atomic state
export {
  appActiveAtom,
  orbClockAtom,
  orbsAnimatingAtom,
  orbsDarkAtom,
  orbSpeedAtom,
  orbsPausedAtom,
  orbThemeAtom,
  reduceMotionAtom,
  systemColorSchemeAtom,
} from './state/atoms';
export { ThinkingOrbsProvider, thinkingOrbsStore, useOrbStore } from './state/store';
export type { OrbStore, ThinkingOrbsProviderProps } from './state/store';
export { useThinkingOrbs } from './state/hooks';
export type { ThinkingOrbsControls } from './state/hooks';

// Constants & the geometry engine for custom renderers
export {
  MODE_FRAMES,
  ORB_LABELS,
  ORB_SIZES,
  ORB_STATES,
  REDUCED_MOTION_T,
  resolvePreset,
  STATE_TO_MODE,
} from './engine/index';
export type { Dot, Line, ModeKey, OrbFrame } from './engine/index';
