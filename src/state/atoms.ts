// Atomic state for every orb on screen.
//
// Three kinds of atoms live here:
//
//   1. Controls      — small writable atoms an app sets to steer all orbs at
//                      once (theme, global pause, global speed).
//   2. System atoms  — read-only atoms that subscribe to the OS (appearance,
//                      reduce-motion, app foreground) via Jotai's `onMount`.
//                      The listener exists only while at least one orb is
//                      mounted, and exactly once no matter how many orbs are.
//   3. The clock     — one requestAnimationFrame loop shared by every
//                      animating orb, so they all stay in phase. It starts
//                      when the first animating orb subscribes and stops
//                      when the last one leaves (again via `onMount`).
//
// Everything uses only React Native core APIs that react-native-web also
// implements, so the same atoms drive iOS, Android and web.

import type { Getter } from 'jotai';
import { atom } from 'jotai';
import { AccessibilityInfo, Appearance, AppState } from 'react-native';

import type { OrbTheme } from '../types';

// ---------------------------------------------------------------------------
// 1. Controls
// ---------------------------------------------------------------------------

/**
 * App-wide theme for orbs that don't pass a `theme` prop.
 * `auto` follows the OS appearance (and, on web, an ancestor
 * `data-theme` / `.dark` / `.light`). @default 'auto'
 */
export const orbThemeAtom = atom<OrbTheme>('auto');
orbThemeAtom.debugLabel = 'thinkingOrbs/theme';

/** Freeze every orb on its current frame. @default false */
export const orbsPausedAtom = atom(false);
orbsPausedAtom.debugLabel = 'thinkingOrbs/paused';

/** Global speed multiplier, applied on top of each orb's `speed`. @default 1 */
export const orbSpeedAtom = atom(1);
orbSpeedAtom.debugLabel = 'thinkingOrbs/speed';

// ---------------------------------------------------------------------------
// 2. System atoms
// ---------------------------------------------------------------------------

type Scheme = 'light' | 'dark';

// Unknown appearance counts as dark, matching the original library.
const toScheme = (s: string | null | undefined): Scheme => (s === 'light' ? 'light' : 'dark');

function readScheme(): Scheme {
  try {
    return toScheme(Appearance.getColorScheme());
  } catch {
    return 'dark';
  }
}

const colorSchemeBaseAtom = atom<Scheme>(readScheme());
colorSchemeBaseAtom.onMount = (set) => {
  set(readScheme());
  const sub = Appearance.addChangeListener(({ colorScheme }) => set(toScheme(colorScheme)));
  return () => sub.remove();
};

/** The OS appearance, live. Read-only. */
export const systemColorSchemeAtom = atom((get) => get(colorSchemeBaseAtom));
systemColorSchemeAtom.debugLabel = 'thinkingOrbs/systemColorScheme';

const reduceMotionBaseAtom = atom(false);
reduceMotionBaseAtom.onMount = (set) => {
  let alive = true;
  AccessibilityInfo.isReduceMotionEnabled()
    .then((value) => {
      if (alive) set(value);
    })
    .catch(() => {});
  const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value: boolean) =>
    set(value)
  );
  return () => {
    alive = false;
    sub?.remove();
  };
};

/** The OS "reduce motion" setting, live. Orbs render one static frame while it's on. */
export const reduceMotionAtom = atom((get) => get(reduceMotionBaseAtom));
reduceMotionAtom.debugLabel = 'thinkingOrbs/reduceMotion';

// `inactive` (iOS control centre, app switcher peek) still shows the app,
// so only `background` stops the clock.
const isForeground = (s: string | null | undefined) => s !== 'background';

const appActiveBaseAtom = atom(isForeground(AppState.currentState));
appActiveBaseAtom.onMount = (set) => {
  set(isForeground(AppState.currentState));
  const sub = AppState.addEventListener('change', (s) => set(isForeground(s)));
  return () => sub.remove();
};

/** True while the app is foregrounded (web: while the tab is visible). Read-only. */
export const appActiveAtom = atom((get) => get(appActiveBaseAtom));
appActiveAtom.debugLabel = 'thinkingOrbs/appActive';

// ---------------------------------------------------------------------------
// Derived, app-wide
// ---------------------------------------------------------------------------

/** Whether orbs without their own `paused` prop are currently animating. */
export const orbsAnimatingAtom = atom(
  (get) => !get(orbsPausedAtom) && get(appActiveAtom) && !get(reduceMotionAtom)
);
orbsAnimatingAtom.debugLabel = 'thinkingOrbs/animating';

/** Whether orbs without their own `theme` prop render light ink (for dark backgrounds). */
export const orbsDarkAtom = atom((get) => {
  const theme = get(orbThemeAtom);
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return get(systemColorSchemeAtom) === 'dark';
});
orbsDarkAtom.debugLabel = 'thinkingOrbs/dark';

// ---------------------------------------------------------------------------
// 3. The shared clock
// ---------------------------------------------------------------------------

/** Seconds on a monotonic clock shared by every orb. */
export function nowSeconds(): number {
  const perf = (globalThis as { performance?: { now?: () => number } }).performance;
  return typeof perf?.now === 'function' ? perf.now() / 1000 : Date.now() / 1000;
}

const tickAtom = atom(nowSeconds());
tickAtom.onMount = (set) => {
  if (typeof requestAnimationFrame !== 'function') return;
  let raf = 0;
  const loop = () => {
    set(nowSeconds());
    raf = requestAnimationFrame(loop);
  };
  set(nowSeconds());
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
};

/**
 * The shared clock in seconds. Subscribing to it (directly or through a
 * derived atom) starts the single app-wide animation loop; it stops when the
 * last subscriber leaves.
 */
export const orbClockAtom = atom((get) => get(tickAtom));
orbClockAtom.debugLabel = 'thinkingOrbs/clock';

/** Above this the last tick is from an idle period, not the running loop. */
const STALE_TICK_S = 0.1;

/**
 * Read the clock inside a derived atom. While the loop runs, every orb gets
 * the same instant, so they stay in phase. Right after the loop was idle the
 * stored tick is old, so a freshly created atom falls back to wall time and
 * never shows a one-frame jump.
 */
export function readOrbClock(get: Getter): number {
  const tick = get(orbClockAtom);
  const now = nowSeconds();
  return now - tick > STALE_TICK_S ? now : tick;
}
