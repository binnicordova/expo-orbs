# README images

## Generated with Gemini

`hero.jpg`, `use-cases.jpg` and `creator.jpg` were generated with Gemini (gemini.google.com, signed in as Binni Cordova) on 2026-10-03, then downloaded at full size. To make new versions, reuse these prompts and keep the same file names.

**hero.jpg** (≈2:1). Two prompts in the same chat: the first made the layout, the second highlighted the credit.

> Create an image: A wide 2:1 GitHub README hero banner for an open-source Expo / React Native library called "expo-thinking-orbs". Pure black to deep charcoal background, strictly monochrome (white and greys only, no color). On the right, a large 3D sphere made entirely of tiny white dots arranged on latitude rings, like a halftone dotted globe, depth-shaded so near dots are bigger and brighter and far dots are small and faint, with a soft vertical scan meridian sweeping across it. Around it, three smaller dotted orbs: one with dots on tilted orbits, one dotted ring, one dotted triangle outline. On the left, large clean bold white sans-serif text "expo-thinking-orbs" and below it smaller grey text "AI thinking indicators for Expo · iOS · Android · Web". In the bottom-left corner, a rounded pill badge with the white text "BinniCordova.com". Minimal, elegant, lots of negative space, crisp vector look, no other logos, no other text.

> Great. Make one more version of this exact banner where the creator credit is highlighted: replace the small corner badge with a clearly readable line under the subtitle that says "by BinniCordova.com" in medium-size white text with a thin white outline pill around it, and keep everything else (monochrome dotted orbs, layout, black background) the same.

**use-cases.jpg** (≈16:9)

> Create a new image in the same monochrome style: a wide 16:9 illustration for a README section called "Use cases". Black background, strictly white and grey only. Three floating rounded dark cards side by side, each with a short white label at the top: (1) "AI chat": a phone chat screen where the assistant's message row shows a small sphere made of tiny white dots next to the text "Searching…"; (2) "Voice": a voice assistant screen with one large dotted sphere whose rings ripple like a sound wave, with the text "Listening…"; (3) "Agents": a coding-agent panel with a checklist of three steps where the active step has a small dotted orb and the text "Solving…". At the bottom centre, small clean white text "BinniCordova.com". Flat vector, crisp, generous spacing, no other logos or text.

**creator.jpg** (≈3:1)

> Create one more image in the same monochrome style: a wide 3:1 creator banner for the bottom of a GitHub README. Black background, white and grey only. On the left, a neat row of five small 3D orbs made of tiny white dots (a dotted globe, a dotted ring, particles on tilted orbits, a dotted triangle outline, a woven striped sphere). On the right, very large bold white sans-serif text "BinniCordova.com" and under it smaller grey text "Expo & React Native open-source modules". Minimal, elegant, crisp vector look, lots of negative space, no other text or logos.

## Rendered from the library

The GIFs are not illustrations: they are frames from the real engine, drawn by `scripts/gifs/` in headless Chromium.

- `bun run gifs` writes `orbs-grid-*.gif`, `chat-*.gif` and `state-*-*.gif` (dark and light).
- `bun run gifs:app` writes `app-demo-dark.gif`, a recording of the example app's web build.
