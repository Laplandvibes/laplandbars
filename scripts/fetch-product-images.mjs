#!/usr/bin/env node
/**
 * Juomakulttuurisivun AIDOT tuotekuvat Wikimedia Commonsista lisenssitietoineen.
 *
 * Vesa 11.9.2026 /drinking-culture-sivusta: *"mieti nyt koko homma uusiksi,
 * visuaalinen tyyli pitää olla meidän brändien mukainen ja vaatimustaso"* —
 * ja sääntö `_claude/feedback_ei_geneerista_ai_ulkoasua.md`: «emotion» tulee
 * aidosta aineesta (oikea esine), ei AI-tunnelmakuvasta. Hartwall-tölkki
 * (CC BY-SA, 10.7.2026) oli se, mikä toimi; tämä laajentaa saman reseptin
 * Koskenkorvaan, Finlandiaan ja Lapin Kultaan.
 *
 * Lisenssiportti: vain CC BY / CC BY-SA / CC0 / Public domain. NC- ja ND-
 * lisenssit hylätään (sivu on kaupallinen: affiliate-CTA). Attribuutio
 * kirjoitetaan rekisteriin ja renderöidään kuvan alle (tekijä, Commons-linkki,
 * lisenssi + linkki) — CC BY vaatii sen.
 *
 * Tuotokset:
 *   public/images/products/<key>.webp
 *   src/data/generated/product-images.json
 *
 * Aja: node scripts/fetch-product-images.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public/images/products');
const REGISTRY = path.join(ROOT, 'src/data/generated/product-images.json');
const UA = 'LaplandVibes-editorial/1.0 (https://laplandvibes.com; info@laplandvibes.com)';

/** Valittu kontaktiarkilta 11.9.2026 (scratchpad commons_sheet.png). */
const FILES = {
  // Tapio Wirkkalan pullo; Commonsin Artist-kenttä on "Wirkkala, Tapio. Photograph: Helsingin kaupunginmuseo" +
  // rikkinäinen merkki, joten tekijä (valokuvaaja) annetaan käsin.
  koskenkorva: { title: 'File:Koskenkorvan Viina.jpg', artist: 'Helsingin kaupunginmuseo' },
  finlandia: { title: 'File:Finlandia Vodka Suomi.jpg' },        // nykyinen jääpullo, Warinhari, CC BY-SA 4.0
  lapinKulta: { title: 'File:Lapin Kulta.JPG' },                 // tölkki tummalla, Xanor, CC0
  // Läpinäkyvä PNG (tölkki irrotettuna): ei rajata, vaan sovitetaan kehykseen.
  lonkero: { title: 'File:Hartwall Original Long Drink.png', fit: 'contain' }, // ComradeUranium, CC BY-SA 4.0 (sama kuin 10.7.)
};

const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const titles = Object.values(FILES).map((f) => f.title).join('|');
const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1200&format=json`;
const j = await (await fetch(api, { headers: { 'user-agent': UA } })).json();
const byTitle = new Map(Object.values(j.query.pages).map((p) => [p.title.replace(/_/g, ' '), p]));

fs.mkdirSync(OUT_DIR, { recursive: true });
const registry = {};
let failed = 0;
for (const [key, spec] of Object.entries(FILES)) {
  const title = spec.title;
  const p = byTitle.get(title.replace(/_/g, ' '));
  const ii = p?.imageinfo?.[0];
  try {
    if (!ii) throw new Error('ei löydy Commonsista');
    const em = ii.extmetadata || {};
    const licence = strip(em.LicenseShortName?.value);
    if (!/^(CC BY(-SA)?( \d(\.\d)?)?|CC0|Public domain)/i.test(licence) || /NC|ND/i.test(licence)) throw new Error(`lisenssi ei kelpaa: ${licence}`);
    const artist = spec.artist || strip(em.Artist?.value) || strip(em.Credit?.value) || 'Tuntematon';
    const res = await fetch(ii.thumburl || ii.url, { headers: { 'user-agent': UA } });
    if (!res.ok) throw new Error(`kuva HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const outPath = path.join(OUT_DIR, `${key}.webp`);
    // 🔴 Kehys on 4:5 (800x1000) ja pullo EI saa rajautua: rajaus katkaisisi
    // tuotteen. Siksi `contain` yon siniselle taustalle, ei `cover`. Sama
    // oppi kuin korttikuvissa 12.9.2026: kuva tehdaan kehyksen suhteeseen,
    // jotta selain ei rajaa sita toista kertaa.
    await sharp(buf).rotate().flatten({ background: '#0F172A' })
      .resize({ width: 800, height: 1000, fit: 'contain', background: '#0F172A' })
      .webp({ quality: 84 }).toFile(outPath);
    const out = await sharp(outPath).metadata();
    registry[key] = {
      src: `/images/products/${key}.webp`, width: out.width, height: out.height,
      fit: 'contain',
      title: strip(em.ObjectName?.value) || title.replace(/^File:/, ''),
      artist, licence,
      licenceUrl: strip(em.LicenseUrl?.value) || (/CC0/i.test(licence) ? 'https://creativecommons.org/publicdomain/zero/1.0/' : ''),
      fileUrl: ii.descriptionurl,
      fetchedAt: new Date().toISOString().slice(0, 10),
    };
    console.log(`✅ ${key.padEnd(12)} ${out.width}x${out.height}  ${licence.padEnd(14)} ${artist.slice(0, 50)}`);
  } catch (e) {
    failed++;
    console.log(`✗  ${key.padEnd(12)} ${e.message}`);
  }
}
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
console.log(`\n${Object.keys(registry).length}/${Object.keys(FILES).length} → ${path.relative(ROOT, REGISTRY)}`);
if (failed) process.exitCode = 1;
