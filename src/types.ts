import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { OrbSize, OrbState } from './engine/types';

export type { OrbSize, OrbState };

/**
 * Theme mode.
 *
 * - `auto` follows the app-wide `orbThemeAtom`, which itself defaults to the
 *   OS appearance. On web it also honours an ancestor `data-theme="dark|light"`
 *   attribute or `dark` / `light` class (the Tailwind / NativeWind convention).
 * - `dark` pins light ink, for dark backgrounds.
 * - `light` pins dark ink, for light backgrounds.
 */
export type OrbTheme = 'auto' | 'dark' | 'light';

/** Props for `<ThinkingOrb>`. Every other `View` prop passes through. */
export interface ThinkingOrbProps extends Omit<ViewProps, 'children' | 'style'> {
  /** Which animation to show. @default 'working' */
  state?: OrbState;

  /**
   * Rendered size in dp (CSS px on web). `64` and `20` are the two hand-tuned
   * presets; any other value renders the nearest preset at that size.
   * @default 64
   */
  size?: OrbSize | (number & {});

  /**
   * Theme for this orb. When omitted, the app-wide `orbThemeAtom` decides
   * (which defaults to `auto`).
   */
  theme?: OrbTheme;

  /** Speed multiplier on top of the preset's baked speed. @default 1 */
  speed?: number;

  /** Freeze this orb on its current frame. @default false */
  paused?: boolean;

  style?: StyleProp<ViewStyle>;
}
