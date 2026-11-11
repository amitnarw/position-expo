import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { poseToScene } from '../src/art/body.ts';
import { poses } from '../src/art/poses.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, 'design');
mkdirSync(outputDir, { recursive: true });

const palette = {
  paper: '#F7F2EA',
  ink: '#171310',
  clay: '#B25E45',
};

function mix(a, b, t) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const channel = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

const baseColor = (figure) => (figure.tone === 'clay' ? palette.clay : palette.ink);
const toneColor = (figure) =>
  figure.depth === 'back' ? mix(baseColor(figure), palette.paper, 0.3) : baseColor(figure);

function renderSolid(figures) {
  return figures
    .map(
      (figure) =>
        figure.halo.map((d) => `<path d="${d}" fill="${palette.paper}" />`).join('') +
        figure.body.map((d) => `<path d="${d}" fill="${toneColor(figure)}" />`).join(''),
    )
    .join('');
}

function renderOutline(figures) {
  return figures
    .map((figure) => {
      const color = toneColor(figure);
      return (
        figure.halo.map((d) => `<path d="${d}" fill="${palette.paper}" />`).join('') +
        figure.body
          .map(
            (d) =>
              `<path d="${d}" fill="${palette.paper}" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" />`,
          )
          .join('')
      );
    })
    .join('');
}

function renderTint(figures) {
  return figures
    .map((figure) => {
      const color = toneColor(figure);
      const tint = mix(color, palette.paper, figure.depth === 'back' ? 0.94 : 0.88);
      return (
        figure.halo.map((d) => `<path d="${d}" fill="${palette.paper}" />`).join('') +
        figure.body
          .map(
            (d) =>
              `<path d="${d}" fill="${tint}" stroke="${color}" stroke-width="2" stroke-linejoin="round" />`,
          )
          .join('')
      );
    })
    .join('');
}

const renderers = { solid: renderSolid, outline: renderOutline, tint: renderTint };

function sceneSvg(pose, variant, size = 1000) {
  const scene = poseToScene(pose, 1000);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1000 1000">
    <rect width="1000" height="1000" fill="${palette.paper}" />
    ${renderers[variant](scene.figures)}
  </svg>`;
}

function writePng(name, svg, width) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  writeFileSync(join(outputDir, name), png);
}

const entries = Object.values(poses);

for (const variant of Object.keys(renderers)) {
  for (const pose of entries) {
    writePng(`${pose.id}-${variant}.png`, sceneSvg(pose, variant), 1000);
  }

  const cell = 460;
  const columns = Math.min(3, entries.length);
  const perSheet = 12;

  for (let start = 0; start < entries.length; start += perSheet) {
    const chunk = entries.slice(start, start + perSheet);
    const rows = Math.ceil(chunk.length / columns);
    const labelHeight = 40;

    const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${columns * cell}" height="${rows * (cell + labelHeight)}">
    <rect width="100%" height="100%" fill="${palette.paper}" />
    ${chunk
      .map((pose, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const scene = poseToScene(pose, 1000);
        return `<g transform="translate(${column * cell + 20} ${row * (cell + labelHeight) + 20})">
          <g transform="scale(${(cell - 40) / 1000})">
            ${renderers[variant](scene.figures)}
          </g>
          <text x="0" y="${cell + 2}" font-family="Arial, sans-serif" font-size="15" letter-spacing="2.4" fill="${palette.ink}">${pose.id.toUpperCase()}</text>
        </g>`;
      })
      .join('')}
  </svg>`;

    writePng(`pose-sheet-${variant}-${start / perSheet + 1}.png`, sheet, columns * cell);
  }
}

console.log(`Rendered ${entries.length} plates × ${Object.keys(renderers).length} variants`);
