// Draws the app icon (ten beads on a cord around a cross) and writes the PNG
// sizes the manifest and iOS need. Pure Node, no image libraries.
// Run: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const BG = [0x11, 0x11, 0x11];
const GOLD = [0xdf, 0xbc, 0x63];
const PARCHMENT = [0xea, 0xe4, 0xd4];
const CORD = [0x6a, 0x6a, 0x6a];

// Everything in unit coordinates, centre (0,0), icon spans -0.5..0.5.
const RING = 0.29;
const beads = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * RING, Math.sin(a) * RING];
});

function colourAt(x, y) {
  for (const [bx, by] of beads) if (Math.hypot(x - bx, y - by) < 0.048) return GOLD;
  if (Math.abs(Math.hypot(x, y) - RING) < 0.007) return CORD;
  const upright = Math.abs(x) < 0.026 && y > -0.15 && y < 0.17;
  const arms = Math.abs(y + 0.045) < 0.026 && Math.abs(x) < 0.105;
  if (upright || arms) return PARCHMENT;
  return BG;
}

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const SS = 4; // supersampling per axis
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let py = 0; py < size; py++) {
    raw[py * (size * 3 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      const sum = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const c = colourAt((px + (sx + 0.5) / SS) / size - 0.5, (py + (sy + 0.5) / SS) / size - 0.5);
          sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2];
        }
      const o = py * (size * 3 + 1) + 1 + px * 3;
      raw[o] = sum[0] / (SS * SS); raw[o + 1] = sum[1] / (SS * SS); raw[o + 2] = sum[2] / (SS * SS);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, 2, 0, 0, 0], 8); // 8-bit RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(new URL(`../public/${name}`, import.meta.url), png(size));
  console.log('wrote', name);
}

const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 1 1">
  <rect x="-0.5" y="-0.5" width="1" height="1" rx="0.18" fill="${hex(BG)}"/>
  <circle r="${RING}" fill="none" stroke="${hex(CORD)}" stroke-width="0.014"/>
  ${beads.map(([x, y]) => `<circle cx="${x.toFixed(4)}" cy="${y.toFixed(4)}" r="0.048" fill="${hex(GOLD)}"/>`).join('\n  ')}
  <rect x="-0.026" y="-0.15" width="0.052" height="0.32" fill="${hex(PARCHMENT)}"/>
  <rect x="-0.105" y="-0.071" width="0.21" height="0.052" fill="${hex(PARCHMENT)}"/>
</svg>
`;
writeFileSync(new URL('../public/icon.svg', import.meta.url), svg);
console.log('wrote icon.svg');
