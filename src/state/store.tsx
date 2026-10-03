// The Jotai store the orbs read from.
//
// The library ships its own store instead of using Jotai's default one, so
// its atoms never collide with an app's atoms and so they can be driven from
// outside React (a service, a websocket handler, a test) with plain
// `thinkingOrbsStore.set(...)`. Apps that want the orbs inside their own
// store — to see them in Jotai DevTools, or to isolate a subtree — wrap that
// subtree in `<ThinkingOrbsProvider store={myStore}>`.

import { createStore } from 'jotai';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export type OrbStore = ReturnType<typeof createStore>;

/** The module-level store every orb uses unless a provider overrides it. */
export const thinkingOrbsStore: OrbStore = createStore();

const OrbStoreContext = createContext<OrbStore>(thinkingOrbsStore);

export interface ThinkingOrbsProviderProps {
  /** Store to read orb atoms from. @default thinkingOrbsStore */
  store?: OrbStore;
  children?: ReactNode;
}

/** Scope every `<ThinkingOrb>` (and the control hooks) below to `store`. */
export function ThinkingOrbsProvider({ store, children }: ThinkingOrbsProviderProps) {
  return (
    <OrbStoreContext.Provider value={store ?? thinkingOrbsStore}>
      {children}
    </OrbStoreContext.Provider>
  );
}

/** The store the nearest `ThinkingOrbsProvider` points at (or the module store). */
export function useOrbStore(): OrbStore {
  return useContext(OrbStoreContext);
}
