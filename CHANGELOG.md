# Changelog

## 0.1.0 — 2026-10-03

Initial release, published as `@binnicordova/expo-thinking-orbs`.

- `<ThinkingOrb>` for iOS, Android and web (Expo SDK 58+): nine hand-tuned states (`working`, `searching`, `solving`, `listening`, `connecting`, `weaving`, `composing`, `breathing`, `shaping`) at two tuned sizes (64 and 20), plus any other size via the nearest preset.
- Works in Expo Go and ships over expo-updates: zero native code. Native renders with `@shopify/react-native-skia`, web with a plain 2D canvas (no CanvasKit download).
- Atomic state with Jotai: `orbThemeAtom`, `orbsPausedAtom`, `orbSpeedAtom`, live OS atoms (`systemColorSchemeAtom`, `reduceMotionAtom`, `appActiveAtom`) and one shared animation clock (`orbClockAtom`) that runs only while an orb is animating.
- `useThinkingOrbs()` control hook, a dedicated `thinkingOrbsStore` you can drive from outside React, and `<ThinkingOrbsProvider store>` to use your own Jotai store.
- Geometry is identical to thinking-orbs 0.3.1: verified against its 72 golden-vector frames.
- `@binnicordova/expo-thinking-orbs/engine` subpath: the pure geometry engine for custom renderers.
