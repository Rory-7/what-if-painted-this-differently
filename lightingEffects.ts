/**
 * lightingEffects.ts
 * ALGORITHMIC lighting simulation via brightness/contrast curves composited
 * with a radial vignette — deterministic pixel math, no AI involved.
 */

import { cloneImageData, applyVignette } from "./imageProcessing";
import { adjustBrightness, adjustContrast, adjustTemperature } from "./colorTransformations";
import type { LightingKey } from "../types";

interface LightingPreset {
  brightness: number;
  contrast: number;
  vignette: number;
  warmth: number;
}

export const LIGHTING_PRESETS: Record<string, LightingPreset | null> = {
  none: null,
  soft: { brightness: 8, contrast: -12, vignette: 0.08, warmth: 4 },
  dramatic: { brightness: -6, contrast: 38, vignette: 0.38, warmth: -2 },
  goldenhour: { brightness: 10, contrast: 6, vignette: 0.14, warmth: 30 },
  lowlight: { brightness: -34, contrast: 16, vignette: 0.3, warmth: -8 },
};

/**
 * applyLighting(imageData, presetKey)
 * Simulates a lighting condition by combining brightness, contrast, a warmth
 * shift, and a vignette falloff — the same tools a photographer would think in
 * terms of, applied deterministically.
 */
export function applyLighting(imageData: ImageData, presetKey: LightingKey): ImageData {
  const preset = LIGHTING_PRESETS[presetKey];
  if (!preset) return cloneImageData(imageData);

  let out = cloneImageData(imageData);
  out = adjustBrightness(out, preset.brightness);
  out = adjustContrast(out, preset.contrast);
  if (preset.warmth) out = adjustTemperature(out, preset.warmth);
  if (preset.vignette > 0) out = applyVignette(out, preset.vignette);
  return out;
}
