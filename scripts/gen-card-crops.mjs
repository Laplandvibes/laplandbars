#!/usr/bin/env node
/**
 * KORTTIRAJAUKSET — kuvitus kortin kuvasuhteessa, ei selaimen armoilla.
 *
 * Vesa 12.9.2026: *"mutta kuvat ei istu, ne ei näy oikein"*. Syy oli mitattava:
 * kortin kehys on 16:10, mutta kuvituskuvat ovat 2,36:1 (heroksi tehtyjä) tai
 * 0,56:1 (pystykuvia). `object-fit: cover` rajaa erotuksen pois, ja kuvasta jäi
 * näkyviin 31–68 %. Kohde katkesi.
 *
 * Kohdekuvat (`fetch-venue-images.mjs`) tehdään jo 800×500. Tämä tekee saman
 * omille AI-kuvituksille, joita käytetään korttikehyksessä: leikkaus tehdään
 * KERRAN täällä, missä tuloksen voi katsoa, eikä joka selaimessa uudelleen.
 *
 * 🔴 Alkuperäistä `public/images/drive/`-tiedostoa EI muuteta: samat kuvat ovat
 * käytössä heroina, joissa 2,36:1 on oikea suhde. Rajaus menee omaan kansioon.
 *
 * Tuotos: public/images/cards/<nimi>.webp (800×500)
 * Aja:    node scripts/gen-card-crops.mjs
 * Portti: node ../scripts/audit_card_images.mjs <url> — kaatuu jos näkyvissä < 70 %.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public/images/drive');
const OUT_DIR = path.join(ROOT, 'public/images/cards');
const W = 800, H = 500; // 16:10, sama kuin VenuePhoto-kehys

/** Kuvitukset, jotka renderöityvät korttikehyksessä. Lähdesuhde suluissa. */
const NAMES = [
  'cocktailTrio',    // 2.36 — Café & Bar 21 (ei omaa kuvaa)
  'cocktailBerry',   // 2.36 — MustaKissa Kuppila
  'iceBarTunnel',    // 2.36 — SnowVillage IceBar
  'heroIceBars',     // 2.36 — etusivun kategoriaruutu
  'heroApres',       // 2.36 — etusivun kategoriaruutu
  'liveMusicVenue',  // 1.78 — etusivun kategoriaruutu
  'saunaBeer',       // 1.79 — Pub Sarvi
  'beerFlight',      // 1.78 — Bar Alakerta
  'auroraLounge',    // 1.78 — Pirtukellari Night Club
];

fs.mkdirSync(OUT_DIR, { recursive: true });
let n = 0;
for (const name of NAMES) {
  const src = path.join(SRC_DIR, `${name}.webp`);
  if (!fs.existsSync(src)) { console.error(`🔴 puuttuu: ${path.relative(ROOT, src)}`); process.exitCode = 1; continue; }
  const m = await sharp(src).metadata();
  const out = path.join(OUT_DIR, `${name}.webp`);
  await sharp(src).resize({ width: W, height: H, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(out);
  console.log(`✅ ${name.padEnd(18)} ${m.width}x${m.height} (${(m.width / m.height).toFixed(2)}) → ${W}x${H}`);
  n++;
}
console.log(`\n${n}/${NAMES.length} korttirajausta → ${path.relative(ROOT, OUT_DIR)}`);
