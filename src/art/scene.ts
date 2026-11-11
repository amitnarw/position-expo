import { Skia, type SkPath } from '@shopify/react-native-skia';

import { poseToScene, type SceneFigure } from './body';
import { poses } from './poses';

export type ArtFigure = {
  tone: 'ink' | 'clay';
  depth: 'front' | 'back';
  halo: SkPath[];
  body: SkPath[];
};

const cache = new Map<string, ArtFigure[]>();

function parse(paths: string[]): SkPath[] {
  const out: SkPath[] = [];
  for (const d of paths) {
    const path = Skia.Path.MakeFromSVGString(d);
    if (path) out.push(path);
  }
  return out;
}

function build(figure: SceneFigure): ArtFigure {
  return {
    tone: figure.tone,
    depth: figure.depth,
    halo: parse(figure.halo),
    body: parse(figure.body),
  };
}

/** Skia paths for a pose, built once and reused across every plate. */
export function getArt(poseId: string): ArtFigure[] | null {
  const cached = cache.get(poseId);
  if (cached) return cached;

  const pose = poses[poseId];
  if (!pose) return null;

  const scene = poseToScene(pose);
  const figures = scene.figures.map(build);
  cache.set(poseId, figures);
  return figures;
}

export function hasArt(poseId: string) {
  return Boolean(poses[poseId]);
}

export function poseIds() {
  return Object.keys(poses);
}
