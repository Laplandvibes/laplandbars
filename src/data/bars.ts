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
      en: 'Snowhotel entrance ticket required (overnight guests free)',
      fi: 'Vaatii Snowhotel-sisäänpääsylipun (hotelliyöpyjille vapaa)',
      de: 'Snowhotel-Eintrittskarte erforderlich (Übernachtungsgäste frei)',
      sv: 'Kräver entrébiljett till Snowhotel (gratis för övernattande gäster)',
      fr: 'Billet d’entrée Snowhotel requis (gratuit pour les clients hébergés)',
      it: 'Serve il biglietto d’ingresso allo Snowhotel (gratis per chi pernotta)',
      nl: 'Snowhotel-toegangskaart vereist (gratis voor overnachtende gasten)',
      es: 'Requiere entrada al Snowhotel (gratis para huéspedes alojados)',
      'pt-BR': 'Exige ingresso do Snowhotel (grátis para hóspedes)',
      ja: 'Snowhotelの入場券が必要（宿泊客は無料）',
      ko: 'Snowhotel 입장권 필요 (투숙객 무료)',
      'zh-CN': '需购买 Snowhotel 门票（住店客人免费）',
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
      // 🔴 gygProductPath removed 2026-07-30: the product
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
      en: 'Snowhotel entrance ticket required (overnight guests free)',
      fi: 'Vaatii Snowhotel-sisäänpääsylipun (hotelliyöpyjille vapaa)',
      de: 'Snowhotel-Eintrittskarte erforderlich (Übernachtungsgäste frei)',
      sv: 'Kräver entrébiljett till Snowhotel (gratis för övernattande gäster)',
      fr: 'Billet d’entrée Snowhotel requis (gratuit pour les clients hébergés)',
      it: 'Serve il biglietto d’ingresso allo Snowhotel (gratis per chi pernotta)',
      nl: 'Snowhotel-toegangskaart vereist (gratis voor overnachtende gasten)',
      es: 'Requiere entrada al Snowhotel (gratis para huéspedes alojados)',
      'pt-BR': 'Exige ingresso do Snowhotel (grátis para hóspedes)',
      ja: 'Snowhotelの入場券が必要（宿泊客は無料）',
      ko: 'Snowhotel 입장권 필요 (투숙객 무료)',
      'zh-CN': '需购买 Snowhotel 门票（住店客人免费）',
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
