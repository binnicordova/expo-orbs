// Native renderer: records a finished frame into an SkPicture.
//
// Recording is cheap (≤ ~600 circle fills) and happens on the JS thread;
// Skia rasterises the picture on the UI thread. One fill paint and one
// stroke paint are mutated in place instead of allocating a paint per dot,
// which is what actually hurts on low-end Android.

import type { SkPaint, SkPicture } from '@shopify/react-native-skia';
import { createPicture, PaintStyle, Skia } from '@shopify/react-native-skia';

import type { OrbFrame } from '../engine/core';
import { inkGrey } from '../engine/core';

export interface OrbPaints {
  fill: SkPaint;
  stroke: SkPaint;
  rgba: Float32Array;
}

export function createOrbPaints(): OrbPaints {
  const fill = Skia.Paint();
  fill.setAntiAlias(true);
  const stroke = Skia.Paint();
  stroke.setAntiAlias(true);
  stroke.setStyle(PaintStyle.Stroke);
  return { fill, stroke, rgba: new Float32Array(4) };
}

function setInk(paints: OrbPaints, paint: SkPaint, white: number, alpha: number, dark: boolean) {
  // quantised exactly like the canvas painter, so both platforms land on
  // identical greys rather than merely close ones
  const g = inkGrey(white, dark) / 255;
  paints.rgba[0] = g;
  paints.rgba[1] = g;
  paints.rgba[2] = g;
  paints.rgba[3] = alpha;
  paint.setColor(paints.rgba);
}

export function recordOrbPicture(
  frame: OrbFrame,
  dark: boolean,
  size: number,
  paints: OrbPaints
): SkPicture {
  return createPicture(
    (canvas) => {
      for (const l of frame.lines) {
        setInk(paints, paints.stroke, l.white, l.a ?? 1, dark);
        paints.stroke.setStrokeWidth(l.w);
        canvas.drawLine(l.x1, l.y1, l.x2, l.y2, paints.stroke);
      }
      for (const d of frame.dots) {
        setInk(paints, paints.fill, d.white, d.a ?? 1, dark);
        canvas.drawCircle(d.x, d.y, d.r, paints.fill);
      }
    },
    Skia.XYWHRect(0, 0, size, size)
  );
}
