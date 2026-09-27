# What If I Painted This Differently?

An interactive art-tech lab that reinterprets a painting under different visual constraints — palette, lighting, contrast, mood, era, and color temperature — while preserving its original composition and structure.

**Live demo:** `https://<your-username>.github.io/painted-differently/` (update after enabling GitHub Pages)

## How it works

Most transformations are real, deterministic pixel processing done in the browser with the Canvas API — HSL-based palette remapping, contrast curves, luminance-weighted grayscale, and radial-gradient lighting simulation. No image is regenerated from scratch; the same artwork is reinterpreted, not replaced.

More complex transformations (era, mood) use a hybrid approach: an algorithmic approximation runs now, with a documented, clearly separated seam in `src/lib/aiTransformation.ts` for an optional AI-assisted reinterpretation step.

## Features

- Upload a painting (drag-and-drop or file picker)
- Choose one or more transformations: palette, lighting, mood, era, color temperature, contrast, saturation
- Interactive before/after comparison slider
- Transformation history — step back through previous versions
- Download the result as a PNG

## Project structure

```
src/
  components/
    ImageUploader.tsx
    TransformationControls.tsx
    ArtworkCanvas.tsx
    BeforeAfterSlider.tsx
    TransformationHistory.tsx
    LandingPage.tsx
    Workspace.tsx
  lib/
    imageProcessing.ts       # pixel/canvas utilities
    colorTransformations.ts  # palette, temperature, saturation, monochrome (algorithmic)
    lightingEffects.ts       # brightness/contrast/vignette lighting simulation (algorithmic)
    aiTransformation.ts      # era/mood approximation + documented AI seam (hybrid)
    pipeline.ts              # composes all of the above per user selection
  types/
    index.ts
```

## Running it locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes to Pages automatically on every push to `main`.

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under "Build and deployment," set **Source** to **GitHub Actions**
4. Push to `main` (or re-run the workflow) — your site will be live at `https://<your-username>.github.io/painted-differently/`

If you rename the repository, update `base` in `vite.config.ts` to match.

## Tech

React, TypeScript, Tailwind CSS, Canvas API, Vite.
