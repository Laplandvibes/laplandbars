#!/usr/bin/env node
/**
 * Vie `_apres-venues.source.json` (en + fi) ja `_apres-venues.translations.json`
 * (10 muuta kielta) locale-tiedostoihin apresSki.venues / stayHints / notFound.
 *
 * Vesa 12.9.2026: *"siis totta helvetissa naiden pitaa olla tuolla"* — apres-ski
 * oli vain Levilla ja Yllaksella, vaikka Pyhalla, Rukalla, Sallalla, Luostolla,
 * Iso-Syotteella ja Saariselalla on paikkoja, jotka kohde ITSE nimeaa after
 * skiksi. 🔴 Yksikaan rivi ei ole kirjoitettu muistista: jokaisella on `src`.
 *
 * Aja: node scripts/apply-apres-venues.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_apres-venues.source.json'), 'utf8'));
const trPath = path.join(ROOT, 'scripts/_apres-venues.translations.json');
const tr = fs.existsSync(trPath) ? JSON.parse(fs.readFileSync(trPath, 'utf8')) : {};
const LOCALES = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];

let missing = 0;
for (const loc of LOCALES) {
  const file = path.join(ROOT, 'src/locales', loc, 'pages.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  json.apresSki ??= {};
  json.apresSki.venues ??= {};
  json.apresSki.stayHints ??= {};

  for (const r of src.resorts) {
    for (const v of r.venues) {
      const row = loc === 'en' ? v.en : loc === 'fi' ? v.fi : tr[loc]?.venues?.[v.name];
      if (!row) { missing++; if (loc !== 'en' && loc !== 'fi') continue; throw new Error(`${loc}: ${v.name} puuttuu lahteesta`); }
      json.apresSki.venues[v.name] = { type: row.type, desc: row.desc };
    }
  }
  for (const [key, val] of Object.entries(src.stayHints)) {
    const s = loc === 'en' ? val.en : loc === 'fi' ? val.fi : tr[loc]?.stayHints?.[key];
    if (s) json.apresSki.stayHints[key] = s;
    else if (loc === 'en' || loc === 'fi') throw new Error(`${loc}: stayHint ${key} puuttuu`);
    else missing++;
  }
  const nf = loc === 'en' ? src.notFound.en : loc === 'fi' ? src.notFound.fi : tr[loc]?.notFound;
  if (nf) json.apresSki.notFound = nf; else missing++;

  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
}
const venueCount = src.resorts.reduce((n, r) => n + r.venues.length, 0);
console.log(`${venueCount} kohdetta x ${LOCALES.length} kielta`);
if (missing) console.log(`👀 ${missing} kaannosta puuttuu viela (aja uudestaan kun _apres-venues.translations.json on valmis)`);
