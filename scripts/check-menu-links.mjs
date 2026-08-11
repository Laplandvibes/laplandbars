/**
 * Kuukausivahti julkaistuille menulinkeille + baarien verkkosivuille.
 *
 * Ajaa saman todisteportin kuin loytoskripti ja raportoi mika on lakannut
 * toimimasta: 404, uudelleenohjaus etusivulle, tai sivu joka ei enaa ole menu.
 * URL on pysyva mutta ei ikuinen.
 *
 * 🔴 Nook Loungen lista on kausileimattu PDF (`NOOK-drinkkilista-kesa26.pdf`).
 * Se vaihtuu kauden mukaan ja katoaa nimensa kanssa — tama vahti on ainoa
 * asia joka huomaa sen.
 *
 * Kadenssi: kuukausittain. Aja: node scripts/check-menu-links.mjs
 * Portti: exit 1 jos jokin vaatii huomiota.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countPriceTokens, classifyKind, titleLooksLikeMenu, redirectedToFrontPage, EVIDENCE_MIN } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/bar-menus.json'), 'utf8'));

/** Baarien verkkosivut ovat kasin yllapidetyssa bars.ts:ssa, ei generoidussa datassa. */
function websitesFromSource() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/bars.ts'), 'utf8');
  const out = [];
  for (const m of src.matchAll(/name: '([^']+)'[\s\S]{0,3000}?website: '([^']+)'/g)) {
    out.push({ name: m[1], url: m[2] });
  }
  // Sama nimi voi esiintya useasti jos regex ylivenyy; pidetaan ensimmainen.
  const seen = new Set();
  return out.filter((r) => !seen.has(r.name) && seen.add(r.name));
}

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

async function head(url) {
  return fetch(url, {
    headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000),
  });
}

const problems = [];

// 1) Menulinkit
const entries = Object.entries(reg).filter(([, e]) => e.url);
let i = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (i < entries.length) {
    const [slug, e] = entries[i++];
    try {
      const res = await head(e.url);
      if (!res.ok) { problems.push(`menu ${slug}: HTTP ${res.status} — ${e.url}`); continue; }
      if (redirectedToFrontPage(e.url, res.url)) {
        problems.push(`menu ${slug}: ohjautuu nyt etusivulle — ${e.url} -> ${res.url}`);
        continue;
      }
      if (classifyKind(e.url) === 'pdf') continue; // PDF:n sisaltoa ei voi lukea
      const body = await res.text();
      const ev = countPriceTokens(strip(body));
      if (ev < EVIDENCE_MIN && !titleLooksLikeMenu(titleOf(body)) && !titleLooksLikeMenu(res.url)) {
        problems.push(`menu ${slug}: ei enaa menu (${ev} hintaa, oli ${e.evidence ?? '?'}) — ${res.url}`);
      }
    } catch (err) {
      problems.push(`menu ${slug}: ${err.name} — ${e.url}`);
    }
    process.stdout.write('.');
  }
}));

// 2) Verkkosivut
const sites = websitesFromSource().filter((s) => !/facebook\.com|instagram\.com/i.test(s.url));
let j = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (j < sites.length) {
    const s = sites[j++];
    try {
      const res = await head(s.url);
      if (!res.ok) problems.push(`sivu ${s.name}: HTTP ${res.status} — ${s.url}`);
    } catch (err) {
      problems.push(`sivu ${s.name}: ${err.name} — ${s.url}`);
    }
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

console.log(`Tarkistettu ${entries.length} menulinkkia ja ${sites.length} verkkosivua.`);
if (problems.length) {
  console.error(`\n${problems.length} vaatii huomiota:`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('Kaikki kunnossa.');
