// Records the example app (its web export) as a GIF: a virtual clock drives
// requestAnimationFrame, and scripted taps walk through states and themes.
//
//   cd example && bunx expo export --platform web && cd ..
//   node scripts/gifs/app-demo.mjs example/dist docs/images/app-demo-dark.gif dark

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import handler from 'serve-handler';

const [dist = 'example/dist', out = 'docs/images/app-demo-dark.gif', scheme = 'dark'] = process.argv.slice(2);
const FPS = 15;
const DT = 1000 / FPS;

const server = http.createServer((q, s) =>
  handler(q, s, { public: dist, rewrites: [{ source: '**', destination: '/index.html' }] })
);
await new Promise((r) => server.listen(0, r));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, colorScheme: scheme });
await page.addInitScript(() => {
  let vt = 1000;
  const cbs = new Map();
  let id = 0;
  performance.now = () => vt;
  window.requestAnimationFrame = (cb) => {
    const i = ++id;
    cbs.set(i, cb);
    return i;
  };
  window.cancelAnimationFrame = (i) => cbs.delete(i);
  window.__step = (ms) => {
    vt += ms;
    const l = [...cbs.values()];
    cbs.clear();
    l.forEach((cb) => cb(vt));
  };
});
await page.goto(`http://localhost:${server.address().port}/`);
await page.waitForTimeout(1500);
await page.evaluate(() => document.fonts.ready);

const tmp = fs.mkdtempSync(path.join(path.dirname(out), '.demo-'));
let n = 0;
const shot = () => page.screenshot({ path: path.join(tmp, `f${String(n++).padStart(4, '0')}.png`) });
const frames = async (seconds) => {
  for (let i = 0; i < Math.round(seconds * FPS); i++) {
    await page.evaluate((dt) => window.__step(dt), DT);
    await shot();
  }
};
const tap = async (label) => {
  await page.getByRole('button', { name: label, exact: true }).first().click();
};
await page.evaluate(() => {
  window.__sc = [...document.querySelectorAll('div')].find(
    (d) => d.scrollHeight > d.clientHeight + 50 && getComputedStyle(d).overflowY !== 'visible'
  );
});
const scrollBy = async (px, seconds) => {
  const steps = Math.round(seconds * FPS);
  const ease = (x) => 0.5 - Math.cos(Math.PI * x) / 2;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => (window.__sc.scrollTop += d), px * (ease((i + 1) / steps) - ease(i / steps)));
    await page.evaluate((dt) => window.__step(dt), DT);
    await shot();
  }
};

await frames(1.6);
for (const s of ['solving', 'listening', 'composing', 'shaping']) {
  await tap(s);
  await frames(1.4);
}
await tap(scheme === 'dark' ? 'light' : 'dark');
await frames(1.4);
await tap('auto');
await frames(0.6);
await scrollBy(560, 1.2);
await frames(2.2);
await scrollBy(-560, 1.0);
await tap('searching');
await frames(0.8);

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%04d.png'),
  '-vf', 'scale=540:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle',
  '-loop', '0', out,
]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(path.basename(out), `${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
await browser.close();
server.close();
