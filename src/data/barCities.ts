import { BARS } from './images';
import { bars, type Bar } from './bars';

/**
 * Kaupunkisivujen rekisteri (/city/{slug}).
 *
 * MIKSI NÄMÄ SIVUT OVAT OLEMASSA (mitattu GSC:stä 11.9.2026, 3 kk). Sivustolla
 * oli 11 reittiä eikä yhtään kaupunkisivua. Kaupunkihaut osuivat yhteen
 * pitkään /bars-listaan ja jäivät sinne: "baarit rovaniemi" sijainti 34–54,
 * "pub rovaniemi" 28, "baarit levi" 35, "hölmölä levi" 43 — 0 klikkiä
 * kaikista. Sisarsivustot laplanddining.com (13 kaupunkisivua 7.9.) ja
 * laplandnightlife.com (14) rankkaavat samoille aikomuksille sijoilla 5–12.
 * Aikomus "baarit Rovaniemellä" tarvitsee oman sivun, ei ankkurilinkin listaan.
 *
 * 🔴 `city` ON SOPIMUS `Bar.city`:n kanssa — merkkijonon on täsmättävä
 * täsmälleen, myös ä/ö. Sivu väittää otsikossaan "baarit kaupungissa X"
 * 12 kielellä, joten väärä arvo ei ole lajitteluvirhe vaan julkaistu väite.
 *
 * 🔴 Alaraja on NELJÄ baaria (sama kuin diningissä). ÄLÄ laske sitä: kolmen
 * kortin sivu 12 kielellä on ohutta sisältöä, joka syö crawl-budjettia eikä
 * vastaa kenenkään hakuun. Kaupunki, joka jää alle, näkyy /bars-listalla
 * omana ankkurinaan.
 *
 * 12.9.2026: Ylläs (3→16) ja Saariselkä (2→14) ylittivät rajan, ja mukaan
 * tulivat Ruka (13), Luosto (7), Pyhä (6), Iso-Syöte (5) ja Salla (4).
 * Kaksi ensimmäistä olivat tässä tiedostossa aiemmin nimenomaan esimerkkeinä
 * siitä, mitä alaraja pitää ulkona — nyt ne ovat esimerkki siitä, että raja
 * ylitetään datalla eikä poikkeuksella.
 */
export interface BarCity {
  /** URL-pala: /city/{slug}. Sama slug kuin laplanddining + laplandnightlife,
   *  jotta sisarsivustojen kaupunkisivut linkittyvät ristiin 1:1. */
  slug: string;
  /** TÄSMÄLLEEN sama merkkijono kuin `Bar.city`. */
  city: string;
  /** Näyttönimi (EN-perusta; lokalisoidaan pages.json `cities.{slug}.name`). */
  name: string;
  /**
   * Sivun hero + og:image. VALINNAINEN.
   *
   * 🔴 Vesa 12.9.2026: seitsemälle uudelle kaupungille ei ole omaa kuvaa, ja
   * yhteinen varakuva olisi näyttänyt saman baarin seitsemän kylän herona.
   * Ilman kuvaa hero on pelkkä tumma pohja — sama ratkaisu kuin korttien
   * kuvattomassa kehyksessä (`VenuePhoto`). Älä lisää `?? BARS.heroMain`.
   */
  img?: string;
  /** Sitemapin prioriteetti. */
  priority: number;
  /** Sembo/Trip.com-haun paikkakunta (Ylläs = Äkäslompolo koko verkostossa). */
  stayQuery: string;
  /**
   * Onko sisarsivustolla saman slugin kaupunkisivu. MITATTU 12.9.2026
   * `curl`illa, ei arvattu: 8 neljästätoista uudesta osoitteesta oli 404.
   * Kuollut ristiinlinkki on huonompi kuin puuttuva linkki, joten sivu
   * näyttää vain ne jotka vastaavat 200.
   */
  sisters: { dining: boolean; nightlife: boolean };
}

export const BAR_CITIES: BarCity[] = [
  { slug: 'rovaniemi', city: 'Rovaniemi',  name: 'Rovaniemi',  img: BARS.whiskyBar,    priority: 0.8, stayQuery: 'Rovaniemi, Finland',     sisters: { dining: true,  nightlife: true  } },
  { slug: 'levi',      city: 'Levi',       name: 'Levi',       img: BARS.apresSkiLevi, priority: 0.8, stayQuery: 'Levi, Finland',          sisters: { dining: true,  nightlife: true  } },
  // Lisätty 12.9.2026, kun bars.ts kasvoi 27:stä 84 kohteeseen. Jokainen
  // ylittää neljän kohteen alarajan; kohdemäärä suluissa.
  { slug: 'yllas',      city: 'Ylläs',      name: 'Ylläs',      priority: 0.7, stayQuery: 'Äkäslompolo, Finland', sisters: { dining: true,  nightlife: true  } }, // 16
  { slug: 'saariselka', city: 'Saariselkä', name: 'Saariselkä', priority: 0.7, stayQuery: 'Saariselkä, Finland',  sisters: { dining: true,  nightlife: true  } }, // 14
  { slug: 'ruka',       city: 'Ruka',       name: 'Ruka',       priority: 0.7, stayQuery: 'Ruka, Finland',        sisters: { dining: false, nightlife: true  } }, // 13
  { slug: 'luosto',     city: 'Luosto',     name: 'Luosto',     priority: 0.7, stayQuery: 'Luosto, Finland',      sisters: { dining: true,  nightlife: false } }, // 7
  { slug: 'pyha',       city: 'Pyhä',       name: 'Pyhä',       priority: 0.7, stayQuery: 'Pyhätunturi, Finland', sisters: { dining: false, nightlife: false } }, // 6
  { slug: 'iso-syote',  city: 'Iso-Syöte',  name: 'Iso-Syöte',  priority: 0.7, stayQuery: 'Syöte, Finland',       sisters: { dining: false, nightlife: false } }, // 5
  { slug: 'salla',      city: 'Salla',      name: 'Salla',      priority: 0.7, stayQuery: 'Salla, Finland',       sisters: { dining: false, nightlife: true  } }, // 4
];

/**
 * Kohteet, jotka EIVÄT ole Lapissa. Vain nämä saavat alue-merkinnän nimensä
 * viereen; Lapin kohteilla ei ole merkkiä, koska koko sivusto on Lapin opas.
 *
 * Vesa 12.9.2026: *"erotellaan vaan ruka koillismaaksi jälleen."* Ruka on
 * Kuusamossa (Koillismaa) ja Iso-Syöte Pudasjärvellä (Syöte) — molemmat
 * Pohjois-Pohjanmaata. Ilman merkintää sivu väittäisi ne Lapiksi.
 *
 * 🔴 Nimet ovat erisnimiä eikä niitä käännetä: "Koillismaa" on sama kaikilla
 * 12 kielellä (verkostossa 494 esiintymää).
 */
export const CITY_REGION: Record<string, string> = {
  Ruka: 'Koillismaa',
  'Iso-Syöte': 'Syöte',
};

/** Alue-merkintä tai undefined, jos kohde on Lapissa. */
export function regionFor(city: string): string | undefined {
  return CITY_REGION[city];
}

/** Alaraja omalle kaupunkisivulle. Ks. tiedoston yläkommentti. */
export const MIN_BARS_FOR_CITY_PAGE = 4;

const BY_SLUG = new Map(BAR_CITIES.map((c) => [c.slug, c]));
const BY_CITY = new Map(BAR_CITIES.map((c) => [c.city, c]));

export function cityBySlug(slug: string | undefined): BarCity | undefined {
  return slug ? BY_SLUG.get(slug) : undefined;
}

/** Kaupunkisivun slug kaupungin nimelle — /bars-listan ja etusivun ristiinlinkitykseen. */
export function slugForCity(city: string): string | undefined {
  return BY_CITY.get(city)?.slug;
}

export function barsForCity(city: string): Bar[] {
  return bars.filter((b) => b.city === city);
}

/**
 * Sisarsivustojen kaupunkisivut samalla slugilla — mitattu 11.9.2026:
 * laplanddining.com/city/{rovaniemi,levi}/ ja laplandnightlife.com/city/{…}/
 * vastaavat 200 sekä ilman etuliitettä että /fi/-etuliitteellä.
 */
export const SISTER_CITY_URLS = {
  dining: (slug: string, prefix: string) => `https://laplanddining.com${prefix}/city/${slug}/`,
  nightlife: (slug: string, prefix: string) => `https://laplandnightlife.com${prefix}/city/${slug}/`,
};
