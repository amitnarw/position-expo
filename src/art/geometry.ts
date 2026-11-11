export type Point = [number, number];

export type CurveSegment = {
  c1: Point;
  c2: Point;
  to: Point;
};

/** Catmull-Rom spline converted to cubic bezier segments. */
export function splineSegments(points: Point[]): CurveSegment[] {
  'worklet';
  if (points.length < 2) return [];

  const padded: Point[] = [points[0], ...points, points[points.length - 1]];
  const segments: CurveSegment[] = [];

  for (let i = 1; i < padded.length - 2; i += 1) {
    const p0 = padded[i - 1];
    const p1 = padded[i];
    const p2 = padded[i + 1];
    const p3 = padded[i + 2];

    segments.push({
      c1: [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      c2: [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      to: [p2[0], p2[1]],
    });
  }

  return segments;
}

export function chainToSvg(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;

  const segments = splineSegments(points);
  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (const segment of segments) {
    d += ` C ${segment.c1[0]} ${segment.c1[1]}, ${segment.c2[0]} ${segment.c2[1]}, ${segment.to[0]} ${segment.to[1]}`;
  }

  return d;
}

export function chainsToSvg(chains: Point[][]): string {
  return chains
    .filter((chain) => chain.length > 0)
    .map(chainToSvg)
    .join(' ');
}

export function lerpPoint(a: Point, b: Point, t: number): Point {
  'worklet';
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function lerpChain(a: Point[], b: Point[], t: number): Point[] {
  'worklet';
  return a.map((point, index) => lerpPoint(point, b[index] ?? point, t));
}

export function distance(a: Point, b: Point) {
  'worklet';
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(max, Math.max(min, value));
}
