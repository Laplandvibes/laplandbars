#!/usr/bin/env node
/**
 * Yhdistaa kaksoiskappaleiksi jaaneet kuvarekisterin slugit yhteen nimeen.
 *
 * 🔴 Sama yritys oli apres-sivulla ja bars.ts:ssa eri nimella (esim.
 * "Yokerho Karhu" / "Nightclub Karhu"), ja koska nimi on kuvarekisterin avain,
 * samasta paikasta oli KAKSI kuvatiedostoa. Nimet on nyt yhdenmukaistettu
 * (`_rename-apres-venues.mjs`), joten myos kuvat pitaa yhdistaa.
 *
 * Valinta tehtiin katsomalla kontaktiarkki (venue-pairs.png, 12.9.2026):
 *   pyha-dreams-wine-bar : pyha.fi:n kuva (viinipoyta) > oman sivun lasikuva
 *   sport-bar-pyha       : tulikuuma.fi (pelipaidat, ruudut) > pyha.fi:n tiski
 *   hanki-baari          : ruka.fi:n baaritiski; oma og:image on brandijuliste
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = path.join(ROOT, 'scripts/_venue-images.overrides.json');
const j = JSON.parse(fs.readFileSync(P, 'utf8'));

/** vanha slug -> uusi slug; `keepTarget` = uuden oma kuva voittaa. */
const MOVE = [
  { from: 'pyha-dreams', to: 'pyha-dreams-wine-bar', keepTarget: false },
  { from: 'sportbar-pyha', to: 'sport-bar-pyha', keepTarget: true },
  { from: 'hanki-baari-ruka', to: 'hanki-baari', keepTarget: false },
  { from: 'bistro-rumpu-baari', to: 'rumpu-bar-rumpubaari', keepTarget: false },
  { from: 'yokerho-karhu', to: 'nightclub-karhu', keepTarget: false },
  { from: 'ravintola-pirtti', to: 'restaurant-pirtti', keepTarget: true },
  { from: 'ravintola-huttuhippu', to: 'restaurant-huttuhippu', keepTarget: false },
];

const approved = new Set(j.approved || []);
for (const { from, to, keepTarget } of MOVE) {
  if (j.overrides[from]) {
    if (!keepTarget) j.overrides[to] = j.overrides[from];
    delete j.overrides[from];
  }
  if (j.noPhoto?.[from]) {
    if (!keepTarget && !j.overrides[to]) j.noPhoto[to] = j.noPhoto[from];
    delete j.noPhoto[from];
  }
  if (j.noPhoto?.[to] && j.overrides[to]) delete j.noPhoto[to];
  if (approved.has(from)) { approved.delete(from); }
  if (j.overrides[to] || approved.has(to)) approved.add(to);
  // vanha kuvatiedosto pois, jottei orpo webp jaa dist-nippuun
  const old = path.join(ROOT, `public/images/venues/${from}.webp`);
  if (fs.existsSync(old)) { fs.unlinkSync(old); console.log(`  poistettu public/images/venues/${from}.webp`); }
  console.log(`  ${from} -> ${to}${keepTarget ? ' (kohteen oma kuva sailyy)' : ''}`);
}

j.approved = [...approved].sort();
fs.writeFileSync(P, JSON.stringify(j, null, 2) + '\n');
console.log(`\napproved: ${j.approved.length}`);
