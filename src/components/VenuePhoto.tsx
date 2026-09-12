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
  /**
   * Näytetään kun kohteella ei ole hyväksyttyä omaa kuvaa. Jätä pois, jos
   * mitään totuudenmukaista kuvaa ei ole: silloin piirretään `panelLabel`in
   * mukainen paneeli eikä lainata toisen paikan tunnelmaa.
   */
  fallback?: string;
  /**
   * Teksti kuvattomaan paneeliin, esim. kohteen tyyppi ("Rinnebaari").
   *
   * 🔴 Vesa 12.9.2026: 62 uutta kohdetta, joista 40:llä ei ole omaa kuvaa.
   * Sama AI-varakuva 40 kortissa lukisi rikkinäisenä, ja jokaiselle keksitty
   * kuva valehtelisi. Paneeli pitää rivien korkeudet samoina eikä väitä
   * mitään: se kertoo mikä paikka on, ei miltä se näyttää.
   */
  panelLabel?: string;
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
  name, fallback, alt, locale, className = '', scrim = 'bg-gradient-to-t from-night/70 via-night/10 to-transparent', hoverZoom = false, panelLabel, children,
}: VenuePhotoProps) {
  const photo = venuePhoto(name);

  // Ei omaa kuvaa eikä kuvitusta ⇒ verkoston sanamerkki. Ei kuvaa on
  // rehellisempi kuin väärä kuva, ja kehyksen korkeus säilyy niin että rivi
  // pysyy tasaisena.
  //
  // 🔴 Ensimmäinen versio latoi paneeliin kohteen TYYPIN, mutta kortti kertoo
  // tyypin jo amber-rivillä otsikon alla: ruudulla luki "NIGHT CLUB" kahdesti
  // kolmen kortin rivissä (mitattu 12.9.2026). Sanamerkki on sama ratkaisu,
  // jonka Vesa valitsi sisarsivustokorteille 12.9.: verkoston oma kuvakieli
  // valokuvan sijaan. Liukuvärin kohta arvotaan nimestä, jottei viiden
  // paneelin sarake näytä renderöintivirheeltä.
  if (!photo && !fallback) {
    let h = 0;
    for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 997;
    const x = 12 + (h % 5) * 19;
    const y = (h % 3) * 22;
    return (
      <div className={`relative overflow-hidden bg-night-light/45 ${className}`} title={panelLabel || undefined}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `radial-gradient(115% 95% at ${x}% ${y}%, rgba(245,158,11,0.13) 0%, rgba(15,23,42,0) 62%)` }}
        />
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-heading text-3xl sm:text-4xl tracking-wide select-none">
          <span className="text-vibe-pink/25">#</span>
          <span className="text-white/[0.13]">LAPLAND</span>
          <span className="text-vibe-pink/25">BARS</span>
        </span>
        {children}
      </div>
    );
  }

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
