#!/usr/bin/env node
/**
 * Vie 7 uuden kaupunkisivun copyn, 5 kaupunkikuvausta ja /bars-metat
 * `pages.json`:iin kaikille 12 kielelle.
 *
 * Lähde: `scripts/_new-city-copy.source.json` (EN) ja
 * `scripts/_new-city-copy.<lang>.json` (11 käännöstä).
 *
 * 🔴 Skripti hylkää kielen kokonaan ja kertoo syyn, jos rakenne ei täsmää,
 * metakuvaus on väärän pituinen tai `know` ei ole tasan kolme kohtaa.
 * Puolittain käännetty kaupunkisivu on sekakielinen sivu 12:sta.
 *
 * Aja: node scripts/apply-city-copy.mjs            (kuivaharjoitus)
 *      node scripts/apply-city-copy.mjs --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');
const LANGS = ['fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];
const FIELDS = ['name', 'at', 'title', 'description', 'h1', 'tagline', 'intro'];

/** Ruka ja Iso-Syöte eivät ole Lapissa. Brändinimi LaplandBars on eri asia. */
const NOT_LAPLAND = ['ruka', 'iso-syote'];
const LAPLAND_WORD = /lapp?land|laponi|lapponia|laponie|ラップランド|拉普兰|라플란드|\bLapi[ns]\b/i;
/**
 * Kielto koskee vain väitettä "on Lapissa". Lause "ei ole Lapissa" on juuri se
 * mitä sivun kuuluu sanoa, joten kieltosana samassa virkkeessä vapauttaa
 * osuman. Ilman tätä espanja ("no en Laponia") ja korea ("속하지 않습니다")
 * hylättiin oikeasta tekstistä.
 */
const NEGATION = /\bei\b|\bnot\b|nicht|\bpas\b|\bnon\b|\bno\b|niet|\binte\b|않|아닌|아니|不在|不属于|ではあり|ではな|não/i;
/** CJK-merkki on noin kaksi kertaa latinalaisen levyinen ⇒ puolet merkkejä. */
const CJK = new Set(['ja', 'ko', 'zh-CN']);
const SENTENCE = /(?<=[.!?。！？])\s+/;

const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_new-city-copy.source.json'), 'utf8'));
const SLUGS = Object.keys(source.cities);
const VIBE_KEYS = Object.keys(source.cityVibes);

function check(lang, data) {
  const why = [];
  if (!data.cities) { why.push('cities puuttuu'); return why; }
  const got = Object.keys(data.cities);
  const missing = SLUGS.filter((s) => !got.includes(s));
  const extra = got.filter((s) => !SLUGS.includes(s));
  if (missing.length) why.push(`kaupunkia puuttuu: ${missing.join(', ')}`);
  if (extra.length) why.push(`tuntematon kaupunki: ${extra.join(', ')}`);

  for (const slug of SLUGS) {
    const c = data.cities[slug];
    if (!c) continue;
    for (const f of FIELDS) if (!c[f] || !String(c[f]).trim()) why.push(`${slug}.${f} puuttuu`);
    if (!Array.isArray(c.know) || c.know.length !== 3) why.push(`${slug}.know: pitää olla tasan 3, on ${c.know?.length ?? 0}`);
    if (c.description) {
      const n = [...c.description].length;
      // CJK-merkki vie noin kaksi latinalaisen leveyttä, joten sama pikselimitta
      // on noin puolet merkkeja. Ilman tata ko/ja/zh kaatuisi aina.
      const [lo, hi] = CJK.has(lang) ? [55, 90] : [105, 160];
      if (n < lo || n > hi) why.push(`${slug}.description on ${n} merkkiä (sallittu ${lo}–${hi})`);
    }
    if (c.title && !c.title.endsWith(' | LaplandBars')) why.push(`${slug}.title ei pääty " | LaplandBars"`);
    const all = [c.title, c.description, c.tagline, c.intro, ...(c.know || [])].join(' ');
    if (all.includes('—')) why.push(`${slug}: em-viiva`);
    if (NOT_LAPLAND.includes(slug)) {
      for (const sentence of all.split('LaplandBars').join('').split(SENTENCE)) {
        if (LAPLAND_WORD.test(sentence) && !NEGATION.test(sentence)) why.push(`${slug}: väittää kohteen Lapiksi: "${sentence.trim().slice(0, 70)}"`);
      }
    }
  }

  const vibes = data.cityVibes || {};
  const vmiss = VIBE_KEYS.filter((k) => !vibes[k]?.trim());
  if (vmiss.length) why.push(`cityVibes puuttuu: ${vmiss.join(', ')}`);
  for (const k of VIBE_KEYS) {
    if (!vibes[k]) continue;
    if (vibes[k].includes('—')) why.push(`cityVibes.${k}: em-viiva`);
    if (['Ruka', 'Iso-Syote'].includes(k)) {
      for (const sentence of vibes[k].split('LaplandBars').join('').split(SENTENCE)) {
        if (LAPLAND_WORD.test(sentence) && !NEGATION.test(sentence)) why.push(`cityVibes.${k}: väittää kohteen Lapiksi: "${sentence.trim().slice(0, 70)}"`);
      }
    }
  }

  const b = data.bars || {};
  for (const f of ['title', 'description', 'heroSub']) if (!b[f]?.trim()) why.push(`bars.${f} puuttuu`);
  if (b.title && !b.title.endsWith(' | LaplandBars')) why.push('bars.title ei pääty " | LaplandBars"');
  return why;
}

const plans = [];
let failed = 0;
for (const lang of LANGS) {
  const file = path.join(ROOT, `scripts/_new-city-copy.${lang}.json`);
  if (!fs.existsSync(file)) { console.log(`  ✗ ${lang}: tiedosto puuttuu`); failed += 1; continue; }
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { console.log(`  ✗ ${lang}: JSON ei jäsenny (${e.message})`); failed += 1; continue; }
  const why = check(lang, data);
  if (why.length) { console.log(`  ✗ ${lang}: ${why.join(' · ')}`); failed += 1; continue; }
  plans.push({ lang, data });
  console.log(`  ✓ ${lang}: ${SLUGS.length} kaupunkia, ${VIBE_KEYS.length} kuvausta, /bars-metat`);
}

if (failed) console.log(`\n🔴 ${failed} kieltä hylätty — niitä ei kirjoiteta.`);
if (!WRITE) { console.log('\nkuivaharjoitus — aja --write kirjoittaaksesi pages.json-tiedostot'); process.exit(failed ? 1 : 0); }

for (const { lang, data } of plans) {
  const p = path.join(ROOT, `src/locales/${lang}/pages.json`);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  j.cities ||= {};
  for (const slug of SLUGS) j.cities[slug] = data.cities[slug];
  j.bars.cityVibes = { ...j.bars.cityVibes, ...data.cityVibes };
  j.bars.title = data.bars.title;
  j.bars.description = data.bars.description;
  j.bars.hero.sub = data.bars.heroSub;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(`  → ${lang} kirjoitettu`);
}
console.log('\n✅ valmis');
