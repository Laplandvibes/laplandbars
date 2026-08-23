// Affiliate partner link builders for LaplandBars.
//
// Source of truth: _affiliate/affiliate-links.json (generated 2026-06-25).
// These are TRAVELPAYOUTS deep links. The marker/trs are PUBLIC (they ship in
// client code by design); NO API secret keys live here. Attribution is handled
// by Travelpayouts itself — these do NOT route through go.laplandvibes.com
// (that Worker is CJ-only, for lodging / EconomyBookings).
//
// Per-placement tracking uses the Travelpayouts `sub_id` parameter, set to a
// snake_case SID so every placement is measurable in the TP dashboard.
//
// Required affiliate <a> attributes (LV spec):
//   target="_blank" rel="sponsored nofollow noopener"   — NO `noreferrer`.

const TP_MARKER = '723794';
const TP_TRS = '524131';

/** Build a Travelpayouts deep link for a program + destination + placement. */
// [LV-ADUNIT-WORKER-2 2026-07-27] Worker-routed so the click reaches D1; the
// Worker rebuilds the identical tp.media URL and appends sub_id=<domain>_<sid>.
const TP_ROUTE: Record<number, string> = { 8310: 'airalo', 8919: 'welcomepickups' };

function tpLink(programId: number, dest: string, sid: string): string {
  const u = encodeURIComponent(dest);
  const route = TP_ROUTE[programId];
  // Unmapped program → keep the direct link rather than 400 on an unknown route.
  if (!route) {
    return `https://tp.media/r?marker=${TP_MARKER}&trs=${TP_TRS}&p=${programId}&u=${u}&campaign_id=1&sub_id=${encodeURIComponent(
      sid,
    )}`;
  }
  return `https://go.laplandvibes.com/go/${route}?sid=${encodeURIComponent(sid)}&dest=${u}`;
}

// ── Welcome Pickups — private airport transfers ──────────────────────────────
// Program p=8919. A pre-booked driver who meets you at arrivals and takes you
// straight into town — and, the angle that fits a BARS site, the safe fixed-price
// ride back to the hotel after a night out. No late taxi rank at a small northern
// airport at −20 °C, and a designated driver beats waiting in the cold at 3am.
// Evergreen positioning only (no time-limited % → never goes stale).
export const WELCOME_PICKUPS = {
  slug: 'welcome_pickups',
  logo: '/images/partners/welcomepickups.png',
  programId: 8919,
} as const;
export const welcomePickupsLink = (sid = 'transfer') =>
  tpLink(WELCOME_PICKUPS.programId, 'https://www.welcomepickups.com/', sid);

// 🔴🔴 WELCOME PICKUPS POISTETTU TÄLTÄ SIVUSTOLTA 2026-08-23 (Vesan linjaus).
//
// Mainos lupasi *"the smart ride home after the night out"*, *"no taxi rank
// waiting outside at 2am"* ja *"nobody in the group has to stay sober to
// drive"*. Welcome Pickups ei myy sellaista palvelua. Mitattu heidän omalta
// Rovaniemen-sivultaan 2026-08-23: he myyvät LENTOKENTTÄKULJETUSTA (ja
// puolen päivän kaupunkikierroksia) — sana "night" ei esiinny sivulla
// kertaakaan, eikä pisteestä-pisteeseen- tai tuntikyytiä ole lainkaan.
// Lisäksi he palvelevat Suomessa vain Helsinkiä ja Rovaniemeä; kittila,
// ivalo, levi, saariselka, kuusamo, oulu, kemi, tampere ja turku ovat kaikki
// 404. Tämän sivuston lukija on useimmiten menossa Leville tai Ylläkselle.
//
// Vesa 2026-08-23: *"ei tietenkään kannata, me luodataan ja autetaan
// asiakasta aidosti, ei rahat pois -ajattelua."*
//
// ⇒ Älä palauta Welcome Pickupsia tälle sivustolle. Jos joskus palautetaan,
//   se vaatii (a) palvelun joka oikeasti vastaa lupausta ja (b) kaupungin
//   jota he oikeasti palvelevat.
