export type Pace = 'slow' | 'steady' | 'playful';

export type Position = {
  slug: string;
  plate: number;
  /** Evocative name shown as the plate title. */
  title: string;
  /** Plain-language name shown beneath it. */
  commonName: string;
  /** Art id in src/art/poses.ts. */
  pose: string;
  summary: string;
  pace: Pace;
  /** 1–5. How much skin-to-skin contact the shape asks for. */
  closeness: number;
  /** 1–5. How much strength or balance it asks for. */
  effort: number;
  setting: string;
  tags: string[];
  setup: string;
  steps: string[];
  why: string;
  tips: string[];
  care: string;
  variations: string[];
  collections: string[];
};

export type GuideBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'steps'; items: { title: string; text: string }[] }
  | { kind: 'note'; title: string; text: string };

export type Guide = {
  slug: string;
  order: number;
  title: string;
  kicker: string;
  summary: string;
  minutes: number;
  topics: string[];
  blocks: GuideBlock[];
};

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  positions: string[];
};
