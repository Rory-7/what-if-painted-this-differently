import React from "react";
import type { TransformParams, PaletteKey, LightingKey, MoodKey, EraKey } from "../types";

export const PALETTE_LABELS: Record<PaletteKey, string> = {
  original: "Original",
  renaissance: "Renaissance",
  impressionist: "Impressionist",
  monochrome: "Monochrome",
  earthtones: "Earth Tones",
  pastel: "Pastel",
};

export const PALETTE_SWATCHES: Record<PaletteKey, string> = {
  original: "#C9C3B6",
  renaissance: "#B5722E",
  impressionist: "#7C93B8",
  monochrome: "#8A8A8A",
  earthtones: "#9C7B4F",
  pastel: "#E7C9D6",
};

export const LIGHTING_LABELS: Record<LightingKey, string> = {
  none: "None",
  soft: "Soft",
  dramatic: "Dramatic",
  goldenhour: "Golden Hour",
  lowlight: "Low Light",
};

export const MOOD_LABELS: Record<MoodKey, string> = {
  none: "None",
  calm: "Calm",
  melancholic: "Melancholic",
  mysterious: "Mysterious",
  joyful: "Joyful",
  tense: "Tense",
};

export const ERA_LABELS: Record<EraKey, string> = {
  none: "None",
  renaissance: "Renaissance",
  baroque: "Baroque",
  impressionism: "Impressionism",
  modern: "Modern",
  futuristic: "Futuristic",
};

interface OptionCardProps {
  label: string;
  active: boolean;
  onClick: () => void;
  swatch?: string;
}

function OptionCard({ label, active, onClick, swatch }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 border"
      style={{
        borderColor: active ? "#1C1B19" : "#E4E0D6",
        background: active ? "#1C1B19" : "transparent",
      }}
    >
      {swatch && (
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ background: swatch, border: "1px solid rgba(0,0,0,0.15)" }}
        />
      )}
      <span className="font-sans text-sm" style={{ color: active ? "#F7F5F0" : "#1C1B19" }}>
        {label}
      </span>
    </button>
  );
}

interface LabeledSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function LabeledSlider({ label, leftLabel, rightLabel, value, onChange, min = -100, max = 100 }: LabeledSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-sans text-ink text-sm font-medium">{label}</span>
        <span className="font-sans text-muted text-xs">{value > 0 ? `+${value}` : value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="flex justify-between mt-1">
        <span className="font-sans text-muted text-xs">{leftLabel}</span>
        <span className="font-sans text-muted text-xs">{rightLabel}</span>
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-ink font-medium text-lg mb-3">{title}</h3>
      {hint && <p className="font-sans text-muted text-xs -mt-2 mb-3">{hint}</p>}
      {children}
    </div>
  );
}

interface TransformationControlsProps {
  params: TransformParams;
  onChange: <K extends keyof TransformParams>(key: K, value: TransformParams[K]) => void;
  onTransform: () => void;
  isProcessing: boolean;
}

/**
 * TransformationControls
 * The full control surface: palette, lighting, mood, era selectable cards,
 * plus the three fine-tuning sliders, and the Transform button.
 */
export default function TransformationControls({
  params,
  onChange,
  onTransform,
  isProcessing,
}: TransformationControlsProps) {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Palette">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(PALETTE_LABELS) as PaletteKey[]).map((key) => (
            <OptionCard
              key={key}
              label={PALETTE_LABELS[key]}
              swatch={PALETTE_SWATCHES[key]}
              active={params.palette === key}
              onClick={() => onChange("palette", key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Lighting">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(LIGHTING_LABELS) as LightingKey[])
            .filter((k) => k !== "none")
            .map((key) => (
              <OptionCard
                key={key}
                label={LIGHTING_LABELS[key]}
                active={params.lighting === key}
                onClick={() => onChange("lighting", params.lighting === key ? "none" : key)}
              />
            ))}
        </div>
      </Section>

      <Section title="Mood">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(MOOD_LABELS) as MoodKey[])
            .filter((k) => k !== "none")
            .map((key) => (
              <OptionCard
                key={key}
                label={MOOD_LABELS[key]}
                active={params.mood === key}
                onClick={() => onChange("mood", params.mood === key ? "none" : key)}
              />
            ))}
        </div>
      </Section>

      <Section
        title="Era"
        hint="Hybrid: algorithmic approximation shown now — the AI-reinterpretation seam is documented in src/lib/aiTransformation.ts"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(ERA_LABELS) as EraKey[])
            .filter((k) => k !== "none")
            .map((key) => (
              <OptionCard
                key={key}
                label={ERA_LABELS[key]}
                active={params.era === key}
                onClick={() => onChange("era", params.era === key ? "none" : key)}
              />
            ))}
        </div>
      </Section>

      <Section title="Fine Tuning">
        <div className="flex flex-col gap-6">
          <LabeledSlider
            label="Color Temperature"
            leftLabel="Cold"
            rightLabel="Warm"
            value={params.temperature}
            onChange={(v) => onChange("temperature", v)}
          />
          <LabeledSlider
            label="Contrast"
            leftLabel="Low"
            rightLabel="High"
            value={params.contrast}
            onChange={(v) => onChange("contrast", v)}
          />
          <LabeledSlider
            label="Saturation"
            leftLabel="Muted"
            rightLabel="Vivid"
            value={params.saturation}
            onChange={(v) => onChange("saturation", v)}
          />
        </div>
      </Section>

      <button
        onClick={onTransform}
        disabled={isProcessing}
        className="w-full py-4 text-sm font-medium font-sans text-cream transition-colors duration-200"
        style={{
          background: isProcessing ? "#C9C3B6" : "#B54B3A",
          cursor: isProcessing ? "default" : "pointer",
        }}
      >
        {isProcessing ? "Transforming…" : "Transform"}
      </button>
    </div>
  );
}
