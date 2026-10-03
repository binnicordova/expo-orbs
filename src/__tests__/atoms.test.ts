import { atom, createStore } from 'jotai';

import {
  nowSeconds,
  orbClockAtom,
  orbsAnimatingAtom,
  orbsDarkAtom,
  orbsPausedAtom,
  orbThemeAtom,
  readOrbClock,
  systemColorSchemeAtom,
} from '../state/atoms';

describe('app-wide controls', () => {
  it('theme atom pins or follows the OS', () => {
    const store = createStore();
    const os = store.get(systemColorSchemeAtom);

    expect(store.get(orbThemeAtom)).toBe('auto');
    expect(store.get(orbsDarkAtom)).toBe(os === 'dark');

    store.set(orbThemeAtom, 'dark');
    expect(store.get(orbsDarkAtom)).toBe(true);

    store.set(orbThemeAtom, 'light');
    expect(store.get(orbsDarkAtom)).toBe(false);
  });

  it('global pause stops animation', () => {
    const store = createStore();
    expect(store.get(orbsAnimatingAtom)).toBe(true);
    store.set(orbsPausedAtom, true);
    expect(store.get(orbsAnimatingAtom)).toBe(false);
  });

  it('stores are isolated from each other', () => {
    const a = createStore();
    const b = createStore();
    a.set(orbsPausedAtom, true);
    expect(b.get(orbsPausedAtom)).toBe(false);
  });
});

describe('shared clock', () => {
  let rafs: Map<number, FrameRequestCallback>;
  let nextId: number;
  let clockMs: number;
  const realPerformance = globalThis.performance;

  beforeEach(() => {
    rafs = new Map();
    nextId = 1;
    clockMs = 1_000;
    // a controllable monotonic clock
    Object.defineProperty(globalThis, 'performance', {
      configurable: true,
      value: { now: () => clockMs },
    });
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      const id = nextId++;
      rafs.set(id, cb);
      return id;
    };
    global.cancelAnimationFrame = (id: number) => {
      rafs.delete(id);
    };
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'performance', {
      configurable: true,
      value: realPerformance,
    });
  });

  const flushFrame = () => {
    clockMs += 16;
    const pending = [...rafs.entries()];
    rafs.clear();
    for (const [, cb] of pending) cb(clockMs);
  };

  it('runs one loop for many subscribers and stops when the last leaves', () => {
    const store = createStore();
    const a = store.sub(orbClockAtom, () => {});
    const b = store.sub(orbClockAtom, () => {});
    expect(rafs.size).toBe(1);

    flushFrame();
    expect(rafs.size).toBe(1); // re-armed, still a single loop

    a();
    expect(rafs.size).toBe(1);
    b();
    expect(rafs.size).toBe(0);
  });

  it('ticks fan out to derived frame atoms', () => {
    const store = createStore();
    const frameAtom = atom((get) => get(orbClockAtom) * 2);
    const seen: number[] = [];
    const unsub = store.sub(frameAtom, () => seen.push(store.get(frameAtom)));

    const before = seen.length;
    flushFrame();
    flushFrame();
    expect(seen.length - before).toBe(2);
    expect(seen[seen.length - 1]).toBeCloseTo(seen[seen.length - 2] + 0.032, 6);
    unsub();
  });

  it('a fresh frame atom never reads a stale tick', () => {
    const store = createStore();
    const unsub = store.sub(orbClockAtom, () => {});
    unsub(); // loop stopped: the stored tick is now frozen
    clockMs += 10_000; // ten seconds later…
    const t = store.get(atom((get) => readOrbClock(get)));
    expect(t).toBeCloseTo(nowSeconds(), 6);
  });

  it('every orb reads the same instant while the loop runs', () => {
    const store = createStore();
    const a = atom((get) => readOrbClock(get));
    const b = atom((get) => readOrbClock(get));
    const ua = store.sub(a, () => {});
    flushFrame();
    clockMs += 5; // b is created mid-frame
    const ub = store.sub(b, () => {});
    expect(store.get(b)).toBe(store.get(a));
    ua();
    ub();
  });
});
