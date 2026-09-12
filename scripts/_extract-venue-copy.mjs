#!/usr/bin/env node
// Poimii bars.ts:sta ne kohteet, joilta puuttuu suomenkielinen kaannos, ja
// kirjoittaa niiden EN-lahdetekstin kaannostyota varten.
import fs from 'node:fs';

const src = fs.readFileSync('src/data/bars.ts', 'utf8').replace(/\r\n/g, '\n');
const fi = JSON.parse(fs.readFileSync('src/locales/fi/pages.json', 'utf8')).bars.venues || {};

const STR = String.raw`(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")`;
const unq = (s) => (s == null ? null : s.replace(/\\(['"\\])/g, '$1'));
const pick = (block, field) => {
  const m = block.match(new RegExp(`\\n    ${field}: ${STR},`));
  return m ? unq(m[1] ?? m[2]) : null;
};

const out = [];
for (const block of src.split(/\n  \{\n/).slice(1)) {
  const name = pick('\n' + block, 'name') ?? (() => {
    const m = block.match(new RegExp(`^\\s*name: ${STR},`, 'm'));
    return m ? unq(m[1] ?? m[2]) : null;
  })();
  const cityM = block.match(/^\s*city: '([^']+)',/m);
  if (!name || !cityM) continue;
  if (fi[name]) continue; // jo kaannetty
  const typeM = block.match(new RegExp(`^\\s*type: ${STR},`, 'm'));
  const descM = block.match(new RegExp(`^\\s*description: ${STR},`, 'm'));
  const hlM = block.match(/^\s*highlights: \[([^\]]*)\],/m);
  const highlights = hlM
    ? [...hlM[1].matchAll(new RegExp(STR, 'g'))].map((m) => unq(m[1] ?? m[2]))
    : [];
  out.push({
    name,
    city: cityM[1],
    type: typeM ? unq(typeM[1] ?? typeM[2]) : '',
    description: descM ? unq(descM[1] ?? descM[2]) : '',
    highlights,
  });
}
fs.writeFileSync('scripts/_new-venue-copy.source.json', JSON.stringify(out, null, 2) + '\n');
const chars = out.reduce((n, v) => n + v.type.length + v.description.length + v.highlights.join('').length, 0);
console.log(`kaannettavia kohteita: ${out.length} · merkkeja ${chars}`);
const byCity = {};
for (const v of out) byCity[v.city] = (byCity[v.city] || 0) + 1;
console.log(Object.entries(byCity).map(([c, n]) => `${c} ${n}`).join(' · '));
