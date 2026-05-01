// Drive CDN image helper. Default width 1200 keeps quality on retina while
// halving payload vs 1600. Hero images that fill the viewport call with 1600.
// Card / thumb images can pass smaller widths (e.g. 800, 400).
//
// `-rw` modifier asks Drive's image CDN to serve WebP. Verified 2026-04-27:
// WebP is ~22% smaller than the default PNG/JPEG (94 kB vs 120 kB at w=400).
// Drive falls back to JPEG/PNG transparently for browsers that lack WebP, so
// this is a safe optimisation across all client devices.
const driveImg = (id: string, w = 1200) =>
  `https://lh3.googleusercontent.com/d/${id}=w${w}-rw`;

// Helper for callers that need a specific size of an existing image (cards,
// thumbs, srcset). Re-points to the same Drive id at the requested width.
export const imgAt = (url: string, w: number) =>
  url.replace(/=w\d+(-\w+)?/, `=w${w}-rw`);

export const BARS = {
  // Hero images
  heroMain: driveImg('1SZN2BoDENmAmzu6a5t7odyR7Oq82T6NW', 1600), // Aurora bar panoramic window — full-bleed hero
  heroIceBars: driveImg('1ttzjleaPso2c1_hGiITnTmWMHFOI-Xp4'),   // Ice bar wide with sculptures
  heroApres: driveImg('1b9Rs9BdGIZuqLH2MpXRs3Mvn4KeRHsh8'),     // Après-ski Koti Finland crowd
  heroNightlife: driveImg('1GHPPX2z77H_42bpJwssfBJjiHoBG17rN'),  // Cozy pub fireplace + aurora

  // Ice bars
  iceBarTunnel: driveImg('1dv8Qr8kIvgWIEu2G8yq8AuqLdZSt0igv'),  // Ice tunnel bar
  iceBarDrinks: driveImg('1fv0WlprRy8_LbT4PcKeroBoxvUFtgkLR'),   // Colorful drinks on ice counter

  // Craft beer & brewery
  craftBeerGlasses: driveImg('16vObeqDMHa2cY_bZtju68h73D446xTh0', 800), // Two beers, snowy window
  breweryInterior: driveImg('1MFGwHkLMU7R8sA1BQnjIxEpWug3piitz'),        // Lapon Panimo copper tanks

  // Cocktails
  cocktailAurora: driveImg('1fNE5OsgS-lq4On8usB9cT_XQt7sSDmtM', 800),  // Blue aurora shimmer cocktails
  cocktailSour: driveImg('1DZUlLp9fCPmFRO5VK8Y4xoMn6vJCugms', 800),    // Cloudberry sour coupe glass
  cocktailBerry: driveImg('1TItGGN1pjEjW2AQJiMVt3bDcXsy5Jz2S', 800),   // Berry spritz, candlelit bar

  // Après-ski & venues
  apresSkiLevi: driveImg('1XgRBVC9YEEkVCVojKVfqO5YjFIWybme1'),  // Levi Après-Ski Bar packed
  whiskyBar: driveImg('1xlIkdF5ASj4hURnXMgU9BQW7v_Ct1vU2'),     // Whisky bar + aurora through windows
  pubExterior: driveImg('1e2DMRKbiQrxMgUP7Vjx0sMsPUKxcSvo-'),   // Arctic Lodge Pub exterior night

  // Live music
  liveMusic: driveImg('1fEWhqhv9uAavR_OpxyQ3ZjD8gwEB6agY'),      // Live band in packed wooden bar

  // New batch — bar atmosphere & venues
  cocktailTrio: driveImg('1CXCw3caLeOTwU6Is4T_u6xG9TFF-uPGF'),         // Three craft cocktails on dark bar counter
  auroraLounge: driveImg('1KmxD7vMipa0paIzJl4x3I5V6llkqDScF'),          // Northern lights through glass-walled bar
  cabinBarInterior: driveImg('1btM2fsETmde576y5VFE178nh9FT78I_8'),      // Cozy rustic log cabin bar interior
  apresSkiTwilight: driveImg('1m3R7TR506rX_oXQnYtx2MVbTGW5yy1QJ'),     // Après-ski bar at twilight (Hullu Poro style)
  beerFlight: driveImg('1CLHMtd5LdEdZ17Dcv6Jw32Dt6YT07HmC'),           // Craft beer taps with flight sampler
  auroraVillage: driveImg('16i3GT0jhOG05HEi5MOE5fwwXFzUzB6Km'),         // Northern lights over snowy village
  snowyVillageStreet: driveImg('1Ou6CHvCEXQScmS8A5Rg8TWJbHpRddKFo'),    // Snow-covered village at dusk
  friendsFireplace: driveImg('1j_O1NGZLJu7mnME4uu3HSN6loqdSZ-Wk'),     // Friends toasting beers by fireplace
  apresSkiAerial: driveImg('1M1oVBMlB8xxkl7Fp1gdj63qf8y9yfUNB'),       // Après-ski slope with bar and stage
  breweryTaps: driveImg('1LAJu9Q8Y8zVsL3skfnKJrE9LkJCLabDe'),           // Brewery bar taps close-up
  lingonberryCocktails: driveImg('1Xe4kaEWLnOekY88HGsZH3MiBZLXtgCd1'),  // Lingonberry cocktails, sugar-rimmed
  auroraLogCabins: driveImg('1Mvfc5SU1za1hFJ6pRSW2cc4QvttSzkjz'),       // Aurora over log cabins
  cabinPubExterior: driveImg('1E-U-4cagool47fGfyIRrMeExtU5tLuFd'),      // Snow-covered cabin pub exterior
  skiersApres: driveImg('1u_WIrDyFwjegcjGg3ZZENaI6X60ol8OE'),           // Skiers at log cabin après-ski bar
  friendsFireplace2: driveImg('1G-D0GeCrofDx_xxfNpgNWGiQipwfa1ZF'),     // Friends toasting by fireplace alt
};
