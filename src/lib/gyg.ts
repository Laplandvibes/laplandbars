/**
 * GetYourGuide deep-link helper.
 *
 * ── 2026-07-30 rewrite ────────────────────────────────────────────────────
 *
 * This file used to build a raw `getyourguide.com` URL, justified by a claim
 * dated 2026-05-02: that "the `go.laplandvibes.com/go/activities/*` Cloudflare
 * Worker collapses every slug to getyourguide.com/ (homepage)".
 *
 * That is not true. The Worker takes everything after `/go/activities/` and
 * appends it to the GetYourGuide origin, so multi-segment product paths deep-link
 * exactly. The homepage result came from testing with a bare curl, which the
 * Worker's bot guard answers with the partner homepage — the same false reading
 * is already recorded in memory from 2026-07-26, and laplandkids carried an
 * identical comment until it was corrected. Re-tested end to end with a real
 * browser on 2026-07-29:
 *
 *   go/activities/kilpisjarvi-l146340/…-t788580
 *     → getyourguide.com/kilpisjarvi-l146340/…-t788580/?partner_id=VRMKD7N&cmp=…
 *     → the product page, booking CTA present.
 *
 * Routing through the Worker is the network rule (never a raw partner URL in
 * source): it owns partner_id, resolves per-site attribution from `Referer`, and
 * logs the slug so the click report shows WHICH activity converted.
 *
 * 2026-08-03: `language=<code>` lisätty — Worker kääntää sen GYG:n
 * kielipolkuprefiksiksi (ks. GYG_WORKER_LANG alla).
 */
import type { Locale } from '../i18n/config';

const GO = 'https://go.laplandvibes.com/go/activities';
const SITE_TAG = 'laplandbars';

/**
 * Worker `?language=` codes (same table as shared/gyg/picks.ts). The Worker's
 * handleGyg turns the code into GetYourGuide's `<lang>-<country>/` PATH prefix
 * — the only localisation GYG honours. 🔴 A raw `?language=xx` appended to a
 * getyourguide.com URL does NOTHING (measured in a real browser 2026-08-02),
 * so never "simplify" back to passing it to GYG directly. `en` is GYG's
 * default and needs no param.
 */
export const GYG_WORKER_LANG: Record<Locale, string | undefined> = {
  en: undefined, fi: 'fi', de: 'de', ja: 'ja', es: 'es', 'pt-BR': 'pt-br',
  'zh-CN': 'zh', ko: 'ko', fr: 'fr', it: 'it', nl: 'nl', sv: 'sv',
};

/**
 * Build a deep link to a specific GetYourGuide product, via the Worker.
 *
 * @param productPath  Path after the GetYourGuide origin, no leading slash.
 *                     Format: `{location-lNNN}/{product-slug}-t{id}`.
 *
 *                     🔴 Only ever pass a path that has been opened in a real
 *                     browser. A wrong or delisted id does NOT 404 — GetYourGuide
 *                     redirects it to a city listing with HTTP 200, so the card
 *                     names one venue and the link delivers a generic list. Two
 *                     of this site's three ice-bar products died exactly that way
 *                     and were removed on 2026-07-30.
 * @param sid          Per-placement tag, e.g. `bar_lapland_brewery_pub`.
 */
export function gygDeepLink(productPath: string, sid: string, lang: Locale = 'en'): string {
  const path = productPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const gygLang = GYG_WORKER_LANG[lang];
  return `${GO}/${path}?sid=${SITE_TAG}_${sid}${gygLang ? `&language=${gygLang}` : ''}`;
}
