// Web-only shared observers. Imported only by ThinkingOrb.web.tsx, so native
// bundles never include it; everything is still guarded for SSR.

import { atom } from 'jotai';

type ThemeToken = 'dark' | 'light' | '';

function themeToken(className: string | null | undefined): ThemeToken {
  if (!className) return '';
  const classes = ` ${className} `;
  if (classes.includes(' dark ')) return 'dark';
  if (classes.includes(' light ')) return 'light';
  return '';
}

/**
 * Bumps whenever any element's `data-theme` changes or its class list gains
 * or loses a `dark` / `light` token. One MutationObserver for the whole page,
 * however many orbs are mounted; it ignores the constant class churn
 * react-native-web produces for styling.
 */
export const domThemeVersionAtom = atom(0);
domThemeVersionAtom.debugLabel = 'thinkingOrbs/domThemeVersion';
domThemeVersionAtom.onMount = (set) => {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
  const mo = new MutationObserver((records) => {
    for (const m of records) {
      if (m.attributeName === 'data-theme') {
        set((v) => v + 1);
        return;
      }
      const now = (m.target as Element).getAttribute?.('class');
      if (themeToken(m.oldValue) !== themeToken(now)) {
        set((v) => v + 1);
        return;
      }
    }
  });
  mo.observe(document.documentElement, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class', 'data-theme'],
    subtree: true,
  });
  return () => mo.disconnect();
};

/** Nearest ancestor theme: `data-theme="dark|light"` or a `dark` / `light` class. */
export function ancestorDark(el: Element | null): boolean | null {
  let node: Element | null = el;
  while (node) {
    const attr = node.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    const token = themeToken(node.getAttribute('class'));
    if (token) return token === 'dark';
    node = node.parentElement;
  }
  return null;
}

// One IntersectionObserver shared by every orb on the page.
let io: IntersectionObserver | null = null;
const listeners = new Map<Element, (visible: boolean) => void>();

/** Call `onChange` when `el` scrolls in or out of view. Returns an unsubscribe. */
export function observeVisibility(el: Element, onChange: (visible: boolean) => void): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) listeners.get(entry.target)?.(entry.isIntersecting);
    });
  }
  listeners.set(el, onChange);
  io.observe(el);
  return () => {
    listeners.delete(el);
    io?.unobserve(el);
    if (listeners.size === 0) {
      io?.disconnect();
      io = null;
    }
  };
}
