// Parity with the original thinking-orbs engine.
//
// `fixtures/orbs-golden.json` is the golden-vector file published by
// thinking-orbs 0.3.1: for every (state × size) it records the resolved
// preset and the exact dot/line list at four fixed instants. If this test
// passes, every platform of this module draws the same picture as the
// original web component, number for number.

import golden from './fixtures/orbs-golden.json';
import type { OrbSize, OrbState } from '../engine/index';
import { MODE_FRAMES, ORB_SIZES, ORB_STATES, resolvePreset } from '../engine/index';

interface GoldenCase {
  key: string;
  state: OrbState;
  size: OrbSize;
  mode: string;
  t: number;
  dotCount: number;
  lineCount: number;
  dots: number[];
  lines: number[];
}

const TOL = golden.tolerance;
const cases = golden.cases as GoldenCase[];
const resolved = golden.resolved as Record<string, { mode: string; speed: number; opts: object }>;

describe('presets', () => {
  it('covers every state × size', () => {
    expect(Object.keys(resolved)).toHaveLength(ORB_STATES.length * ORB_SIZES.length);
  });

  it.each(Object.entries(resolved))('%s resolves like the original', (key, expected) => {
    const [state, size] = key.split('-');
    const r = resolvePreset(state as OrbState, Number(size) as OrbSize);
    expect(r.mode).toBe(expected.mode);
    expect(r.speed).toBeCloseTo(expected.speed, 10);
    expect(r.opts).toEqual(expected.opts);
  });
});

describe('frames match the golden vectors', () => {
  it.each(cases.map((c) => [`${c.key} @ t=${c.t}`, c] as const))('%s', (_name, c) => {
    const { opts } = resolvePreset(c.state, c.size);
    const frame = MODE_FRAMES[c.mode as keyof typeof MODE_FRAMES](c.size, c.t, opts);

    expect(frame.dots).toHaveLength(c.dotCount);
    expect(frame.lines).toHaveLength(c.lineCount);

    frame.dots.forEach((d, i) => {
      const g = c.dots.slice(i * 6, i * 6 + 6);
      const actual = [d.x, d.y, d.z, d.r, d.white, d.a ?? 1];
      actual.forEach((v, j) => expect(Math.abs(v - g[j])).toBeLessThanOrEqual(TOL));
    });
    frame.lines.forEach((l, i) => {
      const g = c.lines.slice(i * 7, i * 7 + 7);
      const actual = [l.x1, l.y1, l.x2, l.y2, l.white, l.a ?? 1, l.w];
      actual.forEach((v, j) => expect(Math.abs(v - g[j])).toBeLessThanOrEqual(TOL));
    });
  });
});
