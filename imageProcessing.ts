/**
 * imageProcessing.ts
 * Low-level pixel and canvas utilities shared by every transformation module.
 */

export const clamp = (v: number, min = 0, max = 255): number =>
  Math.min(max, Math.max(min, v));

/** Read an HTMLImageElement into an ImageData object via an offscreen canvas. */
export function imageToImageData(img: HTMLImageElement, maxDim = 1400): ImageData {
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.drawImage(img, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

/** Write an ImageData back onto a visible canvas element. */
export function paintToCanvas(canvasEl: HTMLCanvasElement, imageData: ImageData): void {
  canvasEl.width = imageData.width;
  canvasEl.height = imageData.height;
  const ctx = canvasEl.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.putImageData(imageData, 0, 0);
}

/** Deep-clone an ImageData so transforms never mutate a shared source buffer. */
export function cloneImageData(imageData: ImageData): ImageData {
  return new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

/** Apply a radial vignette (used by lighting effects and era/mood approximations). */
export function applyVignette(imageData: ImageData, amount: number): ImageData {
  const out = cloneImageData(imageData);
  const { width, height, data: d } = out;
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      const falloff = 1 - amount * Math.pow(dist, 2.2);
      d[idx] = clamp(d[idx] * falloff);
      d[idx + 1] = clamp(d[idx + 1] * falloff);
      d[idx + 2] = clamp(d[idx + 2] * falloff);
    }
  }
  return out;
}
