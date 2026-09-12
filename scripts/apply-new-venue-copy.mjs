#!/usr/bin/env node
/**
 * Vie 62 uuden juomapaikan type/description/highlights `pages.json`:iin
 * kaikille 12 kielelle avaimeen `bars.venues.<name>`.
 *
 * Lahde: `scripts/_new-venue-copy.source.json` (EN, poimittu bars.ts:sta) ja
 * `scripts/_new-venue-copy.<lang>.json` (11 kaannosta).
 *
 * 🔴 Skripti EI korjaa kaannosta. Se hylkaa kielen kokonaan ja kertoo syyn, jos
 * yksikin kohde puuttuu, avain ei vastaa bars.ts:n nimea tai highlights-lista
 * on eri mittainen kuin lahteessa. Puolittain kaannetty kieli nayttaisi
 * sivulla sekakielisena, mika on huonompi kuin pelkka englanti.
 *
 * Aja: node scripts/apply-new-venue-copy.mjs           (kuivaharjoitus)
 *      node scripts/apply-new-venue-copy.mjs --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');
const LANGS = ['fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];

const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_new-venue-copy.source.json'), 'utf8'));
const byName = new Map(source.map((v) => [v.name, v]));

/** bars.ts:n nimet — kaannosavaimen on osuttava naihin taysin. */
const barsSrc = fs.readFileSync(path.join(ROOT, 'src/data/bars.ts'), 'utf8').replace(/\r\n/g, '\n');
const NAME_RE = /\n    name: '([^']*)'|\n    name: "([^"]*)"/g;
const barNames = new Set([...barsSrc.matchAll(NAME_RE)].map((m) => m[1] ?? m[2]));

let failed = 0;
const plans = [];

// EN kirjoitetaan lahteesta, jotta avain on olemassa kaikilla kielilla.
plans.push({ lang: 'en', rows: Object.fromEntries(source.map((v) => [v.name, { type: v.type, description: v.description, highlights: v.highlights }])) });

for (const lang of LANGS) {
  const file = path.join(ROOT, `scripts/_new-venue-copy.${lang}.json`);
  if (!fs.existsSync(file)) { console.log(`  ✗ ${lang}: tiedosto puuttuu`); failed += 1; continue; }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const why = [];
  const missing = source.filter((v) => !data[v.name]).map((v) => v.name);
  if (missing.length) why.push(`${missing.length} kohdetta puuttuu (${missing.slice(0, 3).join(', ')}…)`);
  const extra = Object.keys(data).filter((k) => !byName.has(k));
  if (extra.length) why.push(`${extra.length} tuntematonta avainta (${extra.slice(0, 3).join(', ')}…)`);
  const notInBars = Object.keys(data).filter((k) => !barNames.has(k));
  if (notInBars.length) why.push(`avain ei ole bars.ts:ssä: ${notInBars.slice(0, 3).join(', ')}`);
  const badLen = Object.entries(data)
    .filter(([k, v]) => byName.has(k) && (!Array.isArray(v.highlights) || v.highlights.length !== byName.get(k).highlights.length))
    .map(([k]) => k);
  if (badLen.length) why.push(`highlights eri mittainen: ${badLen.slice(0, 3).join(', ')}`);
  const empty = Object.entries(data).filter(([, v]) => !v.type?.trim() || !v.description?.trim()).map(([k]) => k);
  if (empty.length) why.push(`tyhjä kenttä: ${empty.slice(0, 3).join(', ')}`);
  if (why.length) { console.log(`  ✗ ${lang}: ${why.join(' · ')}`); failed += 1; continue; }
  plans.push({ lang, rows: data });
  console.log(`  ✓ ${lang}: ${Object.keys(data).length} kohdetta`);
}

if (failed) { console.log(`\n🔴 ${failed} kieltä hylätty — niitä ei kirjoiteta.`); }
if (!WRITE) { console.log('\nkuivaharjoitus — aja --write kirjoittaaksesi pages.json-tiedostot'); process.exit(failed ? 1 : 0); }

for (const { lang, rows } of plans) {
  const p = path.join(ROOT, `src/locales/${lang}/pages.json`);
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  json.bars.venues ||= {};
  let added = 0;
  for (const [name, v] of Object.entries(rows)) {
    json.bars.venues[name] = { ...(json.bars.venues[name] || {}), type: v.type, description: v.description, highlights: v.highlights };
    added += 1;
  }
  fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
  console.log(`  → ${lang}: ${added} kohdetta kirjoitettu`);
}
console.log('\n✅ valmis');
