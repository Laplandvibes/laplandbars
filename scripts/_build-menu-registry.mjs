/**
 * Rakentaa restaurant-menus.json:in loytoajon tuloksista JA nimenomaisista
 * kasin tehdyista paatoksista. Kertakaytto; paatokset ovat tassa nakyvissa.
 *
 * Aja: node scripts/_build-menu-registry.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyKind, isFrontPage } from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const TODAY = '2026-08-10';

const candidates = JSON.parse(fs.readFileSync(path.join(HERE, '_menu-candidates.json'), 'utf8'));

/** Kasin tehdyt paatokset — jokainen katsottu sivulta asti. */
const OVERRIDE = {
  // Automaatti nappasi yhden alamenun (Pure burger). Menuhakemisto nayttaa
  // kaikki kolme: burger, pizza ja lounas.
  kauppayhtio: {
    url: 'https://www.kauppayhtio.fi/fi/menut',
    title: 'Menut - Kauppayhtiö',
    note: 'Menuhakemisto; automaatti tarjosi yhta alamenua.',
  },
};

const REJECT = {
  // Molemmat Arctic SnowHotelin ehdokkaat olivat VARAUSPAKETTEJA, eivat
  // juomalistoja: "Dinner at Kota Restaurant | Visiting Package" ja
  // "Arctic Snowhotelin esittely ja lounas Jaaravintolassa | Vierailupaketti".
  'ice-bar-arctic-snowhotel': 'sivuston ainoat ehdokkaat ovat varauspaketteja, ei juomalistaa',
  'arctic-snowhotel-icebar': 'sivuston ainoat ehdokkaat ovat varauspaketteja, ei juomalistaa',
};

const REASONS = {
  nosite: (r) => r.reason ?? 'ei omaa verkkosivua',
  unreachable: () => 'verkkosivu ei vastaa',
  weak: () => 'sivustolta ei loytynyt menua etusivulta eika navista',
  rejected: (r) => r.reason ?? 'ehdokas ei kelvannut menuksi',
};

const registry = {};
for (const c of candidates) {
  const slug = c.slug;

  if (REJECT[slug]) {
    registry[slug] = { status: 'none', reason: REJECT[slug], checkedAt: TODAY };
    continue;
  }
  const ov = OVERRIDE[slug];
  if (ov) {
    registry[slug] = {
      url: ov.url, kind: classifyKind(ov.url), title: ov.title,
      evidence: c.evidence ?? 0, note: ov.note, checkedAt: TODAY,
    };
    continue;
  }
  if (['strong', 'titled'].includes(c.verdict) && c.url && !isFrontPage(c.url)) {
    registry[slug] = {
      url: c.url,
      kind: c.kind ?? classifyKind(c.url),
      title: c.title || `${c.name} (PDF)`,
      evidence: c.evidence ?? 0,
      checkedAt: TODAY,
    };
    // Kausileimattu PDF vaihtuu; kuukausivahti nappaa sen mutta jalkikateen.
    if (classifyKind(c.url) === 'pdf' && /kesa|talvi|summer|winter|20\d\d/i.test(c.url)) {
      registry[slug].note = 'kausileimattu PDF — kuukausivahti seuraa';
    }
    continue;
  }
  registry[slug] = {
    status: 'none',
    reason: (REASONS[c.verdict] ?? (() => c.verdict))(c),
    checkedAt: TODAY,
  };
}

const sorted = Object.fromEntries(Object.keys(registry).sort().map((k) => [k, registry[k]]));
fs.mkdirSync(path.join(ROOT, 'src/data/generated'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/data/generated/bar-menus.json'), `${JSON.stringify(sorted, null, 2)}\n`);

const withUrl = Object.values(sorted).filter((e) => e.url).length;
console.log(`${Object.keys(sorted).length} baaria`);
console.log(`  menulinkki: ${withUrl}`);
console.log(`  ei linkkia: ${Object.keys(sorted).length - withUrl}`);
console.log('-> src/data/generated/bar-menus.json');
