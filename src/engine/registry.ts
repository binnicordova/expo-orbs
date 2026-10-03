// Mode key → geometry builder. Pure geometry, no rendering surface: the Skia
// (native) and canvas (web) renderers both draw exactly what these return.

import { frameBraid } from './braid';
import { frameGlobe, frameRubik, frameWave } from './lattice';
import { frameMorph } from './morph';
import { frameOrbits } from './orbits';
import { frameRibbon } from './ribbon';
import type { ModeFrame, ModeKey } from './types';
import { frameWeb } from './web';

export const MODE_FRAMES: Record<ModeKey, ModeFrame> = {
  orbits: frameOrbits,
  globe: frameGlobe,
  rubik: frameRubik,
  wave: frameWave,
  web: frameWeb,
  braid: frameBraid,
  ribbon: frameRibbon,
  // ring shares ribbon's geometry — the `faceOn` profile flag switches it
  ring: frameRibbon,
  morph: frameMorph,
};
