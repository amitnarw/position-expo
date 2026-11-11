import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'assets', 'images');
mkdirSync(assets, { recursive: true });

const fontFile = join(root, 'node_modules/@expo-google-fonts/fraunces/600SemiBold/Fraunces_600SemiBold.ttf');

function arc(cx, cy, r, from, to) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(from));
  const y1 = cy + r * Math.sin(rad(from));
  const x2 = cx + r * Math.cos(rad(to));
  const y2 = cy + r * Math.sin(rad(to));
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** The FORMA mark: a serif F inside an open ring, closed by a clay marker. */
function mark({ ink, accent, scale = 1 }) {
  const inner = `
    <path d="${arc(0, 0, 342, -68, 248)}" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round" />
    <circle cx="0" cy="-342" r="24" fill="${accent}" />
    <text x="0" y="204" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="560" fill="${ink}">F</text>
  `;
  return `<g transform="translate(512 512) scale(${scale})">${inner}</g>`;
}

function render(name, svg, width) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: [fontFile], loadSystemFonts: false, defaultFontFamily: 'Fraunces' },
  })
    .render()
    .asPng();
  writeFileSync(join(assets, name), png);
  console.log(`  ${name} — ${width}px`);
}

const canvas = (inner, background) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${background ? `<rect width="1024" height="1024" fill="${background}" />` : ''}
    ${inner}
  </svg>`;

console.log('Building FORMA brand assets');
render('icon.png', canvas(mark({ ink: '#171310', accent: '#B25E45' }), '#F7F2EA'), 1024);
render(
  'splash-icon.png',
  canvas(mark({ ink: '#171310', accent: '#B25E45' }), null),
  1024,
);
render(
  'splash-icon-dark.png',
  canvas(mark({ ink: '#F4EDE3', accent: '#D0805F' }), null),
  1024,
);
render(
  'android-icon-foreground.png',
  canvas(mark({ ink: '#171310', accent: '#B25E45', scale: 0.62 }), null),
  1024,
);
render('android-icon-background.png', canvas('', '#F7F2EA'), 1024);
render(
  'android-icon-monochrome.png',
  canvas(mark({ ink: '#FFFFFF', accent: '#FFFFFF', scale: 0.62 }), null),
  1024,
);
render('favicon.png', canvas(mark({ ink: '#171310', accent: '#B25E45' }), '#F7F2EA'), 64);
console.log(`Wrote assets to ${assets}`);
