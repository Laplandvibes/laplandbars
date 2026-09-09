import { Star } from 'lucide-react';
import type { Locale as Lang } from '../i18n/config';
import ratings from '../data/generated/venue-ratings.json';

/**
 * Googlen arvio paikkakortilla.
 *
 * Vesa 8.9.2026: *"google arvioita paikoista ei ole tuotu tänne eikö myöskään bars sivulle?"*. Data tulee
 * `scripts/sync_venue_ratings.mjs`:stä (Places API New, searchText), ei käsin.
 *
 * 🟢 **Täällä osui 23/23**, koska `bars.ts`:ssä on jokaisella katuosoite ja
 * haku tehtiin sillä. Nightlifessa osui vain 32/44 — siellä datassa on pelkkä
 * nimi ja kaupunki. Osoite on halvin tapa tehdä paikkahausta luotettava.
 *
 * 🔴 **Ei chippiä ilman osumaa.** Väärä arvio on keksitty väite nimetystä
 * yrityksestä; puuttuva arvio on vain puuttuva tieto.
 *
 * 🔴 **Kosketusalue 44 px, pilleri 28 px** — sama ratkaisu kuin laplanddiningissa
 * 7.9.: pilleri sisempään spaniin ja `<a>`:lle läpinäkyvä `p-2.5`, jolloin
 * ankkuri yltää iOS:n HIG-minimiin ilman että kortin ilme muuttuu.
 */

type Row = {
  name: string;
  citySlug?: string;
  matched: boolean;
  rating?: number;
  reviewCount?: number;
  mapsUri?: string | null;
  businessStatus?: string | null;
};

const ROWS = ratings as Row[];

/** Lang → BCP-47, jotta luvut muotoutuvat lukijan tavalla (2 394 / 2.394 / 2,394). */
const TAG: Record<Lang, string> = {
  en: 'en-GB', fi: 'fi-FI', de: 'de-DE', ja: 'ja-JP', es: 'es-ES', 'pt-BR': 'pt-BR',
  'zh-CN': 'zh-CN', ko: 'ko-KR', fr: 'fr-FR', it: 'it-IT', nl: 'nl-NL', sv: 'sv-SE',
};

/** Kirjoitettu kunkin kielen omasta rakenteesta, ei suomen käännöksenä. */
const LABEL: Record<Lang, (r: string, n: string) => string> = {
  en: (r, n) => `${r} stars from ${n} Google reviews`,
  fi: (r, n) => `${r} tähteä ${n} Google-arvostelusta`,
  de: (r, n) => `${r} Sterne aus ${n} Google-Bewertungen`,
  ja: (r, n) => `Googleクチコミ${n}件、評価${r}`,
  es: (r, n) => `${r} estrellas de ${n} reseñas de Google`,
  'pt-BR': (r, n) => `${r} estrelas de ${n} avaliações do Google`,
  'zh-CN': (r, n) => `Google 评分 ${r}，共 ${n} 条评价`,
  ko: (r, n) => `구글 리뷰 ${n}개, 평점 ${r}`,
  fr: (r, n) => `${r} étoiles sur ${n} avis Google`,
  it: (r, n) => `${r} stelle su ${n} recensioni Google`,
  nl: (r, n) => `${r} sterren uit ${n} Google-reviews`,
  sv: (r, n) => `${r} stjärnor från ${n} Google-recensioner`,
};

export function findRating(name: string, citySlug?: string) {
  const row = ROWS.find(
    (r) => r.name === name && (!citySlug || !r.citySlug || r.citySlug === citySlug)
  );
  return row?.matched && typeof row.rating === 'number' ? row : null;
}

export default function VenueRating({
  name,
  citySlug,
  lang,
}: {
  name: string;
  citySlug?: string;
  lang: Lang;
}) {
  const row = findRating(name, citySlug);
  if (!row) return null;

  const tag = TAG[lang];
  const rating = row.rating!.toLocaleString(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const count = (row.reviewCount ?? 0).toLocaleString(tag);
  const label = LABEL[lang](rating, count);

  const pill = (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-xs font-medium text-white/90">
      <Star size={12} className="text-amber" fill="currentColor" strokeWidth={0} />
      {rating}
      <span className="text-white/45">·</span>
      <span className="text-white/70">{count}</span>
    </span>
  );

  if (!row.mapsUri) return <span title={label}>{pill}</span>;

  return (
    <a
      href={row.mapsUri}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      className="-m-2.5 p-2.5 inline-flex rounded-full hover:opacity-80 transition-opacity"
    >
      {pill}
    </a>
  );
}
