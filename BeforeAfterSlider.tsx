import React, { useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  originalSrc: string;
  transformedSrc: string;
}

/**
 * BeforeAfterSlider
 * A draggable comparison slider between the original and transformed
 * artwork. Works with both mouse and touch input.
 */
export default function BeforeAfterSlider({ originalSrc, transformedSrc }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden bg-[#EDE9E0]"
      style={{ touchAction: "none" }}
      onMouseDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        updateFromClientX(e.touches[0].clientX);
      }}
    >
      <img
        src={transformedSrc}
        alt="Transformed"
        className="w-full h-auto block pointer-events-none"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img src={originalSrc} alt="Original" className="w-full h-auto block" draggable={false} />
      </div>
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, width: 1, background: "#F7F5F0" }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-cream border border-ink">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1B19" strokeWidth={1.6}>
            <path d="M8 8l-5 4 5 4M16 8l5 4-5 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <span className="absolute top-3 left-3 px-2 py-1 text-xs font-sans text-cream" style={{ background: "rgba(28,27,25,0.72)" }}>
        Original
      </span>
      <span className="absolute top-3 right-3 px-2 py-1 text-xs font-sans text-cream" style={{ background: "rgba(28,27,25,0.72)" }}>
        Transformed
      </span>
    </div>
  );
}
