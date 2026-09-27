import React from "react";

interface ArtworkCanvasProps {
  label: string;
  src: string;
  alt: string;
}

/**
 * ArtworkCanvas
 * A framed display panel for a single artwork state (original or
 * transformed). The actual pixel processing happens on an off-screen
 * <canvas> in Workspace.tsx — this component just displays the resulting
 * image (as a data URL) inside the gallery-style frame.
 */
export default function ArtworkCanvas({ label, src, alt }: ArtworkCanvasProps) {
  return (
    <div>
      <p className="font-sans text-bronze text-xs tracking-wide mb-3">{label}</p>
      <div className="border border-line">
        <img src={src} alt={alt} className="w-full h-auto block" />
      </div>
    </div>
  );
}
