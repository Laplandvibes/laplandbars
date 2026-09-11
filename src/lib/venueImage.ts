import registry from '../data/generated/venue-images.runtime.json';
import { barSlug } from '../data/bars';
import type { Locale } from '../i18n/config';

/**
 * Kohteen oma kuva korttiin — tai ei mitään.
 *
 * Vesa 11.9.2026 etusivun korteista: *"nää kuvat valehtelee ihan vitusti, ne
 * pitää päivittää laadukkailla kuvilla, jotka aidosti voisi olla tottakin"*.
 * AI-tunnelmakuva nimetyn baarin kortissa väittää esittävänsä sitä baaria.
 *
 * Lähde on `src/data/generated/venue-images.runtime.json`, jonka kirjoittaa
 * `scripts/fetch-venue-images.mjs` kohteiden OMILTA sivuilta (og:image tai
 * käsin valittu `_venue-images.overrides.json`). Google Place Photos -kuvia ei
 * tallenneta (Places-ehdot; dining poisti ne 9.8.2026). Täysi rekisteri
 * hylkäyssyineen on `venue-images.json`; runtime-tiedostossa on vain
 * hyväksytyt rivit ja vain kortin tarvitsemat kentät, jotta lähde-URL:t ja
 * muistiinpanot eivät päädy JS-nippuun.
 *
 * 🔴 Runtime-tiedostoon pääsee vain rivi, joka on overrides-tiedoston
 * `approved`-listalla. Hyväksyntä tehdään katsomalla kontaktiarkki
 * (`scripts/_venue-images-sheet.mjs`) — portin läpäisy ei ole hyväksyntä,
 * koska og:image voi olla logo, maskotti tai ruoka-annos (kaikki kolme sattuivat).
 *
 * Kortti ilman hyväksyttyä kuvaa näyttää AI-kuvituksen ja merkitsee sen
 * "Kuvituskuva" (12 kieltä, samat merkkijonot kuin laplanddiningissa), jotta
 * kortti ei väitä esittävänsä juuri tätä paikkaa. Kohteen oma kuva merkitään
 * "Kuva: <domain>" (Vesan ohje 9.8.2026: pienellä kuvan alareunaan).
 */
type Row = { src?: string; credit?: string; sourceUrl?: string; width?: number; height?: number };
const REG = registry as Record<string, Row>;

export interface VenuePhoto {
  src: string;
  /** Lähdesivuston domain ilman www:tä, esim. "selvapyy.fi". */
  credit: string;
  sourceUrl: string;
  width: number;
  height: number;
}

export function venuePhoto(name: string): VenuePhoto | null {
  const r = REG[barSlug(name)];
  if (!r || !r.src || !r.credit || !r.sourceUrl || !r.width || !r.height) return null;
  return { src: r.src, credit: r.credit, sourceUrl: r.sourceUrl, width: r.width, height: r.height };
}

const ILLUSTRATION_LABEL: Record<Locale, string> = {
  en: 'Illustration',
  fi: 'Kuvituskuva',
  de: 'Symbolbild',
  ja: 'イメージ画像',
  es: 'Imagen ilustrativa',
  'pt-BR': 'Imagem ilustrativa',
  'zh-CN': '示意图',
  ko: '이미지 사진',
  fr: "Image d'illustration",
  it: 'Immagine illustrativa',
  nl: 'Illustratiebeeld',
  sv: 'Illustrationsbild',
};

const PHOTO_BY: Record<Locale, string> = {
  en: 'Photo', fi: 'Kuva', de: 'Foto', ja: '写真', es: 'Foto', 'pt-BR': 'Foto',
  'zh-CN': '图片', ko: '사진', fr: 'Photo', it: 'Foto', nl: 'Foto', sv: 'Foto',
};

/** Kuvan alareunan merkintä: "Kuva: selvapyy.fi" tai "Kuvituskuva". */
export function photoCaption(name: string, locale: Locale): string {
  const p = venuePhoto(name);
  return p ? `${PHOTO_BY[locale]}: ${p.credit}` : ILLUSTRATION_LABEL[locale];
}

/** Montako kohdetta näyttää oman kuvansa — mittarille ja testeille. */
export function venuePhotoCoverage(names: string[]): { withPhoto: number; total: number } {
  return { withPhoto: names.filter((n) => venuePhoto(n) !== null).length, total: names.length };
}
