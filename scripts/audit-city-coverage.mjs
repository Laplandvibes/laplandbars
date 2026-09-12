#!/usr/bin/env node
/**
 * Portti: yksikään kaupunki ei saa pudota listalta hiljaa.
 *
 * 🔴 MIKSI (mitattu 12.9.2026). `bars.ts` kasvoi 27:stä 84 kohteeseen, mutta
 * kolme paikkaa piti kaupunkilistaa käsin kirjoitettuna:
 *
 *   1. `export const cities = ['Rovaniemi','Levi','Ylläs','Saariselkä']`
 *      ⇒ Ruka, Pyhä, Luosto, Salla ja Iso-Syöte eivät renderöityneet
 *        /bars-sivulle lainkaan. 33 korttia oli datassa mutta ei sivulla.
 *   2. `cityVibeKey`-taulu ⇒ puuttuva rivi latoi sivulle raa'an
 *      käännösavaimen "bars.cityVibes.undefined".
 *   3. `BAR_CITIES` + `routes.json` ⇒ kaupunkisivu ilman reittiä ei
 *      prerenderöidy eikä päädy sitemapiin.
 *
 * Yksikään näistä ei anna virhettä ajossa. Siksi ne mitataan täällä.
 *
 * Aja: node scripts/audit-city-coverage.mjs   (osa `npm test`iä)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(R(p), 'utf8').replace(/\r\n/g, '\n');

const LOCALES = ['en', 'fi', 'de', 'ja', 'es', 'pt-BR', 'zh-CN', 'ko', 'fr', 'it', 'nl', 'sv'];
/** Sama a-tavaus kuin Bars.tsx:n `cityVibeKey`. */
const vibeKey = (city) => city.replace(/[äå]/g, 'a').replace(/ö/g, 'o');

const fail = [];
const warn = [];

// --- 1. Kaupungit datasta -------------------------------------------------
const barsSrc = read('src/data/bars.ts');
const listStart = barsSrc.indexOf('export const bars');
const listEnd = barsSrc.indexOf('\n];', listStart);
const segment = barsSrc.slice(listStart, listEnd);
const counts = new Map();
for (const m of segment.matchAll(/\n    city: '([^']+)',/g)) {
  counts.set(m[1], (counts.get(m[1]) || 0) + 1);
}
const cityNames = [...counts.keys()];
if (cityNames.length < 2) fail.push(`bars.ts:sta löytyi vain ${cityNames.length} kaupunkia — jäsennys rikki`);

// --- 2. Käännetty kuvausteksti kaikilla kielillä ---------------------------
for (const locale of LOCALES) {
  const pages = JSON.parse(read(`src/locales/${locale}/pages.json`));
  const vibes = pages?.bars?.cityVibes || {};
  const missing = cityNames.filter((c) => !vibes[vibeKey(c)]?.trim());
  if (missing.length) fail.push(`${locale}: bars.cityVibes puuttuu — ${missing.join(', ')}`);
}

// --- 3. Kaupunkisivu jokaiselle, joka ylittää alarajan ---------------------
const citiesSrc = read('src/data/barCities.ts');
const MIN = Number(citiesSrc.match(/MIN_BARS_FOR_CITY_PAGE = (\d+)/)?.[1] ?? 4);
const registered = new Map(
  [...citiesSrc.matchAll(/\{ slug: '([^']+)',\s*city: '([^']+)'/g)].map((m) => [m[2], m[1]]),
);
for (const [city, n] of counts) {
  const slug = registered.get(city);
  if (n >= MIN && !slug) fail.push(`${city}: ${n} kohdetta (alaraja ${MIN}) mutta ei riviä BAR_CITIES:issä`);
  if (n < MIN && slug) warn.push(`${city}: enää ${n} kohdetta mutta kaupunkisivu /city/${slug} on yhä olemassa`);
}
for (const [city, slug] of registered) {
  if (!counts.has(city)) fail.push(`BAR_CITIES /city/${slug} osoittaa kaupunkiin '${city}', jota ei ole bars.ts:ssä`);
}

// --- 4. Reitti + sitemap jokaiselle kaupunkisivulle ------------------------
const routes = JSON.parse(read('scripts/routes.json'));
const routePaths = new Set(routes.map((r) => r.path));
const routeKeys = new Map(routes.map((r) => [r.path, r.jsonKey]));
for (const slug of registered.values()) {
  const p = `/city/${slug}`;
  if (!routePaths.has(p)) fail.push(`reitti puuttuu routes.json:ista: ${p}`);
  else if (routeKeys.get(p) !== `cities.${slug}`) fail.push(`${p}: jsonKey on '${routeKeys.get(p)}', pitäisi olla 'cities.${slug}'`);
}
const sitemap = fs.existsSync(R('public/sitemap.xml')) ? read('public/sitemap.xml') : '';
for (const slug of registered.values()) {
  if (sitemap && !sitemap.includes(`/city/${slug}/`)) fail.push(`sitemap.xml: /city/${slug}/ puuttuu (aja npm run build tai node scripts/gen-sitemap.mjs)`);
}

// --- 5. Kaupunkisivun teksti vähintään englanniksi -------------------------
const en = JSON.parse(read('src/locales/en/pages.json'));
for (const [city, slug] of registered) {
  const c = en?.cities?.[slug];
  if (!c) { fail.push(`en/pages.json: cities.${slug} puuttuu (${city})`); continue; }
  for (const f of ['name', 'at', 'title', 'description', 'h1', 'tagline', 'intro']) {
    if (!c[f]?.trim()) fail.push(`en cities.${slug}.${f} puuttuu`);
  }
  if (!Array.isArray(c.know) || c.know.length !== 3) fail.push(`en cities.${slug}.know: pitää olla tasan 3 kohtaa`);
  if (c.description && (c.description.length < 110 || c.description.length > 155)) {
    fail.push(`en cities.${slug}.description on ${c.description.length} merkkiä (sallittu 110–155)`);
  }
}

// --- Tulos ----------------------------------------------------------------
const total = [...counts.values()].reduce((a, b) => a + b, 0);
console.log(`Kaupunkiportti: ${cityNames.length} kaupunkia, ${total} kohdetta, ${registered.size} kaupunkisivua`);
for (const [city, n] of [...counts].sort((a, b) => b[1] - a[1])) {
  const slug = registered.get(city);
  console.log(`  ${city.padEnd(12)} ${String(n).padStart(2)}  ${slug ? `/city/${slug}` : '(ei omaa sivua)'}`);
}
for (const w of warn) console.log(`  ⚠ ${w}`);
if (fail.length) {
  console.error(`\n🔴 ${fail.length} vikaa:`);
  for (const f of fail) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\n✅ jokainen kaupunki on listalla, käännetty ja reititetty');
