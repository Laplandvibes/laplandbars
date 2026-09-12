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
  ko?: string;
  fr?: string;
  it?: string;
  nl?: string;
  sv?: string;
};

import type { Locale } from '../i18n/config';
import barMenus from './generated/bar-menus.json';

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
 * (a) GYG tour search if the venue runs tours/tastings, or (b) the lodging partner
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
  /**
   * Editorial pick — an opinion, not an ad. Nothing is paid for it: this site
   * has no sold inventory (adSlots.ts `sponsors: [null, null]`) and no venue
   * appears in any partner record.
   *
   * 🔴 If a paid placement is ever sold, it must NOT reuse this flag. Give it
   * its own field and mark it as advertising, the way laplanddining marks its
   * per-city partner slot ("KKV: merkitty mainokseksi"). /about states in all
   * twelve languages that nothing here is paid placement — that sentence stops
   * being true the moment this flag is sold.
   */
  featured?: boolean;
  tour?: BarTour;
}


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
      sv: 'Stor stark ca 7 €',
      fr: 'Pinte ~7 €',
      it: 'Pinta ~7 €',
      nl: 'Pint ~€7',
      es: 'Pinta ~7 €',
      'pt-BR': 'Pint ~7 €',
      ja: 'パイント約7€',
      ko: '파인트 약 7€',
      'zh-CN': '一品脱约 7 €',
    },
    address: 'Teollisuustie 14 B, 96320 Rovaniemi',
    website: 'https://lapinpanimo.fi/en/',
    hours: {
      en: 'Tue–Fri 09–18, Sat–Mon closed (longer hours in the Christmas season)',
      fi: 'Ti–Pe 09–18, La–Ma suljettu (joulun aikaan pidemmät ajat)',
      de: 'Di–Fr 09–18, Sa–Mo geschlossen (in der Weihnachtszeit länger)',
      sv: 'Tis–Fre 09–18, Lör–Mån stängt (längre öppettider i juletid)',
      fr: 'Mar–Ven 09–18, Sam–Lun fermé (horaires étendus pendant les fêtes)',
      it: 'Mar–Ven 09–18, Sab–Lun chiuso (orari più lunghi nel periodo natalizio)',
      nl: 'Di–Vr 09–18, Za–Ma gesloten (ruimere tijden in de kersttijd)',
      es: 'Mar–Vie 09–18, Sáb–Lun cerrado (horario ampliado en Navidad)',
      'pt-BR': 'Ter–Sex 09–18, Sáb–Seg fechado (horário estendido no Natal)',
      ja: '火–金 09–18、土–月 定休（クリスマス期は延長営業）',
      ko: '화–금 09–18, 토–월 휴무 (크리스마스 시즌에는 연장 영업)',
      'zh-CN': '周二–周五 09–18，周六–周一 休息（圣诞季延长营业）',
    },
    featured: true,
    tour: {
      label: 'Brewery tour & tasting',
      priceFrom: '€25 / person',
      schedule: 'Fridays 17:00 (Dec–Mar, weekly)',
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
      sv: 'Cocktail ca 12–15 €',
      fr: 'Cocktail ~12–15 €',
      it: 'Cocktail ~12–15 €',
      nl: 'Cocktail ~€12–15',
      es: 'Cóctel ~12–15 €',
      'pt-BR': 'Coquetel ~12–15 €',
      ja: 'カクテル約12–15€',
      ko: '칵테일 약 12–15€',
      'zh-CN': '鸡尾酒约 12–15 €',
    },
    address: 'Rovakatu 21, 96200 Rovaniemi',
    website: 'https://www.cafebar21.fi/en/home',
    hours: {
      en: 'Mon–Thu 11–20, Fri–Sat 11–21, Sun closed',
      fi: 'Ma–To 11–20, Pe–La 11–21, Su suljettu',
      de: 'Mo–Do 11–20, Fr–Sa 11–21, So geschlossen',
      sv: 'Mån–Tors 11–20, Fre–Lör 11–21, Sön stängt',
      fr: 'Lun–Jeu 11–20, Ven–Sam 11–21, Dim fermé',
      it: 'Lun–Gio 11–20, Ven–Sab 11–21, Dom chiuso',
      nl: 'Ma–Do 11–20, Vr–Za 11–21, Zo gesloten',
      es: 'Lun–Jue 11–20, Vie–Sáb 11–21, Dom cerrado',
      'pt-BR': 'Seg–Qui 11–20, Sex–Sáb 11–21, Dom fechado',
      ja: '月–木 11–20、金–土 11–21、日 定休',
      ko: '월–목 11–20, 금–토 11–21, 일 휴무',
      'zh-CN': '周一–周四 11–20，周五–周六 11–21，周日 休息',
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
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Korkalonkatu 25, 96200 Rovaniemi',
    website: 'https://www.raflaamo.fi/en/restaurant/rovaniemi/uitto-pub',
    hours: {
      en: 'Tue–Thu 17–00:30, Fri–Sat 17–02:30, Sun–Mon closed',
      fi: 'Ti–To 17–00:30, Pe–La 17–02:30, Su–Ma suljettu',
      de: 'Di–Do 17–00:30, Fr–Sa 17–02:30, So–Mo geschlossen',
      sv: 'Tis–Tors 17–00:30, Fre–Lör 17–02:30, Sön–Mån stängt',
      fr: 'Mar–Jeu 17–00:30, Ven–Sam 17–02:30, Dim–Lun fermé',
      it: 'Mar–Gio 17–00:30, Ven–Sab 17–02:30, Dom–Lun chiuso',
      nl: 'Di–Do 17–00:30, Vr–Za 17–02:30, Zo–Ma gesloten',
      es: 'Mar–Jue 17–00:30, Vie–Sáb 17–02:30, Dom–Lun cerrado',
      'pt-BR': 'Ter–Qui 17–00:30, Sex–Sáb 17–02:30, Dom–Seg fechado',
      ja: '火–木 17–00:30、金–土 17–02:30、日–月 定休',
      ko: '화–목 17–00:30, 금–토 17–02:30, 일–월 휴무',
      'zh-CN': '周二–周四 17–00:30，周五–周六 17–02:30，周日–周一 休息',
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
      sv: 'Cocktail ca 12 €',
      fr: 'Cocktail ~12 €',
      it: 'Cocktail ~12 €',
      nl: 'Cocktail ~€12',
      es: 'Cóctel ~12 €',
      'pt-BR': 'Coquetel ~12 €',
      ja: 'カクテル約12€',
      ko: '칵테일 약 12€',
      'zh-CN': '鸡尾酒约 12 €',
    },
    address: 'Koskikatu 14, 96200 Rovaniemi',
    website: 'https://santashotels.fi/en/nook-lounge/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    name: 'Bull Bar & Grill',
    city: 'Rovaniemi',
    type: 'Bar & Grill',
    description: 'In the Arctic City Hotel building, this American-style grill bar has a lively evening atmosphere. Good burgers, proper drinks, sports on screen. The kind of place that fills up after 9 and stays loud until late.',
    highlights: ['Grill menu', 'Sports bar', 'Hotel location'],
    price: {
      en: 'Mains €14–22',
      fi: 'Pääruoat 14–22 €',
      de: 'Hauptgerichte 14–22 €',
      sv: 'Huvudrätter 14–22 €',
      fr: 'Plats 14–22 €',
      it: 'Piatti principali 14–22 €',
      nl: 'Hoofdgerechten €14–22',
      es: 'Platos principales 14–22 €',
      'pt-BR': 'Pratos principais 14–22 €',
      ja: 'メイン 14–22€',
      ko: '메인 요리 14–22€',
      'zh-CN': '主菜 14–22 €',
    },
    address: 'Maakuntakatu 25, 96200 Rovaniemi',
    website: 'https://bullbar.fi/',
    hours: {
      en: 'Sun–Thu 17–23, Fri–Sat 17–00, kitchen 17–21:30',
      fi: 'Su–To 17–23, Pe–La 17–00, keittiö 17–21:30',
      de: 'So–Do 17–23, Fr–Sa 17–00, Küche 17–21:30',
      sv: 'Sön–Tors 17–23, Fre–Lör 17–00, kök 17–21:30',
      fr: 'Dim–Jeu 17–23, Ven–Sam 17–00, cuisine 17–21:30',
      it: 'Dom–Gio 17–23, Ven–Sab 17–00, cucina 17–21:30',
      nl: 'Zo–Do 17–23, Vr–Za 17–00, keuken 17–21:30',
      es: 'Dom–Jue 17–23, Vie–Sáb 17–00, cocina 17–21:30',
      'pt-BR': 'Dom–Qui 17–23, Sex–Sáb 17–00, cozinha 17–21:30',
      ja: '日–木 17–23、金–土 17–00、キッチン 17–21:30',
      ko: '일–목 17–23, 금–토 17–00, 주방 17–21:30',
      'zh-CN': '周日–周四 17–23，周五–周六 17–00，厨房 17–21:30',
    },
  },
  {
    name: 'Ice Bar @ Arctic SnowHotel',
    city: 'Rovaniemi',
    type: 'Ice Bar Experience',
    description: 'Built from scratch every winter, this ice bar is carved by artists and rebuilt with a new theme each season. Located at the Arctic SnowHotel on Lake Lehtojärvi, 30 minutes from Rovaniemi city centre. Drinks served in glasses made of ice. Temperature: −5 °C inside. Thermal suits provided.',
    highlights: ['New theme yearly', 'Ice glasses', 'Thermal suits included', '-5°C inside'],
    // Verified from arcticsnowhotel.fi/en/eat-drink/ice-bar/ 2026-07-10:
    // hours 11–22; access requires a Snowhotel entrance ticket (overnight
    // guests free) — no standalone ~€15 bar fee.
    price: {
      en: 'SnowHotel ticket needed; guests free',
      fi: 'Snowhotel-lippu; yöpyjille ilmainen',
      de: 'Snowhotel-Ticket nötig; Gäste frei',
      sv: 'Snowhotel-biljett krävs; gäster gratis',
      fr: 'Billet Snowhotel requis, hôtes gratuits',
      it: 'Biglietto Snowhotel; ospiti gratis',
      nl: 'Snowhotel-ticket nodig; gasten gratis',
      es: 'Entrada Snowhotel; huéspedes gratis',
      'pt-BR': 'Ingresso Snowhotel; hóspedes grátis',
      ja: 'Snowhotel入場券が必要、宿泊客は無料',
      ko: 'Snowhotel 입장권 필요, 투숙객 무료',
      'zh-CN': '需 Snowhotel 门票，住店客人免费',
    },
    address: 'Lehtoahontie 27, 97220 Sinettä',
    website: 'https://arcticsnowhotel.fi/en/eat-drink/ice-bar/',
    hours: {
      en: 'Daily 11–22 (Dec 15 – Mar 31)',
      fi: 'Päivittäin 11–22 (15.12.–31.3.)',
      de: 'Täglich 11–22 (15. Dez. – 31. März)',
      sv: 'Dagligen 11–22 (15 dec–31 mars)',
      fr: 'Tous les jours 11–22 (15 déc. – 31 mars)',
      it: 'Tutti i giorni 11–22 (15 dic – 31 mar)',
      nl: 'Dagelijks 11–22 (15 dec – 31 mrt)',
      es: 'Todos los días 11–22 (15 dic – 31 mar)',
      'pt-BR': 'Todos os dias 11–22 (15 dez – 31 mar)',
      ja: '毎日 11–22（12月15日〜3月31日）',
      ko: '매일 11–22 (12월 15일–3월 31일)',
      'zh-CN': '每天 11–22（12 月 15 日–3 月 31 日）',
    },
    featured: true,
    tour: {
      label: 'Ice bar visit + thermal suit',
      priceFrom: 'Live price on GetYourGuide',
      schedule: 'Daily 11:00–22:00 (Dec 15 – Mar 31)',
      hint: 'Guided SnowHotel visit, including Ice Bar access.',
      sid: 'bar_ice_bar_arctic_snowhotel',
      // 🟢 11.9.2026: tuote on taas myynnissä — mitattu selaimella (Playwright,
      // selain-UA): URL pysyy tuotesivulla, otsikko "Arctic SnowHotel Visit
      // with Ice Bar - 2026", "From €170", "Check availability", ei
      // unavailable-tekstiä. Ilman tätä kortti lupasi "Live-hinta
      // GetYourGuidessa" ilman yhtään linkkiä (Vesa 11.9.). Jos tuote katoaa
      // uudelleen, poista rivi JA vaihda priceFrom — älä jätä lupausta.
      gygProductPath: 'rovaniemi-l2653/rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814',
      // (historia) gygProductPath removed 2026-07-30: the product
      // `rovaniemi-arctic-snowhotel-visit-with-ice-bar-t1130814` has been
      // delisted. It does not 404 — GetYourGuide redirects it to the generic
      // Rovaniemi listing, so the card named this exact ice bar while the link
      // dropped the visitor into a city-wide list.
      //
      // No replacement exists: `nightlife-bars-tc109` has TWO products in the
      // whole of Lapland, so pointing at another bar product would be inventing
      // relevance. The card falls back to `directBookingUrl` (Bars.tsx already
      // branches on that), which is the honest outcome.
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
      en: 'Concert tickets ~€25–30, some nights free',
      fi: 'Konserttiliput noin 25–30 €, osa illoista ilmaisia',
      de: 'Konzerttickets ~25–30 €, manche Abende frei',
      sv: 'Konsertbiljetter ca 25–30 €, vissa kvällar gratis',
      fr: 'Billets de concert ~25–30 €, certains soirs gratuits',
      it: 'Biglietti concerto ~25–30 €, alcune serate gratis',
      nl: 'Concertkaartjes ~€25–30, sommige avonden gratis',
      es: 'Entradas de concierto ~25–30 €, algunas noches gratis',
      'pt-BR': 'Ingressos de show ~25–30 €, algumas noites grátis',
      ja: 'コンサートチケット約25–30€、無料の夜もあり',
      ko: '콘서트 티켓 약 25–30€, 무료인 밤도 있음',
      'zh-CN': '演出门票约 25–30 €，部分夜晚免费',
    },
    address: 'Hissitie 12, 99130 Levi',
    website: 'https://www.hulluporo.fi/en/restaurants/hullu-poro-areena/',
    hours: {
      en: 'Performance nights, doors 20–21, closes 03:30',
      fi: 'Esiintymisiltoina, ovet 20–21, sulkee 03:30',
      de: 'An Veranstaltungsabenden, Einlass 20–21, Schluss 03:30',
      sv: 'Spelningskvällar, dörrarna 20–21, stänger 03:30',
      fr: 'Soirs de concert, portes 20–21, fermeture 03:30',
      it: 'Serate con spettacolo, porte 20–21, chiude alle 03:30',
      nl: 'Op optreedavonden, deuren 20–21, sluit 03:30',
      es: 'Noches con actuación, puertas 20–21, cierra 03:30',
      'pt-BR': 'Noites de show, portas 20–21, fecha 03:30',
      ja: '公演の夜のみ、開場 20–21、閉店 03:30',
      ko: '공연 밤에만, 입장 20–21, 마감 03:30',
      'zh-CN': '演出之夜营业，开门 20–21，03:30 打烊',
    },
    featured: true,
  },
  {
    name: 'Bar Ihku',
    city: 'Levi',
    type: 'Nightclub & Bar',
    description: 'Already a legend among Levi party-goers. Ihku has accumulated stories over years of late-night Lapland chaos. Karaoke, dancing, Finnish locals and international skiers sharing the same floor. One of those places that looks ordinary until 11pm — then you understand why everyone talks about it.',
    highlights: ['Late-night institution', 'Karaoke nights', 'Local favourite'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Keskuskuja 3 A, 99130 Levi',
    // 2026-07-26: ihkubar.fi no longer resolves to the venue (TLS cert belongs
    // to wisenetwork.fi). The chain's own site is barihku.fi; Levi page below.
    website: 'https://barihku.fi/levi',
    hours: {
      en: 'Nightly until 04:00, weekly schedule on the venue site',
      fi: 'Iltaisin 04:00 asti, viikko-ohjelma paikan sivulla',
      de: 'Abends bis 04:00, Wochenplan auf der Website des Lokals',
      sv: 'Kvällar till 04:00, veckoschema på ställets sida',
      fr: 'Tous les soirs jusqu’à 04:00, programme hebdomadaire sur le site du bar',
      it: 'Ogni sera fino alle 04:00, programma settimanale sul sito del locale',
      nl: 'Elke avond tot 04:00, weekrooster op de site van de zaak',
      es: 'Cada noche hasta las 04:00, programa semanal en la web del local',
      'pt-BR': 'Toda noite até 04:00, programação semanal no site da casa',
      ja: '毎晩 04:00まで、週間スケジュールは店舗サイトで',
      ko: '매일 밤 04:00까지, 주간 일정은 매장 사이트에',
      'zh-CN': '每晚营业至 04:00，每周安排见店家网站',
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
      en: 'Beer from €8.90',
      fi: 'Olut alk. 8,90 €',
      de: 'Bier ab 8,90 €',
      sv: 'Öl från 8,90 €',
      fr: 'Bière à partir de 8,90 €',
      it: 'Birra da 8,90 €',
      nl: 'Bier vanaf €8,90',
      es: 'Cerveza desde 8,90 €',
      'pt-BR': 'Cerveja a partir de 8,90 €',
      ja: 'ビール 8.90€から',
      ko: '맥주 8.90€부터',
      'zh-CN': '啤酒 8.90 € 起',
    },
    address: 'Hiihtäjänkuja 10, 99130 Levi',
    website: 'https://www.hulluporo.fi/en/restaurants/pub-holmola/',
    hours: {
      en: 'Sun–Thu 14–00, Fri–Sat 14–02 (ski season daily 12–02)',
      fi: 'Su–To 14–00, Pe–La 14–02 (hiihtokaudella päivittäin 12–02)',
      de: 'So–Do 14–00, Fr–Sa 14–02 (in der Skisaison täglich 12–02)',
      sv: 'Sön–Tors 14–00, Fre–Lör 14–02 (under skidsäsongen dagligen 12–02)',
      fr: 'Dim–Jeu 14–00, Ven–Sam 14–02 (saison de ski : tous les jours 12–02)',
      it: 'Dom–Gio 14–00, Ven–Sab 14–02 (in stagione sciistica tutti i giorni 12–02)',
      nl: 'Zo–Do 14–00, Vr–Za 14–02 (in het skiseizoen dagelijks 12–02)',
      es: 'Dom–Jue 14–00, Vie–Sáb 14–02 (en temporada de esquí, a diario 12–02)',
      'pt-BR': 'Dom–Qui 14–00, Sex–Sáb 14–02 (na temporada de esqui, todos os dias 12–02)',
      ja: '日–木 14–00、金–土 14–02（スキーシーズンは毎日 12–02）',
      ko: '일–목 14–00, 금–토 14–02 (스키 시즌에는 매일 12–02)',
      'zh-CN': '周日–周四 14–00，周五–周六 14–02（滑雪季每天 12–02）',
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
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Leviraitti 4 B, 99130 Levi',
    website: 'https://pubsohva.fi/',
    hours: {
      en: 'Daily 14–02',
      fi: 'Päivittäin 14–02',
      de: 'Täglich 14–02',
      sv: 'Dagligen 14–02',
      fr: 'Tous les jours 14–02',
      it: 'Tutti i giorni 14–02',
      nl: 'Dagelijks 14–02',
      es: 'Todos los días 14–02',
      'pt-BR': 'Todos os dias 14–02',
      ja: '毎日 14–02',
      ko: '매일 14–02',
      'zh-CN': '每天 14–02',
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
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Myllyjoentie 2, 99130 Levi',
    // Verkkosivulinkki poistettu 2026-08-10: alakerta.bar palauttaa HTTP 500
    // kaikilla varianteilla (www, http, apex) — palvelinvirhe, ei vaara polku.
    // Vaihtoehtoista osoitetta ei ole. Löytyi uudella kuukausivahdilla
    // ensimmäisellä ajolla. Jos sivusto palaa, lisää website-kenttä takaisin.
    hours: {
      en: 'Tue–Sun 18–02 (04)',
      fi: 'Ti–Su 18–02 (04)',
      de: 'Di–So 18–02 (04)',
      sv: 'Tis–Sön 18–02 (04)',
      fr: 'Mar–Dim 18–02 (04)',
      it: 'Mar–Dom 18–02 (04)',
      nl: 'Di–Zo 18–02 (04)',
      es: 'Mar–Dom 18–02 (04)',
      'pt-BR': 'Ter–Dom 18–02 (04)',
      ja: '火–日 18–02 (04)',
      ko: '화–일 18–02 (04)',
      'zh-CN': '周二–周日 18–02 (04)',
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
      sv: 'Stor stark ca 6–8 €',
      fr: 'Pinte ~6–8 €',
      it: 'Pinta ~6–8 €',
      nl: 'Pint ~€6–8',
      es: 'Pinta ~6–8 €',
      'pt-BR': 'Pint ~6–8 €',
      ja: 'パイント約6–8€',
      ko: '파인트 약 6–8€',
      'zh-CN': '一品脱约 6–8 €',
    },
    address: 'Tähtitie 4, 99130 Levi',
    website: 'https://oldmates.fi/levi',
    hours: {
      en: 'Daily 14–02, kitchen 14–21:30',
      fi: 'Päivittäin 14–02, keittiö 14–21:30',
      de: 'Täglich 14–02, Küche 14–21:30',
      sv: 'Dagligen 14–02, kök 14–21:30',
      fr: 'Tous les jours 14–02, cuisine 14–21:30',
      it: 'Tutti i giorni 14–02, cucina 14–21:30',
      nl: 'Dagelijks 14–02, keuken 14–21:30',
      es: 'Todos los días 14–02, cocina 14–21:30',
      'pt-BR': 'Todos os dias 14–02, cozinha 14–21:30',
      ja: '毎日 14–02、キッチン 14–21:30',
      ko: '매일 14–02, 주방 14–21:30',
      'zh-CN': '每天 14–02，厨房 14–21:30',
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
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Tunturintie 16, 95970 Äkäslompolo',
    website: 'https://selvapyy.fi',
    hours: {
      en: 'Daily 12–22 (24), kitchen 12–21',
      fi: 'Päivittäin 12–22 (24), keittiö 12–21',
      de: 'Täglich 12–22 (24), Küche 12–21',
      sv: 'Dagligen 12–22 (24), kök 12–21',
      fr: 'Tous les jours 12–22 (24), cuisine 12–21',
      it: 'Tutti i giorni 12–22 (24), cucina 12–21',
      nl: 'Dagelijks 12–22 (24), keuken 12–21',
      es: 'Todos los días 12–22 (24), cocina 12–21',
      'pt-BR': 'Todos os dias 12–22 (24), cozinha 12–21',
      ja: '毎日 12–22 (24)、キッチン 12–21',
      ko: '매일 12–22 (24), 주방 12–21',
      'zh-CN': '每天 12–22 (24)，厨房 12–21',
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
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Äkäsentie 10, 95970 Äkäslompolo',
    hours: {
      en: 'Ski season only, Fri–Sat nights; closed off-season',
      fi: 'Vain hiihtokaudella pe–la-iltaisin; kauden ulkopuolella suljettu',
      de: 'Nur in der Skisaison, Fr–Sa abends; außerhalb der Saison geschlossen',
      sv: 'Bara under skidsäsongen, fre–lör kvällar; stängt utanför säsong',
      fr: 'Saison de ski uniquement, soirs de ven–sam ; fermé hors saison',
      it: 'Solo in stagione sciistica, ven–sab sera; chiuso fuori stagione',
      nl: 'Alleen in het skiseizoen, vr–za-avonden; buiten het seizoen gesloten',
      es: 'Solo en temporada de esquí, noches de vie–sáb; cerrado fuera de temporada',
      'pt-BR': 'Só na temporada de esqui, noites de sex–sáb; fechado fora da temporada',
      ja: 'スキーシーズンのみ、金・土の夜；シーズン外は休業',
      ko: '스키 시즌에만 금–토 밤 영업; 비수기 휴무',
      'zh-CN': '仅滑雪季周五–周六夜间营业；淡季休息',
    },
  },

  // SAARISELKÄ
  {
    name: 'Gastropub Giitu',
    city: 'Saariselkä',
    type: 'Gastropub & Craft Beer',
    description: 'The best bar in Saariselkä, a proper gastropub with an impressive craft beer selection and a menu that goes well beyond pub basics. Giitu serves Lapland-inspired dishes alongside a rotating tap list. The atmosphere is warm, modern, and exactly what you want after a Northern Lights hunt.',
    highlights: ['Craft beer selection', 'Lappish cuisine', 'Modern gastropub'],
    price: {
      en: 'Beer ~€7–8, mains €16–25',
      fi: 'Olut noin 7–8 €, pääruoat 16–25 €',
      de: 'Bier ~7–8 €, Hauptgerichte 16–25 €',
      sv: 'Öl ca 7–8 €, huvudrätter 16–25 €',
      fr: 'Bière ~7–8 €, plats 16–25 €',
      it: 'Birra ~7–8 €, piatti principali 16–25 €',
      nl: 'Bier ~€7–8, hoofdgerechten €16–25',
      es: 'Cerveza ~7–8 €, platos principales 16–25 €',
      'pt-BR': 'Cerveja ~7–8 €, pratos principais 16–25 €',
      ja: 'ビール約7–8€、メイン 16–25€',
      ko: '맥주 약 7–8€, 메인 요리 16–25€',
      'zh-CN': '啤酒约 7–8 €，主菜 16–25 €',
    },
    address: 'Revontulentie 1, 99830 Saariselkä',
    website: 'https://gastropubgiitu.fi/en/home',
    hours: {
      en: 'Daily 12–02, kitchen 12–22',
      fi: 'Päivittäin 12–02, keittiö 12–22',
      de: 'Täglich 12–02, Küche 12–22',
      sv: 'Dagligen 12–02, kök 12–22',
      fr: 'Tous les jours 12–02, cuisine 12–22',
      it: 'Tutti i giorni 12–02, cucina 12–22',
      nl: 'Dagelijks 12–02, keuken 12–22',
      es: 'Todos los días 12–02, cocina 12–22',
      'pt-BR': 'Todos os dias 12–02, cozinha 12–22',
      ja: '毎日 12–02、キッチン 12–22',
      ko: '매일 12–02, 주방 12–22',
      'zh-CN': '每天 12–02，厨房 12–22',
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
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Valtakatu 24, 96200 Rovaniemi',
    website: 'https://www.kauppayhtio.fi/',
    hours: {
      en: 'Tue–Fri 11–22, Sat 13–22, Sun 13–21',
      fi: 'Ti–Pe 11–22, La 13–22, Su 13–21',
      de: 'Di–Fr 11–22, Sa 13–22, So 13–21',
      sv: 'Tis–Fre 11–22, Lör 13–22, Sön 13–21',
      fr: 'Mar–Ven 11–22, Sam 13–22, Dim 13–21',
      it: 'Mar–Ven 11–22, Sab 13–22, Dom 13–21',
      nl: 'Di–Vr 11–22, Za 13–22, Zo 13–21',
      es: 'Mar–Vie 11–22, Sáb 13–22, Dom 13–21',
      'pt-BR': 'Ter–Sex 11–22, Sáb 13–22, Dom 13–21',
      ja: '火–金 11–22、土 13–22、日 13–21',
      ko: '화–금 11–22, 토 13–22, 일 13–21',
      'zh-CN': '周二–周五 11–22，周六 13–22，周日 13–21',
    },
    featured: true,
  },
  {
    name: 'Rovaniemen Oluthuone',
    city: 'Rovaniemi',
    type: 'Beer Bar',
    description: 'The "Beer Room" on Rovaniemi\'s pedestrian street, a warm beer restaurant with a deep selection of domestic and imported brews plus cocktails and snacks. In summer the terrace and beer garden open up under the midnight sun. A straightforward, well-run place locals keep coming back to.',
    highlights: ['Deep beer selection', 'Summer beer garden', 'Pedestrian-street location'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Koskikatu 20, 96200 Rovaniemi',
    website: 'https://www.rovaniemenoluthuone.fi/',
    hours: {
      en: 'Mon–Tue 14–00, Wed–Thu 14–02, Fri–Sat 12–03, Sun 14–00',
      fi: 'Ma–Ti 14–00, Ke–To 14–02, Pe–La 12–03, Su 14–00',
      de: 'Mo–Di 14–00, Mi–Do 14–02, Fr–Sa 12–03, So 14–00',
      sv: 'Mån–Tis 14–00, Ons–Tors 14–02, Fre–Lör 12–03, Sön 14–00',
      fr: 'Lun–Mar 14–00, Mer–Jeu 14–02, Ven–Sam 12–03, Dim 14–00',
      it: 'Lun–Mar 14–00, Mer–Gio 14–02, Ven–Sab 12–03, Dom 14–00',
      nl: 'Ma–Di 14–00, Wo–Do 14–02, Vr–Za 12–03, Zo 14–00',
      es: 'Lun–Mar 14–00, Mié–Jue 14–02, Vie–Sáb 12–03, Dom 14–00',
      'pt-BR': 'Seg–Ter 14–00, Qua–Qui 14–02, Sex–Sáb 12–03, Dom 14–00',
      ja: '月–火 14–00、水–木 14–02、金–土 12–03、日 14–00',
      ko: '월–화 14–00, 수–목 14–02, 금–토 12–03, 일 14–00',
      'zh-CN': '周一–周二 14–00，周三–周四 14–02，周五–周六 12–03，周日 14–00',
    },
  },
  {
    name: 'MustaKissa Kuppila',
    city: 'Rovaniemi',
    type: 'Cocktail Bar',
    description: 'A small, cosy den for craft cocktails and local beer, where the drinks lean Arctic and seasonal. MustaKissa doubles as a gallery and concert space: temporary exhibitions on the walls, live music some nights. The kind of low-key spot regulars guard a little jealously.',
    highlights: ['Arctic seasonal cocktails', 'Local craft beer', 'Gallery & live music'],
    price: {
      en: 'Cocktail ~€12–15',
      fi: 'Drinkki noin 12–15 €',
      de: 'Cocktail ~12–15 €',
      sv: 'Cocktail ca 12–15 €',
      fr: 'Cocktail ~12–15 €',
      it: 'Cocktail ~12–15 €',
      nl: 'Cocktail ~€12–15',
      es: 'Cóctel ~12–15 €',
      'pt-BR': 'Coquetel ~12–15 €',
      ja: 'カクテル約12–15€',
      ko: '칵테일 약 12–15€',
      'zh-CN': '鸡尾酒约 12–15 €',
    },
    address: 'Kansankatu 2, 96100 Rovaniemi',
    website: 'https://www.facebook.com/MustaKissaKuppila/',
    hours: {
      en: 'Tue–Thu 14–23, Fri–Sat 14–02, Sun 14–20, Mon closed',
      fi: 'Ti–To 14–23, Pe–La 14–02, Su 14–20, Ma suljettu',
      de: 'Di–Do 14–23, Fr–Sa 14–02, So 14–20, Mo geschlossen',
      sv: 'Tis–Tors 14–23, Fre–Lör 14–02, Sön 14–20, Mån stängt',
      fr: 'Mar–Jeu 14–23, Ven–Sam 14–02, Dim 14–20, Lun fermé',
      it: 'Mar–Gio 14–23, Ven–Sab 14–02, Dom 14–20, Lun chiuso',
      nl: 'Di–Do 14–23, Vr–Za 14–02, Zo 14–20, Ma gesloten',
      es: 'Mar–Jue 14–23, Vie–Sáb 14–02, Dom 14–20, Lun cerrado',
      'pt-BR': 'Ter–Qui 14–23, Sex–Sáb 14–02, Dom 14–20, Seg fechado',
      ja: '火–木 14–23、金–土 14–02、日 14–20、月 定休',
      ko: '화–목 14–23, 금–토 14–02, 일 14–20, 월 휴무',
      'zh-CN': '周二–周四 14–23，周五–周六 14–02，周日 14–20，周一 休息',
    },
  },
  {
    name: 'Pub Sarvi',
    city: 'Rovaniemi',
    type: 'Traditional Pub',
    description: 'A warm, wood-clad neighbourhood pub away from the city-centre crowds. Craft beer on tap, honest shots, and regular live music that pulls in locals who know each other by name. Unpretentious and easy, the sort of pub you settle into for the evening rather than just pass through.',
    highlights: ['Craft beer on tap', 'Live music', 'Neighbourhood local'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Hillapolku 9, 96500 Rovaniemi',
    website: 'https://www.facebook.com/pubsarvi/',
    hours: {
      en: 'Mon–Thu 16–00, Fri 14–04, Sat 12–04, Sun 12–22',
      fi: 'Ma–To 16–00, Pe 14–04, La 12–04, Su 12–22',
      de: 'Mo–Do 16–00, Fr 14–04, Sa 12–04, So 12–22',
      sv: 'Mån–Tors 16–00, Fre 14–04, Lör 12–04, Sön 12–22',
      fr: 'Lun–Jeu 16–00, Ven 14–04, Sam 12–04, Dim 12–22',
      it: 'Lun–Gio 16–00, Ven 14–04, Sab 12–04, Dom 12–22',
      nl: 'Ma–Do 16–00, Vr 14–04, Za 12–04, Zo 12–22',
      es: 'Lun–Jue 16–00, Vie 14–04, Sáb 12–04, Dom 12–22',
      'pt-BR': 'Seg–Qui 16–00, Sex 14–04, Sáb 12–04, Dom 12–22',
      ja: '月–木 16–00、金 14–04、土 12–04、日 12–22',
      ko: '월–목 16–00, 금 14–04, 토 12–04, 일 12–22',
      'zh-CN': '周一–周四 16–00，周五 14–04，周六 12–04，周日 12–22',
    },
  },
  {
    name: 'Roy Club',
    city: 'Rovaniemi',
    type: 'Karaoke Bar & Nightclub',
    description: 'Rovaniemi\'s legendary karaoke bar and nightclub, running since 1985. Two floors: grab the mic on one, hit the dance floor on the other. It opens late and closes later, the place where a Rovaniemi night out tends to end, whether you planned it that way or not.',
    highlights: ['Karaoke since 1985', 'Two floors', 'Late-night club'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Maakuntakatu 24, 96200 Rovaniemi',
    website: 'https://www.royclub.fi/',
    hours: {
      en: 'Daily 22–04:30',
      fi: 'Päivittäin 22–04:30',
      de: 'Täglich 22–04:30',
      sv: 'Dagligen 22–04:30',
      fr: 'Tous les jours 22–04:30',
      it: 'Tutti i giorni 22–04:30',
      nl: 'Dagelijks 22–04:30',
      es: 'Todos los días 22–04:30',
      'pt-BR': 'Todos os dias 22–04:30',
      ja: '毎日 22–04:30',
      ko: '매일 22–04:30',
      'zh-CN': '每天 22–04:30',
    },
  },
  {
    name: "V'inkkari",
    city: 'Levi',
    type: 'Après-Ski Bar',
    description: 'A Levi après-ski institution at the foot of the slopes, known far beyond Lapland. Live bands play almost daily through the ski season and the crowd ends up dancing on the tables in ski boots. Easygoing by afternoon, loud and packed by evening: pure Levi après.',
    highlights: ['Live bands daily', 'Slope-side après', 'Dancing in ski boots'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Hissitie 6, 99130 Levi',
    website: 'https://www.levi.fi/en/services/restaurant-vinkkari/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
    featured: true,
  },
  {
    name: 'Restaurant Tuikku',
    city: 'Levi',
    type: 'Fell-Top Restaurant & Après-Ski',
    description: 'Levi\'s oldest fell-top restaurant, perched at the summit with panoramic views across the Western Lapland fells. Reach it on skis, by snowmobile, on foot, or by helicopter via the summit road. Lunch by day, the "Master of After Ski" by afternoon when the winter season is on.',
    highlights: ['Summit panoramic views', 'Arrive by ski or helicopter', 'Legendary après'],
    price: {
      en: 'Lunch / mains €15–25',
      fi: 'Lounas / pääruoat 15–25 €',
      de: 'Mittag / Hauptgerichte 15–25 €',
      sv: 'Lunch / huvudrätter 15–25 €',
      fr: 'Déjeuner / plats 15–25 €',
      it: 'Pranzo / piatti principali 15–25 €',
      nl: 'Lunch / hoofdgerechten €15–25',
      es: 'Almuerzo / platos principales 15–25 €',
      'pt-BR': 'Almoço / pratos principais 15–25 €',
      ja: 'ランチ／メイン 15–25€',
      ko: '점심 / 메인 요리 15–25€',
      'zh-CN': '午餐/主菜 15–25 €',
    },
    address: 'Tuikuntie 11, 99130 Levi',
    website: 'https://www.levi.fi/en/services/panoramic-restaurant-tuikku/',
    hours: {
      en: 'Daily 11–16 (summer); après-ski hours in winter. Check venue',
      fi: 'Päivittäin 11–16 (kesä); talvella après-ski-ajat. Tarkista paikasta',
      de: 'Täglich 11–16 (Sommer); im Winter Après-Ski-Zeiten. Beim Lokal prüfen',
      sv: 'Dagligen 11–16 (sommar); afterski-tider på vintern. Kolla med stället',
      fr: 'Tous les jours 11–16 (été) ; horaires après-ski en hiver. Vérifier auprès du lieu',
      it: 'Tutti i giorni 11–16 (estate); in inverno orari après-ski. Verificare col locale',
      nl: 'Dagelijks 11–16 (zomer); in de winter après-skitijden. Check bij de zaak',
      es: 'Todos los días 11–16 (verano); en invierno horario après-ski. Consulte el local',
      'pt-BR': 'Todos os dias 11–16 (verão); no inverno horário de après-ski. Confira com o local',
      ja: '毎日 11–16（夏）；冬はアプレスキー営業。店舗に確認',
      ko: '매일 11–16 (여름); 겨울에는 아프레 스키 시간. 매장에 확인',
      'zh-CN': '每天 11–16（夏季）；冬季为滑雪后派对时段。请向店家确认',
    },
  },
  {
    name: 'Bar Kaappi',
    city: 'Ylläs',
    type: 'Après-Ski Bar',
    description: 'A lounge-style après-ski bar in the heart of Ylläsjärvi, with a wide drinks list, special beers and cocktails, and the famous "Hattivatti" mocktail families come in for before 10pm. Through winter it runs live music nights and pub quizzes. Out front sits the Ford Sierra from the Lapland Odyssey films.',
    highlights: ['Hattivatti mocktail', 'Special beers & cocktails', 'Live music & quizzes'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Vaeltajantie 2, 95980 Ylläsjärvi',
    website: 'https://yllas.fi/en/restaurant/bar-kaappi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    name: 'Teerenpesä',
    city: 'Saariselkä',
    type: 'Restaurant, Pub & Nightclub',
    description: 'Three venues under one log roof in the centre of Saariselkä: a Lappish restaurant doing seasonal northern dishes, a sports pub with screens, darts and pool, and a nightclub that runs both traditional couples\' dances and a disco floor. Whatever the group wants from a night, it\'s here.',
    highlights: ['Three venues in one', 'Lappish kitchen', 'Dances & disco'],
    price: {
      en: 'Beer ~€6–7',
      fi: 'Olut noin 6–7 €',
      de: 'Bier ~6–7 €',
      sv: 'Öl ca 6–7 €',
      fr: 'Bière ~6–7 €',
      it: 'Birra ~6–7 €',
      nl: 'Bier ~€6–7',
      es: 'Cerveza ~6–7 €',
      'pt-BR': 'Cerveja ~6–7 €',
      ja: 'ビール約6–7€',
      ko: '맥주 약 6–7€',
      'zh-CN': '啤酒约 6–7 €',
    },
    address: 'Saariseläntie 5, 99830 Saariselkä',
    website: 'https://teerenpesa.fi/en/',
    hours: {
      en: 'Daily 14–01, kitchen 14–23',
      fi: 'Päivittäin 14–01, keittiö 14–23',
      de: 'Täglich 14–01, Küche 14–23',
      sv: 'Dagligen 14–01, kök 14–23',
      fr: 'Tous les jours 14–01, cuisine 14–23',
      it: 'Tutti i giorni 14–01, cucina 14–23',
      nl: 'Dagelijks 14–01, keuken 14–23',
      es: 'Todos los días 14–01, cocina 14–23',
      'pt-BR': 'Todos os dias 14–01, cozinha 14–23',
      ja: '毎日 14–01、キッチン 14–23',
      ko: '매일 14–01, 주방 14–23',
      'zh-CN': '每天 14–01，厨房 14–23',
    },
    featured: true,
  },

  {
    // Lähde https://barihku.fi/ruka · https://www.scandichotels.com/hotels/finland/ruka-kuusamo/scandic-rukahovi/restaurant-bar (luettu 12.9.2026)
    // Source conflict: Scandic's own restaurant page currently shows both Bar Ihku and the After Ski
    // terrace as closed with the note 'Open again 18.6.2026' - a date already three months past on
    // 12.9.2026, so that listing looks stale. barihku.fi lists active hours, and per rule 3 the
    // venue's own page is trusted. K18 from 21 onward. barihku.fi writes the address as 93830
    // Kuusamo, Scandic writes Rukankyläntie 15, Rukatunturi - the same building. Seasonal set true
    // on the strength of Scandic's closed-and-reopening listing; barihku.fi alone does not state a
    // season. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Daily from 14, karaoke Sun-Thu 21-02,
    // Fri-Sat 21-04, night club Fri 21-04, Sat 22-04 · Hinta lahteessa: Door tickets from EUR 8,
    // artist nights EUR 10-25
    name: 'Bar Ihku Ruka',
    city: 'Ruka',
    type: 'Karaoke bar and night club',
    description: 'A karaoke bar, night club and after-ski venue inside the Scandic Rukahovi hotel in Ruka village. The slope bar and terrace open in the afternoon, karaoke runs nightly and the night club opens on Friday and Saturday. The venue also runs weekly trivia and bingo nights and takes table reservations.',
    highlights: ['Karaoke every night', 'Slope-side after-ski terrace', 'Night club Fri-Sat'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukankyläntie 15, 93830 Kuusamo',
    website: 'https://barihku.fi/ruka',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://rukapalvelu.fi/en/restaurant-zone/ · https://rukapalvelu.fi/ravintolazone/ (luettu 12.9.2026)
    // Name differs by language on the operator's own site: 'Ravintola Zone' in Finnish, 'Restaurant
    // Zone' in English. Gig tickets are sold online and at the door from 21, but no ticket price is
    // published. seasonal set false because the site publishes one year-round daily schedule and
    // states no season; skiIn set false because the site makes no slope-side claim and the address
    // is in the village centre. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Daily 8-04
    name: 'Ravintola Zone',
    city: 'Ruka',
    type: 'Night club and live music restaurant',
    description: 'A restaurant in Ruka village that serves breakfast, lunch and grill food by day and becomes a music and dance venue at night. Its own site says it hosts over 100 live nights a year, from established Finnish artists to newer acts, and karaoke starts at 21 every night. There is a rooftop Panorama Terrace that can be booked privately.',
    highlights: ['Over 100 live nights a year', 'Karaoke from 21 daily', 'Grill kitchen until 04'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukankyläntie 13, 93830 Rukatunturi',
    website: 'https://rukapalvelu.fi/en/restaurant-zone/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.ravintolapiste.fi · https://www.ravintolapiste.fi/yhteystiedot/ (luettu 12.9.2026)
    // The site publishes a dated season calendar rather than a standing week: 16.-19.9. and
    // 23.-26.9. Wed-Sat 11-18 (kitchen to 20 on 25.-26.9.), then daily 11-18 from 30.9. The hours
    // field holds the from-30.9. pattern. The contact page lists no hours at all. seasonal set true
    // because the venue publishes only dated blocks, not a year-round schedule. ruka.fi calls it
    // 'Restaurant Piste'. · Aukiolo lahteessa: Daily 11-18
    name: 'Rinneravintola Piste',
    city: 'Ruka',
    type: 'Slope bar',
    description: "A slope restaurant and bar at the foot of Ruka's front slopes, described by its own site as serving cold drinks, hot drinks and food. Ruka's Spring Break site calls it the resort's party institution and landmark, with music all day and a terrace looking over the slopes and the spring pond-skim events.",
    highlights: ['At the foot of the front slopes', 'Terrace over the slopes', 'Music all day in season'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukankyläntie 17, 93825 Kuusamo',
    website: 'https://www.ravintolapiste.fi/',
    hours: {
      en: 'Daily 11–18',
      fi: 'Päivittäin 11–18',
      de: 'Täglich 11–18',
      sv: 'Dagligen 11–18',
      fr: 'Tous les jours 11–18',
      it: 'Tutti i giorni 11–18',
      nl: 'Dagelijks 11–18',
      es: 'Todos los días 11–18',
      'pt-BR': 'Todos os dias 11–18',
      ja: '毎日 11–18',
      ko: '매일 11–18',
      'zh-CN': '每天 11–18',
    },
  },
  {
    // Lähde https://hankibaari.fi/ruka/ · https://hankibaari.fi/in-english/ (luettu 12.9.2026)
    // Same-name trap checked: Hanki Baari has two locations. The Ruka one is Rukankyläntie 11, 93830
    // Rukatunturi, phone 040 774 0504; the Pyhä one is a separate venue (phone 041 310 7985)
    // currently closed for the season and reopening on Independence Day. The site shows Fri as
    // '11:00-21:00 (23:00)' and Sat as '12:00-21:00 (23:00)', i.e. extended to 23 on some days - the
    // hours field carries the base times only. The EUR 10-15 figure is gig ticket pricing, not drink
    // pricing. Under-18s after 21 must be with a parent. skiIn set false: village address, no
    // slope-side claim on its own site. · Aukiolo lahteessa: Mon-Thu 11-18, Fri 11-21, Sat 12-21,
    // Sun 12-17 · Hinta lahteessa: Gig tickets typically EUR 10-15
    name: 'Hanki Baari',
    city: 'Ruka',
    type: 'Bar',
    description: "A bar and restaurant in Ruka village that calls itself 'your local living room in the arctic'. Its own site lists local beers, craft drinks, wines and coffee alongside simple food, and it runs a rotating calendar of live artists and DJs through the winter, from folk to alternative. Dogs are welcome and it does not take table reservations.",
    highlights: ['Local beers and craft drinks', 'Live music and DJ nights', 'Dog friendly'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukankyläntie 11, 93830 Rukatunturi',
    website: 'https://hankibaari.fi/ruka/',
    hours: {
      en: 'Mon–Thu 11–18, Fri 11–21, Sat 12–21, Sun 12–17',
      fi: 'Ma–To 11–18, Pe 11–21, La 12–21, Su 12–17',
      de: 'Mo–Do 11–18, Fr 11–21, Sa 12–21, So 12–17',
      sv: 'Mån–Tors 11–18, Fre 11–21, Lör 12–21, Sön 12–17',
      fr: 'Lun–Jeu 11–18, Ven 11–21, Sam 12–21, Dim 12–17',
      it: 'Lun–Gio 11–18, Ven 11–21, Sab 12–21, Dom 12–17',
      nl: 'Ma–Do 11–18, Vr 11–21, Za 12–21, Zo 12–17',
      es: 'Lun–Jue 11–18, Vie 11–21, Sáb 12–21, Dom 12–17',
      'pt-BR': 'Seg–Qui 11–18, Sex 11–21, Sáb 12–21, Dom 12–17',
      ja: '月–木 11–18、金 11–21、土 12–21、日 12–17',
      ko: '월–목 11–18, 금 11–21, 토 12–21, 일 12–17',
      'zh-CN': '周一–周四 11–18，周五 11–21，周六 12–21，周日 12–17',
    },
  },
  {
    // Lähde https://www.scandichotels.com/hotels/finland/ruka-kuusamo/scandic-rukahovi/restaurant-bar · https://www.ruka.fi/en/travelling-to-kuusamo/food-and-entertainment/after-ski-and-bars (luettu 12.9.2026)
    // Scandic's own page writes the name simply as 'Lobby bar'; 'Lobby Bar Scandic Rukahovi' is
    // ruka.fi's label, kept here so the entry is identifiable. Café hours are daily 7-01:30, bar
    // hours daily 9-01:30 - the hours field carries the bar. The postal code is not printed on the
    // Scandic page; 93830 for Rukankyläntie 15 is taken from barihku.fi, which is in the same
    // building. skiIn true because Scandic describes the hotel as genuine ski-in, ski-out with the
    // slopes and lifts in front of it. The Finnish-language Scandic URL timed out repeatedly on
    // fetch; the English page was read in a browser. · Aukiolo lahteessa (ei kaannoskoneen
    // kaavassa): Daily 9-01:30
    name: 'Lobby Bar Scandic Rukahovi',
    city: 'Ruka',
    type: 'Hotel lobby bar',
    description: "The lobby bar of the Scandic Rukahovi hotel in the centre of Ruka village. The hotel's own page describes it as a cosy spot for refreshing drinks and small snacks with sports on the big screen. Café service starts at 7 in the morning and the bar runs until the small hours.",
    highlights: ['Sports on the big screen', 'Drinks and small snacks', 'Open until 01:30'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukankyläntie 15, 93830 Rukatunturi',
    website: 'https://www.scandichotels.com/hotels/finland/ruka-kuusamo/scandic-rukahovi/restaurant-bar',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.ravintolacolorado.fi/en/colorado-ruka/ · https://www.ravintolacolorado.fi/ruka/ (luettu 12.9.2026)
    // Three spellings of the name in circulation: the English page heads it 'Restaurant Colorado
    // Ruka', the Finnish page 'Ravintola Colorado Bar&Grill', ruka.fi 'Colorado Bar & Grill'. Small
    // conflict between the venue's own two language versions on kitchen closing: FI says Sun-Thu to
    // 21 and Fri-Sat to 21:30, EN says Sun-Thu to 20:30 and Fri-Sat to 21. Bar hours above are
    // identical in both. Breakfast is served Nov-Mar (the FI page says 'November onward'); live
    // music entry is free. skiIn false - village centre, no slope-side claim. · Aukiolo lahteessa:
    // Mon-Thu 14-22, Fri-Sat 14-24, Sun 14-22 · Hinta lahteessa: Breakfast EUR 14.50 for adults, EUR
    // 8 for ages 3-12
    name: 'Restaurant Colorado Ruka',
    city: 'Ruka',
    type: 'Bar and grill',
    description: "An American-style bar and grill in the walking centre of Ruka. Its own page pairs the food with 'rock music' and describes an attached bar with live music nearly every week during the ski season, games, billiards and a sun terrace. Meats are grilled in a charcoal oven and the burger patties are made in house.",
    highlights: ['Live music most weeks in ski season', 'Sports screens and billiards', 'Sun terrace'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukankyläntie 6, 93825 Kuusamo',
    website: 'https://www.ravintolacolorado.fi/en/colorado-ruka/',
    hours: {
      en: 'Mon–Thu 14–22, Fri–Sat 14–24, Sun 14–22',
      fi: 'Ma–To 14–22, Pe–La 14–24, Su 14–22',
      de: 'Mo–Do 14–22, Fr–Sa 14–24, So 14–22',
      sv: 'Mån–Tors 14–22, Fre–Lör 14–24, Sön 14–22',
      fr: 'Lun–Jeu 14–22, Ven–Sam 14–24, Dim 14–22',
      it: 'Lun–Gio 14–22, Ven–Sab 14–24, Dom 14–22',
      nl: 'Ma–Do 14–22, Vr–Za 14–24, Zo 14–22',
      es: 'Lun–Jue 14–22, Vie–Sáb 14–24, Dom 14–22',
      'pt-BR': 'Seg–Qui 14–22, Sex–Sáb 14–24, Dom 14–22',
      ja: '月–木 14–22、金–土 14–24、日 14–22',
      ko: '월–목 14–22, 금–토 14–24, 일 14–22',
      'zh-CN': '周一–周四 14–22，周五–周六 14–24，周日 14–22',
    },
  },
  {
    // Lähde https://springbreak.ruka.fi/en/afterski · https://www.ruka.fi/en/events/harmaa-rinne-monomesta-laura-vartio-harvest-nosso-nova (luettu 12.9.2026)
    // No own website - ruka.fi links only to Facebook, and Facebook returned a login wall in the
    // browser, so nothing was read from the venue itself. No street address, postal code or opening
    // hours are published on any page I could open; both fields left as found. Warning for whoever
    // fills this in later: some directories put Monomesta at Rukankyläntie 17, but that address
    // belongs to Rinneravintola Piste - do not copy it across. seasonal and skiIn are inferred from
    // the destination site's own statement that access requires ski equipment and a valid lift
    // ticket.
    name: 'Monomesta',
    city: 'Ruka',
    type: 'Slope bar',
    description: "A slope bar and terrace at the foot of the Pessari slopes in a sheltered valley, reachable only on skis with a valid lift ticket - there is no road access. Ruka's own sites call it a legendary terrace and describe an apres-ski terrace that takes up to a thousand guests, with live acts, DJs, several bars and side competitions during Spring Break. Day shows are free and the serving area is 18+.",
    highlights: ['Reachable only on skis', 'Terrace for up to a thousand', 'Apres-ski live stage'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'At the foot of the Pessari slopes, Ruka ski resort, Kuusamo - no street address published',
    website: 'https://www.facebook.com/Monomesta',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.fonecta.fi/profiili/bar-cafe-ski-booster-ruka/2869876 · https://www.ruka.fi/en/travelling-to-kuusamo/food-and-entertainment/restaurants (luettu 12.9.2026)
    // Weakest entry here - nothing came from the venue itself. Its own domain rukabooster.fi is
    // registered but dead: HTTPS fails on a certificate mismatch (the cert covers only *.zoner.fi)
    // and HTTP returns a 403 with no index page. ruka.fi therefore links to Facebook, which needs a
    // login. Everything above except the ruka.fi name comes from the Fonecta business profile, which
    // registers it as 'Bar Cafe Ski Booster Ruka' under category 'Pubit ja baarit'. Fonecta also
    // marks the hours 'sopimuksen mukaan' (by agreement) and shows extra 00-02 blocks on Sat and
    // Sun, meaning Fri and Sat nights run past midnight - the hours field is my reading of that, not
    // a verbatim quote. seasonal and skiIn are set false only because no source I could open
    // confirms either; treat both as unverified rather than checked. · Aukiolo lahteessa: Wed-Thu
    // 11-22, Fri-Sat 11-24, Sun 11-22, Mon-Tue closed
    name: 'Ski Booster',
    city: 'Ruka',
    type: 'Bar, cafe and grill',
    description: 'A bar, cafe and grill in the Vuosseli part of Ruka, registered as a pub and bar business under the company Ruka Booster Oy. It is closed at the start of the week and runs late on Friday and Saturday nights.',
    highlights: ['Bar, cafe and grill', 'Late Fri-Sat nights', 'Closed Mon-Tue'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Ahon Jussintie 7, 93830 Rukatunturi',
    website: 'https://www.facebook.com/skibooster',
    hours: {
      en: 'Wed–Thu 11–22, Fri–Sat 11–24, Sun 11–22, Mon–Tue closed',
      fi: 'Ke–To 11–22, Pe–La 11–24, Su 11–22, Ma–Ti suljettu',
      de: 'Mi–Do 11–22, Fr–Sa 11–24, So 11–22, Mo–Di geschlossen',
      sv: 'Ons–Tors 11–22, Fre–Lör 11–24, Sön 11–22, Mån–Tis stängt',
      fr: 'Mer–Jeu 11–22, Ven–Sam 11–24, Dim 11–22, Lun–Mar fermé',
      it: 'Mer–Gio 11–22, Ven–Sab 11–24, Dom 11–22, Lun–Mar chiuso',
      nl: 'Wo–Do 11–22, Vr–Za 11–24, Zo 11–22, Ma–Di gesloten',
      es: 'Mié–Jue 11–22, Vie–Sáb 11–24, Dom 11–22, Lun–Mar cerrado',
      'pt-BR': 'Qua–Qui 11–22, Sex–Sáb 11–24, Dom 11–22, Seg–Ter fechado',
      ja: '水–木 11–22、金–土 11–24、日 11–22、月–火 定休',
      ko: '수–목 11–22, 금–토 11–24, 일 11–22, 월–화 휴무',
      'zh-CN': '周三–周四 11–22，周五–周六 11–24，周日 11–22，周一–周二 休息',
    },
  },
  {
    // Lähde https://www.ruka.fi/en/events/rukan-salonki-ice-bar · https://www.ruka.fi/fi/tapahtumat/rukan-salonki-ice-bar (luettu 12.9.2026)
    // Stale listing - verify before publishing. The only page carrying this venue is ruka.fi, and
    // its dates read 4.2.2025-23.3.2025, a full season out of date, so whether the ice bar runs in
    // winter 2026-27 is unconfirmed. The operator's own site rukansalonki.fi lists Ravintola
    // Kultala, Eraravintola Kymppi and Rukan Kuksa but does not mention an ice bar at all, so the
    // website field points at the resort's front page rather than a venue page. hours left empty on
    // purpose: ruka.fi shows the time range 16-18 with no weekdays attached, so no weekday pattern
    // could be confirmed. skiIn false - Salongintie 8 is at the chalets by Salonkijarvi, not at the
    // slopes.
    name: 'Rukan Salonki Ice Bar',
    city: 'Ruka',
    type: 'Ice bar',
    description: 'A bar built entirely of ice at Rukan Salonki Chalets, by the lake outside Ruka village. It serves both hot and cold drinks - hot cocoa and steaming juice to warm up, or ice-cold cocktails and mocktails.',
    highlights: ['Built of ice', 'Cocktails and mocktails', 'Hot drinks too'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Salongintie 8, 93830 Rukatunturi',
    website: 'https://rukansalonki.fi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://campkitchen.fi/en/ · https://www.ruka.fi/en/travelling-to-kuusamo/food-and-entertainment/restaurants (luettu 12.9.2026)
    // Borderline inclusion: food-led, and ruka.fi files it under restaurants rather than bars - it
    // qualifies here only because its own site names itself 'Kitchen & Bar' and sells drinks. Its
    // calendar is a dated sequence, not a standing week: 11.-27.9.2026 daily 14-20 with Fri-Sat
    // 12-20 (the hours field), 28.9.-10.10. daily 14-20, 11.-18.10. daily 12-20, closed
    // 19.10.-17.11.2026 for kitchen renovation, winter season from 19.11. daily 11-21. Note that
    // closure if publishing before mid-November. skiIn false - no slope-side claim on its own page.
    // · Aukiolo lahteessa: Daily 14-20, Fri-Sat 12-20
    name: 'CAMP Kitchen & Bar',
    city: 'Ruka',
    type: 'Restaurant bar',
    description: "A restaurant and bar in the Vuosseli side of Ruka, in Ruka Valley. Its own site describes international food 'from Turku to Thailand, from Nuorgam to New York' served alongside drinks, and names the bar in its own title.",
    highlights: ["Bar named in the venue's own title", 'International menu', 'In Ruka Valley, Vuosseli'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Bistrotie 2, 93830 RUKATUNTURI',
    website: 'https://campkitchen.fi/en/',
    hours: {
      en: 'Daily 14–20, Fri–Sat 12–20',
      fi: 'Päivittäin 14–20, Pe–La 12–20',
      de: 'Täglich 14–20, Fr–Sa 12–20',
      sv: 'Dagligen 14–20, Fre–Lör 12–20',
      fr: 'Tous les jours 14–20, Ven–Sam 12–20',
      it: 'Tutti i giorni 14–20, Ven–Sab 12–20',
      nl: 'Dagelijks 14–20, Vr–Za 12–20',
      es: 'Todos los días 14–20, Vie–Sáb 12–20',
      'pt-BR': 'Todos os dias 14–20, Sex–Sáb 12–20',
      ja: '毎日 14–20、金–土 12–20',
      ko: '매일 14–20, 금–토 12–20',
      'zh-CN': '每天 14–20，周五–周六 12–20',
    },
  },
  {
    // Lähde https://rukankeilahalli.fi/yhteystiedot/ · https://rukankeilahalli.fi/palvelut/ (luettu 12.9.2026)
    // The site uses two names for itself: 'Rukan keilahalli' in Finnish and 'Rukatunturi Bowling' in
    // the contact-page heading and footer. Its own page warns 'Aukioloajat voivat muuttua
    // varaustilanteen mukaan' (hours change with bookings). A search snippet gave a different
    // pattern (Fri-Sat 15-21, Sun 15-19); the hours above are taken from the venue's own contact
    // page, which is the more authoritative of the two. No drink prices are published, only bowling
    // and game prices. · Aukiolo lahteessa: Mon-Tue closed, Wed-Sat 15-21, Sun closed · Hinta
    // lahteessa: Glow bowling EUR 36 per lane hour, pool EUR 10 per hour
    name: 'Rukan keilahalli',
    city: 'Ruka',
    type: 'Bowling alley bar',
    description: 'A bowling hall on the lowest floor of the Kumpare shopping centre in Ruka village, reached by the stairs between the info desk and Subway. Its own site says the bar has a wide selection of affordable drinks. There are also two pool tables and three dart boards.',
    highlights: ['Bar in Kumpare shopping centre', 'Two pool tables and three dart boards', 'Glow bowling lanes'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rukatunturintie 9, 93830 Rukatunturi',
    website: 'https://rukankeilahalli.fi/',
    hours: {
      en: 'Mon–Tue closed, Wed–Sat 15–21, Sun closed',
      fi: 'Ma–Ti suljettu, Ke–La 15–21, Su suljettu',
      de: 'Mo–Di geschlossen, Mi–Sa 15–21, So geschlossen',
      sv: 'Mån–Tis stängt, Ons–Lör 15–21, Sön stängt',
      fr: 'Lun–Mar fermé, Mer–Sam 15–21, Dim fermé',
      it: 'Lun–Mar chiuso, Mer–Sab 15–21, Dom chiuso',
      nl: 'Ma–Di gesloten, Wo–Za 15–21, Zo gesloten',
      es: 'Lun–Mar cerrado, Mié–Sáb 15–21, Dom cerrado',
      'pt-BR': 'Seg–Ter fechado, Qua–Sáb 15–21, Dom fechado',
      ja: '月–火 定休、水–土 15–21、日 定休',
      ko: '월–화 휴무, 수–토 15–21, 일 휴무',
      'zh-CN': '周一–周二 休息，周三–周六 15–21，周日 休息',
    },
  },
  {
    // Lähde https://rukanolkkari.fi/ · https://rukanolkkari.fi/en/menu/ (luettu 12.9.2026)
    // Hours left empty on purpose: at the time of reading the site states only 'WE ARE CLOSED IN
    // AUGUST / WE OPEN AGAIN IN SEPTEMBER' with no day-by-day table, so seasonal is set true on that
    // basis. skiIn is set true from the venue's own tagline 'Rinteesta suoraan sohvalle' / 'From the
    // slope straight to the sofa' and its Vuosseli valley-station location - the site does not state
    // ski-in access in so many words, so verify before publishing. Ruka's resort site calls the
    // venue 'Ruka's Livingroom' in English and lists it as 'Rukan Olkkari' in its Finnish register;
    // the venue itself uses only 'Rukan Olkkari'. Ruka.fi also reported the building previously
    // housed Vuosselin Pirtti and Roy Ski Pub, but that event page now returns 404, so the claim is
    // unverified. No prices published on the pages read.
    name: 'Rukan Olkkari',
    city: 'Ruka',
    type: 'After-ski bar and cafe',
    description: "A cafe-restaurant in Ruka's Vuosseli area whose own tagline is 'From the slope straight to the sofa'. Its site lists hot drinks, savoury and sweet waffles, food, after-ski drinks and karaoke, and the venue also does catering. The menu includes burgers, vegetarian dishes, fries and starters. Pets are welcome.",
    highlights: ['After-ski drinks', 'Karaoke', 'Pets welcome'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Jussinkuja 3, 93830 Rukatunturi',
    website: 'https://rukanolkkari.fi/en/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://rukatonttu.fi/ · https://www.ruka.fi/fi/tulossa-kuusamoon/ruoka-ja-viihde/after-ski-ja-baarit (luettu 12.9.2026)
    // ruka.fi lists it on the after-ski, bars and night clubs page, but the venue's own site
    // presents it primarily as a hotel restaurant with a bar section - it is not a stand-alone bar.
    // Hours are the restaurant hours the site gives as valid 'from 10.9. onwards' (the sauna happens
    // to run the same Tue-Sat 17-21). No drink prices published; the only sourced prices are
    // breakfast EUR 19.50 and sauna EUR 14. · Aukiolo lahteessa: Tue-Sat 17-21
    name: 'Hotelli-ravintola Rukatonttu',
    city: 'Ruka',
    type: 'Hotel restaurant bar',
    description: "A hotel restaurant with a glazed terrace on the shore of Lake Talvijärvi, 650 metres from Ruka village centre and about 20 metres from the nearest slope and ski track. The restaurant and terrace seat 120. Its own site has a 'Ravintola & baari' section and says after ski is spent by the fireplace in the restaurant.",
    highlights: ['Ski-in ski-out', 'Fireplace after ski', 'Glazed terrace, 120 seats'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Hiihtostadionintie 1, 93825 Rukatunturi',
    website: 'https://rukatonttu.fi/',
    hours: {
      en: 'Tue–Sat 17–21',
      fi: 'Ti–La 17–21',
      de: 'Di–Sa 17–21',
      sv: 'Tis–Lör 17–21',
      fr: 'Mar–Sam 17–21',
      it: 'Mar–Sab 17–21',
      nl: 'Di–Za 17–21',
      es: 'Mar–Sáb 17–21',
      'pt-BR': 'Ter–Sáb 17–21',
      ja: '火–土 17–21',
      ko: '화–토 17–21',
      'zh-CN': '周二–周六 17–21',
    },
  },
  {
    // Lähde https://www.tunturimarket.fi/tunturipub · https://www.tunturimarket.fi/ (luettu 12.9.2026)
    // Kitchen closes well before the bar: 21:30 Wed-Sat, 17:30 Sun. No prices published on any
    // source. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Mon-Tue closed, Wed-Thu 12-00
    // (kitchen to 21:30), Fri-Sat 12-03 (kitchen to 21:30), Sun 12-19 (kitchen to 17:30)
    name: 'TunturiPUB',
    city: 'Iso-Syöte',
    type: 'Pub',
    description: "Tunturi Pub sits under the front slopes of Iso-Syöte, a few dozen metres from KIDE Hotel, and shares premises with the Tunturi Market grocery shop — the company's own site calls it \"samoissa tiloissa toimiva ravintola Tunturi Pub\". The kitchen serves pizzas, burgers, salads and smaller snacks plus a separate children's menu, either eaten in or phoned ahead and collected. The ski resort's restaurant page lists cold draught drinks and vegan options, and the pub's own page says evenings can also be spent, with a licence, in what it calls wetter spirits. In the corner there is a pile of board games.",
    highlights: ['Shares premises with the Tunturi Market grocery shop', 'Cold draught drinks (isosyote.fi)', 'Board games in the corner'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Romekievarintie 1, 93280 Syöte',
    website: 'https://www.tunturimarket.fi/tunturipub',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://bistoria.fi/bistoria-iso-syote · https://bistoria.fi/viinit (luettu 12.9.2026)
    // Two conflicting hour sets: the venue's own page (breakfast + a la carte only) and syote.fi's
    // continuous 7:30-22/23. Group lunch by reservation. No source anywhere says the venue is
    // cashless. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Breakfast daily 8-10; a la carte
    // Tue-Sat 16-22 (own site, from 22.6.2026). The destination listing syote.fi shows the venue
    // open Mon-Thu 7:30-22, Fri 7:30-23, Sat 8-23, Sun 8-18. · Hinta lahteessa: Wine by the glass
    // from EUR 8.80 (Prosecco 12 cl); other glasses EUR 12.80
    name: 'Bistoria Iso-Syöte',
    city: 'Iso-Syöte',
    type: 'Restaurant bar',
    description: "Bistoria is the restaurant attached to KIDE Hotel at the foot of the Iso-Syöte fell, serving breakfast and dinner alongside what its own site calls a relaxed bar for the evening; lunch is by advance reservation for groups. The kitchen pairs local ingredients with international, Italian-leaning dishes and lists meat, vegetarian and gluten-free options. The wine list runs by the glass and by the bottle, starting at EUR 8.80. The ski resort's restaurant page adds an outdoor terrace and a lounge area.",
    highlights: ['Bar attached to KIDE Hotel', 'Wine by the glass from EUR 8.80', 'Outdoor terrace and lounge (isosyote.fi)'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Romekievarintie 4, 93280 Syöte',
    website: 'https://bistoria.fi/bistoria-iso-syote',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://skiparja.fi/parja-ski-bistro/ · https://skiparja.fi/ (luettu 12.9.2026)
    // Opening hours are on Facebook only, not on the website — do not publish invented hours. No
    // drinks list and no explicit liquor licence on any of the three sources; the drinking claim
    // rests on the site's own "ruokaa, juomaa ja viihdettä" and after-ski positioning. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Not published online — the venue's own site says only
    // "Katso Facebookistamme" (check our Facebook)
    name: 'Pärjä Ski Bistro',
    city: 'Iso-Syöte',
    type: 'After-ski bistro',
    description: "Pärjä Ski Bistro stands right next to the lifts on Iso-Syöte's back slopes. Its own site bills the place as \"Iso-Syötteen after ski taivas\" — Iso-Syöte's after-ski heaven — and promises food, drink and entertainment. The menu is organised into burgers, pizza, international dishes, a children's list and desserts, with ribs and wings and vegan options per the ski resort's restaurant page. The terrace catches the spring evening sun.",
    highlights: ['Right next to the back-slope lifts', "Billed as Iso-Syöte's after-ski spot", 'Terrace with spring evening sun'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Takarinteentie 4, 93280 Pudasjärvi',
    website: 'https://skiparja.fi/parja-ski-bistro/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://hilltophotelisosyote.fi/ravintola-hilltop/ · https://syote.fi/en/products/restaurant-hilltop/ (luettu 12.9.2026)
    // Own site warns a la carte may be limited outside the winter season and can depend on advance
    // reservation. The bar is evidenced only by a photo caption on syote.fi, not by descriptive text
    // — do not describe it as a destination bar. Kitchen closes at 21, not 22. · Aukiolo lahteessa
    // (ei kaannoskoneen kaavassa): Breakfast 8-10:30, Cafe Hilltop 10:30-18, a la carte 16-22
    // (kitchen closes 21). The destination listing syote.fi shows the venue open daily 8-22. · Hinta
    // lahteessa: About EUR 10-40 per person (syote.fi)
    name: 'Ravintola Hilltop',
    city: 'Iso-Syöte',
    type: 'Summit restaurant bar',
    description: "A 200-seat panoramic restaurant on the top floor of the Hilltop Hotel at the summit of Iso-Syöte fell. The kitchen combines what it calls clean northern flavours with local ingredients — foraged mushrooms, berries and local reindeer. The same space runs as Cafe Hilltop between 10:30 and 18:00, and the destination listing's photo caption shows a bar and lobby area by the restaurant entrance.",
    highlights: ['200 seats at the summit of the fell', 'Northern ingredients: foraged mushrooms, berries, reindeer', 'Cafe Hilltop 10:30-18 in the same room'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Isosyötteentie 246, 93280 Syöte',
    website: 'https://hilltophotelisosyote.fi/ravintola-hilltop/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://pikkusyote.fi/kotva (luettu 12.9.2026)
    // Not year-round. The page published 10.9.2026 states the season as 11.9.-3.10.2027, which is
    // internally inconsistent — treat the dates as needing confirmation and never publish Kotva as
    // an always-open restaurant. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Seasonal: open in
    // the ruska (autumn colour) season, Fri-Sat 17-22, kitchen to 21:30. The venue's own page dates
    // that window 11.9.-3.10. — confirm the year and dates before travelling. · Hinta lahteessa:
    // Three-course menu EUR 59, five-course menu EUR 79
    name: 'Restaurant Kotva',
    city: 'Iso-Syöte',
    type: 'Fine dining wine restaurant',
    description: 'A small Nordic-gastronomy restaurant on top of Pikku-Syöte fell, part of Ski Resort & Hotel Pikku-Syöte. Dishes are built around regional ingredients. The drinks list is what the restaurant calls a considered collection of surprising small-producer wines and Finnish beverages. Dinner only, on Fridays and Saturdays, and only during the season the venue announces.',
    highlights: ['Small-producer wines and Finnish beverages', 'Three courses EUR 59, five courses EUR 79', 'On top of Pikku-Syöte fell'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Syötekeskuksentie 126, 93280 Syöte',
    website: 'https://pikkusyote.fi/kotva',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://hankibaari.fi/pyha/ · https://hankibaari.fi/in-english/ (luettu 12.9.2026)
    // Kausiluontoinen: kiinni kesä–marraskuun, auki joulukuusta 2026. Puh. 041 310 7985. Tapahtumat
    // Facebookissa, ei omalla sivulla. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Kiinni
    // tarkistushetkellä 12.9.2026. Oma sivu: "Thanks for the season! Open again on December 2026."
    // Talvikaudella: klo 21 jälkeen K-18, paitsi alaikäiset vanhemman seurassa; tapahtumaillat aina
    // K-18.
    name: 'Hanki Baari Pyhä',
    city: 'Pyhä',
    type: 'Slope bar (talvikausi)',
    description: 'Baari Pyhän Pohjoisrinteiden alapäässä. Oma sivu lupaa yksinkertaista ruokaa, juomia, paikallisia oluita, laadukkaita viinejä ja kahvia. Talvikaudella tapahtumakalenterissa on artisteja ja DJ:itä lähes joka viikonloppu, folkista ja suomiräpistä vaihtoehtomusiikkiin. Klo 21 jälkeen K-18, paitsi alaikäiset vanhemman seurassa; tapahtumaillat ovat aina K-18. Auki jälleen joulukuussa 2026.',
    highlights: ['Rinteen juurella Pohjoisrinteillä', 'Paikallisia oluita ja live-artisteja lähes joka viikonloppu talvikaudella', 'K-18 klo 21 jälkeen'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Pohjoisrinteentie 1, 98530 Pyhätunturi',
    website: 'https://hankibaari.fi/pyha/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.pyha.fi/en/services/restaurants · https://www.pyha.fi/en/pyhasana (luettu 12.9.2026)
    // EI OMAA VERKKOSIVUA: pyha.fi linkittää Mestan kohdalla Instagram-tilin @mestapyha, joten
    // website on Instagram. Facebook-sivu (Mesta Pyhä | Pelkosenniemi) vaatii kirjautumisen — ei
    // päästy lähteelle. OSOITE EI VARMISTETTU KOHTEEN OMALTA PINNALTA: katuosoite Kultakeronkatu 21
    // löytyi vain hakukoneen kokoamasta tiedosta; pyha.fi kertoo vain 'next Hotel Kultakero' /
    // 'Kultakero 2 -rakennuksen vieressä'. Sama osoite Kultakeronkatu 21 on koko hotellikorttelilla
    // (myös CAMP, Popolo 21C, Calle-Talo), joten katunumero on uskottava mutta tarkistettava.
    // AUKIOLOT: ei omalla pinnalla — hakutulos mainitsi kesäkauden avautuvan 10.7. ja päivittäisen
    // 12-20, mutta tätä ei voitu vahvistaa lähteeltä, siksi hours on tyhjä. seasonal=true perustuu
    // näihin kausiavausilmoituksiin; ympärivuotisuutta ei väitetä missään lähteessä. skiIn=true
    // perustuu pyha.fi:n luokitteluun 'Slope restaurant' ja tekstiin 'in the heart of the slopes'.
    name: 'Mesta',
    city: 'Pyhä',
    type: 'Slope bar',
    description: "A bar and terrace in the middle of the slopes next to Hotel Kultakero, with views over the Lapland landscape from sunrise to the northern lights. Pyhä's own tourist site lists it under Bar/After ski and Slope restaurant and describes flavours, music and views. A festival page on the same site places it at the far end of the Hotel Pyhätunturi parking area beside the Kultakero 2 building, and calls it a place to relax with refreshments and pub-style food.",
    highlights: ['Terrace with fell views', 'Music', 'Pub-style food'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kultakeronkatu 21, 98530 Pyhätunturi',
    website: 'https://www.instagram.com/mestapyha/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://pyhadreams.fi/wine-bar · https://www.pyha.fi/fi/tapahtumat/pyha-dreams-kesan-viinibaari (luettu 12.9.2026)
    // Varmista päivät suoraan paikasta ennen julkaisua (heidi@pyhadreams.fi) — oma sivu ja pyha.fi
    // ovat eri mieltä. pyha.fi:n linkki pyhadreams.fi/food-and-wine on kuollut (404), oikea on
    // /wine-bar. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Kesäkausi 19.6.–20.9.2026, klo
    // 12–17. 🔴 Päivät ristiriidassa lähteissä: oma sivu sanoo ke–su, pyha.fi:n tapahtumasivu ti–la
    // (ja kauden lopuksi 21.9.). Kellonajat 12–17 löytyvät vain pyha.fi:stä, ei omalta sivulta.
    // Talvikausi marraskuun lopusta noin vappuun. · Hinta lahteessa: Viinimaistelu 89 €/hlö (max 8
    // hlöä, 5 viiniä, n. 2 h; hissilippu ei sisälly)
    name: 'Pyhä Dreams Wine Bar',
    city: 'Pyhä',
    type: 'Wine bar',
    description: 'Viinibaari Pyhä Dreams -maisemamökissä Pyhätunturin huipulla, jonne noustaan maisemahissillä. Kesäkausi kulkee 19.6.2026 alkaen syyskuun 20. päivään ja talvikausi marraskuun lopusta noin vappuun. Paikka järjestää myös opastetun viinimaistelun enintään kahdeksan hengen ryhmille: viisi valko-, puna- ja kuohuviiniä suolaisten ja makeiden suupalojen kanssa, kesto noin kaksi tuntia. Tilat ovat rajalliset, joten ennakkovaraus kannattaa.',
    highlights: ['Tunturin huipulla, maisemahissin päässä', 'Opastettu viinimaistelu 5 viinillä, max 8 hlöä', 'Hissilippu ei sisälly maisteluun'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Pyhä Dreams -maisemamökki, Pyhätunturin huippu, 98530 Pyhätunturi (Pelkosenniemi)',
    website: 'https://pyhadreams.fi/wine-bar',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.camppyha.fi/en · https://www.camppyha.fi/en/yhteystiedot (luettu 12.9.2026)
    // NIMI: kohde kirjoittaa itse 'CAMP Kitchen & Bar PYHÄ' (versaalein PYHÄ); pyha.fi kirjoittaa
    // 'Pyhän Camp Kitchen & Bar'. Käytetty kohteen omaa muotoa. AUKIOLOT: omalta yhteystietosivulta
    // 'Breakfast from 8-10, Restaurant 4:00 PM–9:00 PM, Kitchen 4:00 PM–8:30 PM'. hours-kenttään on
    // otettu ravintola-/baariaika 16-21; aamiainen 8-10 ja keittiön sulkeutuminen 20:30 eivät mahdu
    // kaavaan. Omalla sivulla mainitaan myös yksittäisiä lauantaisulkemisia yksityistilaisuuksien
    // takia (esim. 19.9.). seasonal=false: mikään lähde ei rajaa toimintaa kaudelle, mutta
    // ympärivuotisuutta ei myöskään sanota suoraan — hotellin yhteydessä toimiva ravintola.
    // skiIn=false: pyha.fi luokittelee 'Bar/After ski, Private restaurant, Accessible' MUTTA EI
    // 'Slope restaurant' -tagilla. Sisarravintola CAMP RUKA toimii samalla brändillä ja camppyha.fi
    // voi ohjata Rukan sivulle — varmista aina /en/-polku. · Aukiolo lahteessa: Daily 16-21
    name: 'CAMP Kitchen & Bar PYHÄ',
    city: 'Pyhä',
    type: 'Hotel restaurant bar',
    description: "A restaurant and bar next to Hotel Pyhätunturi, serving dishes the venue describes as running from Turku to Thailand and from Nuorgam to New York. Panoramic windows open onto the fell scenery, and Pyhä's tourist site notes you can stop by for a drink at the end of the day or stay for a full dinner. Dogs are welcome and table reservations and gift cards are available.",
    highlights: ['Next to Hotel Pyhätunturi', 'Panoramic fell views', 'Dogs welcome'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kultakeronkatu 21, 98530 Pyhätunturi',
    website: 'https://www.camppyha.fi/en',
    hours: {
      en: 'Daily 16–21',
      fi: 'Päivittäin 16–21',
      de: 'Täglich 16–21',
      sv: 'Dagligen 16–21',
      fr: 'Tous les jours 16–21',
      it: 'Tutti i giorni 16–21',
      nl: 'Dagelijks 16–21',
      es: 'Todos los días 16–21',
      'pt-BR': 'Todos os dias 16–21',
      ja: '毎日 16–21',
      ko: '매일 16–21',
      'zh-CN': '每天 16–21',
    },
  },
  {
    // Lähde https://eatlappi.fi/en/restaurant-huttuhippu · https://eatlappi.fi/fi/huttuhippu (luettu 12.9.2026)
    // Baariperuste on vahva: kohteen oma sivu omistaa oman osion Huttu-Pubille ('own artisan brewery
    // products, a large variety of beers, whiskeys and rums'), ja pyha.fi luokittelee 'Bar/After
    // ski, Slope restaurant, Takeaway'. Keittiö sulkeutuu klo 21, ravintola klo 22. seasonal=false,
    // koska oma sivu sanoo 'Avoinna päivittäin' ympäri vuoden — mutta HUOM: huoltotauko
    // 25.10.–30.11., jonka jälkeen avautuu talvikaudelle 1.12. Sijainti Kulttuurikeskus Naavan ja
    // Hotelli Pyhätunturin välissä perheenrinteen vieressä. Puh. +358 (0)16 882 821, varaukset
    // sales@eatlappi.fi. · Aukiolo lahteessa: Daily 13-22
    name: 'Restaurant Huttuhippu',
    city: 'Pyhä',
    type: 'Slope pub',
    description: "A restaurant next to Pyhä's family slope that works as a ski slope restaurant during the day and an a la carte restaurant in the evening, with reindeer from nearby farms and berries and mushrooms from local forests. The adjoining Huttu-Pub is known for its craft brewery products and a wide range of beers, whiskies and rums; Pyhä's tourist site calls it the local pub with the largest beer selection in the resort. Bingo runs on Thursdays, and the pub has board games and views over the slopes.",
    highlights: ['Largest beer selection in the resort', 'Next to the family slope', 'Thursday bingo'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Ukonhattu 1, 98530 Pyhätunturi',
    website: 'https://eatlappi.fi/en/restaurant-huttuhippu',
    hours: {
      en: 'Daily 13–22',
      fi: 'Päivittäin 13–22',
      de: 'Täglich 13–22',
      sv: 'Dagligen 13–22',
      fr: 'Tous les jours 13–22',
      it: 'Tutti i giorni 13–22',
      nl: 'Dagelijks 13–22',
      es: 'Todos los días 13–22',
      'pt-BR': 'Todos os dias 13–22',
      ja: '毎日 13–22',
      ko: '매일 13–22',
      'zh-CN': '每天 13–22',
    },
  },
  {
    // Lähde https://www.tulikuuma.fi/restaurant/sport-bar-pyha/ · https://www.pyha.fi/en/services/restaurants (luettu 12.9.2026)
    // EI PÄÄSTY OMALLE VERKKOSIVULLE: pyha.fi linkittää sportbarpyha.fi (ja /in-english/), mutta
    // domain EI RESOLVOIDU (getaddrinfo ENOTFOUND / DNS-virhe, testattu 12.9.2026 sekä WebFetchilla
    // että selaimella). website-kenttään on siksi laitettu ylläpitäjän oma, toimiva sivu
    // tulikuuma.fi (Tulikuuma Kumpu Oy). Tarkista sportbarpyha.fi uudelleen ennen julkaisua.
    // NIMIRISTIRIITA: ylläpitäjän oma sivu kirjoittaa 'Sport Bar Pyhä' (otsikossa 'SPORT BAR PYHÄ'),
    // pyha.fi kirjoittaa 'SportBar Pyhä', Tripadvisor 'Sportbar'. Käytetty ylläpitäjän omaa muotoa.
    // AUKIOLORISTIRIITA: ylläpitäjän oma sivu antaa ma-su 17:00–00:00 (02) sekä tarkennukset
    // 'toukokuusta alkaen klo 17-23 (02)' ja '1.6. alkaen klo 17-00 (02)'. Kolmannen osapuolen
    // listauksissa esiintyy poikkeavat ajat (ma-to 17-02, pe 15-02, la 15-03, su 17-00) — luotettu
    // kohteen omaan sivuun sääntö 3:n mukaisesti. Yhteys: lauri.hamalainen@tulikuuma.fi, +358 45 257
    // 5509. · Aukiolo lahteessa: Daily 17-24
    name: 'Sport Bar Pyhä',
    city: 'Pyhä',
    type: 'Sports bar',
    description: 'A bar in the Pyhä shopping centre that the operator describes as a living-room-style place in the heart of the resort centre, open all year round from the afternoon until late. It has a pool table, pinball, a dartboard, air hockey and board games, plus karaoke ranging from evergreens to newer songs. The kitchen serves pub food from burgers to wings, also as take-away, and the Viaplay channel package covers sports broadcasts.',
    highlights: ['Karaoke and billiards', 'Viaplay sports channels', 'Open year-round'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kultakeronkatu 4, 98530 Pyhätunturi',
    website: 'https://www.tulikuuma.fi/restaurant/sport-bar-pyha/',
    hours: {
      en: 'Daily 17–24',
      fi: 'Päivittäin 17–24',
      de: 'Täglich 17–24',
      sv: 'Dagligen 17–24',
      fr: 'Tous les jours 17–24',
      it: 'Tutti i giorni 17–24',
      nl: 'Dagelijks 17–24',
      es: 'Todos los días 17–24',
      'pt-BR': 'Todos os dias 17–24',
      ja: '毎日 17–24',
      ko: '매일 17–24',
      'zh-CN': '每天 17–24',
    },
  },
  {
    // Lähde https://www.sallatunturi.fi/en/restaurants/papana-pupi/ · https://www.sallatunturi.fi/ravintolat/papana-pupi/ (luettu 12.9.2026)
    // Hours are the site-wide banner measured live 12.9.2026: 'Avoinna: Vastaanotto ja Papana Pupi
    // klo 08:00-22:00, Ravintola Kiela 16:00-21:00'. On winter gig nights the pub runs later, but no
    // later closing time is published anywhere on their own site. Address Hangasjärventie 1 is
    // confirmed by the venue's own site and by Visit Salla event pages; one search-engine summary
    // claimed Hangasjärventie 2, which no first-party page supports. Sources place it at Salla Ski
    // Resort but never say slope-side or ski-in, so skiIn is left false. The venue has no separate
    // website of its own - it is a page on the Sallatunturin Tuvat site. · Aukiolo lahteessa (ei
    // kaannoskoneen kaavassa): Daily 8-22
    name: 'Papana Pupi',
    city: 'Salla',
    type: 'Après-ski pub',
    description: "The house pub of Sallatunturin Tuvat at Sallatunturi, in the same building as the reception and Restaurant Kiela. Its own page says the drinks list runs from house signature cocktails and mocktails to beers and wines, many made using local producers' products, alongside espresso-based coffees. Winter weeks include karaoke, a music quiz and bingo, and changing live artists play at weekends. The walls carry match jerseys and sticks from Finnish ice hockey players, and the large terrace is pet-friendly.",
    highlights: ['Signature cocktails', 'Live music and karaoke', 'Ice hockey memorabilia'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Hangasjärventie 1, 98900 Salla',
    website: 'https://www.sallatunturi.fi/en/restaurants/papana-pupi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://keloravintola.fi/en/home/ · http://www.keloravintola.fi/yhteystiedot (luettu 12.9.2026)
    // NAME CLASH CHECKED: there is also a Keloravintola at Lapland Hotels Luostotunturi. This is the
    // Salla one - address Revontulentie 9, 98900 Salla, phone 044 236 8378, kelot@keloravintola.fi,
    // own domain keloravintola.fi, and the Salla municipal business directory lists it as
    // 'Sallatunturin Keloravintola, Revontulentie 9'. Hours 'Open daily: 1pm-8pm' read from
    // keloravintola.fi/en/home/ on 12.9.2026. Visit Salla and the venue's own site both say
    // year-round, hence seasonal=false. The same operator runs Itäkota / East Hut on the eastern
    // slope; that one their own site calls a small cafe and reports 'Closed. We will open again for
    // the winter season 26-27!', so it is not returned as a venue (see notFound). · Aukiolo
    // lahteessa: Daily 13-20
    name: 'Keloravintola',
    city: 'Salla',
    type: 'Slope restaurant bar',
    description: 'A log restaurant at the foot of the front slopes of Salla Ski Resort. Its own site says the restaurant is fully licensed and serves grilled food, pizza and a la carte dishes cooked from scratch using Lappish raw materials. Salla Ski Resort describes a sunny terrace and after-ski gatherings here, and Visit Salla and the 2025 Salla product manual add live music evenings.',
    highlights: ['Fully licensed', 'After-ski and live music', 'At the front slopes'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Revontulentie 9, 98900 Salla',
    website: 'https://keloravintola.fi/en/home/',
    hours: {
      en: 'Daily 13–20',
      fi: 'Päivittäin 13–20',
      de: 'Täglich 13–20',
      sv: 'Dagligen 13–20',
      fr: 'Tous les jours 13–20',
      it: 'Tutti i giorni 13–20',
      nl: 'Dagelijks 13–20',
      es: 'Todos los días 13–20',
      'pt-BR': 'Todos os dias 13–20',
      ja: '毎日 13–20',
      ko: '매일 13–20',
      'zh-CN': '每天 13–20',
    },
  },
  {
    // Lähde https://www.ravintolasallanmaja.fi/ · https://www.ravintolasallanmaja.fi/pubi/ (luettu 12.9.2026)
    // Hours and price are from the operator's own site, not an aggregator. Note an internal conflict
    // on that site: the English page says the pub is open Fri-Sat 21-04, while the Finnish front
    // page gives the more granular times used here. Sunday is simply absent from the hours block —
    // treat 'closed on Sunday' as an inference, not a stated fact. The earlier claim that it sits
    // 'between Sallatunturi and the village centre' is not in any source and has been removed. ·
    // Aukiolo lahteessa (ei kaannoskoneen kaavassa): Mon-Thu 11-18, Fri 11-18 and 22-04, Sat 12-18
    // and 22-02 (sometimes to 04), Sun no hours listed · Hinta lahteessa: Lunch buffet Mon-Thu
    // 11-14, EUR 13.50 (bread, salad buffet, drinks, coffee/tea)
    name: 'Ravintola Sallan Maja',
    city: 'Salla',
    type: 'Karaoke pub',
    description: 'A restaurant and pub in Salla with a lunch and a la carte kitchen alongside its pub, Majan Pubi. The pub page says you can sing karaoke, play board games and have drinks in company into the early hours, and it states a K-18 age limit from 22:00 with ID on request. The kitchen uses regional Lapland ingredients and the pastries and pizza bases come from small local bakeries, including Kursulainen.',
    highlights: ['Karaoke and board games in Majan Pubi', 'K-18 from 22:00, ID checked on request', 'Mon-Thu lunch buffet EUR 13.50 including salad buffet and coffee'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Hautajärventie 32, 98900 Salla',
    website: 'https://www.ravintolasallanmaja.fi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.visitsalla.fi/en/tekeminen/evakko-pub · http://www.kairalankievari.com/wp/ (luettu 12.9.2026)
    // NAME VARIES BY SOURCE, no single spelling is authoritative: 'Evakko Pub' on
    // kairalankievari.com and on Visit Salla's English page, 'Evakkopubi' on Visit Salla's Finnish
    // page, 'Kairalan Kievari/ Evakkopub' as the Facebook page name (category: Pubi), and 'Evakkopub
    // / Kairalan Kievari' in the Salla municipal business directory. HOURS UNCERTAIN: 'PE-LA 22-02'
    // comes from kairalankievari.com, whose page content appears to date from 2018; Visit Salla only
    // says 'The pub is open on weekends until early hours when needed'. Both sources say the pub
    // stays open longer (to 03) on live music nights. WEBSITE: majoitussalla.fi is the site linked
    // as the official one from both Visit Salla and their Facebook page; the older
    // kairalankievari.com (301 redirects to /wp/) is also theirs. Kairalan Kievari has also been
    // reported as planning a separate evening restaurant in the Salla village centre in the former
    // Tammukka premises - not open as far as any source shows. · Aukiolo lahteessa: Fri-Sat 22-02
    name: 'Evakko Pub',
    city: 'Salla',
    type: 'Village karaoke pub',
    description: "A pub at Kairalan Kievari in the village of Vallovaara, set in an old elementary school building. Visit Salla says it is open at weekends until the early hours when needed and has a varied live music offering. The venue's own page describes a game room with darts and billiards, and lists alcoholic drinks, coffee, soft drinks and hot chocolate. The Kairalan Kievari accommodation site calls it a popular karaoke pub and the local night spot.",
    highlights: ['Karaoke and live music', 'Darts and billiards', 'Old school building'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Vallovaarantie 209, 98900 Salla',
    website: 'https://www.majoitussalla.fi/',
    hours: {
      en: 'Fri–Sat 22–02',
      fi: 'Pe–La 22–02',
      de: 'Fr–Sa 22–02',
      sv: 'Fre–Lör 22–02',
      fr: 'Ven–Sam 22–02',
      it: 'Ven–Sab 22–02',
      nl: 'Vr–Za 22–02',
      es: 'Vie–Sáb 22–02',
      'pt-BR': 'Sex–Sáb 22–02',
      ja: '金–土 22–02',
      ko: '금–토 22–02',
      'zh-CN': '周五–周六 22–02',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/luosto/lapland-hotels-luostotunturi/restaurants · https://www.laplandhotels.com/en/hotels-and-destinations/luosto/lapland-hotels-luostotunturi/events (luettu 12.9.2026)
    // Hours are not published as fixed weekly opening times by the venue; they follow the event
    // calendar. Do not reuse luosto.fi's "Fri-Sat 20-01" as if it were the venue's own figure.
    // Ticket prices of 15-20 EUR belong to Keloravintola's dance evenings, not to Karhu. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Event-driven; check the hotel's own event calendar.
    // Karaoke on most evenings during the autumn ruska season (Sept 2026 calendar lists karaoke
    // Sun-Thu as well as Fri-Sat); the one time printed is 20-01. luosto.fi lists "every Friday and
    // Saturday 20-01", which the hotel's own calendar contradicts. · Hinta lahteessa: No entry fee
    // for karaoke (K-18). Live-band nights at Karhu 10 EUR. Cloakroom fee 3 EUR, not included in
    // ticket prices.
    name: 'Nightclub Karhu',
    city: 'Luosto',
    type: 'Night club',
    description: "Karhu is the nightclub at Lapland Hotels Luostotunturi and, on the hotel's own wording, the village's only nightclub. Karaoke plays in the evenings and on artist nights the parties continue into the small hours; in spring the dancing to orchestras and guest artists runs until 04.00. The autumn 2026 calendar lists karaoke on most evenings, two Ruska pub-quiz nights and live bands including PIENIsuuriBÄNDI and Toni Jaatinen Band.",
    highlights: ["The only nightclub in Luosto village, per the hotel's own site", 'Karaoke free of charge, K-18', 'Live bands 10 EUR on artist nights'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Luostontie 1, 99555 Luosto (Lapland Hotels Luostotunturi)',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/luosto/lapland-hotels-luostotunturi/events',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/luosto/lapland-hotels-luostotunturi/restaurants · https://www.laplandhotels.com/fi/hotellit-ja-kohteet/luosto/lapland-hotels-luostotunturi/ravintolat (luettu 12.9.2026)
    // The hotel publishes opening hours only as dated seasonal windows, never as a standing daily
    // time. Any published figure must carry its date range or it goes stale on 27.9.2026. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Seasonal, published as date ranges by the hotel:
    // 4.9.-26.9.2026 daily 12-22; 27.9.-20.11.2026 daily 16-22 (earlier summer periods 22.6.-9.8.
    // 12-22 and 10.8.-3.9. 16-22)
    name: 'Rumpu Bar (Rumpubaari)',
    city: 'Luosto',
    type: 'Hotel bar',
    description: 'Rumpu Bar sits next to the à la carte restaurant Bistro at Lapland Hotels Luostotunturi. The hotel describes it as a place to enjoy a cup of something hot or a refreshing drink. Dogs are welcome in the bar.',
    highlights: ["Next to the hotel's à la carte restaurant Bistro", 'Dogs welcome', 'Open later than the Bistro kitchen'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Luostontie 1, 99555 Luosto (Lapland Hotels Luostotunturi)',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/luosto/lapland-hotels-luostotunturi/restaurants',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://punakettu.fi/en/contact-information/ · https://punakettu.fi/wp-content/uploads/2026/09/juomalista-092026.pdf (luettu 12.9.2026)
    // Named tap beers (Karhu 4.6%, 1664 Blanc, seasonal tap) and the bottled Lapin Panimo / Tornio
    // Panimo claim could not be found in the drinks-list PDF text and must not be published until
    // read off the physical or a readable list. Same for the 10 EUR half-litre. · Aukiolo lahteessa
    // (ei kaannoskoneen kaavassa): Daily 12-21 during the published window 7.-29.9.2026; the site
    // publishes hours only as dated periods, so verify before each season
    name: 'Restaurant Punakettu',
    city: 'Luosto',
    type: 'Restaurant and pub',
    description: "Punakettu is a family restaurant in Luosto's shopping centre that its own English site describes as \"a restaurant and a pub\". The published drinks list carries draught beer, long drinks and ciders, a local craft brewery section, wines by the glass and bottle, a full cocktail and mocktail list with house creations, and Teerenpeli whiskies. The food side is burgers, pizzas and Lappish dishes, and the restaurant holds a Green Key certificate.",
    highlights: ['Own site calls it "a restaurant and a pub"', 'Local craft brewery section on the drinks list', 'Teerenpeli whiskies'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Luostontie 4, 99555 Luosto',
    website: 'https://punakettu.fi/en/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://eatlappi.fi/en/restaurant-vaisko · https://www.luosto.fi/en/services/restaurants (luettu 12.9.2026)
    // Winter-season venue: opens 26.11.2026 for the 2026-2027 season. luosto.fi's Google-fed hours
    // list shows it as open in the next 7 days, which contradicts the restaurant's own announcement
    // — do not use the aggregator here. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Closed at
    // the time of checking. Season 2026-2027 opens 26 November 2026; no daily hours published
    name: 'Restaurant Vaisko',
    city: 'Luosto',
    type: 'Restaurant and cocktail bar',
    description: "Vaisko is an Eat Lappi restaurant in Luosto built around local ingredients and forest produce. Its own page gives the drinks equal billing: a wine cabinet with pairings and social pours, a small selection of domestic and international beers, and a cocktail list of classics plus the house's own creations. The site states you are welcome at Vaisko just for a drink, and the loft upstairs seats about thirty for groups.",
    highlights: ['Own site invites guests in just for a drink', 'Wine cabinet with per-dish pairings', 'House cocktails alongside classics'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Hartsutie 1, 99555 Luosto',
    website: 'https://eatlappi.fi/en/restaurant-vaisko',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://aarnikota.fi/en/ · https://www.luosto.fi/en/services/restaurants (luettu 12.9.2026)
    // Opens only in defined seasonal windows; the current one is the Ruska season 3.9.-27.9.2026.
    // Publish the window, not a bare weekday range. No reservations are taken for the 11-16 daytime
    // slot. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Wed-Sun 11-16 during the published
    // Ruska season 3.9.-27.9.2026; evenings by request for groups. No day-time reservations taken
    // for 11-16
    name: 'Aarnikota',
    city: 'Luosto',
    type: 'Hut café and bar',
    description: "Aarnikota calls itself a \"Hut Café and Bar\", a small traditional Laplander's hut in Aarniluosto about 1.5 km from Luosto centre, reachable on foot, on skis, on snowshoes or by car. During the day it serves crepes and black-pot coffee, and its own page says it offers beverages for adults as well as for children. The heart of the hut is an open fire pit that seats twenty; in the evening it opens by request for groups of up to twenty.",
    highlights: ['Calls itself a hut café and bar; serves drinks for adults', 'Open fire pit seating twenty', 'Reachable on foot, skis or snowshoes from the village'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kerotie 10, 99555 Luosto (at the end of Kerotie road, Aarniluosto)',
    website: 'https://aarnikota.fi/en/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://santashotels.fi/en/restaurant/aurora-luosto/ · https://santashotels.fi/en/hotels/luosto-hotel-aurora/ (luettu 12.9.2026)
    // Do not publish "Mon-Sat 16-22, Sun closed" — that figure appears nowhere on the venue's or the
    // hotel's own pages. If hours are needed, get them by phone (+358 400 102 141) and record the
    // date. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): ei annettu — the venue's own page has
    // an "Opening hours" heading with no times published; only "The kitchen will be closed 30 min
    // before the restaurant closing time"
    name: 'Restaurant Aurora',
    city: 'Luosto',
    type: 'Restaurant and lobby bar',
    description: "Restaurant Aurora is the restaurant of Santa's Hotel Aurora, within walking distance of Luosto village centre. It has an open kitchen with a lava stone grill, a fireplace and windows onto the forest, and the menu is built around traditional flavours, international influences and a selected wine list. The hotel lists a lobby bar among its dining services, and the restaurant page describes the lobby bar's softly lit atmosphere as a setting for relaxed conversation.",
    highlights: ["Lobby bar named on the hotel's own service list", 'Lava stone grill in an open kitchen', 'Selected wine list'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: "Luppokeino 1, 99555 Luosto (Santa's Hotel Aurora)",
    website: 'https://santashotels.fi/en/restaurant/aurora-luosto/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/fi/hotellit-ja-kohteet/luosto/lapland-hotels-luostotunturi/kokoukset-ja-juhlat · https://www.laplandhotels.com/fi/hotellit-ja-kohteet/luosto/lapland-hotels-luostotunturi/tapahtumat (luettu 12.9.2026)
    // Not a walk-in bar: apart from ticketed theme and dance nights it is a booking-only function
    // restaurant. Do not print the hotel's street address as the restaurant's own — the hotel only
    // ever places it "noin 300 metrin päässä". · Aukiolo lahteessa (ei kaannoskoneen kaavassa): By
    // reservation only apart from theme nights and ticketed dances; public dance evenings run
    // roughly 19-01 or 20-01 on the listed dates · Hinta lahteessa: Dance-night tickets 15-20 EUR
    // (autumn 2026: 15 EUR on 5.9., 9.9. and 16.9.; 20 EUR on 12.9. and 14.9.)
    name: 'Keloravintola (Log Restaurant Kelo)',
    city: 'Luosto',
    type: 'Dance and function restaurant',
    description: 'Keloravintola is an atmospheric log restaurant about 300 metres from Lapland Hotels Luostotunturi, seating up to 220 diners. The hotel states it is open by reservation only apart from theme nights, and hosts weddings and birthdays as a function venue. Its public evenings are ticketed dances with live dance orchestras: the autumn 2026 calendar lists Toni Jaatinen Band, Alina Liikola & Afrodite, Marko Maunuksela & Fantasia, Tomi Markkola & Kipinä and Tanssiorkesteri Ässät. The hotel also names karaoke, live music and bingo here.',
    highlights: ['Log restaurant seating 220', 'Ticketed dance evenings with live orchestras, 15-20 EUR', 'Karaoke, live music and bingo'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'About 300 m from Lapland Hotels Luostotunturi (Luostontie 1, 99555 Luosto); no separate street address is published for the restaurant itself',
    website: 'https://www.laplandhotels.com/fi/hotellit-ja-kohteet/luosto/lapland-hotels-luostotunturi/kokoukset-ja-juhlat',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.saariselanpanimo.com/ · https://laplandnorth.fi/en/restaurants/ (luettu 12.9.2026)
    // The pub's own site gives the hours, events and sauna prices but no drink prices. The street
    // address is printed in the site footer and matches the address on the destination site
    // laplandnorth.fi. The same premises also appear under the name "Saariselkä Inn" for
    // accommodation; that is the lodging side of the same address, not a second bar. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Daily 14-02, Fri-Sat 14-03, kitchen daily 14-20:30 ·
    // Hinta lahteessa: Public sauna EUR 10 per person, towel rental EUR 5
    name: 'Local Pub Panimo Saariselkä',
    city: 'Saariselkä',
    type: 'Pub',
    description: "A pub in the centre of Saariselkä that calls itself \"your living room in Saariselkä\" and serves a local and international selection of drinks. The kitchen runs every day alongside the bar. The pub also has separate men's and women's saunas that guests can use during public hours or book privately.",
    highlights: ['Karaoke & live music', 'Bingo & pub quiz', 'Public sauna'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Saariseläntie 10, 99830 Saariselkä',
    website: 'https://www.saariselanpanimo.com/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.tulikuuma.fi/ravintolat/kaunis-jorma/ · https://www.facebook.com/kaunisjormasaariselka/ (luettu 12.9.2026)
    // Hours conflict between two of the venue's own channels: the opening-hours table on
    // tulikuuma.fi says Mon-Thu 14-24 (extendable to 02), Fri-Sat 14-02, Sun closed, while a
    // Facebook post embedded on that same page says Tue-Thu 16-24, Fri-Sat 16-02. I used the
    // official hours table. The venue writes its address as "Kiveliöntie 3, 99830 Inari" (Inari is
    // the municipality; postal code 99830 is Saariselkä). Operated by the Tulikuuma Kumpu restaurant
    // group, which hosts the venue's own page - there is no separate kaunisjorma domain. Do not
    // confuse with Kaunispään Huippu or with Restaurant Kaunis at Star Arctic Hotel. · Aukiolo
    // lahteessa: Mon-Thu 14-24, Fri-Sat 14-02, Sun closed · Hinta lahteessa: Soup lunch EUR 6.50
    // small, EUR 10.50 large
    name: 'Kaunis Jorma Saariselkä',
    city: 'Saariselkä',
    type: 'Pub',
    description: 'A small pub in the centre of Saariselkä, in a building completed at the end of 2023, open all year. It has a fireplace, a terrace, karaoke and a drinks selection alongside pub food. Free bingo runs every Thursday at 19:00.',
    highlights: ['Karaoke', 'Free bingo Thursdays', 'Terrace'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kiveliöntie 3, 99830 Saariselkä',
    website: 'https://www.tulikuuma.fi/ravintolat/kaunis-jorma/',
    hours: {
      en: 'Mon–Thu 14–24, Fri–Sat 14–02, Sun closed',
      fi: 'Ma–To 14–24, Pe–La 14–02, Su suljettu',
      de: 'Mo–Do 14–24, Fr–Sa 14–02, So geschlossen',
      sv: 'Mån–Tors 14–24, Fre–Lör 14–02, Sön stängt',
      fr: 'Lun–Jeu 14–24, Ven–Sam 14–02, Dim fermé',
      it: 'Lun–Gio 14–24, Ven–Sab 14–02, Dom chiuso',
      nl: 'Ma–Do 14–24, Vr–Za 14–02, Zo gesloten',
      es: 'Lun–Jue 14–24, Vie–Sáb 14–02, Dom cerrado',
      'pt-BR': 'Seg–Qui 14–24, Sex–Sáb 14–02, Dom fechado',
      ja: '月–木 14–24、金–土 14–02、日 定休',
      ko: '월–목 14–24, 금–토 14–02, 일 휴무',
      'zh-CN': '周一–周四 14–24，周五–周六 14–02，周日 休息',
    },
  },
  {
    // Lähde https://wildernesshotels.fi/wilderness-hotel-kieppi/restaurant · https://laplandnorth.fi/en/company/kieppi-kitchen-bar/ (luettu 12.9.2026)
    // The à la carte and soup-lunch times published when read were tied to a specific autumn 2026
    // period; the bar hours (9-22:30) were listed without a date limit. Breakfast 7-10 is for hotel
    // guests only. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Daily bar 9-22:30, a la carte
    // 14-21:30 · Hinta lahteessa: Soup lunch EUR 14.90 per person
    name: 'Kieppi Kitchen & Bar',
    city: 'Saariselkä',
    type: 'Restaurant & bar',
    description: 'The restaurant of Wilderness Hotel Kieppi in central Saariselkä, serving Lappish cuisine with modern touches. The à la carte menu covers steaks, local fish, burgers and pan pizzas. A bar corner serves drinks and opens several hours before the kitchen.',
    highlights: ['Bar open from 09', 'Pan pizzas & local fish', 'Central Saariselkä'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Raitopolku 1, 99830 Saariselkä',
    website: 'https://wildernesshotels.fi/wilderness-hotel-kieppi/restaurant',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/saariselka/lapland-hotels-riekonlinna/restaurants · https://laplandnorth.fi/en/company/lobby-bar-takka/ (luettu 12.9.2026)
    // The hours page was headed "Open from 9.6.", i.e. these are the summer-2026 hours; the hotel
    // does not publish a separate winter table for the bar, so hours may differ in the ski season.
    // No drink prices are published. The bar has no page of its own - it sits on the hotel's
    // restaurants page together with Restaurant Linnansali. · Aukiolo lahteessa: Mon-Sun 15-22
    name: 'Lobby Bar Takka',
    city: 'Saariselkä',
    type: 'Lobby bar',
    description: 'The fireplace lobby bar at Lapland Hotels Riekonlinna, next to Restaurant Linnansali. It serves drinks and hot beverages, and dogs are welcome. In autumn and early spring troubadours play in the bar, with free entry.',
    highlights: ['Fireplace bar', 'Live troubadours', 'Dogs welcome'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Saariseläntie 13, 99830 Saariselkä',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/saariselka/lapland-hotels-riekonlinna/restaurants',
    hours: {
      en: 'Mon–Sun 15–22',
      fi: 'Ma–Su 15–22',
      de: 'Mo–So 15–22',
      sv: 'Mån–Sön 15–22',
      fr: 'Lun–Dim 15–22',
      it: 'Lun–Dom 15–22',
      nl: 'Ma–Zo 15–22',
      es: 'Lun–Dom 15–22',
      'pt-BR': 'Seg–Dom 15–22',
      ja: '月–日 15–22',
      ko: '월–일 15–22',
      'zh-CN': '周一–周日 15–22',
    },
  },
  {
    // Lähde https://santashotels.fi/en/restaurant/pirtti-saariselka/ · https://laplandnorth.fi/en/company/restaurant-pirtti/ (luettu 12.9.2026)
    // Aukiolo poistettu: oma sivu jättää kentän tyhjäksi ja laplandnorth sanoo vain "open during
    // high seasons". Älä täytä aikoja Googlesta tai muusta aggregaattorista. · Aukiolo lahteessa (ei
    // kaannoskoneen kaavassa): ei annettu — oma sivu jättää "Restaurant opening hours:" -kentän
    // tyhjäksi; keittiö sulkeutuu 30 min ennen ravintolan sulkemista
    name: 'Restaurant Pirtti',
    city: 'Saariselkä',
    type: 'Pub',
    description: "The pub in the restaurant building of Santa's Hotel Tunturi. The hotel describes it as a relaxed, cozy living room you drift into after a day outdoors, with a warm traditional Lapland pub atmosphere, wooden interiors, a fireplace and an after-ski spirit. Its own page leads with good drinks and simple comfort food. Lapland North notes it is open during high seasons only, and neither the hotel nor Lapland North publishes daily opening hours — check by phone before going.",
    highlights: ['Fireplace and wooden interiors', 'After-ski atmosphere', 'Drinks and simple comfort food'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Lutontie 3, 99830 Saariselkä',
    website: 'https://santashotels.fi/en/restaurant/pirtti-saariselka/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://santashotels.fi/en/restaurant/siula-saariselka/ · https://laplandnorth.fi/en/company/restaurant-siula-santas-hotel-tunturi/ (luettu 12.9.2026)
    // Hours left empty: the venue's own page publishes none. The destination site laplandnorth.fi
    // adds that it seats 450 diners and holds up to 1,000 people for live music events, and that it
    // can be booked for private events; the hotel's own page does not repeat those figures. Do not
    // confuse with "Kauppakeskus Siula", a shopping centre at Kiveliöntie 8 in the same village.
    name: 'Restaurant Siula',
    city: 'Saariselkä',
    type: 'Dance restaurant',
    description: "The dance restaurant in the restaurant building of Santa's Hotel Tunturi, described by the hotel as a legendary dance restaurant where music, laughter and dancing fill the evenings. During the winter season the same room serves breakfast in the morning.",
    highlights: ['Dance floor', 'Live music evenings', 'Large event venue'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Lutontie 3, 99830 Saariselkä',
    website: 'https://santashotels.fi/en/restaurant/siula-saariselka/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.mettabaari.com/fi · https://www.mettabaari.com/fi/about (luettu 12.9.2026)
    // Osoite korjattu muotoon jonka oma sivu käyttää (Hirvaspirtti, ei katunumeroa). Kausi
    // 1.9.-30.4. lisätty. Poistettu lähteettömät väitteet: entinen Huskybaari, avaus kevät 2025,
    // pysyvä tanssisali + ulkotanssilava, karaoke kammi-ravintolassa, keitto. · Aukiolo lahteessa
    // (ei kaannoskoneen kaavassa): Daily 11-18, season 1 September - 30 April
    name: 'Mettäbaari',
    city: 'Saariselkä',
    type: 'Forest bar',
    description: "A bar in the forest beside Saariselkä's fitness/ski trail, two kilometres towards Laanila, in a group of old log buildings the owners describe as having a colourful history. After a few quiet years new owners reopened it as Mettäbaari. It holds a full alcohol licence (A-oikeudet) and its own line is that you can step in straight off the ski track. The simple menu is pancakes, familiar soft and hot drinks and local delicacies such as smoked Lake Inari whitefish. Twice a year, in spring and autumn, the old horse stable is turned into a dance room for the Monotanssit ski-boot dances with live music, and singers can do karaoke between sets.",
    highlights: ['Full alcohol licence (A-oikeudet)', 'Step in straight off the ski trail, 2 km towards Laanila', 'Pancakes and smoked Lake Inari whitefish'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Hirvaspirtti, 99830 Saariselkä',
    website: 'https://www.mettabaari.com/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://stararctichotel.com/restaurant-bar/ (luettu 12.9.2026)
    // Closed 20.4.-29.10.2026 per the hotel's own page, hence seasonal. The kitchen closes at 21:30;
    // the fireplace lounge is described as serving beverages all day, but no separate bar opening
    // hours are published. The bar itself is named only "Lounge Bar" - the venue name is Restaurant
    // Kaunis. Do not confuse with Kaunis Jorma Saariselkä (a separate pub at Kiveliöntie 3) or with
    // Kaunispään Huippu (the summit restaurant at Kaunispääntie 260). · Aukiolo lahteessa (ei
    // kaannoskoneen kaavassa): Daily lunch 13-15, dinner 17-23
    name: 'Restaurant Kaunis',
    city: 'Saariselkä',
    type: 'Restaurant & lounge bar',
    description: 'The restaurant of Star Arctic Hotel on the Kaunispää fell, serving Arctic cuisine built on reindeer, Lake Inari fish and arctic berries. Its fireplace Lounge Bar pours wines and house cocktails made with berries local to the area, which the hotel says are available only at this bar.',
    highlights: ['Lappish berry cocktails', 'Fireplace lounge bar', 'Fell-side hotel'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Ylämajantie 1, 99830 Saariselkä',
    website: 'https://stararctichotel.com/restaurant-bar/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.kaunispaanhuippu.fi/northern-lights-lounge/ (luettu 12.9.2026)
    // Kausi 6.11.2026-10.4.2027 lisätty aukiolokenttään ja seasonal=true — ilman sitä sivusto lupaa
    // syyskuussa baaria joka ei ole auki. Lapsihinnat lisätty. · Aukiolo lahteessa (ei kaannoskoneen
    // kaavassa): Wed and Sat 21-23:30, season 6 November 2026 - 10 April 2027 · Hinta lahteessa:
    // Ticket without transfers EUR 109 per adult, EUR 59 per child 4-14; with transfers EUR 129 per
    // adult, EUR 79 per child 4-14; free for under 4s
    name: 'Northern Lights Lounge',
    city: 'Saariselkä',
    type: 'Aurora lounge bar',
    description: "On Wednesday and Saturday evenings through the dark season the Kaunispää summit restaurant runs as the Northern Lights Lounge. The bar serves cocktails, wines, beers, soft drinks and small bites, and guests watch for the aurora from the summit's outdoor viewing areas or from the warm indoor lounge. A ticket includes entrance, one warm drink and snacks, and a host for the evening; other drinks and food are bought on the spot. Return transfers from Saariselkä can be included in the ticket.",
    highlights: ['Aurora watching from the summit of Kaunispää', 'Cocktails, wines and beers at 438 m', 'Ticket includes a warm drink, snacks and a host'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kaunispääntie 260, 99830 Saariselkä',
    website: 'https://www.kaunispaanhuippu.fi/northern-lights-lounge/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.kakslauttanen.fi/venues/igloo-bar · https://www.kakslauttanen.fi/venues (luettu 12.9.2026)
    // Kakslauttanen Arctic Resort was completely absent from the first pass even though its postal
    // address is 99830 Saariselkä. The resort sits outside Saariselkä village on Kiilopääntie —
    // decide whether laplandbars counts it as Saariselkä. No opening hours or drink prices on the
    // own site; seasonal=false is an assumption, the site states no season.
    name: 'Igloo Bar',
    city: 'Saariselkä',
    type: 'Cocktail bar',
    description: 'A bar inside the Aurora Restaurant in the West Village of Kakslauttanen Arctic Resort. It serves cocktails in a space that combines traditional log architecture with glass igloos and looks out over the surrounding landscape.',
    highlights: ['Glass igloo setting', 'Cocktail list', 'Inside Aurora Restaurant'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kiilopääntie 9, 99830 Saariselkä',
    website: 'https://www.kakslauttanen.fi/venues/igloo-bar',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.kakslauttanen.fi/restaurants/overview (luettu 12.9.2026)
    // Only the resort's restaurants overview page describes this bar; there is no dedicated page I
    // could load. No hours, no prices, and no statement about whether non-guests can visit. Same
    // postal area caveat as the Igloo Bar (9 km from the village).
    name: 'Piano Bar at East Village Restaurant',
    city: 'Saariselkä',
    type: 'Piano bar',
    description: 'A bar within the East Village Restaurant at Kakslauttanen Arctic Resort, described by the resort as having live piano music. The East Village Restaurant itself is a kelo log restaurant and the main dining venue for that side of the resort.',
    highlights: ['Live piano music', 'Kelo log building', 'Resort venue'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Kiilopääntie 9, 99830 Saariselkä',
    website: 'https://www.kakslauttanen.fi/restaurants/overview',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://majoituskuukkeli.fi/en/kuukkeli-shopping-center/bistro-cafe-kuukkeli/ (luettu 12.9.2026)
    // ADDRESS CONFLICT: the venue's own page gives Saariseläntie 1 (Kuukkeli Shopping Center), but a
    // third-party local listing (walttia.fi) places a 'Café Kuukkeli' in the Siula shopping centre
    // at Kiveliöntie 8, 2nd floor. Possibly two separate Kuukkeli cafés, or a listing that was not
    // updated after the original Kuukkeli burned down in early 2022. A full alcohol licence
    // ('A-oikeudet') is claimed only by third-party listings, not by the venue's own page — the own
    // page says only 'bar' and 'drinks'. Kitchen closes 20:30. Verify on site before publishing. ·
    // Aukiolo lahteessa (ei kaannoskoneen kaavassa): Daily 8-21 · Hinta lahteessa: Pizzas EUR
    // 14.80-22.50
    name: 'Bistro & Café Kuukkeli',
    city: 'Saariselkä',
    type: 'Cafe bar',
    description: "A café-restaurant in the Kuukkeli Shopping Center in the centre of Saariselkä. The venue's own page describes a fireplace bar where guests can have drinks. Food service covers breakfast, a weekday lunch buffet and pizzas, burgers, sautéed reindeer and soup.",
    highlights: ['Fireplace bar', 'Lunch buffet Mon-Sat', 'In Kuukkeli Shopping Center'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Saariseläntie 1, Kuukkeli Shopping Center, 99830 Saariselkä',
    website: 'https://majoituskuukkeli.fi/en/kuukkeli-shopping-center/bistro-cafe-kuukkeli/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.evaskori.fi/ · https://yllas.fi/ravintolat/joiku-pub/ (luettu 12.9.2026)
    // Poistettu vahvistamaton väite viikoittaisesta After Ski Partysta (to ja su 14–17) — ei omalla
    // sivulla eikä yllas.fi:llä. Julkaistut aukiolot ovat kampanjaluontoiset (5.–19.9.2026);
    // tarkista ennen talvikautta. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Päivätanssit
    // karaoken tahdissa 5.9.–19.9.2026 klo 14–02, joka päivä (oma sivu; talvikauden aukioloja ei
    // julkaistu). Viereinen Eväskori joka päivä 12–21, keittiö 20.30.
    name: 'Joiku Pub',
    city: 'Ylläs',
    type: 'Pub',
    description: "Joiku Pub is the village pub in Äkäslompolo, run by the same company as the Eväskori pizzeria next door (both listed under business ID 3090445-7). Its own site calls it Ylläs's legendary evening venue: a relaxed room with good music, karaoke and a dance floor that fills late into the night. The village's largest sun terrace belongs to the pub and serves from early spring to late autumn, and outside the season there is a billiard table in the pub. Table reservations only for groups over 10.",
    highlights: ['Karaoke ja tanssilattia', 'Kylän isoin aurinkoterassi', 'Biljardipöytä sesongin ulkopuolella'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Jakolantie 2, 95970 Äkäslompolo',
    website: 'https://www.evaskori.fi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://yllas.fi/ravintolat/los-lompolos/ · https://www.visitfinland.com/en/product/7b9c3086-3eab-44b4-b042-f7502efb75d3/los-lompolos/ (luettu 12.9.2026)
    // Aukiolot ja kausi ovat Visit Finlandin datahubista (yrityksen itsensä syöttämä), eivät
    // yllas.fi:ltä — merkitse lähde. Yllas.fi:n listauksella ei ole aukioloja lainkaan. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Wed–Sun 15–23, Mon and Tue closed (Visit Finland
    // datahub, provider Los Pois Oy). Not listed as available in May, June or October. · Hinta
    // lahteessa: 10–25 € (yllas.fi)
    name: 'Los Lompolos',
    city: 'Ylläs',
    type: 'Cocktail bar',
    description: 'A small bar in the centre of Äkäslompolo. Its own one-line description, carried verbatim by both the Ylläs tourist board and Visit Finland, reads: tiny bar fulfilled with crossover music, cocktails and food, come as you are.',
    highlights: ['Cocktailit ja crossover-musiikki', 'Kylän keskustassa', 'Ruokaa 10–25 €'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Sivulantie 5e, 95970 Äkäslompolo',
    website: 'https://www.instagram.com/los_lompolos/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://miiluresort.fi/en/ · https://yllas.fi/ravintolat/miilu-bar-grill/ (luettu 12.9.2026)
    // Aukiolot ovat kausi-ikkuna 31.8.–17.10., ei ympärivuotinen aikataulu. Oman sivun ruokalista on
    // julkaisematonta paikkatäytettä — älä käytä hintoina. · Aukiolo lahteessa (ei kaannoskoneen
    // kaavassa): 31.8.–17.10.: Mon–Fri 14–21, Sat 15.30–21 (Sunday not listed on the venue's own
    // page). Winter-season hours not published.
    name: 'Miilu Bar & Grill',
    city: 'Ylläs',
    type: 'Bar & grill',
    description: "Miilu Bar & Grill stands on the shore of Lake Ylläsjärvi as part of Miilu Resort. The open fire grill, burning the house's own charcoal embers, is the heart of the kitchen, and the venue's listing says it puts seasonal ingredients together with a selection of drinks. Large windows face the lake. It can be reached by car, on foot, on skis, by bike or by snowmobile.",
    highlights: ['Avotuligrilli', 'Järvinäkymä ja revontulet suurista ikkunoista', 'Saapuminen myös suksilla tai kelkalla'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Rantasaarentie 3-5, 95980 Ylläsjärvi',
    website: 'https://miiluresort.fi/en/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://taigayllas.fi/ · https://ski.yllas.fi/en/services/slope-restaurants/ (luettu 12.9.2026)
    // Poistettu 'Taiga Kitchen event' ja 'all-ages live shows' — kumpaakaan ei löydy omalta sivulta
    // eikä hiihtokeskuksen rinneravintolasivulta. Sama puhelinnumero kuin Bistro Hissillä (+358 40
    // 718 1101). · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Avoinna joka päivä (yllas.fi);
    // tarkkoja kellonaikoja ei julkaistu omalla sivulla. Auki ympäri vuoden (ski.yllas.fi).
    name: 'Taiga Ylläs',
    city: 'Ylläs',
    type: 'Slope pub',
    description: "Taiga Ylläs describes itself on its own site as a restaurant, pub and slope restaurant at the foot of the Ylläs Ski South slope in Ylläsjärvi, serving Lappish food, local drinks, live music and a relaxed après-ski atmosphere. The ski resort's own listing adds that Taiga Pub is built around a changing selection of beers and charcoal-grilled food, with live music on performer nights and stand-up gigs in the spring season. It is open year-round.",
    highlights: ['Rinteen juurella, après-ski', 'Vaihtuva olutvalikoima', 'Livemusiikkia esiintyjäiltoina'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Vaeltajantie 2, 95980 Ylläsjärvi',
    website: 'https://taigayllas.fi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/ski-resorts/yllas-ski-resort/y1-restaurants · https://ski.yllas.fi/en/services/slope-restaurants/ (luettu 12.9.2026)
    // KAUSI: oma sivu sanoo 'Opening in November 2026'. Älä julkaise auki olevana ennen marraskuuta.
    // Vanha .html-osoite ohjautuu uuteen y1-restaurants-polkuun. · Aukiolo lahteessa (ei
    // kaannoskoneen kaavassa): Opening in November 2026 (venue's own page). Closed at the time of
    // checking, 12.9.2026.
    name: 'Y1 Ski Pub',
    city: 'Ylläs',
    type: 'Slope pub',
    description: 'Y1 Ski Pub is part of the Y1 restaurant world at Ylläs Ski Resort on the Äkäslompolo side, near the base of the Aurinko-Express chairlift at Aurinkokuru. Lapland Hotels calls it the restaurant that opens first and closes last, with a traditional, warm pub-like room, a fireplace to sit by during or after skiing, live performers through the season and a terrace. The kitchen serves bistro food such as burgers, pita breads and ramen soups alongside a wide selection of hot and cold drinks.',
    highlights: ['Aukeaa ensimmäisenä, sulkee viimeisenä', 'Takka ja terassi', 'Esiintyjiä läpi kauden'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Tunturintie 56, 95970 Äkäslompolo',
    website: 'https://www.laplandhotels.com/en/ski-resorts/yllas-ski-resort/y1-restaurants',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-akashotelli/restaurants · https://yllas.fi/ravintolat/takka-baari/ (luettu 12.9.2026)
    // Aukiolo on kausikohtainen (28.8.–26.9.2026), ei pysyvä. Koko hotellin ravintolapalvelut kiinni
    // 27.9.–20.11.2026. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): 28.8.–26.9.2026: daily
    // 10–24, soup lunch 12–15. 27.9.–20.11.2026: the fireplace bar is closed. Winter-season hours
    // (from 20.11.2026) not yet published.
    name: 'Takka bar',
    city: 'Ylläs',
    type: 'Hotel lobby bar',
    description: 'The lobby bar at Lapland Hotels Äkäshotelli, in the same building as and next to Restaurant Pirtukirkko. The hotel describes it as the place for its mountain pizzas, a coffee or a refreshing drink, and it runs a soup lunch from 12 to 15.',
    highlights: ['Tunturipizzat', 'Keittolounas 12–15', 'Pirtukirkon vieressä'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Äkäsentie 10, 95970 Äkäslompolo',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-akashotelli/restaurants',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-akashotelli/restaurants · https://yllas.fi/ravintolat/ravintola-pirtukirkko/ (luettu 12.9.2026)
    // Kausi: ravintolapalvelut kiinni 27.9.–20.11.2026. Julkaise aukiolo aina päivämäärävälin
    // kanssa. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): 28.8.–26.9.2026: restaurant 17–01, à
    // la carte 17–22, dinner buffet 17–19; breakfast 7–10 (20.6.–27.9.2026). 27.9.–20.11.2026 the
    // restaurant is closed. Winter season 20.11.2026–2.5.2027.
    name: 'Ravintola Pirtukirkko',
    city: 'Ylläs',
    type: 'Dance restaurant',
    description: 'The restaurant at Lapland Hotels Äkäshotelli, known for its church-like exterior, serving northern flavours and classic dishes from breakfast through à la carte dinner, with a buffet in peak season. Its own page leads on the nightlife side: dances are held there during the autumn and early spring with a published performer calendar, and admission is included in the room rate. Pirtukellari Night Club is in the basement of the same building, and the upstairs Pirtun Parvi keeps going until the early hours on performer nights.',
    highlights: ['Tanssit ja esiintyjäkalenteri', 'Sisäänpääsy majoitushintaan', 'Yökerho samassa rakennuksessa'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Äkäsentie 10, 95970 Äkäslompolo',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-akashotelli/restaurants',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-saaga/restaurants · https://yllas.fi/ravintolat/lapland-hotels-saaga-ravintolat/ (luettu 12.9.2026)
    // Poistettu vahvistamaton väite suksilla sisäänkäynnistä kaikkiin kolmeen ravintolaan. Huomaa
    // hotellin oma ristiriita: bistron aukiolo on merkitty 26.9. asti, mutta kausitiedote sanoo
    // ravintolat kiinni jo 24.9. alkaen. · Aukiolo lahteessa (ei kaannoskoneen kaavassa):
    // 19.6.–26.9.2026: 16–22. From 24.9. to 14.11.2026 the hotel's restaurants are closed (hotel's
    // seasonal notice); winter season from mid-November.
    name: 'Bistro (Lapland Hotels Saaga)',
    city: 'Ylläs',
    type: 'Hotel bistro bar',
    description: "One of the three restaurants at Lapland Hotels Saaga in Ylläsjärvi, alongside the buffet restaurant Biegga and the à la carte Tsohka. The hotel's own page says that in the summer at the relaxed and cosy Bistro you can enjoy cocktails made by the bartender or a cold drink on the sunny terrace; the food is snack-style, such as salmon soup. The hotel sits next to the southern slopes of Ylläs, with the gondola right beside it.",
    highlights: ['Baarimikon cocktailit', 'Aurinkoterassi', 'Gondolin vieressä'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Iso-Ylläksentie 42, 95980 Ylläsjärvi',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-saaga/restaurants',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-yllaskaltio/restaurants · https://yllas.fi/ravintolat/lapland-hotels-yllaskaltion-ravintolat/ (luettu 12.9.2026)
    // Kellonaika 9–01.30 astuu voimaan vasta 30.11. — älä julkaise sitä nykyaukiolona. Poistettu
    // 'first floor' -tarkennus, jota lähde ei sano (vain 'next to the hotel reception'). · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Daily 9–01.30 from 30.11. onwards (hotel's own note).
    // 4.–25.9.2026: soup lunch served in the lobby bar 12–15, dinner buffet 17–19. · Hinta
    // lahteessa: Buffet lunch 14 €, dinner 34 €
    name: 'Lobby Bar (Lapland Hotels Ylläskaltio)',
    city: 'Ylläs',
    type: 'Hotel lobby bar',
    description: "The bar next to the reception at Lapland Hotels Ylläskaltio in Äkäslompolo. The hotel says it serves refreshing drinks and hot drinks with a Snacks menu and that dogs are welcome, and the hotel's soup lunch is served here from 12 to 15. Dance events are held in the hotel's restaurant during the autumn and spring weeks, with admission included in the room rate.",
    highlights: ['Koirat tervetulleita', 'Keittolounas aulabaarissa', 'Tanssi-illat syksyllä ja keväällä'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Sivulantie 7, 95970 Äkäslompolo',
    website: 'https://www.laplandhotels.com/en/hotels-and-destinations/yllas/lapland-hotels-yllaskaltio/restaurants',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://hiyllas.fi/en/company/ski-pub-ala-asema/ · https://ski.yllas.fi/palvelut/rinneravintolat/ (luettu 12.9.2026)
    // Vaihdettu rikkinäinen Facebook-people-osoite hiyllas.fi:n yrityssivuun. Aukiolo 17–00 on
    // hiyllas.fi:ltä, ei paikan omalta sivulta — paikalla ei ole omaa verkkosivua. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): 17–00; during the winter season the pub opens earlier
    // in the day and the terrace is in use.
    name: 'Ski pub Ala-Asema',
    city: 'Ylläs',
    type: 'Ski pub',
    description: "Ski pub Ala-Asema sits next to the lower station of the Ylläs gondola on the Ylläsjärvi side. The resort's slope-restaurant page and the venue's own listing describe a relaxed ski pub with billiards, darts, board games and karaoke, serving drinks and pub food. A terrace is in use in season.",
    highlights: ['Gondolin ala-aseman vieressä', 'Biljardi, tikka ja karaoke', 'Terassi talvikaudella'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Iso-Ylläksentie 44, 95980 Ylläsjärvi',
    website: 'https://hiyllas.fi/en/company/ski-pub-ala-asema/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://yllas.fi/ravintolat/cafe-bar-routa/ · https://www.visitfinland.com/en/product/0bfb4e64-3872-4b64-87ec-c0b6228573e9/cafe-bar-routa/ (luettu 12.9.2026)
    // Poistettu Wikivoyage lähteistä (käyttäjien muokkaama wiki); hinta löytyy yllas.fi:ltä. Sulkee
    // klo 17 — ei iltapaikka. · Aukiolo lahteessa (ei kaannoskoneen kaavassa): Mon–Sat 9–17, Sun
    // 10–17 (Visit Finland datahub). Listed as open all twelve months. · Hinta lahteessa: 3–18 €
    // (yllas.fi)
    name: 'Cafe & Bar Routa',
    city: 'Ylläs',
    type: 'Cafe bar (daytime, closes 17)',
    description: 'Cafe & Bar Routa is a cafe and bar in the heart of Äkäslompolo, in the K-Market Jounin kauppa building. The Ylläs tourist board page describes it as a lively cafe in the busiest part of the village and gives a price range of 3–18 euros. It closes at 17, so it is a daytime spot rather than an evening bar.',
    highlights: ['Kylän vilkkaimmalla paikalla', 'Annokset 3–18 €', 'Auki ympäri vuoden'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Sannanrannantie 3, 95970 Äkäslompolo',
    website: 'https://www.facebook.com/p/Cafe-Bar-Routa-100048855251558/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://yllas.fi/ravintolat/aurinkoravintola-yllas-3/ · https://ski.yllas.fi/en/services/slope-restaurants/ (luettu 12.9.2026)
    // KOHDE KORJATTU: Ylläsjärven puoli (95980), ei Äkäslompolo (95970) — hiihtokeskuksen oma sivu
    // listaa Aurinkon Ylläsjärven alueelle ja koordinaatit vahvistavat. Talvikausipaikka. · Aukiolo
    // lahteessa (ei kaannoskoneen kaavassa): Winter season only, open according to the ski lift
    // timetables. Closed outside the ski season.
    name: 'Aurinkoravintola Ylläs',
    city: 'Ylläs',
    type: 'Slope bar',
    description: 'Aurinkoravintola is a traditional slope restaurant on the Aurinko slope on the Ylläsjärvi side of Ylläs, open during the ski season according to the lift timetables. The Ylläs tourist board page says it serves cold and hot drinks and food portions, and that its large terrace serves spring-winter sun seekers. Guests ski straight to the door.',
    highlights: ['Iso terassi kevätauringossa', 'Suksilla ovelle', 'Auki hissien aikataulun mukaan'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Aurinkorinne, 95980 Ylläsjärvi',
    website: 'https://www.facebook.com/aurinkoravintola/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
  },
  {
    // Lähde https://bistrohissi.fi/ · https://ski.yllas.fi/palvelut/rinneravintolat/ (luettu 12.9.2026)
    // Talvikausipaikka (auki hissien käydessä). Pizzahinnat ovat väli 12,50–15,50 €, ei pelkkä
    // alaraja. Painottuu ruokaan; juomat mainitaan vain hiihtokeskuksen sivulla. · Aukiolo lahteessa
    // (ei kaannoskoneen kaavassa): Open when the lifts are running (winter season). Closed outside
    // the ski season. · Hinta lahteessa: Burgers 15.50–16.50 €, pizzas 12.50–15.50 €, salads 15 €,
    // kids' meal 7.50 €
    name: 'Bistro Hissi',
    city: 'Ylläs',
    type: 'Slope bistro bar',
    description: "Bistro Hissi is at the foot of the slopes on the Ylläsjärvi side, by the Ylläs Express chairlift. Its own site says it serves pizzas, burgers, salads and snacks and is open when the lifts are running; the resort's slope-restaurant page adds that it serves warm and cold drinks by the fireplace. The same company also rents snowmobiles.",
    highlights: ['Rinteen juurella', 'Takka ja lämpimät juomat', 'Kelkkavuokraus samasta talosta'],
    price: {
      en: 'Prices on the venue site',
      fi: 'Hinnat kohteen sivulla',
      de: 'Preise auf der Website des Lokals',
      sv: 'Priser på ställets sida',
      fr: 'Tarifs sur le site du lieu',
      it: 'Prezzi sul sito del locale',
      nl: 'Prijzen op de site van de zaak',
      es: 'Precios en la web del local',
      'pt-BR': 'Preços no site do local',
      ja: '料金は店舗サイトで',
      ko: '가격은 매장 사이트에서',
      'zh-CN': '价格见店家网站',
    },
    address: 'Iso-Ylläksentie 44, 95980 Ylläsjärvi',
    website: 'https://bistrohissi.fi/',
    hours: {
      en: 'Check venue for current hours',
      fi: 'Tarkista aukioloajat suoraan paikasta',
      de: 'Aktuelle Öffnungszeiten beim Lokal prüfen',
      sv: 'Kontrollera aktuella öppettider hos stället',
      fr: 'Horaires à vérifier auprès de l’établissement',
      it: 'Verifica gli orari aggiornati sul sito del locale',
      nl: 'Actuele openingstijden bij de zaak checken',
      es: 'Consulte el horario actual en el local',
      'pt-BR': 'Confira o horário atual com o local',
      ja: '最新の営業時間は店舗にご確認ください',
      ko: '최신 영업시간은 매장에 확인하세요',
      'zh-CN': '营业时间请以店家为准',
    },
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
  /**
   * Optional since 2026-07-30. Two of the three ice-bar products were delisted
   * and GetYourGuide redirects a delisted product to a city listing instead of
   * 404ing, so a required field forced us to keep a link that silently lied.
   * Absent means "no bookable product" — IceBars.tsx hides the CTA entirely.
   */
  visitGygProductPath?: string;
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
      fi: '-5 °C sisällä',
      de: '-5 °C innen',
      sv: '-5 °C inomhus',
      fr: '-5 °C à l’intérieur',
      it: '-5 °C all’interno',
      nl: '-5 °C binnen',
      es: '-5 °C en el interior',
      'pt-BR': '-5 °C no interior',
      ja: '室内 -5°C',
      ko: '실내 -5°C',
      'zh-CN': '室内 -5°C',
    },
    // Verified from laplandhotels.com/…/snowvillage/ice-exhibition 2026-07-10:
    // ice bar is included in the exhibition ticket (hot drink or drink in an
    // ice shot glass); venue publishes prices seasonally.
    price: {
      en: 'Exhibition ticket incl. a drink in an ice glass. Prices on venue site',
      fi: 'Näyttelylippu sis. juoman jäälasissa. Hinnat kohteen sivulla',
      de: 'Ausstellungsticket inkl. Drink im Eisglas. Preise auf der Website',
      sv: 'Utställningsbiljett inkl. en drink i isglas. Priser på ställets sida',
      fr: 'Billet d’exposition avec une boisson dans un verre de glace. Tarifs sur le site',
      it: 'Biglietto della mostra con un drink nel bicchiere di ghiaccio. Prezzi sul sito',
      nl: 'Expositieticket incl. een drankje in een ijsglas. Prijzen op de site',
      es: 'Entrada a la exposición con una bebida en vaso de hielo. Precios en la web',
      'pt-BR': 'Ingresso da exposição com uma bebida em copo de gelo. Preços no site',
      ja: '展示チケットに氷のグラスのドリンク1杯付き。料金は公式サイトで',
      ko: '전시 입장권에 얼음잔 음료 1잔 포함. 가격은 공식 사이트에서',
      'zh-CN': '展览门票含一杯冰杯饮品。价格见官网',
    },
    season: {
      en: 'Opens Dec 25, 2026 (rebuilt every autumn)',
      fi: 'Avautuu 25.12.2026 (rakennetaan uudelleen joka syksy)',
      de: 'Öffnet am 25.12.2026 (jeden Herbst neu gebaut)',
      sv: 'Öppnar 25 dec 2026 (byggs om varje höst)',
      fr: 'Ouverture le 25 déc. 2026 (reconstruit chaque automne)',
      it: 'Apre il 25 dic 2026 (ricostruito ogni autunno)',
      nl: 'Opent 25 dec 2026 (elke herfst opnieuw gebouwd)',
      es: 'Abre el 25 dic 2026 (se reconstruye cada otoño)',
      'pt-BR': 'Abre em 25 dez 2026 (reconstruído todo outono)',
      ja: '2026年12月25日オープン（毎年秋に再建）',
      ko: '2026년 12월 25일 개장 (매년 가을 재건축)',
      'zh-CN': '2026 年 12 月 25 日开放（每年秋季重建）',
    },
    website: 'https://snowvillage.fi',
    // the lodging partner — the property ("Lapland Hotels Snow Village") does NOT
    // resolve in the lodging partner destination search (verified via Expedia
    // typeahead 2026-07-10, empty for every name variant) → use the
    // municipality so the search always returns results. Card label says
    // "book a room nearby", which this honestly is.
    stayQuery: 'Kittilä, Finland',
    staySid: 'icebar_snowvillage_lainio',
    stayHint: 'Snow suites + log cabins on-site',
    // 🔴 Delisted, removed 2026-07-30. `yllas-snowvillage-ice-hotel-guided-tour-
    // with-transfer-t1108702` now redirects to the Yllasjarvi listing (HTTP 200,
    // valid-looking page) instead of the tour it names. No replacement exists.
    visitSid: 'icebar_visit_snowvillage',
  },
  {
    name: 'Arctic SnowHotel IceBar',
    location: 'Rovaniemi (30min)',
    description: 'Located at Arctic SnowHotel on the shores of Lake Lehtojärvi. Rebuilt every winter with new artistic themes, carved by Finnish and international artists. Thermal suits provided. The Lake setting makes this one of the most atmospheric ice bars in the world.',
    highlight: 'Thermal suits included',
    temp: {
      en: '-5°C inside',
      fi: '-5 °C sisällä',
      de: '-5 °C innen',
      sv: '-5 °C inomhus',
      fr: '-5 °C à l’intérieur',
      it: '-5 °C all’interno',
      nl: '-5 °C binnen',
      es: '-5 °C en el interior',
      'pt-BR': '-5 °C no interior',
      ja: '室内 -5°C',
      ko: '실내 -5°C',
      'zh-CN': '室内 -5°C',
    },
    // Verified from arcticsnowhotel.fi/en/eat-drink/ice-bar/ 2026-07-10:
    // hours 11–22, season Dec 15 – Mar 31; no standalone bar fee — a Snowhotel
    // entrance ticket is required (overnight guests enter free).
    price: {
      en: 'SnowHotel ticket needed; guests free',
      fi: 'Snowhotel-lippu; yöpyjille ilmainen',
      de: 'Snowhotel-Ticket nötig; Gäste frei',
      sv: 'Snowhotel-biljett krävs; gäster gratis',
      fr: 'Billet Snowhotel requis, hôtes gratuits',
      it: 'Biglietto Snowhotel; ospiti gratis',
      nl: 'Snowhotel-ticket nodig; gasten gratis',
      es: 'Entrada Snowhotel; huéspedes gratis',
      'pt-BR': 'Ingresso Snowhotel; hóspedes grátis',
      ja: 'Snowhotel入場券が必要、宿泊客は無料',
      ko: 'Snowhotel 입장권 필요, 투숙객 무료',
      'zh-CN': '需 Snowhotel 门票，住店客人免费',
    },
    season: {
      en: 'Daily 11–22 (Dec 15 – Mar 31)',
      fi: 'Päivittäin 11–22 (15.12.–31.3.)',
      de: 'Täglich 11–22 (15. Dez. – 31. März)',
      sv: 'Dagligen 11–22 (15 dec–31 mars)',
      fr: 'Tous les jours 11–22 (15 déc. – 31 mars)',
      it: 'Tutti i giorni 11–22 (15 dic – 31 mar)',
      nl: 'Dagelijks 11–22 (15 dec – 31 mrt)',
      es: 'Todos los días 11–22 (15 dic – 31 mar)',
      'pt-BR': 'Todos os dias 11–22 (15 dez – 31 mar)',
      ja: '毎日 11–22（12月15日〜3月31日）',
      ko: '매일 11–22 (12월 15일–3월 31일)',
      'zh-CN': '每天 11–22（12 月 15 日–3 月 31 日）',
    },
    website: 'https://arcticsnowhotel.fi',
    // lodging partner listing name, verified EXACT_MATCH (hotelId 12689601,
    // Lehtoahontie 27) via Expedia typeahead 2026-07-10. The old
    // "Arctic SnowHotel, Rovaniemi, Finland" string geocoded to nothing
    // → the search page showed zero properties.
    stayQuery: 'Arctic SnowHotel & Glass Igloos',
    staySid: 'icebar_arctic_snowhotel',
    stayHint: 'Snow rooms, glass igloos, log cabins',
    // 🔴 Delisted, removed 2026-07-30. Same product as the Arctic SnowHotel bar
    // row above: it redirects to the Rovaniemi listing rather than 404ing.
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
      de: 'Im Freien / überdacht',
      sv: 'Utomhus / under tak',
      fr: 'En extérieur / couvert',
      it: 'All’aperto / al coperto',
      nl: 'Buiten / overdekt',
      es: 'Al aire libre / cubierto',
      'pt-BR': 'Ao ar livre / coberto',
      ja: '屋外／屋根付き',
      ko: '야외 / 지붕 있음',
      'zh-CN': '户外/有顶棚',
    },
    // Verified from snowmanworld.fi 2026-07-10: entry €35/person (under-2s
    // free), season Dec 6, 2026 – Mar 17, 2027; ice bar drinks purchased
    // separately at the bar.
    price: {
      en: 'Snowman World entry €35. Ice Bar drinks separately',
      fi: 'Snowman World -sisäänpääsy 35 €. Jääbaarin juomat erikseen',
      de: 'Snowman World Eintritt 35 €. Drinks an der Eisbar extra',
      sv: 'Snowman World entré 35 €. Drinkar i isbaren tillkommer',
      fr: 'Entrée Snowman World 35 €. Boissons du bar de glace en sus',
      it: 'Ingresso Snowman World 35 €. Drink dell’ice bar a parte',
      nl: 'Snowman World entree €35. Drankjes in de ijsbar apart',
      es: 'Entrada a Snowman World 35 €. Bebidas del bar de hielo aparte',
      'pt-BR': 'Entrada no Snowman World 35 €. Bebidas do bar de gelo à parte',
      ja: 'Snowman World 入場 35€。アイスバーのドリンクは別料金',
      ko: 'Snowman World 입장 35€. 아이스 바 음료 별도',
      'zh-CN': 'Snowman World 门票 35 €。冰吧饮品另计',
    },
    season: {
      en: 'Dec 6, 2026 – Mar 17, 2027',
      fi: '6.12.2026–17.3.2027',
      de: '6. Dez. 2026 – 17. März 2027',
      sv: '6 dec 2026 – 17 mars 2027',
      fr: '6 déc. 2026 – 17 mars 2027',
      it: '6 dic 2026 – 17 mar 2027',
      nl: '6 dec 2026 – 17 mrt 2027',
      es: '6 dic 2026 – 17 mar 2027',
      'pt-BR': '6 dez 2026 – 17 mar 2027',
      ja: '2026年12月6日〜2027年3月17日',
      ko: '2026년 12월 6일 – 2027년 3월 17일',
      'zh-CN': '2026 年 12 月 6 日–2027 年 3 月 17 日',
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

/**
 * Menulinkki baarille (juoma- tai ruokalista) rekisteristä
 * `generated/bar-menus.json`. Jokainen rivi on kuitattu käsin: löytöskripti
 * ehdottaa, ihminen katsoo. 10/26 baarilla on linkki; lopuilla rekisterissä on
 * kirjattu syy.
 *
 * Avain on baarin nimestä johdettu slug, jossa skandit on TRANSLITEROITU
 * (ä→a, ö→o) eikä pudotettu — muuten "Pub Hölmölä" olisi `pub-h-lm-l`.
 */
const menuRegistry = barMenus as Record<string, {
  url?: string; kind?: string; title?: string; status?: string; reason?: string;
}>;

/**
 * Kaupunkien esitysjarjestys /bars-sivulla ja etusivun suodattimissa.
 *
 * 🔴 Vesa 12.9.2026: tama oli KASIN KIRJOITETTU nelja nimea, ja kun bars.ts
 * kasvoi 27:sta 84 kohteeseen, viisi kokonaista kylaa (Ruka, Pyha, Luosto,
 * Salla, Iso-Syote) jai listalta pois — data oli tiedostossa mutta 33 korttia
 * ei renderoitunyt kenellekaan. Puuttuva nimi ei anna virhetta.
 *
 * Siksi lista JOHDETAAN datasta: `CITY_ORDER` maaraa vain jarjestyksen, ja
 * tuntematon kaupunki paatyy silti loppuun. Uusi kohde nakyy sivulla heti kun
 * sen rivi on `bars`-taulukossa.
 */
const CITY_ORDER = ['Rovaniemi', 'Levi', 'Ylläs', 'Saariselkä', 'Ruka', 'Pyhä', 'Luosto', 'Salla', 'Iso-Syöte'];

export const cities: string[] = (() => {
  const present = new Set(bars.map((b) => b.city));
  const ordered = CITY_ORDER.filter((c) => present.has(c));
  const rest = [...present].filter((c) => !CITY_ORDER.includes(c)).sort();
  return [...ordered, ...rest];
})();

export function barSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[äå]/g, 'a').replace(/ö/g, 'o').replace(/[éè]/g, 'e').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Riittaa etta paikalla on nimi, jotta sama haku palvelee myos IceBar-tyyppia. */
export function menuFor(bar: { name: string }): { url: string; kind: 'page' | 'pdf' } | null {
  const m = menuRegistry[barSlug(bar.name)];
  if (!m?.url || (m.kind !== 'page' && m.kind !== 'pdf')) return null;
  return { url: m.url, kind: m.kind };
}

export function getFeaturedBars(): Bar[] {
  return bars.filter((b) => b.featured);
}
