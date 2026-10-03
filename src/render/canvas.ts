// Web renderer: paints a finished frame into a 2D canvas. Plain arc fills
// only — no ctx.filter, no SVG filters, no WebGL — so Chrome, Safari and
// Firefox all produce the same pixels.

import type { OrbFrame } from '../engine/core';
import { inkGrey } from '../engine/core';

/** Lines first, so nodes sit on top of their edges; dots arrive z-sorted. */
export function paintCanvas(ctx: CanvasRenderingContext2D, frame: OrbFrame, dark: boolean): void {
  for (const l of frame.lines) {
    const g = inkGrey(l.white, dark);
    ctx.strokeStyle = `rgba(${g},${g},${g},${l.a ?? 1})`;
    ctx.lineWidth = l.w;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
  }
  for (const d of frame.dots) {
    const g = inkGrey(d.white, dark);
    ctx.fillStyle = `rgba(${g},${g},${g},${d.a ?? 1})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
