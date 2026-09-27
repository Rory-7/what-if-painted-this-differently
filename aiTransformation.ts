/**
 * aiTransformation.ts
 *
 * THIS MODULE IS DELIBERATELY SEPARATE FROM THE ALGORITHMIC PIPELINE.
 *
 * "Era" and "Mood" are only partially achievable with deterministic pixel
 * math — a genuine Baroque or Futurist reinterpretation involves brushwork,
 * compositional emphasis, and stylistic cues that go beyond color/light
 * curves. Everything in here that runs TODAY is still algorithmic (built from
 * the same primitives in colorTransformations.ts and imageProcessing.ts) —
 * it's the closest achievable approximation for each preset, documented below.
 *
 * requestAIReinterpretation() is the single, obvious seam where a real
 * deployment would call an image-generation/editing API — e.g. an image model
 * prompted with the original artwork, a style descriptor, and a low
 * image-to-image strength so composition is preserved. It is intentionally a
 * documented no-op here: swap its body for a real fetch() in production.
 */

import { cloneImageData, applyVignette } from "./imageProcessing";
import {
  adjustBrightness,
  adjustContrast,
  adjustSaturation,
  adjustTemperature,
  transformPalette,
} from "./colorTransformations";
import type { EraKey, MoodKey, PaletteKey } from "../types";

interface EraApproximation {
  palette: PaletteKey;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  tempShift?: number;
  vignette?: number;
}

export const ERA_APPROXIMATIONS: Record<string, EraApproximation | null> = {
  none: null,
  renaissance: { palette: "renaissance", contrast: 4, saturation: -8, vignette: 0.1 },
  baroque: { palette: "renaissance", contrast: 26, saturation: -4, vignette: 0.32, brightness: -14 },
  impressionism: { palette: "impressionist", contrast: -6, saturation: 18, vignette: 0.04 },
  modern: { palette: "monochrome", contrast: 30, saturation: 40, vignette: 0 },
  futuristic: { palette: "monochrome", contrast: 20, saturation: -60, vignette: 0, tempShift: -30 },
};

interface MoodApproximation {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  tempShift?: number;
  vignette?: number;
}

export const MOOD_APPROXIMATIONS: Record<string, MoodApproximation | null> = {
  none: null,
  calm: { brightness: 6, contrast: -14, saturation: -10, tempShift: 4 },
  melancholic: { brightness: -10, contrast: -4, saturation: -35, tempShift: -12 },
  mysterious: { brightness: -22, contrast: 22, saturation: -15, vignette: 0.4, tempShift: -8 },
  joyful: { brightness: 12, contrast: 10, saturation: 30, tempShift: 8 },
  tense: { brightness: -8, contrast: 42, saturation: 10, vignette: 0.22, tempShift: -4 },
};

/** Closest algorithmic approximation of a historical era. */
export function applyEraApproximation(imageData: ImageData, eraKey: EraKey): ImageData {
  const preset = ERA_APPROXIMATIONS[eraKey];
  if (!preset) return cloneImageData(imageData);

  let out = transformPalette(imageData, preset.palette);
  if (preset.brightness) out = adjustBrightness(out, preset.brightness);
  if (preset.contrast) out = adjustContrast(out, preset.contrast);
  if (preset.saturation) out = adjustSaturation(out, preset.saturation);
  if (preset.tempShift) out = adjustTemperature(out, preset.tempShift);
  if (preset.vignette) out = applyVignette(out, preset.vignette);
  return out;
}

/** Closest algorithmic approximation of an emotional mood. */
export function applyMoodApproximation(imageData: ImageData, moodKey: MoodKey): ImageData {
  const preset = MOOD_APPROXIMATIONS[moodKey];
  if (!preset) return cloneImageData(imageData);

  let out = cloneImageData(imageData);
  if (preset.brightness) out = adjustBrightness(out, preset.brightness);
  if (preset.contrast) out = adjustContrast(out, preset.contrast);
  if (preset.saturation) out = adjustSaturation(out, preset.saturation);
  if (preset.tempShift) out = adjustTemperature(out, preset.tempShift);
  if (preset.vignette) out = applyVignette(out, preset.vignette);
  return out;
}

export interface AIReinterpretationRequest {
  imageDataUrl: string;
  styleDescriptor: string;
}

export interface AIReinterpretationResult {
  imageDataUrl: string;
  note?: string;
}

/**
 * Documented seam for a real AI-assisted reinterpretation call.
 * NOT wired to any network request in this project — see module comment.
 *
 * Production sketch:
 *   const res = await fetch("/api/reinterpret", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ image: imageDataUrl, prompt: styleDescriptor, strength: 0.35 }),
 *   });
 *   return res.json();
 */
export async function requestAIReinterpretation(
  { imageDataUrl }: AIReinterpretationRequest
): Promise<AIReinterpretationResult> {
  return {
    imageDataUrl,
    note: "AI reinterpretation is not wired up in this project. The algorithmic approximation was used instead.",
  };
}
