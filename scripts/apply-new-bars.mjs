#!/usr/bin/env node
/**
 * Vie varmennetut uudet juomapaikat `bars.ts`:aan.
 *
 * Vesa 12.9.2026: *"kyllä haluan"* — Salla, Luosto ja Iso-Syöte (ja samalla
 * Pyhä, Ruka sekä lisää Ylläkselle ja Saariselälle) myös baarilistalle.
 *
 * Syöte: `scripts/_new-bars.verified.json`, joka on kartoitus- ja
 * vastatarkistustyönkulun tulos. Jokaisella rivillä on `sources`.
 *
 * 🔴 Tämä skripti EI keksi mitään. Se hylkää rivin ja kertoo syyn, jos:
 *   - pakollinen kenttä puuttuu (nimi, kaupunki, tyyppi, kuvaus, osoite)
 *   - lähdettä ei ole
 *   - nimi on jo bars.ts:ssä (kaksoiskappale)
 *   - `hours` ei ole tyhjä eikä osu käännöskoneen kaavaan eikä SPECIAL-tauluun
 *   - `price` ei ole SPECIAL-taulussa (keksitty hinta ei saa mennä läpi)
 *
 * Aukiolot ja hinnat kirjoitetaan vain englanniksi; `_gen-localised-hours.mjs
 * --write` täyttää loput 11 kieltä sen jälkeen. Jos se kaatuu, rivi on väärässä
 * muodossa — korjaa lähde, älä käännöskonetta.
 *
 * Aja: node scripts/apply-new-bars.mjs            (kuivaharjoitus + validointi)
 *      node scripts/apply-new-bars.mjs --write    (kirjoittaa bars.ts)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BARS = path.join(ROOT, 'src/data/bars.ts');
const INPUT = path.join(ROOT, 'scripts/_new-bars.verified.json');
const GEN = path.join(ROOT, 'scripts/_gen-localised-hours.mjs');
const WRITE = process.argv.includes('--write');

const src = fs.readFileSync(BARS, 'utf8').replace(/\r\n/g, '\n');
const gen = fs.readFileSync(GEN, 'utf8');

/** SPECIAL-taulun avaimet: nämä merkkijonot käännöskone osaa jo. */
const SPECIAL = new Set([...gen.matchAll(/^  '([^']+)': \{$/gm)].map((m) => m[1]));

/** Kaava, jonka käännöskone osaa ilman SPECIAL-riviä. */
const DAY = '(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)';
const PART = `(?:Daily|${DAY}(?:–${DAY})?)\\s(?:\\d{2}(?::\\d{2})?–\\d{2}(?::\\d{2})?|closed)`;
const PATTERN = new RegExp(`^${PART}(?:,\\s${PART})*$`);

const existing = new Set([...src.matchAll(/\n    name: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g)]
  .map((m) => (m[1] ?? m[2]).replace(/\\(['"\\])/g, '$1').toLowerCase()));

if (!fs.existsSync(INPUT)) {
  console.error(`🔴 puuttuu: ${path.relative(ROOT, INPUT)}`);
  process.exit(2);
}
const input = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const q = (s) => (String(s).includes("'") ? `"${String(s).replace(/"/g, '\\"')}"` : `'${esc(s)}'`);

/**
 * Normalisoi aukiolomerkkijonon kaannoskoneen kaavaan.
 *
 * Kaava (_gen-localised-hours.mjs): lausekkeet erotettu ", ", muodot
 * "Daily 11-18", "Mon-Thu 14-22", "Sun closed", "kitchen 14-23" — mutta
 * valimerkkina on AJATUSVIIVA, ei yhdysmerkkia. Se on ainoa ero useimmissa
 * lahteissa. Sulkeissa olevat lisaykset eivat mahdu kaavaan ⇒ kommenttiin.
 *
 * 🔴 Puolittain jasennettya aukioloa ei julkaista: vaara aukiolo on pahempi
 * kuin "tarkista kohteesta". Alkuperainen teksti sailyy aina kommentissa.
 */
function normaliseHours(raw) {
  if (!raw || !raw.trim()) return { hours: '', note: '' };
  const original = raw.trim();
  const h = original
    .replace(/\([^()]*\)/g, '')
    .replace(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s*-\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/g, '$1\u2013$2')
    .replace(/(\d{1,2}(?::\d{2})?)\s*-\s*(\d{1,2}(?::\d{2})?)/g, '$1\u2013$2')
    .replace(/\bKitchen\b/g, 'kitchen')
    .replace(/\s{2,}/g, ' ')
    .replace(/[,;]\s*$/, '')
    .trim();
  if (PATTERN.test(h)) return { hours: h, note: h === original ? '' : `Aukiolo lahteessa: ${original}` };
  return { hours: '', note: `Aukiolo lahteessa (ei kaannoskoneen kaavassa): ${original}` };
}

/** Hinta kelpaa vain jos se on jo kaannostaulussa; muuten se jaa kommenttiin. */
function normalisePrice(raw) {
  const t = (raw || '').trim();
  if (!t || /^(ei annettu|not published|ei hintoja)/i.test(t)) return { price: 'Prices on the venue site', note: '' };
  if (SPECIAL.has(t)) return { price: t, note: '' };
  return { price: 'Prices on the venue site', note: `Hinta lahteessa: ${t}` };
}

/**
 * Kohteen oma postinumeroalue. 🔴 Vastalukija pitaa paikan, joka on olemassa,
 * mutta se ei aina huomaa etta paikka on VAARASSA kohteessa: Rukan listalle
 * paatyi nelja Kuusamon keskustan paikkaa (93600, ~25 km rinteilta) ja
 * Iso-Syotteen listalle Pudasjarven keskusta (93100, ~60 km). Postinumero
 * ratkaisee sen ilman arvailua.
 */
const POSTCODE = {
  // Monomesta ei julkaise katuosoitetta ('At the foot of the Pessari slopes,
  // Ruka ski resort') — se on silti Rukalla, joten kohteen nimi kelpaa.
  Ruka: /\b(93825|93830)\b|Rukatunturi|Ruka ski resort/i,
  'Iso-Syöte': /\b93280\b/,
  'Pyhä': /\b98530\b/,
  Salla: /\b98900\b/,
  Luosto: /\b99555\b/,
  'Saariselkä': /\b99830\b/,
  'Ylläs': /\b(95970|95980)\b/,
};

/**
 * Tama on baarisivusto. Kahvila, pizzeria ja pelkka ruokaravintola eivat kuulu
 * listalle, vaikka ne olisivat olemassa ja oikeassa kylassa. Vastalukija
 * merkitsi useat itse tyyppikenttaan ("ei baari", "ei iltabaari").
 */
const NOT_A_BAR = /\bei baari|ei iltabaari|ei erillist|pizzeria|^licensed cafe|^cafe(?!.*\bbar\b)|^kahvila(?!.*baari)|game restaurant/i;

const accepted = [];
const rejected = [];

for (const dest of input) {
  for (const v of dest.venues) {
    const why = [];
    for (const f of ['name', 'type', 'description', 'address']) if (!v[f] || !String(v[f]).trim()) why.push(`kenttä ${f} puuttuu`);
    if (!Array.isArray(v.sources) || !v.sources.length) why.push('ei lähdettä');
    if (!Array.isArray(v.highlights) || v.highlights.length < 2) why.push('alle 2 kohokohtaa');
    if (v.name && existing.has(v.name.toLowerCase())) why.push('nimi on jo bars.ts:ssä');
    const pc = POSTCODE[dest.city];
    if (pc && v.address && !pc.test(v.address)) why.push(`osoite ei ole kohteessa ${dest.city}: ${v.address}`);
    if (NOT_A_BAR.test(`${v.type} ${v.name}`)) why.push(`ei juomapaikka: ${v.type}`);
    const H = SPECIAL.has(v.hours || '') ? { hours: v.hours, note: '' } : normaliseHours(v.hours);
    const P = normalisePrice(v.price);
    if (why.length) { rejected.push({ city: dest.city, name: v.name || '(nimetön)', why }); continue; }
    const notes = [v.notes, H.note, P.note].filter(Boolean).join(' · ');
    accepted.push({ ...v, city: dest.city, price: P.price, hours: H.hours || 'Check venue for current hours', notes, hoursKnown: !!H.hours });
  }
}

function block(v) {
  const hi = v.highlights.slice(0, 3).map((h) => q(h)).join(', ');
  const note = v.notes ? v.notes.replace(/\n/g, ' ').match(/.{1,94}(\s|$)/g).map((x) => `    // ${x.trim()}`).join('\n') + '\n' : '';
  const srcline = `    // Lähde ${v.sources.slice(0, 2).join(' · ')} (luettu 12.9.2026)\n`;
  return `  {
${srcline}${note}    name: ${q(v.name)},
    city: ${q(v.city)},
    type: ${q(v.type)},
    description: ${q(v.description)},
    highlights: [${hi}],
    price: {
      en: ${q(v.price)},
    },
    address: ${q(v.address)},${v.website ? `\n    website: ${q(v.website)},` : ''}
    hours: {
      en: ${q(v.hours)},
    },
  },`;
}

const byCity = {};
for (const v of accepted) (byCity[v.city] ||= []).push(v);

console.log(`\nHYVÄKSYTTY ${accepted.length} · HYLÄTTY ${rejected.length}\n`);
for (const [city, vs] of Object.entries(byCity)) {
  const total = vs.length + [...existing].filter(() => false).length;
  const withHours = vs.filter((v) => v.hoursKnown).length;
  console.log(`  ${city.padEnd(12)} +${String(vs.length).padStart(2)}  (aukiolot ${withHours}/${vs.length})  ${vs.map((v) => v.name).join(', ')}`);
  void total;
}
if (rejected.length) {
  console.log('\nHylätyt (syy kerrotaan, mitään ei arvata):');
  for (const r of rejected) console.log(`  ✗ ${r.city} · ${r.name}: ${r.why.join('; ')}`);
}

if (!WRITE) { console.log('\nkuivaharjoitus — aja --write kirjoittaaksesi bars.ts'); process.exit(0); }

// bars-taulukon loppu: ensimmainen sulkeva rivi `export const bars`in jalkeen.
// EI voi hakea "export const iceBars":lla, koska valissa on IceBar-rajapinta.
const start = src.indexOf('export const bars');
const i = start === -1 ? -1 : src.indexOf('\n];', start);
if (i === -1) { console.error('bars-taulukon loppua ei loytynyt'); process.exit(1); }
const out = src.slice(0, i) + '\n' + accepted.map(block).join('\n') + src.slice(i);
fs.writeFileSync(BARS, out);
console.log(`\n✅ ${accepted.length} riviä kirjoitettu bars.ts:ään. Aja seuraavaksi:`);
console.log('   node scripts/_gen-localised-hours.mjs --write');
