import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { poseToScene } from '../src/art/body.ts';
import { poses } from '../src/art/poses.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'design', 'brand');
mkdirSync(out, { recursive: true });

const paper = '#F7F2EA';
const ink = '#171310';
const clay = '#B25E45';
const fontFile = join(root, 'node_modules/@expo-google-fonts/fraunces/600SemiBold/Fraunces_600SemiBold.ttf');

function render(name, svg, width = 512) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: [fontFile], loadSystemFonts: false, defaultFontFamily: 'Fraunces' },
  })
    .render()
    .asPng();
  writeFileSync(join(out, name), png);
}

const frame = (inner, background = paper) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="${background}" />
    ${inner}
  </svg>`;

// A — editorial stamp: open ring, clay marker, serif F.
const arc = (cx, cy, r, from, to) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(from));
  const y1 = cy + r * Math.sin(rad(from));
  const x2 = cx + r * Math.cos(rad(to));
  const y2 = cy + r * Math.sin(rad(to));
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

const a = frame(`
  <path d="${arc(512, 512, 342, -68, -112 + 360)}" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round" />
  <circle cx="512" cy="170" r="24" fill="${clay}" />
  <text x="512" y="716" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="560" fill="${ink}">F</text>
`);

// B — two facing arcs, one space.
const b = frame(`
  <path d="${arc(512, 512, 300, 118, 242)}" fill="none" stroke="${ink}" stroke-width="26" stroke-linecap="round" />
  <path d="${arc(512, 512, 300, -62, 62)}" fill="none" stroke="${clay}" stroke-width="26" stroke-linecap="round" />
  <circle cx="512" cy="512" r="20" fill="${clay}" />
`);

// C — an actual plate, heavy strokes.
const scene = poseToScene(poses['the-hush'], 1000);
const bodies = scene.figures
  .map(
    (figure) =>
      figure.halo.map((d) => `<path d="${d}" fill="${paper}" />`).join('') +
      figure.body
        .map(
          (d) =>
            `<path d="${d}" fill="${paper}" stroke="${figure.tone === 'clay' ? clay : ink}" stroke-width="11" stroke-linejoin="round" />`,
        )
        .join(''),
  )
  .join('');
const c = frame(`<g transform="translate(102 102) scale(0.8)">${bodies}</g>`);

render('icon-a.png', a);
render('icon-b.png', b);
render('icon-c.png', c);
console.log(`Wrote icon options to ${out}`);
