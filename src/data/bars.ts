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
  price: string;
  address: string;
  website?: string;
  hours: string;
  featured?: boolean;
  tour?: BarTour;
}

export const cities = ['Rovaniemi', 'Levi', 'Ylläs', 'Saariselkä'];

export const bars: Bar[] = [
  // ROVANIEMI
  {
    name: 'Lapland Brewery Pub',
    city: 'Rovaniemi',
    type: 'Craft Beer Pub',
    description: 'The northernmost craft brewery pub in Rovaniemi, serving fresh beers brewed on-site. Lapland Brewery uses pure Arctic water and locally inspired recipes — spruce tip ales, lingonberry wheat, smoked porter. Sit by the tanks and drink what was brewed that week.',
    highlights: ['House-brewed craft beer', 'Arctic ingredients', 'Brewery tours'],
    price: 'Pint ~€7',
    address: 'Teollisuustie 14, 96320 Rovaniemi',
    website: 'https://lapinpanimo.fi/en/',
    hours: 'Mon–Fri 09–21, Sat 12–21, Sun closed',
    featured: true,
    tour: {
      label: 'Brewery tour & tasting',
      priceFrom: '€25 / person',
      schedule: 'Friday 17:00 + 18:30 (Dec–Mar weekly)',
      hint: 'Register by Wed 14:00 — minimum 3 people. Reserve via info@lapinpanimo.fi or +358 45 133 4410.',
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
    description: 'Rovakatu 21, right in the heart of Rovaniemi. The most consistently mentioned bar in the city — a hybrid café by day, cocktail bar by night. Creative drinks, curated wine list, a refined crowd. A favourite of locals and visitors who want something beyond a standard pub.',
    highlights: ['Creative cocktails', 'Wine selection', 'City centre location'],
    price: 'Cocktail ~€12–15',
    address: 'Rovakatu 21, 96200 Rovaniemi',
    website: 'https://www.cafebar21.fi/en/home',
    hours: 'Mon–Thu 11–21, Fri 11–22, Sat 12–22, Sun closed',
    featured: true,
  },
  {
    name: 'Uitto Pub',
    city: 'Rovaniemi',
    type: 'Traditional Pub',
    description: 'A legendary Rovaniemi institution. "Comfortable, relaxed, and legendary" — Uitto has been serving locals high-quality beers, drinks, snacks and meals for decades. No pretension, just a good Finnish pub doing what a good Finnish pub should do.',
    highlights: ['Local institution', 'Full menu', 'Draft beers'],
    price: 'Beer ~€6–7',
    address: 'Korkalonkatu 25, 96200 Rovaniemi',
    website: 'https://www.raflaamo.fi/en/restaurant/rovaniemi/uitto-pub',
    hours: 'Mon–Thu 17–00:30, Fri–Sat 17–02:30, Sun 17–00:30',
  },
  {
    name: 'Nook Lounge',
    city: 'Rovaniemi',
    type: 'Bar & Lounge',
    description: 'A cosy café-bar hybrid where good drinks are made slowly and conversations run long. The bartenders know what they\'re doing. Popular with travellers who\'ve been on their feet all day and want somewhere warm, unhurried, and properly lit.',
    highlights: ['Lounge atmosphere', 'Crafted drinks', 'Late evenings'],
    price: 'Cocktail ~€12',
    address: 'Koskikatu 14, 96200 Rovaniemi',
    website: 'https://santashotels.fi/en/nook-lounge/',
    hours: 'Check venue for current hours',
  },
  {
    name: 'Bull Bar & Grill',
    city: 'Rovaniemi',
    type: 'Bar & Grill',
    description: 'Located in the Arctic City Hotel building — an American-style grill bar with a lively evening atmosphere. Good burgers, proper drinks, sports on screen. The kind of place that fills up after 9 and stays loud until late.',
    highlights: ['Grill menu', 'Sports bar', 'Hotel location'],
    price: 'Mains €14–22',
    address: 'Maakuntakatu 25, 96200 Rovaniemi',
    website: 'https://www.arcticcityhotel.fi/eat-drink/bull-bar-grill',
    hours: 'Mon–Thu 17–00, Fri–Sat 17–02, Sun 17–00',
  },
  {
    name: 'Ice Bar @ Arctic SnowHotel',
    city: 'Rovaniemi',
    type: 'Ice Bar Experience',
    description: 'Built from scratch every winter, this ice bar is carved by artists and rebuilt with a new theme each season. Located at the Arctic SnowHotel on Lake Lehtojärvi — 30 minutes from Rovaniemi city centre. Drinks served in glasses made of ice. Temperature: -5°C inside. Thermal suits provided.',
    highlights: ['New theme yearly', 'Ice glasses', 'Thermal suits included', '-5°C inside'],
    price: 'Entry ~€15 incl. one drink',
    address: 'Lehtoahontie 27, 97220 Sinettä',
    website: 'https://arcticsnowhotel.fi/en/eat-drink/ice-bar/',
    hours: 'Daily 10–20 (Dec 15 – Mar 31)',
    featured: true,
    tour: {
      label: 'Ice bar visit + thermal suit',
      priceFrom: '€15 / person',
      schedule: 'Daily 10:00–20:00 (Dec 15 – Mar 31)',
      hint: 'Includes one drink in an ice glass + thermal suit.',
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
    description: 'The undisputed king of Lapland après-ski. 1,700-capacity arena right at the base of Levi\'s main slope — Finland\'s biggest après-ski venue. Top Finnish artists, pop stars, rap acts and international DJs perform nightly during ski season. The dance floor fills at 4pm and doesn\'t empty until 2am.',
    highlights: ['1,700 capacity', 'Top Finnish artists', 'Slope-side location', 'Nightly shows'],
    price: 'Entry €0–20 depending on act',
    address: 'Myllyjoentie 2, 99130 Levi',
    website: 'https://www.hulluporo.fi/en/restaurants/hullu-poro-areena/',
    hours: 'Performance nights, doors 20–21, closes 03:30',
    featured: true,
  },
  {
    name: 'Bar Ihku',
    city: 'Levi',
    type: 'Nightclub & Bar',
    description: 'Already a legend among Levi party-goers. Ihku has accumulated stories over years of late-night Lapland chaos. Karaoke, dancing, Finnish locals and international skiers sharing the same floor. One of those places that looks ordinary until 11pm — then you understand why everyone talks about it.',
    highlights: ['Late-night institution', 'Karaoke nights', 'Local favourite'],
    price: 'Beer ~€6–7',
    address: 'Keskuskuja 3 A, 99130 Levi',
    website: 'https://ihkubar.fi',
    hours: 'Karaoke from 18:00, club 22:00–04:00',
    featured: true,
  },
  {
    name: 'Pub Hölmölä',
    city: 'Levi',
    type: 'Pub',
    description: '"Levi\'s funniest pub." Hölmölä offers the best brewery products and cocktails, followed by unpretentious bar food. Board games, table football and billiards available free of charge. The kind of pub that doesn\'t take itself seriously, which is exactly what makes it great.',
    highlights: ['Board games & billiards', 'Craft beers', 'Bar food', 'No attitude'],
    price: 'Beer ~€6–7',
    address: 'Hiihtäjänkuja 10, 99130 Levi',
    website: 'https://www.hulluporo.fi/en/restaurants/pub-holmola/',
    hours: 'Daily 10–02',
  },
  {
    name: 'Pub Sohva',
    city: 'Levi',
    type: 'Beer Restaurant',
    description: 'A warm and helpful beer restaurant along Levi\'s main street. Sohva is the kind of place you walk into planning one drink and leave three hours later. Good beer selection, decent food, friendly service. The daytime crowd flows straight into the evening one.',
    highlights: ['Main street location', 'Beer selection', 'Food menu'],
    price: 'Beer ~€6–7',
    address: 'Leviraitti 4 B, 99130 Levi',
    website: 'https://pubsohva.fi/',
    hours: 'Daily 12–02',
  },
  {
    name: 'Bar Alakerta',
    city: 'Levi',
    type: 'Live Music Bar',
    description: 'Sunny terrace, live music and the legendary Open Stage Jams on Sundays. Alakerta attracts musicians and music lovers — both locals and visiting artists who\'ve heard about the Sunday sessions. Unpretentious, warm, with the kind of atmosphere that happens when people actually love what they\'re doing.',
    highlights: ['Sunday Open Stage Jams', 'Live music', 'Sunny terrace'],
    price: 'Beer ~€6–7',
    address: 'Myllyjoentie 2, 99130 Levi',
    website: 'https://alakerta.bar',
    hours: 'Tue–Sun 18–02 (04)',
  },
  {
    name: 'Pub Old Mates',
    city: 'Levi',
    type: 'British Pub',
    description: 'A proper British-style pub dropped into the middle of Finnish Lapland. Old Mates does pints properly, shows football, and provides a corner of familiar comfort for those who need it after a long day on the slopes. Better than most pubs in Britain, because Finnish beer is actually good.',
    highlights: ['British pub style', 'Sports on screen', 'Pints done right'],
    price: 'Pint ~€6–8',
    address: 'Tähtitie 4, 99130 Levi',
    website: 'https://oldmates.fi/levi',
    hours: 'Daily 12–02, kitchen 12–21:30',
  },

  // YLLÄS
  {
    name: 'Selvä Pyy',
    city: 'Ylläs',
    type: 'Pub & Restaurant',
    description: 'The go-to pub in Äkäslompolo village on the Ylläs side. Selvä Pyy serves craft beers, cocktails and proper Finnish pub food in a warm, log-cabin atmosphere. After a day on the fells, this is where locals and skiers converge — no pretension, just good drinks and easy company.',
    highlights: ['Äkäslompolo village', 'Craft beers', 'Finnish pub food', 'Log cabin vibe'],
    price: 'Beer ~€6–7',
    address: 'Tunturintie 16, 95970 Äkäslompolo',
    website: 'https://selvapyy.fi',
    hours: 'Daily 11–01',
    featured: true,
  },
  {
    name: 'Pirtukellari Night Club',
    city: 'Ylläs',
    type: 'Nightclub',
    description: 'The only proper nightclub in the Ylläs area, located inside Lapland Hotels Äkäshotelli. When the pubs wind down, the party moves underground to Pirtukellari. DJs, dancing, and a surprisingly packed floor for a village of 400 people. Peak season Fridays are genuinely wild.',
    highlights: ['Ylläs only nightclub', 'DJs & dancing', 'Inside Lapland Hotels'],
    price: 'Beer ~€6–7',
    address: 'Äkäsentie 10, 95970 Äkäslompolo',
    hours: 'Fri–Sat 22–03 (season dependent)',
  },

  // SAARISELKÄ
  {
    name: 'Gastropub Giitu',
    city: 'Saariselkä',
    type: 'Gastropub & Craft Beer',
    description: 'The best bar in Saariselkä — a proper gastropub with an impressive craft beer selection and a menu that goes well beyond pub basics. Giitu serves Lappish-inspired dishes alongside a rotating tap list. The atmosphere is warm, modern, and exactly what you want after a Northern Lights hunt.',
    highlights: ['Craft beer selection', 'Lappish cuisine', 'Modern gastropub'],
    price: 'Beer ~€7–8, mains €16–25',
    address: 'Revontulentie 1, 99830 Saariselkä',
    website: 'https://gastropubgiitu.fi/en/home',
    hours: 'Daily 12–00, kitchen 12–22',
    featured: true,
  },
  {
    name: 'Pirtti Pub & Restaurant',
    city: 'Saariselkä',
    type: 'Pub & Restaurant',
    description: 'A traditional Finnish pub-restaurant in Saariselkä serving reliable Finnish food alongside a good selection of drinks. Located in the Santa\'s Hotel Tunturi complex. The kind of place the whole group can agree on — whether you want a burger, a beer, or just somewhere warm to sit after a long Arctic day.',
    highlights: ['Full restaurant menu', 'Traditional Finnish food', 'Hotel complex'],
    price: 'Mains €14–22',
    address: 'Honkapolku 2, 99830 Saariselkä',
    website: 'https://pirkonpirtti.fi/',
    hours: 'Daily 15–21',
  },
];

export const iceBars = [
  {
    name: 'SnowVillage IceBar',
    location: 'Lainio, Ylläs',
    description: 'Carved entirely from snow and ice each winter by international ice artists. New theme and sculptures every season. Drinks served in glasses made of pure Arctic ice. Part of the Snow Village complex — combine it with a night in a snow suite.',
    highlight: 'New ice sculptures every winter',
    temp: '-5°C inside',
    price: 'Entry + 1 drink ~€25',
    season: 'Open Dec–Apr (rebuild Oct–Nov)',
    website: 'https://snowvillage.fi',
    // Hotels.com — sleep on-site
    stayQuery: 'Lainio Snow Village, Ylläs, Finland',
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
    temp: '-5°C inside',
    price: 'Entry + 1 drink ~€15',
    season: 'Daily 10–20 (Dec 15 – Mar 31)',
    website: 'https://arcticsnowhotel.fi',
    stayQuery: 'Arctic SnowHotel, Rovaniemi, Finland',
    staySid: 'icebar_arctic_snowhotel',
    stayHint: 'Snow rooms, glass igloos, log cabins',
    // GYG product (verified 2026-05-02): Arctic SnowHotel Visit with Ice Bar
    visitGygProductPath: 'rovaniemi-l2653/rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814',
    visitSid: 'icebar_visit_arctic_snowhotel',
  },
  {
    name: 'Snowman World Ice Bar',
    location: 'Santa Claus Village, Rovaniemi',
    description: 'Inside the legendary Snowman World at Santa Claus Village — a different kind of ice bar experience, more family-friendly and accessible. Hot drinks and cold cocktails served amid snow sculptures. Good option if you\'re combining the ice bar with a Santa visit.',
    highlight: 'Santa Claus Village location',
    temp: 'Outdoors / covered',
    price: 'Part of Snowman World entry',
    season: 'Late Nov – early Apr',
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
