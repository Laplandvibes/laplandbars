/**
 * GetYourGuide deep-link helper.
 *
 * Discovered 2026-05-02 (Vesa flag): the `go.laplandvibes.com/go/activities/*`
 * Cloudflare Worker collapses every slug to `getyourguide.com/` (homepage),
 * losing the deep-link to a specific tour. To preserve user intent AND
 * affiliate attribution we build the direct GYG product URL with our
 * `partner_id` baked into the query string. GYG's affiliate system reads
 * `partner_id` from query params — same attribution path, no worker hop.
 *
 * The `cmp` parameter is GYG's analog of our `sid` — it shows up in the
 * GYG partner dashboard so we can see which venue/page drove the click.
 *
 * For Hotels.com / EconomyBookings the worker is still the right route
 * because CJ attribution flows through `Referer`, not query string.
 */

const GYG_PARTNER_ID = 'VRMKD7N';

/**
 * Build a deep link to a specific GYG product.
 *
 * @param productPath  Full path component after `getyourguide.com/`.
 *                     Format: `{city-slug}/{product-slug}-t{id}`. Example:
 *                     `rovaniemi-l2653/rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814`
 * @param sid          Per-placement campaign tag, e.g. `bar_lapland_brewery_pub`.
 *                     Mirrors the existing AffiliateCTA `sid` convention so
 *                     analytics stay consistent across hotels + activities.
 */
export function gygDeepLink(productPath: string, sid: string): string {
  // Strip leading slashes; GYG product paths shouldn't start with `/`
  const path = productPath.replace(/^\/+/, '');
  const url = new URL(`https://www.getyourguide.com/${path}/`);
  url.searchParams.set('partner_id', GYG_PARTNER_ID);
  url.searchParams.set('cmp', `lv_laplandbars_${sid}`);
  return url.toString();
}
