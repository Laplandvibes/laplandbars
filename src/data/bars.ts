/**
 * Localised string for tabular data fields like `hours` / `price` that we want
 * to render in the user's current language (EN/FI/DE) without going through a
 * JSON translation file. Keeping the translations next to the data keeps the
 * data file self-contained and avoids the "string drifts out of sync with JSON"
 * class of bugs.
 *
 * Read it with the `pickLocalised` helper below.
 */
export type Localised = {
  en: string;
  fi: string;
  de?: string;
  ja?: string;
  es?: string;
  'pt-BR'?: string;
  'zh-CN'?: string;
};

import type { Locale } from '../i18n/config';

/**
 * Pick the string for the current locale. Falls back to EN if a translation
 * for that locale is not yet provided (so a half-bootstrapped `de` doesn't
 * render an empty cell).
 */
export function pickLocalised(value: Localised | string, locale: Locale): string {
  if (typeof value === 'string') return value;
  return (value as Record<string, string | undefined>)[locale] ?? value.en;
}

/**
 * Tour / experience that this venue actually sells (verified from the
 * venue's public website, not invented). When set, the bar card surfaces
 * the concrete details (price + schedule + booking hint) and offers a
 * primary "Book a tour" CTA routed through GYG via go.laplandvibes.com.
 *
 * For the LV ecosystem, GYG is the only affiliate path that maps cleanly
 * onto the experience side of bar/brewery venues — Finnish independent
 * pubs and breweries are not in CJ/Awin/Impact, so the choice is
 * (a) GYG tour search if the venue runs tours/tastings, or (b) Hotels.com
 * city-level CTA (covered by the city band below the bar grid).
 */
export interface BarTour {
  /** What user actually buys, e.g. "Brewery tour & tasting". */
  label: string;
  /** Concrete starting price as the venue advertises it, e.g. "€25 / person". */
  priceFrom: string;
  /** Schedule string lifted from the venue site, e.g. "Friday 17:00 + 18:30". */
  schedule: string;
  /** One-line booking hint, e.g. "Register by Wed 14:00". Optional. */
  hint?: string;
  /** Per-placement analytics tag (matches AffiliateCTA `sid` convention). */
  sid: string;

  // EXACTLY ONE of these is set per venue:

  /**
   * GYG product full path — verified by web search 2026-05-02. Format:
   * `{city-slug}/{product-slug}-t{id}`. Example:
   * `rovaniemi-l2653/rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814`
   *
   * NOTE: We deep-link directly to GYG (not via go.laplandvibes.com) because
   * the redirect worker currently collapses every activities slug to GYG
   * homepage. Direct linking preserves both intent + partner_id attribution.
   */
  gygProductPath?: string;

  /**
   * Direct booking URL when no GYG product exists. NOT an affiliate link —
   * just an honest pass-through to the venue's own booking page (e.g.
   * lapinpanimo.fi for the Lapland Brewery tour, since it's not on GYG).
   * Use this until we negotiate direct affiliate deals with venues.
   */
  directBookingUrl?: string;
  /** Optional label override for the direct booking CTA. */
  directBookingLabel?: string;
}

export interface Bar {
  name: string;
  city: string;
  type: string;
  description: string;
  highlights: string[];
  /** Price summary localised across EN / FI / DE. Read via `pickLocalised`. */
  price: Localised;
  address: string;
  website?: string;
  /** Opening hours localised across EN / FI / DE. Read via `pickLocalised`. */
  hours: Localised;
  featured?: boolean;
  tour?: BarTour;
}

export const cities = ['Rovaniemi', 'Levi', 'Ylläs', 'Saariselkä'];

export const bars: Bar[] = [
  // ROVANIEMI
  {
    // Verified 2026-07-26 against lapinpanimo.fi: the business is "Lapland
    // Brewery" (fi: Lapin Panimo), not "Lapland Brewery Pub"; Google Places
    // lists it as "Lapland Brewery" at Teollisuustie 14 B. The old copy placed
    // it in the city centre — Teollisuustie is an industrial estate outside it.
    // The named beer styles were unverifiable and have been dropped rather than
    // replaced with invented ones.
    name: 'Lapland Brewery',
    city: 'Rovaniemi',
    type: 'Brewery Taproom',
    description: "Rovaniemi's own brewery, out on Teollisuustie a short drive from the centre rather than in town. Beers are brewed on site and poured in the taproom beside the tanks. The brewery describes itself as Finland's northernmost. The Friday tour and tasting needs booking in advance.",
    highlights: ['House-brewed beer', 'Taproom beside the tanks', 'Brewery tours'],
    price: {
      en: 'Pint ~€7',
      fi: 'Tuoppi noin 7 €',
      de: 'Pint ~7 €',
    },
    address: 'Teollisuustie 14 B, 96320 Rovaniemi',
    website: 'https://lapinpanimo.fi/en/',
    hours: {
      en: 'Mon–Fri 09–21, Sat 12–21, Sun closed',
      fi: 'Ma–Pe 09–21, La 12–21, Su suljettu',
      de: 'Mo–Fr 09–21, Sa 12–21, So geschlossen',
    },
    featured: true,
    tour: {
      label: 'Brewery tour & tasting',
      priceFrom: '€25 / person',
      schedule: 'Friday 17:00 + 18:30 (Dec–Mar weekly)',
      hint: 'Register by Wed 14:00. Minimum 3 people. Reserve via info@lapinpanimo.fi or +358 45 133 4410.',
      sid: 'bar_lapland_brewery_pub',
      // Verified 2026-05-02: Lapin Panimo's brewery tour is NOT on GYG.
      // Direct pass-through to venue booking page until we negotiate a
      // direct affiliate or GYG list this product.
      directBookingUrl: 'https://lapinpanimo.fi/en/',
      directBookingLabel: 'Reserve at lapinpanimo.fi',
    },
  },
  {
    name: 'Café & Bar 21',
    city: 'Rovaniemi',
    type: 'Cocktail Bar',
    description: 'Rovakatu 21, right in the heart of Rovaniemi. The most consistently mentioned bar in the city, a hybrid café by day, cocktail bar by night. Creative drinks, curated wine list, a refined crowd. A favourite of locals and visitors who want something beyond a standard pub.',
    highlights: ['Creative cocktails', 'Wine selection', 'City centre location'],
    price: {
      en: 'Cocktail ~€12–15',
      fi: 'Drinkki noin 12–15 €',
      de: 'Cocktail ~12–15 €',
    },
    address: 'Rovakatu 21, 96200 Rovaniemi',
    website: 'https://www.cafebar21.fi/en/home',
    hours: {
      en: 'Mon–Thu 11–21, Fri 11–22, Sat 12–22, Sun closed',
      fi: 'Ma–To 11–21, Pe 11–22, La 12–22, Su suljettu',
      de: 'Mo–Do 11–21, Fr 11–22, Sa 12–22, So geschlossen',
    },
    featured: true,
  },
  {
    name: 'Uitto Pub',
    city: 'Rovaniemi',
    type: 'Traditional Pub',
    description: 'A legendary Rovaniemi institution. "Comfortable, relaxed, and legendary". Uitto has been serving locals high-quality beers, drinks, snacks and meals for decades. No pretension, just a good Finnish pub doing what a good Finnish pub should do.',
    highlights: ['Local institution', 'Full menu', 'Draft beers'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Korkalonkatu 25, 96200 Rovaniemi',
    website: 'https://www.raflaamo.fi/en/restaurant/rovaniemi/uitto-pub',
    hours: {
      en: 'Mon–Thu 17–00:30, Fri–Sat 17–02:30, Sun 17–00:30',
      fi: 'Ma–To 17–00:30, Pe–La 17–02:30, Su 17–00:30',
      de: 'Mo–Do 17–00:30, Fr–Sa 17–02:30, So 17–00:30',
    },
  },
  {
    name: 'Nook Lounge',
    city: 'Rovaniemi',
    type: 'Bar & Lounge',
    description: 'A cosy café-bar hybrid where good drinks are made slowly and conversations run long. The bartenders know what they\'re doing. Popular with travellers who\'ve been on their feet all day and want somewhere warm, unhurried, and properly lit.',
    highlights: ['Lounge atmosphere', 'Crafted drinks', 'Late evenings'],
    price: {
      en: 'Cocktail ~€12',
      fi: 'Drinkki noin 12 €',
      de: 'Cocktail ~12 €',
    },
    address: 'Koskikatu 14, 96200 Rovaniemi',
    website: 'https://santashotels.fi/en/nook-lounge/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
    },
  },
  {
    name: 'Bull Bar & Grill',
    city: 'Rovaniemi',
    type: 'Bar & Grill',
    description: 'Located in the Arctic City Hotel building, an American-style grill bar with a lively evening atmosphere. Good burgers, proper drinks, sports on screen. The kind of place that fills up after 9 and stays loud until late.',
    highlights: ['Grill menu', 'Sports bar', 'Hotel location'],
    price: {
      en: 'Mains €14–22',
      fi: 'Pääruoat 14–22 €',
      de: 'Hauptgerichte 14–22 €',
    },
    address: 'Maakuntakatu 25, 96200 Rovaniemi',
    website: 'https://www.arcticcityhotel.fi/eat-drink/bull-bar-grill',
    hours: {
      en: 'Mon–Thu 17–00, Fri–Sat 17–02, Sun 17–00',
      fi: 'Ma–To 17–00, Pe–La 17–02, Su 17–00',
      de: 'Mo–Do 17–00, Fr–Sa 17–02, So 17–00',
    },
  },
  {
    name: 'Ice Bar @ Arctic SnowHotel',
    city: 'Rovaniemi',
    type: 'Ice Bar Experience',
    description: 'Built from scratch every winter, this ice bar is carved by artists and rebuilt with a new theme each season. Located at the Arctic SnowHotel on Lake Lehtojärvi, 30 minutes from Rovaniemi city centre. Drinks served in glasses made of ice. Temperature: -5°C inside. Thermal suits provided.',
    highlights: ['New theme yearly', 'Ice glasses', 'Thermal suits included', '-5°C inside'],
    // Verified from arcticsnowhotel.fi/en/eat-drink/ice-bar/ 2026-07-10:
    // hours 11–22; access requires a Snowhotel entrance ticket (overnight
    // guests free) — no standalone ~€15 bar fee.
    price: {
      en: 'Snowhotel entrance ticket required (overnight guests free)',
      fi: 'Vaatii Snowhotel-sisäänpääsylipun (hotelliyöpyjille vapaa)',
      de: 'Snowhotel-Eintrittskarte erforderlich (Übernachtungsgäste frei)',
    },
    address: 'Lehtoahontie 27, 97220 Sinettä',
    website: 'https://arcticsnowhotel.fi/en/eat-drink/ice-bar/',
    hours: {
      en: 'Daily 11–22 (Dec 15 – Mar 31)',
      fi: 'Päivittäin 11–22 (15.12.–31.3.)',
      de: 'Täglich 11–22 (15. Dez. – 31. März)',
    },
    featured: true,
    tour: {
      label: 'Ice bar visit + thermal suit',
      priceFrom: 'Live price on GetYourGuide',
      schedule: 'Daily 11:00–22:00 (Dec 15 – Mar 31)',
      hint: 'Guided Snowhotel visit incl. Ice Bar access.',
      sid: 'bar_ice_bar_arctic_snowhotel',
      // Verified GYG product 2026-05-02 via search.
      gygProductPath: 'rovaniemi-l2653/rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814',
    },
  },

  // LEVI
  {
    name: 'Hullu Poro Areena',
    city: 'Levi',
    type: 'Live Music Venue & Après-Ski',
    // Verified 2026-07-26 against hulluporo.fi: the venue states "up to 1700
    // people ... over Areena's two floors", "ten bars and a large dance floor",
    // and that it opened in 2001. It does NOT claim to be Finland's biggest
    // après-ski venue — that superlative was ours and is unverifiable, so it is
    // replaced with the operator's own numbers.
    description: "Levi's big room, at the foot of the main slope. Up to 1,700 people across two floors, ten bars and a large dance floor. Finnish headliners and DJs through the ski season. It has been running since 2001.",
    highlights: ['1,700 capacity', 'Ten bars, two floors', 'Slope-side location', 'Open since 2001'],
    price: {
      en: 'Entry €0–20 depending on act',
      fi: 'Sisäänpääsy 0–20 € esiintyjästä riippuen',
      de: 'Eintritt 0–20 € je nach Act',
    },
    address: 'Myllyjoentie 2, 99130 Levi',
    website: 'https://www.hulluporo.fi/en/restaurants/hullu-poro-areena/',
    hours: {
      en: 'Performance nights, doors 20–21, closes 03:30',
      fi: 'Keikkailtoina, ovet 20–21, suljetaan 03:30',
      de: 'Showabende, Einlass 20–21, Schluss 03:30',
    },
    featured: true,
  },
  {
    name: 'Bar Ihku',
    city: 'Levi',
    type: 'Nightclub & Bar',
    description: 'Already a legend among Levi party-goers. Ihku has accumulated stories over years of late-night Lapland chaos. Karaoke, dancing, Finnish locals and international skiers sharing the same floor. One of those places that looks ordinary until 11pm, then you understand why everyone talks about it.',
    highlights: ['Late-night institution', 'Karaoke nights', 'Local favourite'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Keskuskuja 3 A, 99130 Levi',
    // 2026-07-26: ihkubar.fi no longer resolves to the venue (TLS cert belongs
    // to wisenetwork.fi). The chain's own site is barihku.fi; Levi page below.
    website: 'https://barihku.fi/levi',
    hours: {
      en: 'Karaoke from 18:00, club 22:00–04:00',
      fi: 'Karaoke alkaen 18:00, klubi 22:00–04:00',
      de: 'Karaoke ab 18:00, Club 22:00–04:00',
    },
    featured: true,
  },
  {
    name: 'Pub Hölmölä',
    city: 'Levi',
    type: 'Pub',
    description: '"Levi\'s funniest pub." Hölmölä offers the best brewery products and cocktails, followed by unpretentious bar food. Board games, table football and billiards available free of charge. The kind of pub that doesn\'t take itself seriously, which is exactly what makes it great.',
    highlights: ['Board games & billiards', 'Craft beers', 'Bar food', 'No attitude'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Hiihtäjänkuja 10, 99130 Levi',
    website: 'https://www.hulluporo.fi/en/restaurants/pub-holmola/',
    hours: {
      en: 'Daily 10–02',
      fi: 'Päivittäin 10–02',
      de: 'Täglich 10–02',
    },
  },
  {
    // Verified 2026-07-26 against pubsohva.fi: the venue trades as "Public
    // House Sohva". Google Places lists it as "Public House Sohva levi".
    name: 'Public House Sohva',
    city: 'Levi',
    type: 'Beer Restaurant',
    description: 'A warm and helpful beer restaurant along Levi\'s main street. Sohva is the kind of place you walk into planning one drink and leave three hours later. Good beer selection, decent food, friendly service. The daytime crowd flows straight into the evening one.',
    highlights: ['Main street location', 'Beer selection', 'Food menu'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Leviraitti 4 B, 99130 Levi',
    website: 'https://pubsohva.fi/',
    hours: {
      en: 'Daily 12–02',
      fi: 'Päivittäin 12–02',
      de: 'Täglich 12–02',
    },
  },
  {
    name: 'Bar Alakerta',
    city: 'Levi',
    type: 'Live Music Bar',
    description: 'Sunny terrace, live music and the legendary Open Stage Jams on Sundays. Alakerta attracts musicians and music lovers, both locals and visiting artists who\'ve heard about the Sunday sessions. Unpretentious, warm, with the kind of atmosphere that happens when people actually love what they\'re doing.',
    highlights: ['Sunday Open Stage Jams', 'Live music', 'Sunny terrace'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Myllyjoentie 2, 99130 Levi',
    website: 'https://alakerta.bar',
    hours: {
      en: 'Tue–Sun 18–02 (04)',
      fi: 'Ti–Su 18–02 (04)',
      de: 'Di–So 18–02 (04)',
    },
  },
  {
    name: 'Pub Old Mates',
    city: 'Levi',
    type: 'British Pub',
    description: 'A proper British-style pub dropped into the middle of Finnish Lapland. Old Mates does pints properly, shows football, and provides a corner of familiar comfort for those who need it after a long day on the slopes. Better than most pubs in Britain, because Finnish beer is actually good.',
    highlights: ['British pub style', 'Sports on screen', 'Pints done right'],
    price: {
      en: 'Pint ~€6–8',
      fi: 'Tuoppi noin 6–8 €',
      de: 'Pint ~6–8 €',
    },
    address: 'Tähtitie 4, 99130 Levi',
    website: 'https://oldmates.fi/levi',
    hours: {
      en: 'Daily 12–02, kitchen 12–21:30',
      fi: 'Päivittäin 12–02, keittiö 12–21:30',
      de: 'Täglich 12–02, Küche 12–21:30',
    },
  },

  // YLLÄS
  {
    name: 'Selvä Pyy',
    city: 'Ylläs',
    type: 'Pub & Restaurant',
    description: 'The go-to pub in Äkäslompolo village on the Ylläs side. Selvä Pyy serves craft beers, cocktails and proper Finnish pub food in a warm, log-cabin atmosphere. After a day on the fells, this is where locals and skiers converge: no pretension, just good drinks and easy company.',
    highlights: ['Äkäslompolo village', 'Craft beers', 'Finnish pub food', 'Log cabin vibe'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Tunturintie 16, 95970 Äkäslompolo',
    website: 'https://selvapyy.fi',
    hours: {
      en: 'Daily 11–01',
      fi: 'Päivittäin 11–01',
      de: 'Täglich 11–01',
    },
    featured: true,
  },
  {
    name: 'Pirtukellari Night Club',
    city: 'Ylläs',
    type: 'Nightclub',
    // Verified 2026-07-26: Pirtukellari is at Lapland Hotels Äkäshotelli, in the
    // same building as the Pirtukirkko restaurant. The "only nightclub in Ylläs"
    // claim is dropped — the hotel's own listings name Parvi as a second
    // late-night option — as is the unsourced "village of 400 people" figure.
    description: 'The nightclub at Lapland Hotels Äkäshotelli, in the same building as the Pirtukirkko restaurant. When the pubs wind down, the party moves downstairs: DJs, dancing, and a floor that fills fast in peak season.',
    highlights: ['Inside Lapland Hotels Äkäshotelli', 'DJs & dancing', 'Late weekend hours'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
    },
    address: 'Äkäsentie 10, 95970 Äkäslompolo',
    hours: {
      en: 'Fri–Sat 22–03 (season dependent)',
      fi: 'Pe–La 22–03 (sesongin mukaan)',
      de: 'Fr–Sa 22–03 (saisonabhängig)',
    },
  },

  // SAARISELKÄ
  {
    name: 'Gastropub Giitu',
    city: 'Saariselkä',
    type: 'Gastropub & Craft Beer',
    description: 'The best bar in Saariselkä, a proper gastropub with an impressive craft beer selection and a menu that goes well beyond pub basics. Giitu serves Lappish-inspired dishes alongside a rotating tap list. The atmosphere is warm, modern, and exactly what you want after a Northern Lights hunt.',
    highlights: ['Craft beer selection', 'Lappish cuisine', 'Modern gastropub'],
    price: {
      en: 'Beer ~€7–8, mains €16–25',
      fi: 'Olut noin 7–8 €, pääruoat 16–25 €',
      de: 'Bier ~7–8 €, Hauptgerichte 16–25 €',
    },
    address: 'Revontulentie 1, 99830 Saariselkä',
    website: 'https://gastropubgiitu.fi/en/home',
    hours: {
      en: 'Daily 12–00, kitchen 12–22',
      fi: 'Päivittäin 12–00, keittiö 12–22',
      de: 'Täglich 12–00, Küche 12–22',
    },
    featured: true,
  },
  // REMOVED 2026-07-26 — "Pirtti Pub & Restaurant" was not a real business.
  // Google Places Text Search returned zero candidates for the name. The
  // website on the entry (pirkonpirtti.fi) belongs to Ravintola Pirkon Pirtti,
  // Honkapolku 2, 99800 Saariselkä (the entry had 99830), which its own site
  // describes as a traditional à la carte restaurant with no bar or pub, and
  // which is independent rather than part of the Santa's Hotel Tunturi complex
  // as the copy claimed. A restaurant with no bar does not belong in a bars and
  // pubs guide, so the card is removed rather than relabelled.

  // --- GEMS added 2026-06-11 (verified addresses/hours) ---
  {
    name: 'Kauppayhtiö',
    city: 'Rovaniemi',
    type: 'Bar & Live Music',
    description: 'Valtakatu 24: part bar, part marketplace, part art gallery. Wood-fired pizza and burgers from the kitchen, DJs spinning into the night, second-hand furniture for sale, and the Edge Gallery of street and pop art on the walls. Nothing in Rovaniemi feels quite like it.',
    highlights: ['DJs & live music', 'Wood-fired pizza', 'Street-art gallery'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Valtakatu 24, 96200 Rovaniemi',
    website: 'https://www.kauppayhtio.fi/',
    hours: { en: 'Tue–Fri 11–22, Sat 13–22, Sun 13–21', fi: 'Ti–Pe 11–22, La 13–22, Su 13–21', de: 'Di–Fr 11–22, Sa 13–22, So 13–21' },
    featured: true,
  },
  {
    name: 'Rovaniemen Oluthuone',
    city: 'Rovaniemi',
    type: 'Beer Bar',
    description: 'The "Beer Room" on Rovaniemi\'s pedestrian street, a warm beer restaurant with a deep selection of domestic and imported brews plus cocktails and snacks. In summer the terrace and beer garden open up under the midnight sun. A straightforward, well-run place locals keep coming back to.',
    highlights: ['Deep beer selection', 'Summer beer garden', 'Pedestrian-street location'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Koskikatu 20, 96200 Rovaniemi',
    website: 'https://www.rovaniemenoluthuone.fi/',
    hours: { en: 'Mon–Tue 14–00, Wed–Thu 14–02, Fri–Sat 12–03, Sun 12–00', fi: 'Ma–Ti 14–00, Ke–To 14–02, Pe–La 12–03, Su 12–00', de: 'Mo–Di 14–00, Mi–Do 14–02, Fr–Sa 12–03, So 12–00' },
  },
  {
    name: 'MustaKissa Kuppila',
    city: 'Rovaniemi',
    type: 'Cocktail Bar',
    description: 'A small, cosy den for craft cocktails and local beer, where the drinks lean Arctic and seasonal. MustaKissa doubles as a gallery and concert space: temporary exhibitions on the walls, live music some nights. The kind of low-key spot regulars guard a little jealously.',
    highlights: ['Arctic seasonal cocktails', 'Local craft beer', 'Gallery & live music'],
    price: { en: 'Cocktail ~€12–15', fi: 'Drinkki noin 12–15 €', de: 'Cocktail ~12–15 €' },
    address: 'Kansankatu 2, 96100 Rovaniemi',
    website: 'https://www.facebook.com/MustaKissaKuppila/',
    hours: { en: 'Tue–Thu 14–23, Fri–Sat 14–02, Sun 14–20, Mon closed', fi: 'Ti–To 14–23, Pe–La 14–02, Su 14–20, Ma suljettu', de: 'Di–Do 14–23, Fr–Sa 14–02, So 14–20, Mo geschlossen' },
  },
  {
    name: 'Pub Sarvi',
    city: 'Rovaniemi',
    type: 'Traditional Pub',
    description: 'A warm, wood-clad neighbourhood pub away from the city-centre crowds. Craft beer on tap, honest shots, and regular live music that pulls in locals who know each other by name. Unpretentious and easy, the sort of pub you settle into for the evening rather than just pass through.',
    highlights: ['Craft beer on tap', 'Live music', 'Neighbourhood local'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Hillapolku 9, 96500 Rovaniemi',
    website: 'https://www.facebook.com/pubsarvi/',
    hours: { en: 'Mon–Thu 16–00, Fri 14–04, Sat 12–04, Sun 12–22', fi: 'Ma–To 16–00, Pe 14–04, La 12–04, Su 12–22', de: 'Mo–Do 16–00, Fr 14–04, Sa 12–04, So 12–22' },
  },
  {
    name: 'Roy Club',
    city: 'Rovaniemi',
    type: 'Karaoke Bar & Nightclub',
    description: 'Rovaniemi\'s legendary karaoke bar and nightclub, running since 1985. Two floors: grab the mic on one, hit the dance floor on the other. It opens late and closes later, the place where a Rovaniemi night out tends to end, whether you planned it that way or not.',
    highlights: ['Karaoke since 1985', 'Two floors', 'Late-night club'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Maakuntakatu 24, 96200 Rovaniemi',
    website: 'https://www.royclub.fi/',
    hours: { en: 'Daily 22–04:30', fi: 'Päivittäin 22–04:30', de: 'Täglich 22–04:30' },
  },
  {
    name: "V'inkkari",
    city: 'Levi',
    type: 'Après-Ski Bar',
    description: 'A Levi après-ski institution at the foot of the slopes, known far beyond Lapland. Live bands play almost daily through the ski season and the crowd ends up dancing on the tables in ski boots. Easygoing by afternoon, loud and packed by evening: pure Levi après.',
    highlights: ['Live bands daily', 'Slope-side après', 'Dancing in ski boots'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Hissitie 6, 99130 Levi',
    website: 'https://www.levi.fi/en/services/restaurant-vinkkari/',
    hours: { en: 'Check venue for current hours', fi: 'Tarkista aukioloajat suoraan paikasta', de: 'Aktuelle Öffnungszeiten beim Lokal prüfen' },
    featured: true,
  },
  {
    name: 'Restaurant Tuikku',
    city: 'Levi',
    type: 'Fell-Top Restaurant & Après-Ski',
    description: 'Levi\'s oldest fell-top restaurant, perched at the summit with panoramic views across the Western Lapland fells. Reach it on skis, by snowmobile, on foot, or by helicopter via the summit road. Lunch by day, the "Master of After Ski" by afternoon when the winter season is on.',
    highlights: ['Summit panoramic views', 'Arrive by ski or helicopter', 'Legendary après'],
    price: { en: 'Lunch / mains €15–25', fi: 'Lounas / pääruoat 15–25 €', de: 'Mittag / Hauptgerichte 15–25 €' },
    address: 'Tuikuntie 11, 99130 Levi',
    website: 'https://www.levi.fi/en/services/panoramic-restaurant-tuikku/',
    hours: { en: 'Daily 11–16 (summer); après-ski hours in winter. Check venue', fi: 'Päivittäin 11–16 (kesä); talvella après-ski-ajat. Tarkista paikasta', de: 'Täglich 11–16 (Sommer); im Winter Après-Ski-Zeiten. Beim Lokal prüfen' },
  },
  {
    name: 'Bar Kaappi',
    city: 'Ylläs',
    type: 'Après-Ski Bar',
    description: 'A lounge-style après-ski bar in the heart of Ylläsjärvi, with a wide drinks list, special beers and cocktails, and the famous "Hattivatti" mocktail families come in for before 10pm. Through winter it runs live music nights and pub quizzes. Out front sits the Ford Sierra from the Lapland Odyssey films.',
    highlights: ['Hattivatti mocktail', 'Special beers & cocktails', 'Live music & quizzes'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Vaeltajantie 2, 95980 Ylläsjärvi',
    website: 'https://yllas.fi/en/restaurant/bar-kaappi/',
    hours: { en: 'Check venue for current hours', fi: 'Tarkista aukioloajat suoraan paikasta', de: 'Aktuelle Öffnungszeiten beim Lokal prüfen' },
  },
  {
    name: 'Teerenpesä',
    city: 'Saariselkä',
    type: 'Restaurant, Pub & Nightclub',
    description: 'Three venues under one log roof in the centre of Saariselkä: a Lappish restaurant doing seasonal northern dishes, a sports pub with screens, darts and pool, and a nightclub that runs both traditional couples\' dances and a disco floor. Whatever the group wants from a night, it\'s here.',
    highlights: ['Three venues in one', 'Lappish kitchen', 'Dances & disco'],
    price: { en: 'Beer ~€6–7', fi: 'Olut noin 6–7 €', de: 'Bier ~6–7 €' },
    address: 'Saariseläntie 5, 99830 Saariselkä',
    website: 'https://teerenpesa.fi/en/',
    hours: { en: 'Daily 15–02, kitchen 15–23', fi: 'Päivittäin 15–02, keittiö 15–23', de: 'Täglich 15–02, Küche 15–23' },
    featured: true,
  },

];

export interface IceBar {
  name: string;
  location: string;
  description: string;
  highlight: string;
  /** Temperature label localised across EN / FI / DE. */
  temp: Localised;
  /** Price summary localised across EN / FI / DE. */
  price: Localised;
  /** Season / availability window localised across EN / FI / DE. */
  season: Localised;
  website?: string;
  stayQuery: string;
  staySid: string;
  stayHint: string;
  visitGygProductPath: string;
  visitSid: string;
}

export const iceBars: IceBar[] = [
  {
    name: 'SnowVillage IceBar',
    location: 'Lainio, Ylläs',
    description: 'Carved entirely from snow and ice each winter by international ice artists. New theme and sculptures every season. Drinks served in glasses made of pure Arctic ice. Part of the Snow Village complex. Combine it with a night in a snow suite.',
    highlight: 'New ice sculptures every winter',
    temp: {
      en: '-5°C inside',
      fi: 'sisällä -5 °C',
      de: 'innen -5 °C',
    },
    // Verified from laplandhotels.com/…/snowvillage/ice-exhibition 2026-07-10:
    // ice bar is included in the exhibition ticket (hot drink or drink in an
    // ice shot glass); venue publishes prices seasonally.
    price: {
      en: 'Exhibition ticket incl. a drink in an ice glass. Prices on venue site',
      fi: 'Näyttelylippu sis. juoman jäälasissa. Hinnat kohteen sivulta',
      de: 'Eintritt inkl. Getränk im Eisglas. Preise auf der Website',
    },
    season: {
      en: 'Opens Dec 25, 2026 (rebuilt every autumn)',
      fi: 'Avautuu 25.12.2026 (rakennetaan joka syksy uudelleen)',
      de: 'Öffnet 25.12.2026 (jeden Herbst neu gebaut)',
    },
    website: 'https://snowvillage.fi',
    // Hotels.com — the property ("Lapland Hotels Snow Village") does NOT
    // resolve in the Hotels.com destination search (verified via Expedia
    // typeahead 2026-07-10, empty for every name variant) → use the
    // municipality so the search always returns results. Card label says
    // "book a room nearby", which this honestly is.
    stayQuery: 'Kittilä, Finland',
    staySid: 'icebar_snowvillage_lainio',
    stayHint: 'Snow suites + log cabins on-site',
    // GYG product (verified 2026-05-02): SnowVillage Ice Hotel Guided Tour with Transfer
    visitGygProductPath: 'yllasjarvi-l248346/yllas-snowvillage-ice-hotel-guided-tour-with-transfer-t1108702',
    visitSid: 'icebar_visit_snowvillage',
  },
  {
    name: 'Arctic SnowHotel IceBar',
    location: 'Rovaniemi (30min)',
    description: 'Located at Arctic SnowHotel on the shores of Lake Lehtojärvi. Rebuilt every winter with new artistic themes, carved by Finnish and international artists. Thermal suits provided. The Lake setting makes this one of the most atmospheric ice bars in the world.',
    highlight: 'Thermal suits included',
    temp: {
      en: '-5°C inside',
      fi: 'sisällä -5 °C',
      de: 'innen -5 °C',
    },
    // Verified from arcticsnowhotel.fi/en/eat-drink/ice-bar/ 2026-07-10:
    // hours 11–22, season Dec 15 – Mar 31; no standalone bar fee — a Snowhotel
    // entrance ticket is required (overnight guests enter free).
    price: {
      en: 'Snowhotel entrance ticket required (overnight guests free)',
      fi: 'Vaatii Snowhotel-sisäänpääsylipun (hotelliyöpyjille vapaa)',
      de: 'Snowhotel-Eintrittskarte erforderlich (Übernachtungsgäste frei)',
    },
    season: {
      en: 'Daily 11–22 (Dec 15 – Mar 31)',
      fi: 'Päivittäin 11–22 (15.12.–31.3.)',
      de: 'Täglich 11–22 (15. Dez. – 31. März)',
    },
    website: 'https://arcticsnowhotel.fi',
    // Hotels.com listing name, verified EXACT_MATCH (hotelId 12689601,
    // Lehtoahontie 27) via Expedia typeahead 2026-07-10. The old
    // "Arctic SnowHotel, Rovaniemi, Finland" string geocoded to nothing
    // → the search page showed zero properties.
    stayQuery: 'Arctic SnowHotel & Glass Igloos',
    staySid: 'icebar_arctic_snowhotel',
    stayHint: 'Snow rooms, glass igloos, log cabins',
    // GYG product (verified 2026-05-02): Arctic SnowHotel Visit with Ice Bar
    visitGygProductPath: 'rovaniemi-l2653/rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814',
    visitSid: 'icebar_visit_arctic_snowhotel',
  },
  {
    name: 'Snowman World Ice Bar',
    location: 'Santa Claus Village, Rovaniemi',
    description: 'Inside the legendary Snowman World at Santa Claus Village, a different kind of ice bar experience, more family-friendly and accessible. Hot drinks and cold cocktails served amid snow sculptures. Good option if you\'re combining the ice bar with a Santa visit.',
    highlight: 'Santa Claus Village location',
    temp: {
      en: 'Outdoors / covered',
      fi: 'Ulkona / katettu',
      de: 'Draußen / überdacht',
    },
    // Verified from snowmanworld.fi 2026-07-10: entry €35/person (under-2s
    // free), season Dec 6, 2026 – Mar 17, 2027; ice bar drinks purchased
    // separately at the bar.
    price: {
      en: 'Snowman World entry €35. Ice Bar drinks separately',
      fi: 'Snowman World -lippu 35 €. Jääbaarin juomat erikseen',
      de: 'Snowman-World-Ticket 35 €. Getränke an der Eisbar separat',
    },
    season: {
      en: 'Dec 6, 2026 – Mar 17, 2027',
      fi: '6.12.2026–17.3.2027',
      de: '6. Dez. 2026 – 17. März 2027',
    },
    website: 'https://snowmanworld.fi',
    stayQuery: 'Santa Claus Village, Rovaniemi, Finland',
    staySid: 'icebar_snowman_world',
    stayHint: 'Santa Holiday Village + Nova Skyland nearby',
    // GYG product (verified 2026-05-02): Snowman World Entry Ticket
    visitGygProductPath: 'rovaniemi-l2653/entrance-ticket-to-snowman-world-in-santa-claus-village-t404948',
    visitSid: 'icebar_visit_snowman_world',
  },
];

export function getFeaturedBars(): Bar[] {
  return bars.filter((b) => b.featured);
}
