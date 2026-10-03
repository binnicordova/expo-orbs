// Renders the README GIFs from the real engine in headless Chromium.
//
// Every frame is drawn at an exact instant (a virtual clock, not wall time),
// so the GIFs are smooth and reproducible. The last 0.6 s of each loop
// crossfades into its first frames, so the loop has no visible jump.
//
//   bun run gifs            # or: node scripts/gifs/record.mjs docs/images
//
// Needs: ffmpeg on PATH, and a Chromium (Playwright's, or set CHROMIUM_PATH).

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.resolve(process.argv[2] ?? 'docs/images');
fs.mkdirSync(OUT, { recursive: true });

const STATES = ['working', 'searching', 'solving', 'listening', 'connecting', 'weaving', 'composing', 'breathing', 'shaping'];
const JOBS = process.argv[3]
  ? JSON.parse(process.argv[3])
  : ['dark', 'light'].flatMap((theme) => [
      { name: `orbs-grid-${theme}`, scene: 'grid', theme, dpr: 2, fps: 25, seconds: 4 },
      { name: `chat-${theme}`, scene: 'chat', theme, dpr: 2, fps: 20, seconds: 9.6, t0: 0, fade: 0 },
      ...STATES.map((s) => ({ name: `state-${s}-${theme}`, scene: 'single', theme, arg: s, dpr: 2, fps: 20, seconds: 3 })),
    ]);

const server = http.createServer((req, res) => {
  const f = path.join(DIR, req.url === '/' ? 'scenes.html' : req.url.split('?')[0]);
  res.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : 'text/html');
  fs.createReadStream(f).on('error', () => { res.statusCode = 404; res.end(); }).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/`);
await page.waitForFunction(() => window.ready === true);
await page.evaluate(() => document.fonts.ready);

for (const job of JOBS) {
  const { name, scene, theme, dpr = 2, fps = 25, seconds = 4, t0 = 10, fade = 0.6, arg = null } = job;
  const tmp = fs.mkdtempSync(path.join(OUT, '.frames-'));
  const n = Math.round(fps * seconds);
  const nf = Math.round(fps * fade);
  for (let i = 0; i < n; i++) {
    const t = t0 + i / fps;
    let tAlt = 0;
    let alpha = 0;
    if (nf > 0 && i >= n - nf) {
      const k = i - (n - nf);
      alpha = (k + 1) / (nf + 1);
      tAlt = t0 - (nf - k) / fps;
    }
    const url = await page.evaluate(
      ([s, th, d, tt, ta, a, g]) => window.renderFrame(s, th, d, tt, ta, a, g),
      [scene, theme, dpr, t, tAlt, alpha, arg]
    );
    fs.writeFileSync(path.join(tmp, `f${String(i).padStart(4, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  const out = path.join(OUT, `${name}.gif`);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(tmp, 'f%04d.png'),
    '-vf', 'split[a][b];[a]palettegen=max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=none',
    '-loop', '0', out,
  ]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`${name}.gif  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
await browser.close();
server.close();
