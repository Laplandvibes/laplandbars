#!/usr/bin/env node
/**
 * verify-venues.mjs — fact-check every named bar / pub / ice bar in
 * `src/data/bars.ts` against Google Places API (New).
 *
 * Run:
 *   cd laplandbars-new && node scripts/verify-venues.mjs
 *
 * Cost: Places API (New) Text Search, **Pro** SKU (rating + userRatingCount are
 * Pro fields) = $0.032 / request. One request per registry venue. The field
 * mask below is deliberately minimal — `reviews`, `regularOpeningHours`,
 * `websiteUri` and `priceLevel` are Enterprise-tier fields and would multiply
 * the bill.
 *
 * Writes exactly one file:
 *   src/data/generated/venues-from-maps.json
 *
 * It NEVER writes src/data/bars.ts. That file is the hand-maintained editorial
 * layer and the two layers stay separate, so a re-run can never clobber
 * editorial work.
 *
 * ── FAIL CLOSED ──────────────────────────────────────────────────────────────
 * A rating pasted onto the WRONG venue is worse than no rating: it is a
 * fabricated recommendation that looks exactly like a correct one. A candidate
 * is accepted only when ALL gates pass. Gate set is the union of the hardening
 * learned on laplandhoteldeals, laplandstays and laplandweddings:
 *
 *   1. NAME       — whole-word containment, or compacted containment guarded by
 *                   the chain-sibling rule, or Dice bigrams >= 0.72 likewise
 *                   guarded. Word boundaries matter: plain compacted
 *                   containment accepts "…Ylläs" inside "…Ylläskaltio".
 *   2. NOT-THE-   A candidate whose whole name is just the locality ("Levi",
 *      PLACE        "Ylläs") is the resort/municipality, not our venue.
 *   3. HEAD TOKEN — the LAST word of the registry name must survive into the
 *                   candidate. Within a chain the final word is what tells two
 *                   properties apart.
 *   4. SUB-UNIT   — per-venue `rejectNames`: listings that are a sub-unit of the
 *                   venue, or its parent hotel. 🔴 This site's specific risk:
 *                   most bars here sit INSIDE a hotel or share a name with a
 *                   restaurant, so a hotel's rating must never be published as
 *                   the bar's, or vice versa.
 *   5. PLACE      — returned `formattedAddress` contains an expected locality.
 *   6. BBOX       — coordinate inside the Finnish Lapland bounding box.
 *   7. UNIQUE     — post-pass: two registry venues resolving to one Google
 *      PLACE        Place ID means we would print one business's reviews under
 *                   two names. Both dropped.
 *
 * Anything that fails is listed under "unmatched" with the reason, for human
 * follow-up. businessStatus is reported rather than silently dropped: a
 * CLOSED_PERMANENTLY listing is the single most valuable finding on a
 * nightlife/bar site, where turnover is high.
 *
 * The API key is read from .env.local (gitignored), never printed, never
 * written to any output file, never committed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PLACES_BASE = 'https://places.googleapis.com/v1';

// ── API key ────────────────────────────────────────────────────────────────
async function loadApiKey() {
  const envPath = path.join(ROOT, '.env.local');
  let envText;
  try {
    envText = await fs.readFile(envPath, 'utf-8');
  } catch {
    console.error(`FATAL: ${envPath} not found. Add GOOGLE_MAPS_API_KEY=... to it.`);
    process.exit(1);
  }
  const m = envText.match(/^GOOGLE_MAPS_API_KEY\s*=\s*(.+?)\s*$/m);
  if (!m) {
    console.error('FATAL: GOOGLE_MAPS_API_KEY missing from .env.local');
    process.exit(1);
  }
  return m[1].replace(/^["']|["']$/g, '');
}

/**
 * Locality variants per registry `city` value. Compared against the normalised
 * formattedAddress, so written folded (Ylläs -> yllas, Äkäslompolo ->
 * akaslompolo). Also the list used by the "candidate is just the locality"
 * rejection, so keep it to real place names.
 *
 * Several venues sit outside the resort their city field groups them under —
 * Arctic SnowHotel is in Sinettä/Lehtojärvi 30 km from Rovaniemi, SnowVillage
 * is in Lainio — which is why the postal town parsed out of our own `address`
 * field is appended to this list per venue.
 */
const CITY_LOCALITIES = {
  Rovaniemi: ['rovaniemi', 'sinetta', 'lehtojarvi'],
  Levi: ['levi', 'sirkka', 'kittila', 'kongas'],
  'Ylläs': ['yllas', 'yllasjarvi', 'akaslompolo', 'kolari', 'lainio'],
  'Saariselkä': ['saariselka', 'inari', 'ivalo'],
  'Lainio, Ylläs': ['lainio', 'kittila', 'yllas', 'yllasjarvi'],
  'Rovaniemi (30min)': ['rovaniemi', 'sinetta', 'lehtojarvi'],
  'Santa Claus Village, Rovaniemi': ['rovaniemi'],
};

const QUERY_CITY = {
  Rovaniemi: 'Rovaniemi, Lapland, Finland',
  Levi: 'Levi, Kittilä, Lapland, Finland',
  'Ylläs': 'Ylläs, Kolari, Lapland, Finland',
  'Saariselkä': 'Saariselkä, Inari, Lapland, Finland',
  'Lainio, Ylläs': 'Lainio, Kittilä, Lapland, Finland',
  'Rovaniemi (30min)': 'Rovaniemi, Lapland, Finland',
  'Santa Claus Village, Rovaniemi': 'Santa Claus Village, Rovaniemi, Finland',
};

/**
 * Per-venue listing exclusions. 🔴 The bar-specific trap: a lobby bar inside a
 * hotel, or a bar sharing a name with the restaurant it lives in, will surface
 * the PARENT's listing. Publishing the hotel's 4.3/2100 reviews as the bar's
 * rating is exactly the fabrication this script exists to prevent.
 */
const REJECT_NAMES = {
  'Ice Bar @ Arctic SnowHotel': ['arctic snowhotel & glass igloos', 'glass igloos', 'arctic snowhotel resort'],
  'Arctic SnowHotel IceBar': ['arctic snowhotel & glass igloos', 'glass igloos', 'arctic snowhotel resort'],
  'SnowVillage IceBar': ['lainio snow village hotel', 'snowvillage hotel'],
  'Snowman World Ice Bar': ['santa claus village', 'snowman world igloo hotel'],
  'Hullu Poro Areena': ['hotel hullu poro', 'hotelli hullu poro'],
  'Pub Hölmölä': ['hotel hullu poro', 'hotelli hullu poro'],
  'Nook Lounge': ["santa's hotel santa claus", 'santas hotel santa claus'],
  'Bull Bar & Grill': ['arctic city hotel'],
  'Restaurant Tuikku': ['levi ski resort', 'gondoli'],
};

/** Finnish Lapland bounding box (plus a small margin). */
const LAPLAND_BBOX = { minLat: 65.4, maxLat: 70.2, minLng: 20.0, maxLng: 31.0 };

// ── Registry reader (single source of truth for names) ──────────────────────
async function readRegistry() {
  const src = (await fs.readFile(path.join(ROOT, 'src/data/bars.ts'), 'utf-8')).replace(/\r\n/g, '\n');
  const blocks = src.split(/\n  \{\n/).slice(1);
  const out = [];
  for (const b of blocks) {
    const n = b.match(/name: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/);
    if (!n) continue;
    const name = (n[1] !== undefined ? n[1] : n[2]).replace(/\\(['"\\])/g, '$1');
    const city = b.match(/city: '(.+?)'/);
    const location = b.match(/location: '(.+?)'/);
    const address = b.match(/address: '(.+?)'/);
    const website = b.match(/website: '(.+?)'/);
    out.push({
      name,
      city: city ? city[1] : location ? location[1] : null,
      address: address ? address[1] : null,
      website: website ? website[1] : null,
    });
  }
  if (out.length === 0) {
    console.error('FATAL: could not parse any venues out of src/data/bars.ts.');
    console.error('       The registry format changed — fix the parser before trusting a run.');
    process.exit(1);
  }
  return out;
}

// ── Name matching ──────────────────────────────────────────────────────────
const fold = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const compact = (s) => fold(s).replace(/ /g, '');

function bigrams(s) {
  const out = new Set();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

/** Sørensen–Dice coefficient over character bigrams (0..1). */
function dice(a, b) {
  const A = bigrams(a);
  const B = bigrams(b);
  if (A.size === 0 || B.size === 0) return 0;
  let shared = 0;
  for (const g of A) if (B.has(g)) shared++;
  return (2 * shared) / (A.size + B.size);
}

const NAME_MIN_DICE = 0.72;

/**
 * Tokens that carry no identity — corporate forms and the generic descriptors
 * Google routinely appends. A candidate differing only by these is the same
 * business.
 */
const GENERIC_TOKENS = new Set([
  'hotel', 'hotels', 'resort', 'resorts', 'inn', 'lodge', 'spa', 'suites',
  'apartments', 'chalets', 'cabins', 'igloos', 'glass', 'activities', 'safaris',
  'oy', 'ab', 'oyj', 'ltd', 'the', 'and',
  // bar/nightlife descriptors Google appends or drops freely
  'bar', 'bars', 'pub', 'pubs', 'club', 'nightclub', 'lounge', 'cafe',
  'restaurant', 'ravintola', 'baari', 'grill', 'kitchen', 'panimo', 'brewery',
]);

/** A distinctive token this long is treated as a proper name, not a descriptor. */
const CHAIN_GUARD_MIN_LEN = 5;

/**
 * CHAIN-SIBLING GUARD. Dice similarity only means two names LOOK alike, which
 * is exactly what chain siblings do. On the fuzzy path the candidate may not
 * introduce a substantial word of its own: any non-generic token of 5+
 * characters that our name lacks is evidence Google returned a DIFFERENT member
 * of the same family. Do not relax this to force a match.
 */
function chainSiblingGate(expected, candidate) {
  const exp = new Set(fold(expected).split(' ').filter(Boolean));
  const intruders = fold(candidate)
    .split(' ')
    .filter((t) => t.length >= CHAIN_GUARD_MIN_LEN && !GENERIC_TOKENS.has(t) && !exp.has(t));
  return { ok: intruders.length === 0, intruders };
}

/**
 * Whole-word containment: `needle` occurs inside `hay` and both ends land on a
 * token boundary. Without the boundary check, "Lapland Hotels Ylläs" is
 * literally a prefix of "Lapland Hotels Ylläskaltio" once spaces are stripped.
 */
function boundaryContains(hay, needle) {
  if (!hay || !needle) return false;
  let from = 0;
  for (;;) {
    const i = hay.indexOf(needle, from);
    if (i === -1) return false;
    const end = i + needle.length;
    const leftOk = i === 0 || hay[i - 1] === ' ';
    const rightOk = end === hay.length || hay[end] === ' ';
    if (leftOk && rightOk) return true;
    from = i + 1;
  }
}

function nameGate(expected, candidate) {
  const a = compact(expected);
  const b = compact(candidate);
  if (!a || !b) return { ok: false, score: 0, how: 'empty' };

  const af = fold(expected);
  const bf = fold(candidate);
  if (boundaryContains(bf, af) || boundaryContains(af, bf)) {
    return { ok: true, score: 1, how: 'containment' };
  }

  if (b.includes(a) || a.includes(b)) {
    const chain = chainSiblingGate(expected, candidate);
    if (chain.ok) return { ok: true, score: 1, how: 'containment (compacted)' };
    return { ok: false, score: 1, how: `compacted containment but chain sibling — adds "${chain.intruders.join('", "')}"` };
  }

  const d = dice(a, b);
  if (d < NAME_MIN_DICE) return { ok: false, score: d, how: `dice ${d.toFixed(2)}` };
  const chain = chainSiblingGate(expected, candidate);
  if (!chain.ok) {
    return { ok: false, score: d, how: `dice ${d.toFixed(2)} but chain sibling — adds "${chain.intruders.join('", "')}"` };
  }
  return { ok: true, score: d, how: `dice ${d.toFixed(2)}` };
}

function genericNameGate(candidate, localities) {
  const c = compact(candidate);
  if (c.length < 5) return { ok: false, why: `candidate name "${candidate}" too short to identify a business` };
  if (localities.some((l) => compact(l) === c)) {
    return { ok: false, why: `candidate "${candidate}" is the locality itself, not the venue` };
  }
  return { ok: true };
}

function headTokenGate(expected, candidate) {
  const tokens = fold(expected).split(' ').filter(Boolean);
  const head = tokens[tokens.length - 1];
  if (!head) return { ok: true };
  const ok = compact(candidate).includes(head);
  return {
    ok,
    why: ok ? '' : `"${candidate}" is missing the identifying word "${head}" — likely a sibling property of the same chain`,
  };
}

function rejectListGate(candidate, rejectNames = []) {
  const c = compact(candidate);
  const hit = rejectNames.find((r) => c.includes(compact(r)));
  return {
    ok: !hit,
    why: hit ? `"${candidate}" is a sub-unit / parent listing ("${hit}"), not the venue as published` : '',
  };
}

function placeGate(address, localities) {
  const a = fold(address || '');
  const hit = localities.find((l) => a.includes(l));
  return { ok: Boolean(hit), hit };
}

function bboxGate(loc) {
  if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
    return { ok: false, why: 'no coordinate' };
  }
  const { latitude: lat, longitude: lng } = loc;
  const ok =
    lat >= LAPLAND_BBOX.minLat && lat <= LAPLAND_BBOX.maxLat &&
    lng >= LAPLAND_BBOX.minLng && lng <= LAPLAND_BBOX.maxLng;
  return { ok, why: ok ? '' : `outside Lapland (${lat.toFixed(3)}, ${lng.toFixed(3)})` };
}

// ── Places API ─────────────────────────────────────────────────────────────
/** Minimal Pro-tier field mask. Do not add Enterprise fields casually. */
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.businessStatus',
].join(',');

async function textSearch(apiKey, textQuery) {
  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({ textQuery, languageCode: 'en', regionCode: 'FI', maxResultCount: 5 }),
  });
  if (!res.ok) {
    const body = await res.text();
    // Never echo the key; keep the slice short so a future API change cannot leak much.
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  return data.places || [];
}

/** Postal town out of "Tunturintie 16, 95970 Äkäslompolo" → "akaslompolo". */
function postalTown(address) {
  if (!address) return null;
  const m = address.match(/\b\d{5}\s+([^,]+)$/);
  return m ? fold(m[1]) : null;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const apiKey = await loadApiKey();
  const registry = await readRegistry();
  const today = new Date().toISOString().slice(0, 10);

  console.log(`Registry: ${registry.length} venues parsed from src/data/bars.ts`);
  console.log('Places API (New) Text Search · Pro SKU · ~$0.032/request\n');

  const matched = {};
  const unmatched = [];
  const closed = [];
  let requests = 0;

  for (const venue of registry) {
    const key = venue.name;
    const baseLocalities = CITY_LOCALITIES[venue.city];
    if (!baseLocalities) {
      unmatched.push({ key, name: venue.name, city: venue.city, reason: `no CITY_LOCALITIES entry for city "${venue.city}" — add it before syncing` });
      console.log(`  x ${key.padEnd(30)} no CITY_LOCALITIES for "${venue.city}" — skipped (fail closed)`);
      continue;
    }
    const pt = postalTown(venue.address);
    const localities = pt && !baseLocalities.includes(pt) ? [...baseLocalities, pt] : baseLocalities;
    const queryCity = QUERY_CITY[venue.city] || `${venue.city}, Lapland, Finland`;

    const textQuery = `${venue.name}, ${queryCity}`;
    let places;
    try {
      places = await textSearch(apiKey, textQuery);
      requests++;
    } catch (e) {
      unmatched.push({ key, name: venue.name, reason: `API error: ${e.message}` });
      console.log(`  x ${key.padEnd(30)} API error: ${e.message}`);
      continue;
    }

    const rejected = [];
    let accepted = null;

    for (const p of places) {
      const candName = p.displayName?.text || '';
      const n = nameGate(venue.name, candName);
      if (!n.ok) { rejected.push(`"${candName}" name mismatch (${n.how})`); continue; }
      const g = genericNameGate(candName, localities);
      if (!g.ok) { rejected.push(g.why); continue; }
      const h = headTokenGate(venue.name, candName);
      if (!h.ok) { rejected.push(h.why); continue; }
      const rj = rejectListGate(candName, REJECT_NAMES[venue.name]);
      if (!rj.ok) { rejected.push(rj.why); continue; }
      const pl = placeGate(p.formattedAddress, localities);
      if (!pl.ok) {
        rejected.push(`"${candName}" wrong place — address "${p.formattedAddress}" has none of [${localities.join(', ')}]`);
        continue;
      }
      const bb = bboxGate(p.location);
      if (!bb.ok) { rejected.push(`"${candName}" ${bb.why}`); continue; }

      // Business status is a FINDING, not just a rejection reason: a closed bar
      // is the thing this sweep is looking for.
      if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') {
        closed.push({
          key, name: venue.name, city: venue.city,
          matchedName: candName, businessStatus: p.businessStatus,
          address: p.formattedAddress, googlePlaceId: p.id,
        });
        rejected.push(`"${candName}" businessStatus=${p.businessStatus} (RECORDED as closed finding)`);
        continue;
      }
      if (typeof p.rating !== 'number' || typeof p.userRatingCount !== 'number') {
        rejected.push(`"${candName}" matched but Google returned no rating`);
        continue;
      }
      accepted = { p, nameHow: n.how, localityHit: pl.hit };
      break;
    }

    if (!accepted) {
      unmatched.push({
        key, name: venue.name, city: venue.city, address: venue.address, website: venue.website,
        candidates: places.map((p) => `${p.displayName?.text} @ ${p.formattedAddress}${p.businessStatus && p.businessStatus !== 'OPERATIONAL' ? ` [${p.businessStatus}]` : ''}`),
        reason: rejected.length ? rejected.join(' | ') : 'Text Search returned no candidates',
      });
      console.log(`  x ${key.padEnd(30)} NO SAFE MATCH`);
      for (const r of rejected) console.log(`       · ${r}`);
      if (!places.length) console.log('       · (Text Search returned nothing at all)');
      continue;
    }

    const { p } = accepted;
    matched[key] = {
      matchedName: p.displayName.text,
      rating: p.rating,
      reviewCount: p.userRatingCount,
      googlePlaceId: p.id,
      address: p.formattedAddress,
      registryAddress: venue.address,
      location: p.location,
      lastVerified: today,
    };
    console.log(
      `  v ${key.padEnd(30)} ${String(p.rating).padEnd(4)} · ${String(p.userRatingCount).padStart(5)} reviews  ` +
        `[${accepted.nameHow}, locality "${accepted.localityHit}"]  ${p.displayName.text}`,
    );
  }

  // ── UNIQUE PLACE gate (post-pass) ────────────────────────────────────────
  const byPlaceId = new Map();
  for (const [key, rec] of Object.entries(matched)) {
    const list = byPlaceId.get(rec.googlePlaceId) || [];
    list.push(key);
    byPlaceId.set(rec.googlePlaceId, list);
  }
  for (const [placeId, keys] of byPlaceId) {
    if (keys.length < 2) continue;
    console.log(`\n  ! DUPLICATE PLACE ${placeId} claimed by ${keys.length} venues — dropping all (fail closed):`);
    for (const key of keys) {
      const rec = matched[key];
      console.log(`       · ${key} → "${rec.matchedName}"`);
      unmatched.push({
        key, name: key,
        reason: `duplicate Google place ${placeId} ("${rec.matchedName}") also claimed by ${keys.filter((k) => k !== key).join(', ')} — same business under two registry entries`,
      });
      delete matched[key];
    }
  }

  const generatedDir = path.join(ROOT, 'src/data/generated');
  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(
    path.join(generatedDir, 'venues-from-maps.json'),
    JSON.stringify({
      _README:
        'GENERATED by scripts/verify-venues.mjs from Google Places API (New) Text Search. ' +
        'Do not hand-edit: re-run the script instead. Editorial data (names, descriptions, ' +
        'hours, prices) lives in src/data/bars.ts and is never written by this script.',
      _syncedAt: today,
      venues: matched, closed, unmatched,
    }, null, 2) + '\n',
  );

  const ratings = Object.values(matched).map((m) => m.rating).sort((a, b) => a - b);
  const counts = Object.values(matched).map((m) => m.reviewCount).sort((a, b) => a - b);
  const median = (arr) => (arr.length === 0 ? null : arr.length % 2 ? arr[(arr.length - 1) / 2] : (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2);

  console.log('');
  console.log(`v ${Object.keys(matched).length}/${registry.length} venues verified against Google`);
  if (ratings.length) {
    console.log(`  rating  min ${ratings[0]}  median ${median(ratings)}  max ${ratings[ratings.length - 1]}`);
    console.log(`          all: ${ratings.join(', ')}`);
    console.log(`  reviews min ${counts[0]}  median ${median(counts)}  max ${counts[counts.length - 1]}`);
    console.log(`          all: ${counts.join(', ')}`);
  }
  if (closed.length) {
    console.log(`\n! ${closed.length} venue(s) matched but NOT OPERATIONAL — investigate:`);
    for (const c of closed) console.log(`    ${c.key}: ${c.businessStatus} ("${c.matchedName}" @ ${c.address})`);
  }
  if (unmatched.length) {
    console.log(`\n! ${unmatched.length} UNMATCHED (fail closed) — investigate each:`);
    for (const u of unmatched) {
      console.log(`    ${u.key} [${u.city || '?'}]`);
      console.log(`        reason: ${u.reason}`);
      if (u.candidates?.length) for (const c of u.candidates) console.log(`        cand: ${c}`);
    }
  }
  console.log(`\nv ${requests} API requests ~ $${(requests * 0.032).toFixed(2)}`);
  console.log('v wrote src/data/generated/venues-from-maps.json');
}

main().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
