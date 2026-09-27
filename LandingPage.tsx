import React from "react";
import ImageUploader from "./ImageUploader";

interface LandingPageProps {
  onUpload: (file: File) => void;
}

function ExampleStrip() {
  const steps = [
    { label: "Original", css: "linear-gradient(135deg,#6b5a4a,#8f7a5e,#4a4038,#a68b6a)", desaturate: false },
    { label: "Warm Renaissance", css: "linear-gradient(135deg,#8a5a2e,#c98a3e,#5c2f1f,#e0a856)", desaturate: false },
    { label: "Cold Monochrome", css: "linear-gradient(135deg,#4a4a4a,#8a8a8a,#2a2a2a,#b0b0b0)", desaturate: true },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col gap-3">
          <div
            className="aspect-[4/5] w-full"
            style={{ background: s.css, filter: s.desaturate ? "saturate(0)" : "none" }}
          />
          <span className="font-sans text-body text-xs md:text-sm">
            {i === 0 ? "" : "→ "}
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * LandingPage
 * The entry screen: hero headline, upload affordances, a static illustrative
 * example strip, and a short "how it works" explainer.
 */
export default function LandingPage({ onUpload }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="max-w-6xl mx-auto px-6 md:px-10 pt-10 pb-4 flex items-center justify-between">
        <span className="font-sans text-sm text-bronze tracking-wide">A Digital Art Laboratory</span>
        <span className="font-sans text-sm text-ink opacity-50 hidden sm:block">No. 001</span>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10">
        <section className="pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <h1 className="font-display text-ink font-normal leading-[1.04] tracking-tight text-5xl sm:text-6xl md:text-7xl">
              What if I painted
              <br />
              this differently?
            </h1>
            <p className="font-sans text-body mt-7 text-lg md:text-xl max-w-md leading-relaxed">
              Explore how one artwork changes when you change the rules.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <ImageUploader onUpload={onUpload} />
          </div>
        </section>

        <section className="pb-28">
          <p className="font-sans text-sm text-bronze tracking-wide mb-6">An example</p>
          <ExampleStrip />
        </section>

        <section className="pb-28 border-t border-line">
          <div className="pt-14 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h2 className="font-display text-ink font-normal text-3xl">How does it work?</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="font-sans text-body text-base leading-relaxed">
                Some transformations are generated algorithmically by manipulating the artwork's
                color, light, contrast, and temperature — real pixel mathematics, not a filter
                preset. More complex reinterpretations, like a shift in era or emotional mood,
                use a hybrid of controlled image processing with an optional AI-assisted layer.
                The composition, objects, and structure of your original artwork are always
                preserved.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 md:px-10 pb-10">
        <div className="pt-8 border-t border-line flex justify-between flex-wrap gap-2">
          <span className="font-sans text-xs text-muted">Client-side image processing · Canvas API</span>
          <span className="font-sans text-xs text-muted">Your images never leave your browser</span>
        </div>
      </footer>
    </div>
  );
}
