// Per-orb wiring: reads the shared atoms and builds this orb's frame atom.
//
// The frame atom is the heart of the pattern. While the orb animates it is
// derived from the shared clock, so the single animation loop fans out to
// every orb through Jotai's dependency graph and only the tiny renderer leaf
// that subscribes to it re-renders each frame — never the orb's parent.
// When the orb is paused, backgrounded or under reduce-motion, the frame atom
// is a constant: nothing subscribes to the clock, and if no other orb does
// either, the loop stops on its own.

import type { Atom } from 'jotai';
import { atom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import type { OrbFrame } from '../engine/core';
import { ORB_LABELS, REDUCED_MOTION_T } from '../engine/index';
import { resolvePreset, STATE_TO_MODE } from '../engine/presets';
import { MODE_FRAMES } from '../engine/registry';
import type { OrbSize, OrbState } from '../engine/types';
import type { OrbTheme } from '../types';
import {
  appActiveAtom,
  nowSeconds,
  orbSpeedAtom,
  orbsPausedAtom,
  orbThemeAtom,
  readOrbClock,
  reduceMotionAtom,
  systemColorSchemeAtom,
} from './atoms';
import { useOrbStore } from './store';

export interface UseOrbOptions {
  state: OrbState;
  size: number;
  theme?: OrbTheme;
  speed: number;
  paused: boolean;
  /** Extra visibility signal (web: IntersectionObserver). @default true */
  visible?: boolean;
}

export interface OrbRuntime {
  /** This orb's frame: derived from the clock while animating, constant otherwise. */
  frameAtom: Atom<OrbFrame>;
  /** Theme mode after falling back to the app-wide atom. */
  themeMode: OrbTheme;
  /** OS appearance is dark. */
  systemDark: boolean;
  /** Resolved ink: true = light ink for dark backgrounds. */
  dark: boolean;
  /** Whether this orb is currently subscribed to the clock. */
  animating: boolean;
  /** Default accessibility label for the state. */
  label: string;
}

/** Map any requested size onto one of the two tuned presets. */
export function presetSizeFor(size: number): OrbSize {
  return size < 42 ? 20 : 64;
}

export function useOrb({
  state: requestedState,
  size: requestedSize,
  theme,
  speed,
  paused,
  visible = true,
}: UseOrbOptions): OrbRuntime {
  // tolerate untyped callers: unknown states and sizes fall back to defaults
  const state: OrbState = STATE_TO_MODE[requestedState] ? requestedState : 'working';
  const size = requestedSize > 0 && Number.isFinite(requestedSize) ? requestedSize : 64;

  const store = useOrbStore();
  const globalTheme = useAtomValue(orbThemeAtom, { store });
  const scheme = useAtomValue(systemColorSchemeAtom, { store });
  const globalPaused = useAtomValue(orbsPausedAtom, { store });
  const globalSpeed = useAtomValue(orbSpeedAtom, { store });
  const reduced = useAtomValue(reduceMotionAtom, { store });
  const appActive = useAtomValue(appActiveAtom, { store });

  const themeMode = theme ?? globalTheme;
  const systemDark = scheme === 'dark';
  const dark = themeMode === 'auto' ? systemDark : themeMode === 'dark';
  const animating = !paused && !globalPaused && appActive && !reduced && visible;
  const effSpeed = speed * globalSpeed;

  const frameAtom = useMemo<Atom<OrbFrame>>(() => {
    const { mode, speed: baseSpeed, opts } = resolvePreset(state, presetSizeFor(size));
    const build = MODE_FRAMES[mode];
    const rate = baseSpeed * effSpeed;

    if (reduced) {
      // one deterministic, representative frame
      const still = build(size, REDUCED_MOTION_T, opts);
      return atom(() => still);
    }
    if (!animating) {
      // freeze on the instant we stopped
      const frozen = build(size, nowSeconds() * rate, opts);
      return atom(() => frozen);
    }
    return atom((get) => build(size, readOrbClock(get) * rate, opts));
  }, [state, size, effSpeed, reduced, animating]);

  return {
    frameAtom,
    themeMode,
    systemDark,
    dark,
    animating,
    label: ORB_LABELS[state],
  };
}
