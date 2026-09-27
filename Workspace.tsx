import React, { useCallback, useEffect, useRef, useState } from "react";
import ArtworkCanvas from "./ArtworkCanvas";
import TransformationControls from "./TransformationControls";
import TransformationHistory from "./TransformationHistory";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { imageToImageData, paintToCanvas } from "../lib/imageProcessing";
import { runFullPipeline } from "../lib/pipeline";
import {
  PALETTE_LABELS,
  LIGHTING_LABELS,
  MOOD_LABELS,
  ERA_LABELS,
} from "./TransformationControls";
import type { TransformParams, HistoryEntry } from "../types";

interface WorkspaceProps {
  originalImg: HTMLImageElement;
  originalSrc: string;
  onReset: () => void;
}

const DEFAULT_PARAMS: TransformParams = {
  palette: "original",
  lighting: "none",
  mood: "none",
  era: "none",
  temperature: 0,
  contrast: 0,
  saturation: 0,
};

function describeParams(params: TransformParams): string {
  const parts: string[] = [];
  if (params.era !== "none") parts.push(ERA_LABELS[params.era]);
  else if (params.palette !== "original") parts.push(PALETTE_LABELS[params.palette]);
  if (params.mood !== "none") parts.push(MOOD_LABELS[params.mood]);
  if (params.lighting !== "none") parts.push(LIGHTING_LABELS[params.lighting]);
  if (params.temperature !== 0) parts.push(params.temperature > 0 ? "Warmer" : "Cooler");
  if (params.contrast !== 0) parts.push(params.contrast > 0 ? "High Contrast" : "Low Contrast");
  if (params.saturation !== 0) parts.push(params.saturation > 0 ? "Saturated" : "Desaturated");
  return parts.length ? parts.join(" + ") : "Original";
}

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
      <path d="M19 12H5M5 12l6-6M5 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} {...props}>
      <path d="M12 4v12M12 16l-4.5-4.5M12 16l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Workspace
 * The three-column transformation screen: original artwork, control surface,
 * and the transformed result, plus history and the before/after comparison.
 * Owns the off-screen <canvas> where all pixel processing actually happens.
 */
export default function Workspace({ originalImg, originalSrc, onReset }: WorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageDataRef = useRef<ImageData | null>(null);

  const [params, setParams] = useState<TransformParams>(DEFAULT_PARAMS);
  const [transformedSrc, setTransformedSrc] = useState(originalSrc);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([
    { label: "Original", params: DEFAULT_PARAMS, src: originalSrc },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      baseImageDataRef.current = imageToImageData(originalImg);
    } catch {
      setError("This image could not be read for processing. Try a different file.");
    }
  }, [originalImg]);

  const updateParam = <K extends keyof TransformParams>(key: K, value: TransformParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handleTransform = useCallback(() => {
    if (!baseImageDataRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    setError(null);

    // Yield to the event loop so the "Transforming…" state paints before the
    // synchronous, potentially heavy pixel processing blocks the main thread.
    setTimeout(() => {
      try {
        const result = runFullPipeline(baseImageDataRef.current!, params);
        paintToCanvas(canvasRef.current!, result);
        const dataUrl = canvasRef.current!.toDataURL("image/png");
        setTransformedSrc(dataUrl);

        const entry: HistoryEntry = { label: describeParams(params), params: { ...params }, src: dataUrl };
        setHistory((h) => [...h.slice(0, activeIndex + 1), entry]);
        setActiveIndex((i) => i + 1);
      } catch {
        setError("Something went wrong while transforming this artwork. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }, 30);
  }, [params, activeIndex]);

  const handleSelectHistory = (i: number) => {
    setActiveIndex(i);
    setTransformedSrc(history[i].src);
    setParams(history[i].params);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = transformedSrc;
    a.download = "painted-differently.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 pb-6 flex items-center justify-between flex-wrap gap-4">
        <button onClick={onReset} className="inline-flex items-center gap-2 text-sm font-sans text-body">
          <IconArrowLeft className="w-4 h-4" />
          New painting
        </button>
        <h1 className="font-display text-ink font-normal text-xl hidden sm:block">
          What If I Painted This Differently?
        </h1>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans text-ink border border-ink"
        >
          <IconDownload className="w-4 h-4" />
          Download
        </button>
      </header>

      {error && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-4">
          <div className="px-4 py-3 text-sm font-sans" style={{ background: "#FBEFE9", color: "#8A3B24" }}>
            {error}
          </div>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 pb-16 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3 order-1">
          <ArtworkCanvas label="Original" src={originalSrc} alt="Original artwork" />
        </div>

        <div className="md:col-span-6 order-3 md:order-2">
          <TransformationControls
            params={params}
            onChange={updateParam}
            onTransform={handleTransform}
            isProcessing={isProcessing}
          />
          <div className="mt-8">
            <TransformationHistory history={history} activeIndex={activeIndex} onSelect={handleSelectHistory} />
          </div>
        </div>

        <div className="md:col-span-3 order-2 md:order-3">
          <ArtworkCanvas label="Transformed" src={transformedSrc} alt="Transformed artwork" />
        </div>
      </main>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20">
        <p className="font-sans text-bronze text-xs tracking-wide mb-3">Compare</p>
        <BeforeAfterSlider originalSrc={originalSrc} transformedSrc={transformedSrc} />
      </section>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
