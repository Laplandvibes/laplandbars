import { MapPin, Clock, ExternalLink, Ticket, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { pickLocalised, type Bar } from '../data/bars';
import type { Locale } from '../i18n/config';
import MenuLink from './MenuLink';
import VenueRating, { findRating } from './VenueRating';
import { gygDeepLink } from '../lib/gyg';
import { withReferral } from '../lib/withReferral';
import VenuePhoto from './VenuePhoto';

/**
 * Baarikortti. Yksi lähde kolmelle pinnalle: /bars, /city/{slug} ja etusivun
 * poiminnat.
 *
 * Vesa 11.9.2026 ensimmäisestä versiosta: *"kaikki ei ole samoissa riveissä
 * firm"*, *"kamalan epätasaista nää laatikot"*, *"arvostelut baarin nimen
 * oikealla puolella samalla rivillä"*. Siksi:
 *
 * 1. Kortti VENYY rivin korkuiseksi (`h-full`, ruudukko oletuksena stretch)
 *    ja jokainen lohko varaa saman tilan kortista riippumatta: otsikkorivi
 *    2 riviä, tyyppi 1, kuvaus tasan 4 riviä (`line-clamp-4` + min-h),
 *    kohokohdat YKSI rivi (toinen rivi leikkautuu pois, ei rivity),
 *    osoite 1 rivi, aukiolo 2 riviä (min-h), hinta 1. Linkit pohjassa
 *    (`mt-auto`). Näin samalla rivillä olevat kortit ovat pikselilleen
 *    yhtä korkeat ja niiden vaakalinjat osuvat kohdakkain.
 * 2. Googlen arvio on otsikkorivillä nimen oikealla puolella, ei kuvassa.
 * 3. Varattava kierros on yksi rivi tietolohkossa + amber-pilleri
 *    linkkirivillä, ei erillinen laatikko, joka teki kahdesta kortista
 *    24:stä puolet korkeampia.
 *
 * Kuvaus leikkautuu neljään riviin kuten diningin kortissa (line-clamp-5
 * siellä); koko teksti on datassa ja hakukoneen prerender-lohkossa.
 */
export interface BarCardProps {
  bar: Bar;
  /** AI-kuvitus, jos kohteelle on valittu sellainen. Jätä pois, kun mitään
   *  totuudenmukaista kuvaa ei ole: kortti piirtää silloin tyyppipaneelin. */
  image?: string;
  locale: Locale;
  /** utm_campaign-etuliite, esim. bars_directory tai bars_city_rovaniemi. */
  campaign: string;
  /** Etusivun poiminta: kaupunki näkyy tyyppirivillä, koska lista on sekakaupunki. */
  showCity?: boolean;
  /** Teemasivun oma tyyppi (esim. /apres-ski: "Live-musiikkiareena"). Oletus: bars.venues.<nimi>.type. */
  typeLabel?: string;
  /** Teemasivun oma kuvaus (esim. /apres-ski kertoo after ski -näkökulman). Oletus: bars.venues.<nimi>.description. */
  description?: string;
  /**
   * Kuvan kulman lätkä. undefined = "Toimituksen poiminta" jos `bar.featured`;
   * merkkijono = tämä teksti (esim. "#1: Levi"); null = ei lätkää.
   */
  badge?: string | null;
}

export default function BarCard({ bar, image, locale, campaign, showCity = false, typeLabel, description: descriptionOverride, badge }: BarCardProps) {
  const { t } = useTranslation('pages');
  const type = typeLabel ?? t(`bars.venues.${bar.name}.type`, { defaultValue: bar.type });
  const description = descriptionOverride ?? t(`bars.venues.${bar.name}.description`, { defaultValue: bar.description });
  const highlights = (t(`bars.venues.${bar.name}.highlights`, { returnObjects: true, defaultValue: bar.highlights }) as string[]) || bar.highlights;
  const tourLabel = bar.tour ? t(`bars.venues.${bar.name}.tour.label`, { defaultValue: bar.tour.label }) : '';
  const tourSchedule = bar.tour ? t(`bars.venues.${bar.name}.tour.schedule`, { defaultValue: bar.tour.schedule }) : '';
  const tourPrice = bar.tour ? t(`bars.venues.${bar.name}.tour.priceFrom`, { defaultValue: bar.tour.priceFrom }) : '';
  const directLabel = bar.tour && bar.tour.directBookingLabel
    ? t(`bars.venues.${bar.name}.tour.directLabel`, { defaultValue: bar.tour.directBookingLabel })
    : t('bars.bookDirect');
  const rating = findRating(bar.name);
  const badgeText = badge === undefined ? (bar.featured ? t('bars.featuredBadge') : null) : badge;
  const cardClass = `bar-card bar-card-hover group overflow-hidden flex flex-col h-full${badgeText ? ' bar-card-featured' : ''}`;

  const tourHref = bar.tour?.gygProductPath
    ? gygDeepLink(bar.tour.gygProductPath, bar.tour.sid, locale)
    : bar.tour?.directBookingUrl
      ? withReferral(bar.tour.directBookingUrl, `${campaign}_tour`)
      : null;
  const tourRel = bar.tour?.gygProductPath ? 'sponsored nofollow noopener' : 'nofollow noopener';
  const tourCta = bar.tour?.gygProductPath ? t('bars.checkBook') : directLabel;

  return (
    <article className={cardClass}>
      {/* Kuva: kiinteä korkeus, poimintamerkki vasemmassa yläkulmassa ja
          lähdemerkintä oikeassa alakulmassa ("Kuva: selvapyy.fi" / "Kuvituskuva").
          Vesa 18.10.2026: *"onko kuvaruutu sitten ihan vähän liian pieni?"* — 16:10 oli
          kortin korkeudesta kolmannes. 4:3 antaa kuvalle 20 % lisää korkeutta. */}
      <VenuePhoto name={bar.name} fallback={image} alt={bar.name} locale={locale} panelLabel={type} className="aspect-[4/3] shrink-0" panelClassName="aspect-[5/2] sm:aspect-[4/3] shrink-0" hoverZoom>
        {badgeText && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-amber text-night text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-md">
            {badgeText}
          </span>
        )}
      </VenuePhoto>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Otsikkorivi: nimi vasemmalla, Googlen arvio oikealla. Varaa aina
            kahden rivin tilan, jotta pitkä nimi ei siirrä alempia lohkoja. */}
        <div className="flex items-start justify-between gap-3 min-h-[3.75rem]">
          <h3 translate="no" className="font-heading text-2xl text-white tracking-wide leading-[1.15] line-clamp-2 group-hover:text-amber transition-colors">
            {bar.name}
          </h3>
          <span className="shrink-0 pt-0.5">
            <VenueRating name={bar.name} lang={locale} />
          </span>
        </div>
        <p className="text-xs text-amber font-semibold uppercase tracking-[0.16em] mt-1 mb-3 line-clamp-1">
          {showCity ? `${bar.city} · ${type}` : type}
        </p>
        <p className="text-[15px] text-white/85 leading-relaxed line-clamp-4 min-h-[6.1rem] mb-4">{description}</p>

        {/* Kohokohdat: yksi rivi, ylivuoto leikataan (ei rivitystä) */}
        <div className="flex flex-wrap gap-2 h-7 overflow-hidden mb-5">
          {highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-xs bg-amber/10 text-amber/85 border border-amber/15 px-2.5 py-1 rounded-full whitespace-nowrap leading-none inline-flex items-center h-7">
              {h}
            </span>
          ))}
        </div>

        {/* Osoite, aukiolo, hinta: aina samat rivit samassa järjestyksessä */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-amber/80 mt-1 shrink-0" />
            <p className="text-sm text-white/80 leading-relaxed line-clamp-1">
              {bar.addressLine ? pickLocalised(bar.addressLine, locale) : bar.address}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-amber/80 mt-1 shrink-0" />
            <p className="text-sm text-white/80 leading-relaxed line-clamp-2 min-h-[2.85rem]">{pickLocalised(bar.hours, locale)}</p>
          </div>
          <p className="text-sm text-amber font-medium pt-1 line-clamp-1">{pickLocalised(bar.price, locale)}</p>
          {bar.tour && (
            <div className="flex items-start gap-2">
              <Ticket size={14} className="text-amber/80 mt-1 shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                {tourLabel}: {tourSchedule}, {tourPrice}
              </p>
            </div>
          )}
        </div>

        {/* Linkit pohjassa: ruokalista, verkkosivu, kartta, ja kierroksen
            varaus amber-pillerinä. Kosketusalue 44 px, teksti 13 px (18.10.2026, oli 12). */}
        <div className="mt-auto pt-4 -mb-2 flex flex-wrap items-center gap-x-4 gap-y-0">
          <MenuLink
            bar={bar}
            label={t('bars.venueMenu')}
            labelPdf={t('bars.venueMenuPdf')}
            campaign={`${campaign}_menu`}
            className="py-2.5 text-[13px] font-semibold uppercase tracking-wider text-amber hover:text-amber/80"
          />
          {bar.website && (
            <a
              href={withReferral(bar.website, campaign)}
              target="_blank"
              rel="nofollow noopener"
              className="lv-tap inline-flex items-center gap-1 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-white/80 hover:text-white no-underline transition-colors"
            >
              {t('bars.venueWebsite')} <ExternalLink size={11} />
            </a>
          )}
          {rating?.mapsUri && (
            <a
              href={rating.mapsUri}
              target="_blank"
              rel="nofollow noopener"
              className="lv-tap inline-flex items-center gap-1 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-white/80 hover:text-white no-underline transition-colors"
            >
              <Map size={11} /> {t('bars.venueMap')}
            </a>
          )}
          {tourHref && (
            <a
              href={tourHref}
              target="_blank"
              rel={tourRel}
              className="ml-auto inline-flex items-center gap-1.5 min-h-[44px] lg:min-h-[36px] my-1 bg-amber hover:bg-amber/90 text-night px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
            >
              <Ticket size={12} />
              {tourCta}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
