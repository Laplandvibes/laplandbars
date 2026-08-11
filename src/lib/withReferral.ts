/**
 * Tag an outbound link to a venue's/business's OWN website with LV referral
 * UTM parameters (Vesa network rule 2026-07-24), so the venue sees in its
 * analytics that the visit came from us:
 *
 *   utm_source=laplandvibes&utm_medium=referral&utm_campaign=bars_<context>
 *
 * Applied at RENDER SITES only — data files (src/data/bars.ts) keep clean
 * URLs. Do NOT use for: Google Maps links, affiliate links (go.laplandvibes.com,
 * GetYourGuide), internal ecosystem links, or social links.
 *
 * These are unpaid editorial referrals, so the rel is "nofollow noopener" —
 * NOT "sponsored" (no money changes hands) and NOT "noreferrer".
 *
 * 🔴 `noreferrer` was dropped 2026-08-10 (Vesa). It strips the Referer header,
 * so the venue could not see in its own analytics that the visit came from
 * laplandbars.com — we were sending free traffic anonymously. The UTM query
 * params survive, but only if the partner looks at UTM; the Referer is what
 * shows up by default. This matters most on `bars_tour_direct`, where the
 * operator attributes an actual booking. Network standard, same as
 * laplanddining.
 */
export function withReferral(url: string, campaign: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'laplandvibes');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch {
    // Malformed URL in data — return unchanged rather than crash the card.
    return url;
  }
}
