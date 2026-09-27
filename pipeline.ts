/**
 * pipeline.ts
 * Composes the algorithmic and hybrid transformation modules into a single
 * full-image transform, based on the user's selected parameters.
 */

import { cloneImageData } from "./imageProcessing";
import { adjustTemperature, adjustContrast, adjustSaturation, transformPalette } from "./colorTransformations";
import { applyLighting } from "./lightingEffects";
import { applyEraApproximation, applyMoodApproximation } from "./aiTransformation";
import type { TransformParams } from "../types";

export function runFullPipeline(baseImageData: ImageData, params: TransformParams): ImageData {
  let out = cloneImageData(baseImageData);

  // Era takes precedence over a manually chosen palette, since it implies one.
  if (params.era !== "none") {
    out = applyEraApproximation(out, params.era);
  } else if (params.palette !== "original") {
    out = transformPalette(out, params.palette);
  }

  if (params.mood !== "none") {
    out = applyMoodApproximation(out, params.mood);
  }

  if (params.lighting !== "none") {
    out = applyLighting(out, params.lighting);
  }

  if (params.temperature !== 0) {
    out = adjustTemperature(out, params.temperature);
  }

  if (params.contrast !== 0) {
    out = adjustContrast(out, params.contrast);
  }

  if (params.saturation !== 0) {
    out = adjustSaturation(out, params.saturation);
  }

  return out;
}
