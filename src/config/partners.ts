// Affiliate partner link builders for LaplandBars.
//
// Source of truth: _affiliate/affiliate-links.json (generated 2026-06-25).
// These are TRAVELPAYOUTS deep links. The marker/trs are PUBLIC (they ship in
// client code by design); NO API secret keys live here. Attribution is handled
// by Travelpayouts itself — these do NOT route through go.laplandvibes.com
// (that Worker is CJ-only, for Hotels.com / EconomyBookings).
//
// Per-placement tracking uses the Travelpayouts `sub_id` parameter, set to a
// snake_case SID so every placement is measurable in the TP dashboard.
//
// Required affiliate <a> attributes (LV spec):
//   target="_blank" rel="sponsored nofollow noopener"   — NO `noreferrer`.

const TP_MARKER = '723794';
const TP_TRS = '524131';

/** Build a Travelpayouts deep link for a program + destination + placement. */
function tpLink(programId: number, dest: string, sid: string): string {
  const u = encodeURIComponent(dest);
  return `https://tp.media/r?marker=${TP_MARKER}&trs=${TP_TRS}&p=${programId}&u=${u}&campaign_id=1&sub_id=${encodeURIComponent(
    sid,
  )}`;
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
