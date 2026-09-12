#!/usr/bin/env node
// Yhdistaa tyonkulun journalista kartoituksen (vaihe 1+2) ja vastatarkistuksen
// (vaihe 3) yhdeksi tiedostoksi scripts/_new-bars.verified.json.
// verdict keep -> rivi sellaisenaan, fix -> corrected-versio, drop -> pois.
import fs from 'node:fs';
const J = process.argv[2];
const OUT = 'scripts/_new-bars.verified.json';
const lines = fs.readFileSync(J, 'utf8').trim().split('\n');
const label = {}, res = [];
for (const l of lines) {
  let j; try { j = JSON.parse(l); } catch { continue; }
  if (j.label) label[j.agentId] = j.label;
  if (j.type === 'result') res.push({ label: label[j.agentId] || '?', r: j.result });
}
const dest = {};
for (const { label: lab, r } of res) {
  if (!r || typeof r !== 'object') continue;
  const city = lab.split(':')[1];
  if (!city) continue;
  dest[city] ||= { city, candidates: [], verdicts: null };
  if (Array.isArray(r.venues)) dest[city].candidates.push(...r.venues);
  if (Array.isArray(r.extra)) dest[city].candidates.push(...r.extra);
  if (Array.isArray(r.results)) dest[city].verdicts = r.results;
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const out = [];
let kept = 0, dropped = 0, fixed = 0, unjudged = 0;
for (const d of Object.values(dest)) {
  const byName = new Map();
  for (const v of d.candidates) if (!byName.has(norm(v.name))) byName.set(norm(v.name), v);
  const venues = [];
  for (const verdict of d.verdicts || []) {
    const base = byName.get(norm(verdict.name));
    if (verdict.verdict === 'drop') { dropped++; continue; }
    const merged = verdict.verdict === 'fix' && verdict.corrected
      ? { ...(base || {}), ...Object.fromEntries(Object.entries(verdict.corrected).filter(([, x]) => x !== undefined && x !== '')) }
      : base;
    if (!merged || !merged.name) { unjudged++; continue; }
    if (verdict.verdict === 'fix') fixed++; else kept++;
    venues.push(merged);
  }
  out.push({ city: d.city, venues });
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`keep ${kept} · fix ${fixed} · drop ${dropped} · nimi ei tasmannyt ${unjudged}`);
for (const d of out) console.log(`  ${d.city.padEnd(12)} ${d.venues.length}`);
