<p align="center">
  <a href="https://binnicordova.com"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/hero.jpg" alt="expo-orbs — AI thinking indicators for Expo on iOS, Android and web, by BinniCordova.com" width="100%"></a>
</p>

<h1 align="center">expo-orbs</h1>

<p align="center">
  <b>Dotted thought-orb loading indicators for AI &amp; agent UIs — iOS, Android and web.</b><br/>
  Works in <b>Expo Go</b> · ships with <b>expo-updates</b> · <b>zero native code</b> · <b>Jotai</b> atomic state
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/expo-orbs"><img alt="npm" src="https://img.shields.io/npm/v/expo-orbs?style=flat-square&color=111111"></a>
  <img alt="Expo SDK 58+" src="https://img.shields.io/badge/Expo%20SDK-58%2B-000020?style=flat-square&logo=expo">
  <img alt="Platforms" src="https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web-0ea5e9?style=flat-square">
  <img alt="Expo Go" src="https://img.shields.io/badge/Expo%20Go-ready-16a34a?style=flat-square">
  <img alt="Jotai" src="https://img.shields.io/badge/state-Jotai%20atoms-f59e0b?style=flat-square">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white">
  <a href="./LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-64748b?style=flat-square"></a>
</p>

<p align="center">
  Created by <a href="https://binnicordova.com"><b>Binni Cordova</b></a> · <a href="https://binnicordova.com"><b>BinniCordova.com</b></a> · <a href="https://github.com/binnicordova">@binnicordova</a>
</p>

<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/orbs-grid-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/orbs-grid-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/orbs-grid-dark.gif" alt="All nine thinking-orb states animating, each at the 64 and 20 sizes" width="660"></picture>
</p>

---

Nine hand-tuned animations that tell your user what an agent is doing — searching, solving, listening, composing — each at two purpose-tuned sizes, strictly monochrome, following the light or dark theme automatically. The orbs are honestly 3D: rotated, depth-shaded and z-sorted dots, with depth carried by dot size and ink weight alone.

It is a TypeScript-only port of [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) by Jakub Antalik, rebuilt for Expo:

- **The same picture everywhere.** The geometry engine is the original, number for number. The test suite replays all 72 golden-vector frames published by thinking-orbs 0.3.1.
- **Native where it counts.** iOS and Android draw with [Skia](https://shopify.github.io/react-native-skia/) (bundled in Expo Go). Web draws with a plain 2D `<canvas>`, so there's no CanvasKit download and no WebGL.
- **Atomic state.** Theme, pause, speed, OS signals and the animation clock are [Jotai](https://jotai.org) atoms. You can steer every orb with one hook, or from outside React.

## See it running

<table>
  <tr>
    <td align="center" valign="top" width="45%"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/app-demo-dark.gif" alt="The example app: tapping through states, switching theme, scrolling the grid" width="300"><br/><sub>The example app — tap a state, flip the theme, every orb follows the same atoms</sub></td>
    <td align="center" valign="top"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/chat-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/chat-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/chat-dark.gif" alt="An AI agent's steps in a chat: searching, solving, then composing a reply" width="420"></picture><br/><sub>Inline at size 20: one orb per agent step</sub></td>
  </tr>
</table>

> Every GIF in this README is drawn by the library's own engine (see [`scripts/gifs`](./scripts/gifs)), so what you see is exactly what ships. The app recording is the web build; iOS and Android render the same frames with Skia.

## Get started in 3 steps

**1 — Install** (`expo install` picks the Skia version that matches your SDK)

```sh
npx expo install expo-orbs jotai @shopify/react-native-skia
```

> Web-only project? Add `react-dom react-native-web`. Skia is never loaded on web.

**2 — Import**

```tsx
import { ThinkingOrb } from 'expo-orbs';
```

**3 — Render**

```tsx
<ThinkingOrb state="searching" />
```

That's it: no provider, no config plugin, no prebuild. `npx expo start`, scan with Expo Go, done.

## States

Nine verbs an agent can be doing, each a distinct animation:

<table>
  <tr><th></th><th><code>state</code></th><th>Animation</th><th>Default label</th></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-working-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-working-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-working-dark.gif" alt="working orb" width="72"></picture></td><td><code>working</code></td><td>particles on tilted orbits</td><td>Working…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-searching-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-searching-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-searching-dark.gif" alt="searching orb" width="72"></picture></td><td><code>searching</code></td><td>a scan meridian sweeps a dotted globe</td><td>Searching…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-solving-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-solving-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-solving-dark.gif" alt="solving orb" width="72"></picture></td><td><code>solving</code></td><td>bands scramble in quarter turns, then click back solved</td><td>Solving…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-listening-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-listening-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-listening-dark.gif" alt="listening orb" width="72"></picture></td><td><code>listening</code></td><td>a waveform rolls through latitude rings</td><td>Listening…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-connecting-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-connecting-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-connecting-dark.gif" alt="connecting orb" width="72"></picture></td><td><code>connecting</code></td><td>a constellation wires itself, packets running the edges</td><td>Connecting…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-weaving-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-weaving-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-weaving-dark.gif" alt="weaving orb" width="72"></picture></td><td><code>weaving</code></td><td>three strands plait around the sphere</td><td>Weaving…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-composing-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-composing-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-composing-dark.gif" alt="composing orb" width="72"></picture></td><td><code>composing</code></td><td>an undulating multi-band sash</td><td>Composing…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-breathing-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-breathing-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-breathing-dark.gif" alt="breathing orb" width="72"></picture></td><td><code>breathing</code></td><td>a face-on ring slowly morphing</td><td>Thinking…</td></tr>
  <tr><td><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-shaping-dark.gif"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-shaping-light.gif"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/state-shaping-dark.gif" alt="shaping orb" width="72"></picture></td><td><code>shaping</code></td><td>a dotted outline morphs circle → triangle → square</td><td>Shaping…</td></tr>
</table>

## Sizes

Two tuned presets. They are separate designs, not one design scaled: each carries its own dot count, dot size and speed.

```tsx
<ThinkingOrb state="working" size={64} /> // chat-avatar scale (default)
<ThinkingOrb state="working" size={20} /> // inline-text scale
```

Any other size works too and renders the nearest preset at that size (under 42 → the 20 design, otherwise the 64 design):

```tsx
<ThinkingOrb state="searching" size={112} /> // a hero orb
```

## Theme

Monochrome ink: light dots for dark backgrounds, dark dots for light backgrounds.

```tsx
<ThinkingOrb />                // follows the app-wide theme atom (default: the OS)
<ThinkingOrb theme="dark" />   // pin: light dots for dark backgrounds
<ThinkingOrb theme="light" />  // pin: dark dots for light backgrounds
```

`auto` follows the OS appearance live. On web it first looks for an ancestor `data-theme="dark|light"` attribute or a `dark` / `light` class (the Tailwind / NativeWind convention). One shared `MutationObserver` watches for those changes, however many orbs are on the page.

> Your app ships with `"userInterfaceStyle": "light"` by default. Set it to `"automatic"` in `app.json` if you want `auto` to follow the OS on iOS and Android.

## Atomic state with Jotai

Every piece of shared state is a small atom. Orbs subscribe only to what they need, and each animating orb re-renders only its own drawing leaf, never your screen.

```
 controls (writable)          system (read-only, live)          clock
 ───────────────────          ────────────────────────          ─────
 orbThemeAtom                 systemColorSchemeAtom             orbClockAtom
 orbsPausedAtom               reduceMotionAtom                    │ one rAF loop for ALL orbs,
 orbSpeedAtom                 appActiveAtom                       │ running only while ≥ 1 orb animates
        │                            │                            │
        └──────────────┬─────────────┘                            │
                       ▼                                          ▼
          orbsDarkAtom · orbsAnimatingAtom          per-orb frame atom (derived) ──► Skia / canvas
```

- **One clock.** A single `requestAnimationFrame` loop drives every orb on screen, so they all stay in phase. It starts when the first animating orb mounts and stops by itself when the last one pauses, unmounts or the app goes to the background (Jotai `onMount`).
- **One listener per OS signal.** Appearance, reduce-motion and app-state listeners exist once, not once per orb, and only while an orb is mounted.
- **Frame atoms.** Each orb's frame is an atom derived from the clock. While the orb is paused or under reduce-motion it becomes a constant atom, so it costs nothing per frame.

### Steer every orb with one hook

```tsx
import { useThinkingOrbs } from 'expo-orbs';

function OrbSettings() {
  const { theme, setTheme, paused, togglePaused, speed, setSpeed, isDark, reduceMotion } =
    useThinkingOrbs();

  return (
    <>
      <Button title={paused ? 'Resume' : 'Pause'} onPress={togglePaused} />
      <Button title="Dark orbs" onPress={() => setTheme('dark')} />
      <Button title="2× speed" onPress={() => setSpeed(2)} />
    </>
  );
}
```

### Use the atoms directly

The orbs live in their own store, `thinkingOrbsStore`, so they never collide with your app's atoms. Read or write them with any Jotai hook by passing that store:

```tsx
import { useAtomValue, useSetAtom } from 'jotai';
import { orbsPausedAtom, reduceMotionAtom, useOrbStore } from 'expo-orbs';

const store = useOrbStore();
const pauseAll = useSetAtom(orbsPausedAtom, { store });
const reduced = useAtomValue(reduceMotionAtom, { store });
```

### Drive it from outside React

Services, websocket handlers and tests can set atoms directly:

```ts
import { orbThemeAtom, orbsPausedAtom, thinkingOrbsStore } from 'expo-orbs';

socket.on('agent:idle', () => thinkingOrbsStore.set(orbsPausedAtom, true));
socket.on('agent:busy', () => thinkingOrbsStore.set(orbsPausedAtom, false));
thinkingOrbsStore.set(orbThemeAtom, 'dark');
```

### Bring your own store

Want the orbs inside your app's Jotai store (to see them in Jotai DevTools, or to isolate a screen)? Wrap that part of the tree:

```tsx
import { createStore } from 'jotai';
import { ThinkingOrbsProvider } from 'expo-orbs';

const appStore = createStore();

<ThinkingOrbsProvider store={appStore}>
  <ChatScreen />
</ThinkingOrbsProvider>;
```

## Real use cases

<p align="center">
  <img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/use-cases.jpg" alt="Use cases: an AI chat that is searching, a voice assistant that is listening, a coding agent that is solving" width="100%">
</p>

### 🤖 Map agent tool calls to states

```tsx
const ORB_FOR_TOOL: Record<string, OrbState> = {
  web_search: 'searching',
  run_code: 'solving',
  transcribe: 'listening',
  call_api: 'connecting',
  write_file: 'composing',
};

<ThinkingOrb state={ORB_FOR_TOOL[step.tool] ?? 'working'} size={20} />;
```

### 💬 Streaming LLM reply in a chat

```tsx
{isStreaming && (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <ThinkingOrb state="composing" size={20} />
    <Text>Composing a reply…</Text>
  </View>
)}
```

### 🎙️ Voice assistant

```tsx
<ThinkingOrb state={isRecording ? 'listening' : 'breathing'} size={64} />
```

### 📜 Long lists

On web, orbs pause automatically while scrolled offscreen (one shared `IntersectionObserver`). On native, pass `paused` from your list's viewability callback:

```tsx
const [visible, setVisible] = useState<Set<string>>(new Set());
const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) =>
  setVisible(new Set(viewableItems.map((v) => v.key)))
).current;

<FlatList
  data={steps}
  keyExtractor={(s) => s.id}
  onViewableItemsChanged={onViewable}
  renderItem={({ item }) => <ThinkingOrb paused={!visible.has(item.id)} size={20} />}
/>;
```

## Why it works in Expo Go and with expo-updates

This package has no `ios/` or `android/` folder, no `expo-module.config.json` and no config plugin. It is plain TypeScript built on APIs your app already has:

| Need | Where it comes from |
| --- | --- |
| Drawing on iOS / Android | `@shopify/react-native-skia` (included in Expo Go) |
| Drawing on web | the browser's 2D canvas |
| State | `jotai` (pure JS) |
| Appearance, reduce-motion, app state | React Native core (`Appearance`, `AccessibilityInfo`, `AppState`) |

So:

- **Expo Go:** works out of the box on iOS, Android and web.
- **expo-updates / EAS Update:** every change to this package, from a new state to a retuned preset, ships over the air. It never changes your native fingerprint.
- **Development builds:** Skia gets autolinked like any other library. Nothing else to configure.

## Accessibility & performance

- Each orb is `role="img"` with a per-state `aria-label` (override it with `aria-label` or `accessibilityLabel`).
- With the OS **reduce motion** setting on, each orb renders one static, representative frame. It still follows the live theme.
- The shared clock stops when nothing animates. Orbs freeze while the app is backgrounded (web: hidden tab) and resume in phase.
- **Native:** each frame is recorded into one `SkPicture` (≤ ~600 circle fills), and Skia rasterises it on the UI thread. Paint objects are reused, and each previous picture is released right away instead of waiting for the garbage collector.
- **Web:** frames paint into the canvas imperatively (`store.sub`), so React never re-renders per frame. Plain arc fills only: no `ctx.filter`, no SVG filters, no WebGL. Device pixel ratio is capped at 2.

## API

### `<ThinkingOrb>` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `OrbState` | `'working'` | Which animation to show. |
| `size` | `64 \| 20 \| number` | `64` | Size in dp / px. 64 and 20 are the tuned presets. |
| `theme` | `'auto' \| 'dark' \| 'light'` | app-wide `orbThemeAtom` | Ink for this orb. |
| `speed` | `number` | `1` | Multiplier on the preset's baked speed (and on `orbSpeedAtom`). |
| `paused` | `boolean` | `false` | Freeze this orb on its current frame. |
| `style` | `StyleProp<ViewStyle>` | — | Container style. |
| …`ViewProps` | | | `testID`, `aria-label`, `accessibilityLabel`, `onLayout`, … pass through. |

### Exports

| Export | Kind | Description |
| --- | --- | --- |
| `ThinkingOrb` | component | The orb. |
| `useThinkingOrbs()` | hook | `{ theme, setTheme, paused, setPaused, togglePaused, speed, setSpeed, isDark, reduceMotion, animating }` |
| `orbThemeAtom` | atom (rw) | App-wide theme, default `'auto'`. |
| `orbsPausedAtom` | atom (rw) | Global pause, default `false`. |
| `orbSpeedAtom` | atom (rw) | Global speed multiplier, default `1`. |
| `systemColorSchemeAtom` | atom (r) | `'light' \| 'dark'`, live. |
| `reduceMotionAtom` | atom (r) | OS reduce-motion, live. |
| `appActiveAtom` | atom (r) | App foregrounded / tab visible, live. |
| `orbsDarkAtom` | atom (r) | Resolved app-wide ink. |
| `orbsAnimatingAtom` | atom (r) | Not paused, foregrounded and motion allowed. |
| `orbClockAtom` | atom (r) | The shared clock in seconds. Subscribing starts the loop. |
| `thinkingOrbsStore` | store | The module's Jotai store. |
| `ThinkingOrbsProvider` | component | Point orbs at another store. |
| `useOrbStore()` | hook | The store in effect. |
| `ORB_STATES`, `ORB_SIZES`, `ORB_LABELS` | constants | For pickers and menus. |
| `MODE_FRAMES`, `resolvePreset`, `STATE_TO_MODE` | engine | For custom renderers. |

### `expo-orbs/engine`

The geometry on its own, with zero React, React Native or DOM, for custom renderers (an SVG exporter, a server-side rasteriser, your own Skia scene):

```ts
import { MODE_FRAMES, inkGrey, resolvePreset } from 'expo-orbs/engine';

const { mode, speed, opts } = resolvePreset('searching', 64);
const { dots, lines } = MODE_FRAMES[mode](64, elapsedSeconds * speed, opts);
// dots arrive z-sorted: draw lines first, then each dot as a circle
// fill grey = inkGrey(dot.white, dark), alpha = dot.a ?? 1
```

## Example app

The `example/` app shows every state at both sizes, a hero orb, the global controls (theme, pause, speed) and orbs inside a chat UI. It loads the library straight from `src/`, so edits hot-reload.

```sh
bun install
cd example && bun install
bun run example:ios       # iOS simulator, Expo Go
bun run example:android   # Android device / emulator, Expo Go
bun run example:web       # browser
```

## Development

```sh
bun install
bun run typecheck   # tsc --noEmit
bun run test        # jest: golden-vector parity + atom behaviour
bun run lint        # eslint (expo universe)
bun run build       # tsc → build/
```

### Regenerating the GIFs

```sh
bun run gifs       # orbs grid, chat and the nine state GIFs (dark + light) → docs/images
bun run gifs:app   # records the example app's web build → docs/images/app-demo-dark.gif
```

Both need `ffmpeg` and a Chromium (Playwright's, or `CHROMIUM_PATH=/path/to/chrome`).

### Releasing to npm

CI (`.github/workflows/ci.yml`) typechecks, lints, tests, builds and packs every push and pull request. Publishing is tag-driven:

1. Create an npm **automation** token and save it as the `NPM_TOKEN` repository secret (GitHub → Settings → Secrets and variables → Actions).
2. Bump, tag and push:

```sh
npm version patch            # or minor / major — updates package.json and creates the vX.Y.Z tag
git push --follow-tags
```

`.github/workflows/release.yml` checks the tag matches `package.json`, runs the full `prepublishOnly` pipeline (clean, typecheck, test, lint, build) and publishes with npm provenance.

Publishing by hand works too:

```sh
npm login
npm publish --dry-run   # inspect the tarball (build/, src/, README, LICENSE, CHANGELOG)
npm publish             # publishConfig.access is already "public"
```

## About the creator

<p align="center">
  <a href="https://binnicordova.com"><img src="https://raw.githubusercontent.com/binnicordova/expo-orbs/main/docs/images/creator.jpg" alt="BinniCordova.com — Expo & React Native open-source modules" width="100%"></a>
</p>

**Binni Cordova** builds Expo and React Native modules that run in Expo Go and ship over the air: pure TypeScript, no native code, iOS, Android and web from one codebase.

- 🌐 Website: [**BinniCordova.com**](https://binnicordova.com)
- 🐙 GitHub: [@binnicordova](https://github.com/binnicordova)
- 📦 More modules: [expo-useanimations](https://github.com/binnicordova/expo-useanimations) · [expo-logs](https://github.com/binnicordova/expo-logs) · [expo-atoms](https://github.com/binnicordova/expo-atoms)

Using expo-orbs in an app? Open an issue or say hi on [BinniCordova.com](https://binnicordova.com) — I'd love to see it.

## Credits & license

- Orb design, tuning and geometry engine: [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) by **Jakub Antalik** (MIT).
- Expo port, Skia/canvas renderers and Jotai state: **Binni Cordova** (MIT).

See [LICENSE](./LICENSE) for both notices.
