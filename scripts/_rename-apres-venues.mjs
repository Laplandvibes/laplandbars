#!/usr/bin/env node
/**
 * Yhdenmukaistaa apres-ski-sivun kohdenimet `bars.ts`:n kanssa.
 *
 * 🔴 MIKSI (mitattu 12.9.2026): sama yritys oli kahdella nimella kahdessa
 * tiedostossa, esim. "Yokerho Karhu" ja "Nightclub Karhu". Nimi on
 * kuvarekisterin AVAIN (`venuePhoto` -> `barSlug(name)`), joten kaksi nimea
 * tarkoitti kahta kuvatiedostoa samasta paikasta - ja hyvaksytty kuva nakyi
 * vain toisella sivulla. Sivukavijalle se nayttaa kahdelta eri paikalta.
 *
 * bars.ts on kanoninen: siella rivi on lahteistetty ja siella on osoite.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];

const RENAME = {
  'Pyhä Dreams': 'Pyhä Dreams Wine Bar',
  'CAMP Kitchen & Bar Pyhä': 'CAMP Kitchen & Bar PYHÄ',
  'Ravintola Huttuhippu': 'Restaurant Huttuhippu',
  'SportBar Pyhä': 'Sport Bar Pyhä',
  'Hanki Baari Ruka': 'Hanki Baari',
  'Bistro & Rumpu Baari': 'Rumpu Bar (Rumpubaari)',
  'Yökerho Karhu': 'Nightclub Karhu',
  'Ravintola Pirtti': 'Restaurant Pirtti',
};

// Portti: kohdenimen on oltava bars.ts:ssa, muuten nimea ei vaihdeta.
const bars = fs.readFileSync(path.join(ROOT, 'src/data/bars.ts'), 'utf8');
const missing = Object.values(RENAME).filter((n) => !bars.includes(`name: '${n}'`) && !bars.includes(`name: "${n}"`));
if (missing.length) { console.error('🔴 kohdenimi ei ole bars.ts:ssa: ' + missing.join(', ')); process.exit(1); }

let touched = 0;
const page = path.join(ROOT, 'src/pages/ApresSki.tsx');
let src = fs.readFileSync(page, 'utf8');
for (const [from, to] of Object.entries(RENAME)) {
  const a = `'${from}'`;
  const b = to.includes("'") ? `"${to}"` : `'${to}'`;
  if (src.includes(a)) { src = src.split(a).join(b); touched += 1; }
}
fs.writeFileSync(page, src);
console.log(`ApresSki.tsx: ${touched}/${Object.keys(RENAME).length} nimea vaihdettu`);

for (const locale of LOCALES) {
  const p = path.join(ROOT, `src/locales/${locale}/pages.json`);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const v = j?.apresSki?.venues;
  if (!v) { console.log(`  ${locale}: ei apresSki.venues`); continue; }
  let n = 0;
  const out = {};
  for (const [k, val] of Object.entries(v)) {
    const key = RENAME[k] || k;
    if (RENAME[k]) n += 1;
    out[key] = val;
  }
  j.apresSki.venues = out;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(`  ${locale}: ${n} avainta uudelleennimetty`);
}

const srcJson = path.join(ROOT, 'scripts/_apres-venues.source.json');
if (fs.existsSync(srcJson)) {
  let raw = fs.readFileSync(srcJson, 'utf8');
  for (const [from, to] of Object.entries(RENAME)) raw = raw.split(JSON.stringify(from)).join(JSON.stringify(to));
  fs.writeFileSync(srcJson, raw);
  console.log('_apres-venues.source.json paivitetty');
}
