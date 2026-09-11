import type { Bar } from '../data/bars';
import ratings from '../data/generated/venue-ratings.json';
import maps from '../data/generated/venues-from-maps.json';
import { venuePhoto } from './venueImage';

/**
 * Schema.org `BarOrPub` yhdelle baarille, ItemListiin /bars- ja /city/-sivuille.
 *
 * Kaikki kentät tulevat datasta: osoite bars.ts:stä, arvio ja arviomäärä
 * Googlen synkatusta venue-ratings.jsonista, koordinaatti venues-from-maps
 * .jsonista (verify-venues.mjs). Jos jotain ei ole, kenttä jää pois — mitään
 * ei täydennetä arvaamalla. Sama periaate kuin laplanddiningin ItemListissä.
 */
type RatingRow = { name: string; matched: boolean; rating?: number; reviewCount?: number; mapsUri?: string | null; address?: string };
type MapsFile = { venues: Record<string, { location?: { latitude: number; longitude: number }; address?: string }> };

const ROWS = ratings as RatingRow[];
const VENUES = (maps as MapsFile).venues;

export function barSchema(bar: Bar, origin = 'https://laplandbars.com') {
  const rating = ROWS.find((r) => r.name === bar.name && r.matched && typeof r.rating === 'number');
  const loc = VENUES[bar.name]?.location;
  const [street, postal] = splitAddress(bar.address);
  // Vain kohteen oma, hyväksytty kuva — AI-kuvitusta ei ilmoiteta hakukoneelle kohteen kuvaksi.
  const photo = venuePhoto(bar.name);
  return {
    '@type': 'BarOrPub',
    name: bar.name,
    ...(bar.website ? { url: bar.website } : {}),
    ...(photo ? { image: `${origin}${photo.src}` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      ...(postal ? { postalCode: postal } : {}),
      addressLocality: bar.city,
      addressRegion: 'Lapland',
      addressCountry: 'FI',
    },
    ...(loc ? { geo: { '@type': 'GeoCoordinates', latitude: loc.latitude, longitude: loc.longitude } } : {}),
    ...(rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.rating,
            reviewCount: rating.reviewCount,
            bestRating: 5,
          },
        }
      : {}),
    ...(rating?.mapsUri ? { hasMap: rating.mapsUri } : {}),
    // Sivu, jolla tämä kortti on — ei kohteen oma sivu.
    subjectOf: { '@type': 'WebPage', url: `${origin}/bars/` },
  };
}

export function barItemList(name: string, list: Bar[], origin = 'https://laplandbars.com') {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: barSchema(b, origin),
    })),
  };
}

/** "Teollisuustie 14 B, 96320 Rovaniemi" → ["Teollisuustie 14 B", "96320"]. */
function splitAddress(address: string): [string, string | null] {
  const m = address.match(/^(.*?),\s*(\d{5})\s+\S+.*$/);
  return m ? [m[1], m[2]] : [address, null];
}
