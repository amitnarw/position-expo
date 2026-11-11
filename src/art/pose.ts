import type { Point } from './geometry';

export type Tone = 'ink' | 'accent';
export type Depth = 'front' | 'back';

export type Limb = [Point, Point, Point];

export type Figure = {
  /** [head, neck, chest, pelvis] */
  spine: [Point, Point, Point, Point];
  arm?: Limb;
  leg?: Limb;
  arm2?: Limb;
  leg2?: Limb;
  tone: Tone;
  depth: Depth;
  headRadius?: number;
};

export type Pose = {
  id: string;
  figures: Figure[];
  framing?: {
    scale?: number;
    x?: number;
    y?: number;
  };
};

export function figureChains(figure: Figure): Point[][] {
  'worklet';
  const chains: Point[][] = [figure.spine.slice(1)];
  if (figure.arm) chains.push(figure.arm);
  if (figure.arm2) chains.push(figure.arm2);
  if (figure.leg) chains.push(figure.leg);
  if (figure.leg2) chains.push(figure.leg2);
  return chains;
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  'worklet';
  if (a.figures.length !== b.figures.length) return a;

  const figures = a.figures.map((figureA, index) => {
    const figureB = b.figures[index];
    const hasArm = Boolean(figureA.arm && figureB.arm);
    const hasLeg = Boolean(figureA.leg && figureB.leg);
    const hasArm2 = Boolean(figureA.arm2 && figureB.arm2);
    const hasLeg2 = Boolean(figureA.leg2 && figureB.leg2);

    const mix = (chainA: Point[], chainB: Point[]): Point[] =>
      chainA.map((point, i) => [
        point[0] + ((chainB[i]?.[0] ?? point[0]) - point[0]) * t,
        point[1] + ((chainB[i]?.[1] ?? point[1]) - point[1]) * t,
      ]);

    return {
      ...figureA,
      spine: mix(figureA.spine, figureB.spine) as [Point, Point, Point, Point],
      arm: hasArm ? (mix(figureA.arm!, figureB.arm!) as Limb) : figureA.arm,
      leg: hasLeg ? (mix(figureA.leg!, figureB.leg!) as Limb) : figureA.leg,
      arm2: hasArm2 ? (mix(figureA.arm2!, figureB.arm2!) as Limb) : figureA.arm2,
      leg2: hasLeg2 ? (mix(figureA.leg2!, figureB.leg2!) as Limb) : figureA.leg2,
    };
  });

  return { ...a, figures };
}

/** Pose authored in a 1000 x 1000 coordinate space. */
export type PoseMap = Record<string, Pose>;
