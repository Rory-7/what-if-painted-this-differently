
# What If I Painted This Differently?

An interactive art-tech lab that reinterprets a painting under different visual constraints — palette, lighting, contrast, mood, era, and color temperature — while preserving its original composition and structure.

**[Live demo](https://your-username.github.io/painted-differently/)**

## How it works

Most transformations are real, deterministic pixel processing done in the browser with the Canvas API — HSL-based palette remapping, contrast curves, luminance-weighted grayscale, and radial-gradient lighting simulation. No image is regenerated from scratch; the same artwork is reinterpreted, not replaced.

More complex transformations (era, mood) use a hybrid approach: an algorithmic approximation runs now, with a documented, clearly separated seam in the code for an optional AI-assisted reinterpretation step.

## Features

- Upload a painting (drag-and-drop or file picker)
- Choose one or more transformations: palette, lighting, mood, era, color temperature, contrast, saturation
- Interactive before/after comparison slider
- Transformation history — step back through previous versions
- Download the result as a PNG

## Running it

This is a single static HTML file — no build step, no server required.

1. Clone the repo
2. Open `index.html` in your browser

Or visit the live demo link above.

## Tech

React (via CDN) + Canvas API, all in one HTML file for easy hosting on GitHub Pages.
