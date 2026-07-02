// Images are self-hosted under public/images/drive/ (WebP, optimised with
// sharp). Previously these were hotlinked from Google Drive's image CDN
// (lh3.googleusercontent.com), but Drive throttles real traffic and the
// images rendered as blank/dark blocks on mobile. They are now served from
// our own origin. Source Drive FILE_IDs are noted next to each entry for
// future re-fetching.
//
// NOTE: cocktailSour's Drive original is no longer accessible (returned an HTML
// error page, not an image) → it now reuses a local image (cocktailAurora).

// Helper for callers that need a specific size of an existing image (cards,
// thumbs, srcset). For local images this is a no-op (the path has no =w
// modifier to rewrite); kept for the remaining Drive-hosted fallback.
export const imgAt = (url: string, w: number) =>
  url.replace(/=w\d+(-\w+)?/, `=w${w}-rw`);

// Northern-hemisphere summer window (May–September). Drives the seasonal
// home-hero swap: summer terrace image in-season, aurora/winter otherwise.
export const isSummerSeason = () => {
  const m = new Date().getMonth() + 1;
  return m >= 5 && m <= 9;
};

export const BARS = {
  // Hero images
  heroMain: '/images/drive/heroMain.webp',           // 1SZN2BoDENmAmzu6a5t7odyR7Oq82T6NW — Aurora bar panoramic window
  heroMainSummer: '/images/drive/heroMain-summer.webp', // Summer terrace bar — shown May–Sep via isSummerSeason()
  heroIceBars: '/images/drive/heroIceBars.webp',     // 1ttzjleaPso2c1_hGiITnTmWMHFOI-Xp4 — Ice bar wide with sculptures
  heroApres: '/images/drive/heroApres.webp',         // 1b9Rs9BdGIZuqLH2MpXRs3Mvn4KeRHsh8 — Après-ski Koti Finland crowd
  heroNightlife: '/images/drive/heroNightlife.webp', // 1GHPPX2z77H_42bpJwssfBJjiHoBG17rN — Cozy pub fireplace + aurora

  // Ice bars
  iceBarTunnel: '/images/drive/iceBarTunnel.webp',   // 1dv8Qr8kIvgWIEu2G8yq8AuqLdZSt0igv — Ice tunnel bar
  iceBarDrinks: '/images/drive/iceBarDrinks.webp',   // 1fv0WlprRy8_LbT4PcKeroBoxvUFtgkLR — Colorful drinks on ice counter

  // Craft beer & brewery
  craftBeerGlasses: '/images/drive/craftBeerGlasses.webp', // 16vObeqDMHa2cY_bZtju68h73D446xTh0 — Two beers, snowy window
  breweryInterior: '/images/drive/breweryInterior.webp',   // 1MFGwHkLMU7R8sA1BQnjIxEpWug3piitz — Lapon Panimo copper tanks

  // Cocktails
  cocktailAurora: '/images/drive/cocktailAurora.webp',  // 1fNE5OsgS-lq4On8usB9cT_XQt7sSDmtM — Blue aurora shimmer cocktails
  cocktailSour: '/images/drive/cocktailAurora.webp', // Drive original inaccessible (returned HTML) → reuse local aurora cocktail; regen with Picsart later when credits return
  cocktailBerry: '/images/drive/cocktailBerry.webp',    // 1TItGGN1pjEjW2AQJiMVt3bDcXsy5Jz2S — Berry spritz, candlelit bar

  // Après-ski & venues
  apresSkiLevi: '/images/drive/apresSkiLevi.webp', // 1XgRBVC9YEEkVCVojKVfqO5YjFIWybme1 — Levi Après-Ski Bar packed
  whiskyBar: '/images/drive/whiskyBar.webp',       // 1xlIkdF5ASj4hURnXMgU9BQW7v_Ct1vU2 — Whisky bar + aurora through windows
  pubExterior: '/images/drive/pubExterior.webp',   // 1e2DMRKbiQrxMgUP7Vjx0sMsPUKxcSvo- — Arctic Lodge Pub exterior night

  // Live music
  liveMusic: '/images/drive/liveMusic.webp', // 1fEWhqhv9uAavR_OpxyQ3ZjD8gwEB6agY — Live band in packed wooden bar

  // New batch — bar atmosphere & venues
  cocktailTrio: '/images/drive/cocktailTrio.webp',                 // 1CXCw3caLeOTwU6Is4T_u6xG9TFF-uPGF — Three craft cocktails on dark bar counter
  auroraLounge: '/images/drive/auroraLounge.webp',                 // 1KmxD7vMipa0paIzJl4x3I5V6llkqDScF — Northern lights through glass-walled bar
  cabinBarInterior: '/images/drive/cabinBarInterior.webp',         // 1btM2fsETmde576y5VFE178nh9FT78I_8 — Cozy rustic log cabin bar interior
  apresSkiTwilight: '/images/drive/apresSkiTwilight.webp',         // 1m3R7TR506rX_oXQnYtx2MVbTGW5yy1QJ — Après-ski bar at twilight
  beerFlight: '/images/drive/beerFlight.webp',                     // 1CLHMtd5LdEdZ17Dcv6Jw32Dt6YT07HmC — Craft beer taps with flight sampler
  auroraVillage: '/images/drive/auroraVillage.webp',               // 16i3GT0jhOG05HEi5MOE5fwwXFzUzB6Km — Northern lights over snowy village
  snowyVillageStreet: '/images/drive/snowyVillageStreet.webp',     // 1Ou6CHvCEXQScmS8A5Rg8TWJbHpRddKFo — Snow-covered village at dusk
  friendsFireplace: '/images/drive/friendsFireplace.webp',         // 1j_O1NGZLJu7mnME4uu3HSN6loqdSZ-Wk — Friends toasting beers by fireplace
  apresSkiAerial: '/images/drive/apresSkiAerial.webp',             // 1M1oVBMlB8xxkl7Fp1gdj63qf8y9yfUNB — Après-ski slope with bar and stage
  breweryTaps: '/images/drive/breweryTaps.webp',                   // 1LAJu9Q8Y8zVsL3skfnKJrE9LkJCLabDe — Brewery bar taps close-up
  lingonberryCocktails: '/images/drive/lingonberryCocktails.webp', // 1Xe4kaEWLnOekY88HGsZH3MiBZLXtgCd1 — Lingonberry cocktails, sugar-rimmed
  auroraLogCabins: '/images/drive/auroraLogCabins.webp',           // 1Mvfc5SU1za1hFJ6pRSW2cc4QvttSzkjz — Aurora over log cabins
  cabinPubExterior: '/images/drive/cabinPubExterior.webp',         // 1E-U-4cagool47fGfyIRrMeExtU5tLuFd — Snow-covered cabin pub exterior
  skiersApres: '/images/drive/skiersApres.webp',                   // 1u_WIrDyFwjegcjGg3ZZENaI6X60ol8OE — Skiers at log cabin après-ski bar
  friendsFireplace2: '/images/drive/friendsFireplace2.webp',       // 1G-D0GeCrofDx_xxfNpgNWGiQipwfa1ZF — Friends toasting by fireplace alt
};
