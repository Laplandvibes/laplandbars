import type { ReactNode } from 'react';
import { venuePhoto, photoCaption } from '../lib/venueImage';
import type { Locale } from '../i18n/config';

/**
 * Kohteen kuva ja sen lähdemerkintä — yksi komponentti joka pinnalle.
 *
 * Vesa 11.9.2026: *"nää kuvat valehtelee ihan vitusti, ne pitää päivittää
 * laadukkailla kuvilla, jotka aidosti voisi olla tottakin"*, ja 12.9. kun
 * korjaus oli tehty vain baarikortteihin: *"ei kyllä livenä ole noi uudet
 * kuvat?"* — hän katsoi teemasivua, jonka kuvat olivat yhä AI-tunnelmaa.
 *
 * 🔴 Siksi tämä on komponentti eikä kopioitu lohko: jokainen pinta, joka
 * näyttää nimetyn paikan kuvan, käyttää tätä, ja merkintä tulee mukana. Jos
 * kohteella ei ole hyväksyttyä omaa kuvaa, näytetään `fallback` ja merkintä
 * on "Kuvituskuva" (12 kieltä) — kortti ei silloin väitä esittävänsä paikkaa.
 *
 * Nykyiset pinnat: BarCard (/bars, /city, etusivu), IceBars, CraftBeer.
 */
export interface VenuePhotoProps {
  /** Kohteen nimi täsmälleen kuten bars.ts:ssä — rekisterin avain. */
  name: string;
  /** Näytetään kun kohteella ei ole hyväksyttyä omaa kuvaa. */
  fallback: string;
  alt: string;
  locale: Locale;
  /** Ulkokehyksen luokat, esim. "h-48 sm:h-56 shrink-0". */
  className?: string;
  /** Tumma liuku kuvan päälle; anna '' jos ei haluta. */
  scrim?: string;
  /** Kortin hover-zoomi (vaatii vanhemmalta `group`-luokan). */
  hoverZoom?: boolean;
  /** Kuvan päälle asetettavat merkit, esim. poimintalätkä. */
  children?: ReactNode;
}

export default function VenuePhoto({
  name, fallback, alt, locale, className = '', scrim = 'bg-gradient-to-t from-night/70 via-night/10 to-transparent', hoverZoom = false, children,
}: VenuePhotoProps) {
  const photo = venuePhoto(name);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={photo?.src ?? fallback}
        alt={alt}
        {...(photo ? { width: photo.width, height: photo.height } : {})}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover${hoverZoom ? ' group-hover:scale-105 transition-transform duration-700' : ''}`}
      />
      {scrim && <div className={`absolute inset-0 ${scrim}`} />}
      {children}
      <span className="absolute bottom-0 right-0 z-10 px-2 py-[3px] rounded-tl-md bg-night/70 backdrop-blur-[2px] text-white/70 text-[9px] leading-none tracking-wide pointer-events-none">
        {photoCaption(name, locale)}
      </span>
    </div>
  );
}
