/**
 * colorTransformations.ts
 * ALGORITHMIC transformations only — deterministic pixel math, no AI involved.
 *
 * Palette transformation works by HSL hue-anchoring: each pixel's hue is pulled
 * partway toward the nearest anchor hue in a curated target palette, and its
 * saturation/lightness are remapped through that palette's characteristic
 * curve. This preserves the original composition and value structure while
 * shifting the color language — it is deliberately not a naive color swap or
 * posterization, which would break the sense that this is the same artwork.
 */

import { clamp, cloneImageData, rgbToHsl, hslToRgb } from "./imageProcessing";
import type { PaletteKey } from "../types";

/** Adjust color temperature. value: -100 (cold/blue) .. +100 (warm/amber) */
export function adjustTemperature(imageData: ImageData, value: number): ImageData {
  const out = cloneImageData(imageData);
  const d = out.data;
  const strength = value / 100;
  const rShift = strength * 35;
  const bShift = -strength * 35;
  const gShift = strength * 8;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] + rShift);
    d[i + 1] = clamp(d[i + 1] + gShift);
    d[i + 2] = clamp(d[i + 2] + bShift);
  }
  return out;
}

/** Adjust saturation. value: -100 (grayscale) .. +100 (oversaturated) */
export function adjustSaturation(imageData: ImageData, value: number): ImageData {
  const out = cloneImageData(imageData);
  const d = out.data;
  const factor = 1 + value / 100;
  for (let i = 0; i < d.length; i += 4) {
    const [h, s, l] = rgbToHsl(d[i], d[i + 1], d[i + 2]);
    const [r, g, b] = hslToRgb(h, clamp(s * factor, 0, 1), l);
    d[i] = clamp(r);
    d[i + 1] = clamp(g);
    d[i + 2] = clamp(b);
  }
  return out;
}

/** Contrast adjustment. value: -100 .. +100 */
export function adjustContrast(imageData: ImageData, value: number): ImageData {
  const out = cloneImageData(imageData);
  const d = out.data;
  const factor = (259 * (value + 255)) / (255 * (259 - value));
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(factor * (d[i] - 128) + 128);
    d[i + 1] = clamp(factor * (d[i + 1] - 128) + 128);
    d[i + 2] = clamp(factor * (d[i + 2] - 128) + 128);
  }
  return out;
}

/** Brightness adjustment. value: -100 .. +100 */
export function adjustBrightness(imageData: ImageData, value: number): ImageData {
  const out = cloneImageData(imageData);
  const d = out.data;
  const shift = (value / 100) * 90;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] + shift);
    d[i + 1] = clamp(d[i + 1] + shift);
    d[i + 2] = clamp(d[i + 2] + shift);
  }
  return out;
}

/** True grayscale via relative luminance, with optional tint for monochrome palettes. */
export function applyMonochrome(imageData: ImageData, tint: [number, number, number] | null = null): ImageData {
  const out = cloneImageData(imageData);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    if (tint) {
      d[i] = clamp(lum * tint[0]);
      d[i + 1] = clamp(lum * tint[1]);
      d[i + 2] = clamp(lum * tint[2]);
    } else {
      d[i] = d[i + 1] = d[i + 2] = lum;
    }
  }
  return out;
}

interface PaletteDefinition {
  anchors: number[]; // hue anchors in degrees (0-360)
  satCurve: (s: number) => number;
  lightCurve: (l: number) => number;
  tempShift: number;
}

export const PALETTES: Record<string, PaletteDefinition | null> = {
  original: null,
  renaissance: {
    anchors: [30, 15, 45, 350], // amber, terracotta, gold, oxblood
    satCurve: (s) => clamp(s * 0.85 + 0.08, 0, 1),
    lightCurve: (l) => clamp(l * 0.92 + 0.04, 0, 1),
    tempShift: 18,
  },
  impressionist: {
    anchors: [200, 280, 60, 330], // sky blue, violet, sun yellow, pink
    satCurve: (s) => clamp(s * 1.25 + 0.05, 0, 1),
    lightCurve: (l) => clamp(l * 1.08, 0, 1),
    tempShift: 4,
  },
  monochrome: null, // handled separately via applyMonochrome
  earthtones: {
    anchors: [30, 90, 45, 20], // ochre, olive, sand, sienna
    satCurve: (s) => clamp(s * 0.55 + 0.05, 0, 1),
    lightCurve: (l) => clamp(l * 0.95, 0, 1),
    tempShift: 10,
  },
  pastel: {
    anchors: [200, 340, 60, 150], // powder blue, blush, cream, mint
    satCurve: (s) => clamp(s * 0.45 + 0.1, 0, 1),
    lightCurve: (l) => clamp(l * 0.7 + 0.28, 0, 1),
    tempShift: -2,
  },
};

function nearestHue(h360: number, anchors: number[]): number {
  let best = anchors[0];
  let bestDist = Infinity;
  for (const a of anchors) {
    let dist = Math.abs(h360 - a);
    if (dist > 180) dist = 360 - dist;
    if (dist < bestDist) {
      bestDist = dist;
      best = a;
    }
  }
  // Pull the hue partway (65%) toward the nearest anchor rather than snapping
  // fully — this is what preserves "the same painting" rather than a swap.
  let diff = best - h360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return ((h360 + diff * 0.65) % 360 + 360) % 360;
}

/**
 * transformPalette(imageData, palette)
 * Remaps the artwork's hues toward a curated target palette while preserving
 * composition, value structure, and object boundaries.
 */
export function transformPalette(imageData: ImageData, paletteKey: PaletteKey): ImageData {
  if (paletteKey === "original") return cloneImageData(imageData);
  if (paletteKey === "monochrome") return applyMonochrome(imageData);

  const palette = PALETTES[paletteKey];
  if (!palette) return cloneImageData(imageData);

  let out = cloneImageData(imageData);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const [h, s, l] = rgbToHsl(d[i], d[i + 1], d[i + 2]);
    const h360 = h * 360;
    const hue = nearestHue(h360, palette.anchors);
    const newS = palette.satCurve(s);
    const newL = palette.lightCurve(l);
    const [r, g, b] = hslToRgb(hue / 360, newS, newL);
    d[i] = clamp(r);
    d[i + 1] = clamp(g);
    d[i + 2] = clamp(b);
  }
  out = adjustTemperature(out, palette.tempShift);
  return out;
}
