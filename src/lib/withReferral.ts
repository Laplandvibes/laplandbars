/**
 * Tag an outbound link to a venue's/business's OWN website with LV referral
 * UTM parameters (Vesa network rule 2026-07-24), so the venue sees in its
 * analytics that the visit came from us:
 *
 *   utm_source=laplandvibes&utm_medium=referral&utm_campaign=bars_<context>
 *
 * Applied at RENDER SITES only — data files (src/data/bars.ts) keep clean
 * URLs. Do NOT use for: Google Maps links, affiliate links (go.laplandvibes.com,
 * GetYourGuide), internal ecosystem links, or social links. These are unpaid
 * editorial referrals — rel stays "noopener noreferrer", NOT "sponsored".
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
