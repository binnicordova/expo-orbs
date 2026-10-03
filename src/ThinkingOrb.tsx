// <ThinkingOrb> for iOS and Android, drawn with Skia (bundled in Expo Go).
//
// The outer component only re-renders when its props or the app-wide atoms
// change. Per-frame work happens in <OrbPicture>, the leaf that subscribes to
// this orb's frame atom: it records the frame into an SkPicture and hands it
// to Skia's picture view.

import type { SkPicture } from '@shopify/react-native-skia';
import { SkiaPictureView } from '@shopify/react-native-skia';
import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { OrbFrame } from './engine/core';
import { createOrbPaints, recordOrbPicture } from './render/skia';
import { useOrbStore } from './state/store';
import { useOrb } from './state/useOrb';
import type { ThinkingOrbProps } from './types';

export function ThinkingOrb({
  state = 'working',
  size = 64,
  theme,
  speed = 1,
  paused = false,
  style,
  ...rest
}: ThinkingOrbProps) {
  const orb = useOrb({ state, size, theme, speed, paused });
  const label = rest['aria-label'] ?? rest.accessibilityLabel ?? orb.label;

  return (
    <View
      accessible
      role="img"
      {...rest}
      aria-label={label}
      style={[{ width: size, height: size }, style]}>
      <OrbPicture frameAtom={orb.frameAtom} dark={orb.dark} size={size} />
    </View>
  );
}

interface OrbPictureProps {
  frameAtom: Atom<OrbFrame>;
  dark: boolean;
  size: number;
}

function OrbPicture({ frameAtom, dark, size }: OrbPictureProps) {
  const store = useOrbStore();
  const frame = useAtomValue(frameAtom, { store });
  const paints = useMemo(() => createOrbPaints(), []);
  const picture = useMemo(
    () => recordOrbPicture(frame, dark, size, paints),
    [frame, dark, size, paints]
  );

  // Skia's native view keeps its own reference to the picture it draws, so
  // the previous JS wrapper can be released right away instead of waiting
  // for the garbage collector — ~60 pictures a second otherwise pile up as
  // native memory the JS heap can't see.
  const previous = useRef<SkPicture | null>(null);
  useEffect(() => {
    const old = previous.current;
    previous.current = picture;
    if (old && old !== picture) old.dispose?.();
  }, [picture]);
  useEffect(
    () => () => {
      previous.current?.dispose?.();
      previous.current = null;
    },
    []
  );

  return <SkiaPictureView picture={picture} style={StyleSheet.absoluteFill} />;
}
