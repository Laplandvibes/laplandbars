#!/usr/bin/env node
// Kontaktiarkki: kaikki haetut kohdekuvat yhdessä PNG:ssä nimilapuilla, jotta ne
// KATSOTAAN ennen käyttöä (portin läpäisy ei ole hyväksyntä). Aja:
//   node scripts/_venue-images-sheet.mjs [out.png]
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/venue-images.json'), 'utf8'));
const out = process.argv[2] || path.join(ROOT, 'scripts/_venue-images-sheet.png');
const rows = Object.entries(reg).filter(([, r]) => r.src);
const W = 400, H = 240, LABEL = 34, COLS = 4;
const tiles = [];
for (let i = 0; i < rows.length; i++) {
  const [slug, r] = rows[i];
  const img = await sharp(path.join(ROOT, 'public', r.src)).resize(W, H, { fit: 'cover' }).png().toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="${LABEL}"><rect width="100%" height="100%" fill="#0F172A"/><text x="8" y="22" font-family="Arial" font-size="15" fill="#F9FAFB">${i + 1}. ${slug}  ·  ${r.credit}  ·  ${r.approved ? 'OK' : '?'}</text></svg>`);
  const tile = await sharp({ create: { width: W, height: H + LABEL, channels: 3, background: '#0F172A' } })
    .composite([{ input: img, top: 0, left: 0 }, { input: label, top: H, left: 0 }]).png().toBuffer();
  tiles.push({ input: tile, left: (i % COLS) * (W + 8), top: Math.floor(i / COLS) * (H + LABEL + 8) });
}
const rowsN = Math.ceil(rows.length / COLS);
await sharp({ create: { width: COLS * (W + 8), height: rowsN * (H + LABEL + 8), channels: 3, background: '#1E293B' } })
  .composite(tiles).png().toFile(out);
console.log(`${rows.length} kuvaa → ${out}`);
