import type { ReactNode, AnchorHTMLAttributes } from 'react';

/**
 * LaplandVibes affiliate CTA. All affiliate clicks are funnelled through
 * https://go.laplandvibes.com — the Cloudflare Worker handles CJ tracking,
 * GYG partner_id injection, and per-domain Website ID attribution.
 *
 * Synced 2026-04-27 from laplandvibes/src/components/AffiliateCTA.tsx.
 * If the canonical version changes, mirror the update here.
 *
 * See LaplandVibes Affiliate System (developer handoff, 2026-04-25), §7.
 */

export type AffiliatePartner =
  | 'hotels'
  | 'hotels-seasonal'
  | 'hotels-budget'
  | 'cars'
  | 'activities';

export interface AffiliateCTAProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> {
  partner: AffiliatePartner;
  /** Placement tag, e.g. 'hero_cta', 'inline_paragraph', 'property_card'. a-z, 0-9, underscore. Max 50 chars. */
  sid: string;
  /**
   * For hotels/cars: search query passed as `?ss=...` (or partner-specific param).
   * For activities: GYG slug appended to the path (e.g. 'rovaniemi-l2653').
   */
  destination?: string;
  /** Extra query params (checkin, pickup_date, currency, …). Merged after sid + ss. */
  query?: Record<string, string>;
  children: ReactNode;
}

const REDIRECT_HOST = 'https://go.laplandvibes.com';
const GYG_PARTNER_ID = 'VRMKD7N';
const SITE_ID = 'laplandbars';

export function buildAffiliateHref({
  partner,
  sid,
  destination,
  query,
}: Pick<AffiliateCTAProps, 'partner' | 'sid' | 'destination' | 'query'>): string {
  if (partner === 'activities') {
    const path = (destination ?? '').replace(/^\/+/, '').replace(/\/+$/, '');
    const url = new URL(path ? `https://www.getyourguide.com/${path}/` : 'https://www.getyourguide.com/');
    url.searchParams.set('partner_id', GYG_PARTNER_ID);
    url.searchParams.set('cmp', `lv_${SITE_ID}_${sid}`);
    if (query) for (const [k, v] of Object.entries(query)) if (v) url.searchParams.set(k, v);
    return url.toString();
  }
  const params = new URLSearchParams({ sid, ...(query || {}) });
  if (destination) params.set('ss', destination);
  return `${REDIRECT_HOST}/go/${partner}?${params.toString()}`;
}

export default function AffiliateCTA({
  partner,
  sid,
  destination,
  query,
  children,
  ...rest
}: AffiliateCTAProps) {
  return (
    <a
      {...rest}
      href={buildAffiliateHref({ partner, sid, destination, query })}
      target="_blank"
      rel="sponsored nofollow noopener"
    >
      {children}
    </a>
  );
}
