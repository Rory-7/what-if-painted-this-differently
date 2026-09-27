export type PaletteKey =
  | "original"
  | "renaissance"
  | "impressionist"
  | "monochrome"
  | "earthtones"
  | "pastel";

export type LightingKey = "none" | "soft" | "dramatic" | "goldenhour" | "lowlight";

export type MoodKey = "none" | "calm" | "melancholic" | "mysterious" | "joyful" | "tense";

export type EraKey = "none" | "renaissance" | "baroque" | "impressionism" | "modern" | "futuristic";

export interface TransformParams {
  palette: PaletteKey;
  lighting: LightingKey;
  mood: MoodKey;
  era: EraKey;
  temperature: number; // -100 (cold) .. +100 (warm)
  contrast: number; // -100 .. +100
  saturation: number; // -100 (grayscale) .. +100 (vivid)
}

export interface HistoryEntry {
  label: string;
  params: TransformParams;
  src: string; // data URL
}
