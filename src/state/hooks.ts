// Public hooks for steering every orb at once.

import type { SetStateAction } from 'jotai';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

import type { OrbTheme } from '../types';
import {
  orbsAnimatingAtom,
  orbsDarkAtom,
  orbSpeedAtom,
  orbsPausedAtom,
  orbThemeAtom,
  reduceMotionAtom,
} from './atoms';
import { useOrbStore } from './store';

export interface ThinkingOrbsControls {
  /** App-wide theme for orbs without a `theme` prop. */
  theme: OrbTheme;
  setTheme: (update: SetStateAction<OrbTheme>) => void;
  /** Global pause for every orb. */
  paused: boolean;
  setPaused: (update: SetStateAction<boolean>) => void;
  togglePaused: () => void;
  /** Global speed multiplier. */
  speed: number;
  setSpeed: (update: SetStateAction<number>) => void;
  /** Resolved app-wide ink: true = light ink for dark backgrounds. */
  isDark: boolean;
  /** OS reduce-motion setting (orbs render a static frame while on). */
  reduceMotion: boolean;
  /** Whether orbs without their own `paused` prop are animating right now. */
  animating: boolean;
}

/**
 * Read and steer every `<ThinkingOrb>` from anywhere in the tree.
 *
 * ```tsx
 * const { paused, togglePaused, setTheme } = useThinkingOrbs();
 * ```
 */
export function useThinkingOrbs(): ThinkingOrbsControls {
  const store = useOrbStore();
  const [theme, setTheme] = useAtom(orbThemeAtom, { store });
  const [paused, setPaused] = useAtom(orbsPausedAtom, { store });
  const [speed, setSpeed] = useAtom(orbSpeedAtom, { store });
  const isDark = useAtomValue(orbsDarkAtom, { store });
  const reduceMotion = useAtomValue(reduceMotionAtom, { store });
  const animating = useAtomValue(orbsAnimatingAtom, { store });
  const togglePaused = useCallback(() => setPaused((p) => !p), [setPaused]);

  return {
    theme,
    setTheme,
    paused,
    setPaused,
    togglePaused,
    speed,
    setSpeed,
    isDark,
    reduceMotion,
    animating,
  };
}
