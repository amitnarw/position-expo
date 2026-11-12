export type Point = [number, number];

/**
 * A figure is described by its centre line only. Widths are derived from
 * body proportions, so poses stay readable without hand-tuned outlines.
 *
 * Coordinates live in the pose's own space; see `poseToScene` for framing.
 */
export type Figure = {
  tone: 'ink' | 'clay';
  depth: 'front' | 'back';
  /** Head centre. */
  head: Point;
  /** Centre of the shoulder line. */
  shoulders: Point;
  /** Sternum. Optional, defaults to a point between shoulders and hip. */
  chest?: Point;
  /** Centre of the hip line. */
  hip: Point;
  /** Elbow and wrist of the first arm. The shoulder is chosen automatically. */
  armA?: [Point, Point];
  armB?: [Point, Point];
  /** Knee and ankle of the first leg. */
  legA?: [Point, Point];
  legB?: [Point, Point];
  /** Full widths, in pose units. */
  widths?: { shoulder?: number; chest?: number; hip?: number };
};

export type Pose = {
  id: string;
  figures: Figure[];
  /** Extra breathing room around the fitted silhouette, in fitted units. */
  padding?: number;
};

const DEFAULT_SHOULDER = 100;
const DEFAULT_CHEST = 74;
const DEFAULT_HIP = 92;

const r2 = (value: number) => Math.round(value * 100) / 100;

function quadWidth(widths: [number, number, number], t: number) {
  const u = 1 - t;
  return u * u * widths[0] + 2 * u * t * widths[1] + t * t * widths[2];
}

/** Samples a Catmull-Rom spline through the given points. */
export function splineSamples(points: Point[], perSegment = 16): Point[] {
  if (points.length < 2) return points.slice();
  const padded: Point[] = [points[0], ...points, points[points.length - 1]];
  const out: Point[] = [];

  for (let i = 1; i < padded.length - 2; i += 1) {
    const [x0, y0] = padded[i - 1];
    const [x1, y1] = padded[i];
    const [x2, y2] = padded[i + 1];
    const [x3, y3] = padded[i + 2];
    const last = i === padded.length - 3;
    const steps = last ? perSegment : perSegment - 1;

    for (let s = 0; s <= steps; s += 1) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 *
          (2 * x1 + (-x0 + x2) * t + (2 * x0 - 5 * x1 + 4 * x2 - x3) * t2 + (-x0 + 3 * x1 - 3 * x2 + x3) * t3),
        0.5 *
          (2 * y1 + (-y0 + y2) * t + (2 * y0 - 5 * y1 + 4 * y2 - y3) * t2 + (-y0 + 3 * y1 - 3 * y2 + y3) * t3),
      ]);
    }
  }

  return out;
}

/**
 * A closed, tapered ribbon along a spline — the basic mass of every limb and
 * torso. `widths` are full widths at the start, middle and end.
 *
 * With `capStart: false` the near end is left open, so it can be tucked inside
 * a torso without its end cap showing through the outline.
 */
export function ribbonPath(
  points: Point[],
  widths: [number, number, number],
  capStart = true,
): string {
  const samples = splineSamples(points);
  if (samples.length < 2) return '';

  const count = samples.length;
  const cumulative = new Array<number>(count).fill(0);
  for (let i = 1; i < count; i += 1) {
    cumulative[i] =
      cumulative[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]);
  }
  const total = cumulative[count - 1] || 1;

  const left: Point[] = [];
  const right: Point[] = [];
  const radii: number[] = [];
  const tangents: Point[] = [];

  for (let i = 0; i < count; i += 1) {
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(count - 1, i + 1)];
    let tx = next[0] - prev[0];
    let ty = next[1] - prev[1];
    const length = Math.hypot(tx, ty) || 1;
    tx /= length;
    ty /= length;

    const h = quadWidth(widths, cumulative[i] / total) / 2;
    radii.push(h);
    tangents.push([tx, ty]);
    left.push([samples[i][0] - ty * h, samples[i][1] + tx * h]);
    right.push([samples[i][0] + ty * h, samples[i][1] - tx * h]);
  }

  const first = samples[0];
  const last = samples[count - 1];
  const [t0x, t0y] = tangents[0];
  const [tnx, tny] = tangents[count - 1];

  let d = `M ${r2(left[0][0])} ${r2(left[0][1])}`;
  for (let i = 1; i < count; i += 1) {
    d += ` L ${r2(left[i][0])} ${r2(left[i][1])}`;
  }
  // Rounded cap at the far end.
  d += ` Q ${r2(last[0] + tnx * radii[count - 1])} ${r2(last[1] + tny * radii[count - 1])} ${r2(
    right[count - 1][0],
  )} ${r2(right[count - 1][1])}`;
  for (let i = count - 2; i >= 0; i -= 1) {
    d += ` L ${r2(right[i][0])} ${r2(right[i][1])}`;
  }
  if (!capStart) return d;

  // Rounded cap at the near end.
  d += ` Q ${r2(first[0] - t0x * radii[0])} ${r2(first[1] - t0y * radii[0])} ${r2(left[0][0])} ${r2(
    left[0][1],
  )} Z`;

  return d;
}

export function ellipsePath(
  center: Point,
  rx: number,
  ry: number,
  angle = 0,
): string {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const ax = center[0] - rx * cos;
  const ay = center[1] - rx * sin;
  const bx = center[0] + rx * cos;
  const by = center[1] + rx * sin;
  const deg = (angle * 180) / Math.PI;

  return `M ${r2(ax)} ${r2(ay)} A ${r2(rx)} ${r2(ry)} ${r2(deg)} 1 0 ${r2(bx)} ${r2(by)} A ${r2(
    rx,
  )} ${r2(ry)} ${r2(deg)} 1 0 ${r2(ax)} ${r2(ay)} Z`;
}

function unit(a: Point, b: Point): Point {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy) || 1;
  return [dx / length, dy / length];
}

function distance(a: Point, b: Point) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/**
 * Builds every filled shape of a figure. `pad` grows all widths, which is how
 * the paper halo behind each body is produced.
 */
export function figureShapes(figure: Figure, pad = 0): string[] {
  const shoulder = figure.widths?.shoulder ?? DEFAULT_SHOULDER;
  const chest = figure.widths?.chest ?? DEFAULT_CHEST;
  const hip = figure.widths?.hip ?? DEFAULT_HIP;
  const k = shoulder / DEFAULT_SHOULDER;

  const spineUnit = unit(figure.hip, figure.shoulders);
  const normal: Point = [-spineUnit[1], spineUnit[0]];

  const shoulderAnchor = (side: 1 | -1): Point => [
    figure.shoulders[0] + normal[0] * side * shoulder * 0.4,
    figure.shoulders[1] + normal[1] * side * shoulder * 0.4,
  ];
  const hipAnchor = (side: 1 | -1): Point => [
    figure.hip[0] + normal[0] * side * hip * 0.33,
    figure.hip[1] + normal[1] * side * hip * 0.33,
  ];

  const anchors: [Point, Point] = [shoulderAnchor(1), shoulderAnchor(-1)];
  const hips: [Point, Point] = [hipAnchor(1), hipAnchor(-1)];

  const shapes: string[] = [];

  const limb = (
    chain: [Point, Point] | undefined,
    from: Point,
    toward: Point,
    widths: [number, number, number],
  ) => {
    if (!chain) return null;
    // Tuck the root inside the torso so its open end never shows.
    const root: Point = [from[0] + (toward[0] - from[0]) * 0.34, from[1] + (toward[1] - from[1]) * 0.34];
    return ribbonPath(
      [root, chain[0], chain[1]],
      [widths[0] * k + pad, widths[1] * k + pad, widths[2] * k + pad],
      false,
    );
  };

  // Legs sit behind the torso mass.
  const legs: ([Point, Point] | undefined)[] = [figure.legA, figure.legB];
  const usedHips = new Set<number>();
  for (const leg of legs) {
    if (!leg) continue;
    const options = [0, 1].filter((index) => !usedHips.has(index));
    const index =
      options.length === 1
        ? options[0]
        : distance(leg[0], hips[0]) <= distance(leg[0], hips[1])
          ? 0
          : 1;
    usedHips.add(index);
    const path = limb(leg, hips[index], figure.hip, [43, 32, 20]);
    if (path) shapes.push(path);
  }

  // Torso.
  const chestPoint: Point = figure.chest ?? [
    (figure.shoulders[0] + figure.hip[0]) / 2,
    (figure.shoulders[1] + figure.hip[1]) / 2,
  ];
  shapes.push(
    ribbonPath([figure.shoulders, chestPoint, figure.hip], [
      shoulder + pad,
      chest + pad,
      hip + pad,
    ]),
  );

  // Neck, mostly swallowed by the head and shoulders.
  const headDistance = distance(figure.shoulders, figure.head);
  const neckEnd: Point = [
    figure.shoulders[0] + unit(figure.shoulders, figure.head)[0] * Math.min(headDistance * 0.62, 74 * k),
    figure.shoulders[1] + unit(figure.shoulders, figure.head)[1] * Math.min(headDistance * 0.62, 74 * k),
  ];
  shapes.push(
    ribbonPath([figure.shoulders, neckEnd], [40 * k + pad, 34 * k + pad, 34 * k + pad], false),
  );

  // Arms sit in front of the torso mass.
  const arms: ([Point, Point] | undefined)[] = [figure.armA, figure.armB];
  const usedShoulders = new Set<number>();
  for (const arm of arms) {
    if (!arm) continue;
    const options = [0, 1].filter((index) => !usedShoulders.has(index));
    const index =
      options.length === 1
        ? options[0]
        : distance(arm[0], anchors[0]) <= distance(arm[0], anchors[1])
          ? 0
          : 1;
    usedShoulders.add(index);
    const path = limb(arm, anchors[index], figure.shoulders, [30, 23, 16]);
    if (path) shapes.push(path);
  }

  // Head.
  const tilt = Math.atan2(figure.head[1] - figure.shoulders[1], figure.head[0] - figure.shoulders[0]) + Math.PI / 2;
  shapes.push(ellipsePath(figure.head, 33 * k + pad / 2, 39 * k + pad / 2, tilt));

  return shapes;
}

function bounds(figure: Figure): { minX: number; minY: number; maxX: number; maxY: number } {
  const points: Point[] = [figure.head, figure.shoulders, figure.hip];
  if (figure.chest) points.push(figure.chest);
  for (const chain of [figure.armA, figure.armB, figure.legA, figure.legB]) {
    if (chain) points.push(chain[0], chain[1]);
  }

  const shoulder = figure.widths?.shoulder ?? DEFAULT_SHOULDER;
  const margin = shoulder * 0.42 + 42;

  return points.reduce(
    (box, point) => ({
      minX: Math.min(box.minX, point[0] - margin),
      minY: Math.min(box.minY, point[1] - margin),
      maxX: Math.max(box.maxX, point[0] + margin),
      maxY: Math.max(box.maxY, point[1] + margin),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

export type SceneFigure = {
  tone: 'ink' | 'clay';
  depth: 'front' | 'back';
  /** Widened shapes used to knock out whatever sits behind this body. */
  halo: string[];
  /** Shapes at true width, in painting order. */
  body: string[];
};

export type Scene = {
  figures: SceneFigure[];
  /** Nominal square the scene was fitted into. */
  size: number;
};

/**
 * Fits a pose into a square and returns paintable path data. No renderer
 * specific types, so the same scene drives SVG previews and Skia.
 */
export function poseToScene(pose: Pose, size = 1000): Scene {
  const boxes = pose.figures.map(bounds);
  const box = boxes.reduce(
    (acc, next) => ({
      minX: Math.min(acc.minX, next.minX),
      minY: Math.min(acc.minY, next.minY),
      maxX: Math.max(acc.maxX, next.maxX),
      maxY: Math.max(acc.maxY, next.maxY),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;
  const padding = (pose.padding ?? 40) * 2;
  const scale = (size - padding) / Math.max(width, height);
  const offsetX = (size - width * scale) / 2 - box.minX * scale;
  const offsetY = (size - height * scale) / 2 - box.minY * scale;

  const order = [...pose.figures].sort((a, b) => (a.depth === 'back' ? -1 : 1) - (b.depth === 'back' ? -1 : 1));

  const figures: SceneFigure[] = [];
  const halo = Math.max(8, 13 * scale);

  for (const figure of order) {
    const map = (point: Point): Point => [point[0] * scale + offsetX, point[1] * scale + offsetY];
    const mapped: Figure = {
      ...figure,
      head: map(figure.head),
      shoulders: map(figure.shoulders),
      chest: figure.chest ? map(figure.chest) : undefined,
      hip: map(figure.hip),
      armA: figure.armA ? [map(figure.armA[0]), map(figure.armA[1])] : undefined,
      armB: figure.armB ? [map(figure.armB[0]), map(figure.armB[1])] : undefined,
      legA: figure.legA ? [map(figure.legA[0]), map(figure.legA[1])] : undefined,
      legB: figure.legB ? [map(figure.legB[0]), map(figure.legB[1])] : undefined,
      widths: figure.widths
        ? {
            shoulder: (figure.widths.shoulder ?? DEFAULT_SHOULDER) * scale,
            chest: (figure.widths.chest ?? DEFAULT_CHEST) * scale,
            hip: (figure.widths.hip ?? DEFAULT_HIP) * scale,
          }
        : {
            shoulder: DEFAULT_SHOULDER * scale,
            chest: DEFAULT_CHEST * scale,
            hip: DEFAULT_HIP * scale,
          },
    };

    figures.push({
      tone: figure.tone,
      depth: figure.depth,
      halo: figureShapes(mapped, halo),
      body: figureShapes(mapped, 0),
    });
  }

  return { figures, size };
}
