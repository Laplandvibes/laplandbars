/**
 * Etsii jokaiselle baarille ehdokkaan menulinkiksi (juoma- tai ruokalista).
 *
 * Sama putki kuin laplanddiningissa 2026-08-10. EI julkaise mitaan: tuottaa
 * ehdokaslistan + katselmussivun, jotka ihminen kuittaa. Diningissa automaatti
 * tarjosi annoskuvaa menuksi ja antoi pizzerialle naapurin a la carten.
 *
 * Baarikohtainen ero: bars.ts:n `website`-osoitteet ovat jo ENGLANNIKSI
 * (/en/, /en/home). Siksi etsitaan seka sivuston oma menu etta suomenkielinen
 * vastine — peilikuva diningin tilanteesta.
 *
 * Aja: node scripts/discover-menu-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  scoreCandidate, countPriceTokens, classifyKind, sameHost, titleLooksLikeMenu, isFrontPage, EVIDENCE_MIN,
} from './lib/menu-detect.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const TIMEOUT = 15000;
const CONCURRENCY = 4;
const SOCIAL = /facebook\.com|instagram\.com/i;

/** Baarit bars.ts:sta. Tiedosto on kasin yllapidetty TS, ei generoitua JSONia. */
function loadBars() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/bars.ts'), 'utf8');
  // Lohkotaan `name:`-rivien kohdalta, jotta website osuu oikeaan baariin.
  const blocks = src.split(/\n\s{4}name: '/).slice(1);
  return blocks.map((b) => {
    const name = b.slice(0, b.indexOf("'"));
    const city = (b.match(/\n\s{4}city: '([^']+)'/) || [])[1] ?? '';
    const website = (b.match(/\n\s{4}website: '([^']+)'/) || [])[1] ?? null;
    // Skandit translitteroidaan, ei pudoteta: pelkka [^a-z0-9] tekisi
    // "Pub Holmolasta" muodon `pub-h-lm-l` ja "Kauppayhtiosta" `kauppayhti`,
    // jolloin kasin tehdyt override-avaimet eivat osu mihinkaan.
    const slug = name.toLowerCase()
      .replace(/[äå]/g, 'a').replace(/ö/g, 'o').replace(/[éè]/g, 'e').replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return { slug, name, city, site: website };
  });
}

async function get(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9,fi;q=0.8' },
      redirect: 'follow',
      signal: ctl.signal,
    });
    const ct = res.headers.get('content-type') ?? '';
    const body = res.ok && /text|html|pdf/i.test(ct) ? await res.text() : '';
    return { ok: res.ok, status: res.status, url: res.url, body };
  } catch (e) {
    return { ok: false, status: e.name === 'AbortError' ? 'timeout' : 'error', url, body: '' };
  } finally {
    clearTimeout(timer);
  }
}

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const titleOf = (h) => (h.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();

/** Baarikohtaiset termit yleisten menutermien lisaksi. */
const DRINK_WORDS = /juomalist|drinks?\s?(list|menu)|cocktail|olutlist|beer\s?(list|menu)|tap\s?list|viinilist|wine\s?list/i;

function candidates(html, baseUrl) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]{0,200}?)<\/a>/gi)) {
    const href = m[1];
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    let score = scoreCandidate(href, text);
    // Juomalistatermit ovat baarissa yhta vahva signaali kuin ruokalista.
    if (!score && DRINK_WORDS.test(`${href} ${text}`)) score = 9;
    if (score <= 0) continue;
    try { out.push({ url: new URL(href, baseUrl).toString(), text, score }); } catch { /* kelvoton */ }
  }
  const seen = new Set();
  return out.filter((c) => !seen.has(c.url) && seen.add(c.url)).sort((a, b) => b.score - a.score);
}

function navLinks(html, baseUrl) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = m[1];
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) continue;
    try {
      const u = new URL(href, baseUrl);
      if (!sameHost(u.toString(), baseUrl)) continue;
      if (classifyKind(u.toString()) === 'image') continue;
      out.push(u.toString());
    } catch { /* kelvoton */ }
  }
  return [...new Set(out)].slice(0, 12);
}

async function evaluate(url, siteUrl, linkText) {
  const kind = classifyKind(url);
  if (kind === 'image') return { verdict: 'rejected', reason: 'kuvatiedosto' };
  if (isFrontPage(url)) return { verdict: 'rejected', reason: 'etusivu' };
  if (!sameHost(url, siteUrl)) return { verdict: 'rejected', reason: 'vieras domain' };
  const res = await get(url);
  if (!res.ok) return { verdict: 'rejected', reason: `ehdokas ${res.status}` };

  const title = titleOf(res.body);
  const evidence = kind === 'pdf' ? null : countPriceTokens(strip(res.body));
  let verdict = 'weak';
  if (evidence !== null && evidence >= EVIDENCE_MIN) verdict = 'strong';
  else if (titleLooksLikeMenu(title) || titleLooksLikeMenu(res.url) || titleLooksLikeMenu(linkText)
           || DRINK_WORDS.test(`${title} ${res.url} ${linkText}`)) verdict = 'titled';

  return { verdict, kind, title, evidence, url: res.url };
}

async function probe(b) {
  const base = { slug: b.slug, name: b.name, city: b.city, site: b.site };
  if (!b.site) return { ...base, verdict: 'nosite', reason: 'ei verkkosivua' };
  if (SOCIAL.test(b.site)) return { ...base, verdict: 'nosite', reason: 'vain some-sivu' };

  const front = await get(b.site);
  if (!front.ok) return { ...base, verdict: 'unreachable', reason: `verkkosivu ${front.status}` };

  let cands = candidates(front.body, front.url);
  if (cands.length === 0) {
    for (const link of navLinks(front.body, front.url)) {
      const sub = await get(link);
      if (!sub.ok) continue;
      const deeper = candidates(sub.body, sub.url);
      if (deeper.length) { cands = deeper; break; }
    }
  }
  if (cands.length === 0) return { ...base, verdict: 'weak', reason: 'ei ehdokasta etusivulta eika navista' };

  let best = null;
  const rank = { strong: 3, titled: 2, weak: 1, rejected: 0 };
  for (const c of cands.slice(0, 4)) {
    const ev = await evaluate(c.url, b.site, c.text);
    const cand = { ...base, ...ev, score: c.score, url: ev.url ?? c.url };
    if (!best || rank[cand.verdict] > rank[best.verdict]) best = cand;
    if (cand.verdict === 'strong') break;
  }
  return best;
}

const bars = loadBars();
console.log(`Baareja: ${bars.length}`);
const results = [];
let i = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < bars.length) {
    results.push(await probe(bars[i++]));
    process.stdout.write('.');
  }
}));
process.stdout.write('\n');

// Sama verkkotunnus usealla baarilla = riski etta toinen sai naapurin listan.
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./i, '').toLowerCase(); } catch { return null; } };
const hostCount = results.reduce((a, r) => {
  const h = r.site && !SOCIAL.test(r.site) && hostOf(r.site);
  if (h) a[h] = (a[h] ?? 0) + 1;
  return a;
}, {});
results.forEach((r) => { const h = r.site && hostOf(r.site); if (h && hostCount[h] > 1) r.sharedDomain = h; });

const order = { strong: 0, titled: 1, weak: 2, rejected: 3, unreachable: 4, nosite: 5 };
results.sort((a, b) => (order[a.verdict] - order[b.verdict]) || (b.evidence ?? 0) - (a.evidence ?? 0));
fs.writeFileSync(path.join(HERE, '_menu-candidates.json'), JSON.stringify(results, null, 1));

const counts = Object.entries(results.reduce((a, r) => ({ ...a, [r.verdict]: (a[r.verdict] ?? 0) + 1 }), {}))
  .map(([k, v]) => `${k}: ${v}`).join(' · ');
console.log(counts);
for (const r of results.filter((x) => ['strong', 'titled'].includes(x.verdict))) {
  console.log(`${r.verdict.padEnd(7)} ${String(r.evidence ?? '-').padStart(3)} ${r.name.slice(0, 24).padEnd(24)} ${r.url}`);
}
console.log('\n-> scripts/_menu-candidates.json');
