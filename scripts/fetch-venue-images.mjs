#!/usr/bin/env node
/**
 * Hakee baarien OMAT kuvat niiden omilta sivuilta ja kirjoittaa kuvarekisterin.
 * Sama periaate kuin laplanddiningin `_fetch-partner-images.mjs` (8/2026):
 * kohteen oma julkaistu kuva on julkaistavaksi tarkoitettu, Google Place Photos
 * EI (Places-ehdot kieltävät tallentamisen). AI-kuvitusta ei käytetä esittämään
 * nimettyä paikkaa.
 *
 * Vesa 11.9.2026: *"nää kuvat valehtelee ihan vitusti, ne pitää päivittää
 * laadukkailla kuvilla, jotka aidosti voisi olla tottakin"*.
 *
 * Lähdejärjestys per kohde:
 *   1. `scripts/_venue-images.overrides.json` → overrides[slug].imageUrl
 *      (käsin valittu kontaktiarkilta, kun og:image on logo tai puuttuu)
 *   2. kohteen website → og:image / twitter:image (HTML-entiteetit puretaan:
 *      levi.fi:n URL:ssa oli `&amp;` ⇒ HTTP 400)
 *
 * Portit: HTTP 200 · content-type image/* · sharp jäsentää · leveys >= 600 px ·
 * ei alfakanavaa · URL ei sisällä "logo|icon|favicon". Pystykuva rajataan
 * korttiin 16:10 (cover), vaakakuva skaalataan leveyteen 800.
 *
 * 🔴 Läpäisy ei ole hyväksyntä. `approved` tulee VAIN overrides-tiedoston
 * `approved`-listasta, joka täytetään kontaktiarkin katsomisen jälkeen
 * (`node scripts/_venue-images-sheet.mjs`). Rivi ilman approved:true ei
 * renderöidy (src/lib/venueImage.ts).
 *
 * Tuotokset:
 *   public/images/venues/<slug>.webp                (leveys 800)
 *   src/data/generated/venue-images.json            (täysi rekisteri: lähde,
 *                                                    alkuperäinen URL, hylkäyssyy)
 *   src/data/generated/venue-images.runtime.json    (VAIN hyväksytyt, vain
 *                                                    src/credit/sourceUrl/koko —
 *                                                    tämä importoidaan JS-nippuun)
 *
 * Aja: node scripts/fetch-venue-images.mjs [--only <slug>] [--runtime-only]
 *   --runtime-only = älä hae mitään, kirjoita runtime-tiedosto rekisteristä ja
 *   overrides-tiedoston approved-listasta (hyväksynnän muutos ilman verkkoa).
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public/images/venues');
const REGISTRY = path.join(ROOT, 'src/data/generated/venue-images.json');
const RUNTIME = path.join(ROOT, 'src/data/generated/venue-images.runtime.json');
const OVERRIDES = path.join(ROOT, 'scripts/_venue-images.overrides.json');
// 🔴 Kortin kuvakehys on 16:10 JOKA pinnalla (VenuePhoto). Kuva tehdaan TASAN
// siihen suhteeseen, jotta selain ei raajaa sita uudelleen: kaksi perakkaista
// rajausta hukkasi 25-32 % kuvasta (mitattu 12.9.2026, Vesa: "kuvat ei istu").
const WIDTH = 800;
const CARD_H = 500; // 800x500 = 16:10
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;

/** Kopio bars.ts barSlug():sta — pidä identtisenä, rekisterin avain on tämä. */
function barSlug(name) {
  return name.toLowerCase()
    .replace(/[äå]/g, 'a').replace(/ö/g, 'o').replace(/[éè]/g, 'e').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&#38;/g, '&').replace(/&quot;/g, '"');

// Kohteet luetaan bars.ts:stä tekstinä (TS ei importoidu Nodeen).
const src = fs.readFileSync(path.join(ROOT, 'src/data/bars.ts'), 'utf8').replace(/\r\n/g, '\n');
const venues = [];
for (const block of src.split(/\n  \{\n/).slice(1)) {
  const n = block.match(/name: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/);
  if (!n) continue;
  const name = (n[1] ?? n[2]).replace(/\\(['"\\])/g, '$1');
  const website = block.match(/website: '([^']+)'/)?.[1] ?? null;
  venues.push({ name, slug: barSlug(name), website });
}

// Apres-ski-sivun kohteet eivat ole bars.ts:ssa (ne ovat oma listansa, ja osa
// on Lapin ulkopuolella). Sama og:image-logiikka koskee niita.
const APRES = path.join(ROOT, 'scripts/_apres-venues.source.json');
if (fs.existsSync(APRES)) {
  for (const r of JSON.parse(fs.readFileSync(APRES, 'utf8')).resorts) {
    for (const v of r.venues) {
      if (!v.website) continue;
      const slug = barSlug(v.name);
      if (venues.some((x) => x.slug === slug)) continue; // Bar Ihku on jo bars.ts:ssa (Levi) — Rukan toimipiste on eri paikka
      venues.push({ name: v.name, slug, website: v.website });
    }
  }
}

const ov = JSON.parse(fs.readFileSync(OVERRIDES, 'utf8'));
const approved = new Set(ov.approved);
fs.mkdirSync(OUT_DIR, { recursive: true });
const registry = fs.existsSync(REGISTRY) ? JSON.parse(fs.readFileSync(REGISTRY, 'utf8')) : {};

/** Kevyt runtime-tiedosto: vain hyväksytyt rivit ja vain kentät, joita kortti tarvitsee. */
function writeRuntime(reg) {
  const out = {};
  for (const [slug, r] of Object.entries(reg)) {
    if (!r.src || !approved.has(slug)) continue;
    if (!fs.existsSync(path.join(ROOT, 'public', r.src))) { console.error(`🔴 ${slug}: ${r.src} puuttuu levyltä`); process.exitCode = 1; continue; }
    out[slug] = { src: r.src, credit: r.credit, sourceUrl: r.sourceUrl, width: r.width, height: r.height };
  }
  fs.writeFileSync(RUNTIME, JSON.stringify(out, null, 2) + '\n');
  console.log(`runtime: ${Object.keys(out).length} hyväksyttyä → ${path.relative(ROOT, RUNTIME)}`);
}

if (process.argv.includes('--runtime-only')) {
  for (const [slug, r] of Object.entries(registry)) r.approved = !!r.src && approved.has(slug);
  fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
  writeRuntime(registry);
  process.exit();
}

function pickImageUrl(html, base) {
  const metas = [...html.matchAll(/<meta[^>]+>/gi)].map((m) => m[0]);
  const get = (re) => {
    for (const m of metas) {
      if (re.test(m)) {
        const c = m.match(/content=["']([^"']+)["']/i);
        if (c) return c[1];
      }
    }
    return null;
  };
  const u = get(/property=["']og:image(:secure_url)?["']/i) || get(/name=["']twitter:image["']/i);
  if (!u) return null;
  try { return new URL(decodeEntities(u), base).href; } catch { return null; }
}

async function fetchImage(imageUrl, allowAlpha = false) {
  const res = await fetch(imageUrl, { headers: { 'user-agent': UA, accept: 'image/*,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`kuva HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`content-type ${ct.slice(0, 30)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  if (!meta.width || meta.width < 600) throw new Error(`liian kapea ${meta.width}px`);
  // Alfakanava on yleensä logo. Poikkeus vain käsin (`allowAlpha`), kun kuva on
  // katsottu kontaktiarkilta ja se on aito tuotekuva läpinäkyvällä taustalla.
  if (meta.hasAlpha && !allowAlpha) throw new Error('alfakanava (todennäköisesti logo)');
  return { buf, meta };
}

/**
 * Kirjoittaa yhden rivin kortin kuvasuhteeseen 800x500.
 *
 * `fit: 'contain'` on tuotekuville (tolkkipakkaus): niita ei saa rajata, koska
 * rajaus katkaisee tuotteen. Tausta on yon sininen, joten reunat eivat nay.
 * Muut rajataan `cover` + `attention`, ja tulos KATSOTAAN kontaktiarkilta.
 */
async function writeImage(slug, buf, meta, fit = 'cover') {
  const outPath = path.join(OUT_DIR, `${slug}.webp`);
  const pipeline = sharp(buf).rotate().flatten({ background: '#0F172A' });
  const opts = fit === 'contain'
    ? { width: WIDTH, height: CARD_H, fit: 'contain', background: '#0F172A' }
    : { width: WIDTH, height: CARD_H, fit: 'cover', position: 'attention' };
  await pipeline.resize(opts).webp({ quality: 82 }).toFile(outPath);
  return sharp(outPath).metadata();
}

let ok = 0;
for (const v of venues) {
  if (only && v.slug !== only) continue;
  const row = { name: v.name, website: v.website, fetchedAt: new Date().toISOString().slice(0, 10) };
  try {
    const o = ov.overrides[v.slug];
    let imageUrl, sourceUrl, via;
    if (o) {
      imageUrl = o.imageUrl; sourceUrl = o.sourceUrl; via = 'override';
    } else {
      if (ov.noPhoto?.[v.slug]) throw new Error(ov.noPhoto[v.slug]);
      if (!v.website || /facebook\.com/.test(v.website)) throw new Error('ei omaa verkkosivua (Facebook ei ole haettavissa)');
      const page = await fetch(v.website, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(25000) });
      if (!page.ok) throw new Error(`sivu HTTP ${page.status}`);
      imageUrl = pickImageUrl(await page.text(), page.url);
      sourceUrl = page.url; via = 'og:image';
      if (!imageUrl) throw new Error('ei og:image-tagia');
      if (/logo|icon|favicon|placeholder/i.test(imageUrl)) throw new Error(`og:image on logo/ikoni: ${imageUrl.slice(0, 80)}`);
    }
    const { buf, meta } = await fetchImage(imageUrl);
    const out = await writeImage(v.slug, buf, meta, o?.fit);
    Object.assign(row, {
      src: `/images/venues/${v.slug}.webp`, kind: 'partner', status: 'fetched', via,
      credit: new URL(sourceUrl).hostname.replace(/^www\./, ''), sourceUrl, imageUrl,
      width: out.width, height: out.height, approved: approved.has(v.slug),
      ...(o?.note ? { note: o.note } : {}),
    });
    ok++;
    console.log(`${row.approved ? '✅' : '👀'} ${v.slug.padEnd(28)} ${out.width}x${out.height}  ${via.padEnd(9)} ${row.credit}`);
  } catch (e) {
    Object.assign(row, { status: 'rejected', reason: e.message, approved: false });
    if (fs.existsSync(path.join(OUT_DIR, `${v.slug}.webp`))) fs.unlinkSync(path.join(OUT_DIR, `${v.slug}.webp`));
    console.log(`✗  ${v.slug.padEnd(28)} ${e.message}`);
  }
  registry[v.slug] = row;
}
// Lisäkohteet, joita ei ole bars.ts:ssä (esim. panimo, joka ei ole baari).
for (const [slug, e] of Object.entries(ov.extras ?? {})) {
  if (only && slug !== only) continue;
  const row = { name: e.name, website: e.sourceUrl, fetchedAt: new Date().toISOString().slice(0, 10) };
  try {
    const { buf, meta } = await fetchImage(e.imageUrl, !!e.allowAlpha);
    const out = await writeImage(slug, buf, meta, e.fit);
    Object.assign(row, {
      src: `/images/venues/${slug}.webp`, kind: 'partner', status: 'fetched', via: 'extra',
      credit: new URL(e.sourceUrl).hostname.replace(/^www\./, ''), sourceUrl: e.sourceUrl, imageUrl: e.imageUrl,
      width: out.width, height: out.height, approved: approved.has(slug), ...(e.note ? { note: e.note } : {}),
    });
    ok++;
    console.log(`${row.approved ? '✅' : '👀'} ${slug.padEnd(28)} ${out.width}x${out.height}  extra     ${row.credit}`);
  } catch (err) {
    Object.assign(row, { status: 'rejected', reason: err.message, approved: false });
    console.log(`✗  ${slug.padEnd(28)} ${err.message}`);
  }
  registry[slug] = row;
}

// Hyväksytty mutta ei kuvaa = lista on vanhentunut → kaadu, ettei hyväksyntä jää roikkumaan.
for (const s of approved) if (!registry[s]?.src) { console.error(`🔴 approved-listalla on ${s}, mutta kuvaa ei ole`); process.exitCode = 1; }
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
writeRuntime(registry);
console.log(`\n${ok}/${only ? 1 : venues.length} kuvaa, hyväksytty ${[...approved].length} → ${path.relative(ROOT, REGISTRY)}`);
