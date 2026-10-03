// <ThinkingOrb> for web: a plain 2D <canvas> inside a react-native-web View.
// No Skia/CanvasKit download, no WebGL — just arc fills.
//
// The frame atom is consumed imperatively (`store.sub`), so on web the
// per-frame work never touches React at all: the shared clock ticks, the
// frame atom recomputes, and the canvas repaints.

import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { paintCanvas } from './render/canvas';
import { ancestorDark, domThemeVersionAtom, observeVisibility } from './state/dom';
import { useOrbStore } from './state/store';
import { useOrb } from './state/useOrb';
import type { ThinkingOrbProps } from './types';

const canvasStyle = { width: '100%', height: '100%', display: 'block' } as const;

export function ThinkingOrb({
  state = 'working',
  size = 64,
  theme,
  speed = 1,
  paused = false,
  style,
  ...rest
}: ThinkingOrbProps) {
  const store = useOrbStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // pause while scrolled offscreen (one shared IntersectionObserver)
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = canvasRef.current;
    return el ? observeVisibility(el, setVisible) : undefined;
  }, []);

  const orb = useOrb({ state, size, theme, speed, paused, visible });
  // one shared MutationObserver tells us when a page-level theme flips
  const domThemeVersion = useAtomValue(domThemeVersionAtom, { store });
  const label = rest['aria-label'] ?? rest.accessibilityLabel ?? orb.label;

  const { frameAtom, themeMode, systemDark } = orb;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(2, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    const dark = themeMode === 'auto' ? (ancestorDark(canvas) ?? systemDark) : themeMode === 'dark';

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      paintCanvas(ctx, store.get(frameAtom), dark);
    };
    paint();
    return store.sub(frameAtom, paint);
  }, [store, frameAtom, size, themeMode, systemDark, domThemeVersion]);

  return (
    <View role="img" {...rest} aria-label={label} style={[{ width: size, height: size }, style]}>
      <canvas ref={canvasRef} aria-hidden style={canvasStyle} />
    </View>
  );
}
