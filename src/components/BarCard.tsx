import { MapPin, Clock, ExternalLink, Ticket, Calendar, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { pickLocalised, type Bar } from '../data/bars';
import type { Locale } from '../i18n/config';
import MenuLink from './MenuLink';
import VenueRating, { findRating } from './VenueRating';
import { gygDeepLink } from '../lib/gyg';
import { withReferral } from '../lib/withReferral';

/**
 * Baarikortti. Yksi lähde kahdelle pinnalle: /bars ja /city/{slug}.
 *
 * Ilme diningin mallisivun mukaan (Vesa hyväksyi 7.9.2026): `.lv-card` =
 * iso pyöristys, terävä lähivarjo + kaksi pehmeää, ohut rengas. Kuva 192/224 px
 * (oli 160). Lohkot ovat SAMASSA järjestyksessä joka kortissa: nimi, tyyppi,
 * kuvaus, kohokohdat, osoite/aukiolo/hinta, mahdollinen kierros, linkit.
 * Osoite, aukiolo ja hinta renderöityvät aina, koska data on jokaisella baarilla.
 *
 * Arviopilleri on LINKKI Googlen arvosteluihin, kuvan kulmassa kuten
 * diningissä. Sen kosketusalue on 44 px VenueRating-komponentin sisällä.
 *
 * Kortti EI venytetä rivin korkuiseksi (ruudukossa `items-start`). Mitattu
 * livenä 11.9.2026: `mt-auto`-tietolohko jätti Nook Loungen korttiin noin
 * 150 px tyhjää, koska saman rivin Lapland Brewery kantoi panimokierroslaatikon.
 * Ragged alareuna on parempi kuin reikä kortin keskellä.
 */
export interface BarCardProps {
  bar: Bar;
  image: string;
  locale: Locale;
  /** utm_campaign-etuliite, esim. bars_directory tai bars_city_rovaniemi. */
  campaign: string;
}

export default function BarCard({ bar, image, locale, campaign }: BarCardProps) {
  const { t } = useTranslation('pages');
  const type = t(`bars.venues.${bar.name}.type`, { defaultValue: bar.type });
  const description = t(`bars.venues.${bar.name}.description`, { defaultValue: bar.description });
  const highlights = (t(`bars.venues.${bar.name}.highlights`, { returnObjects: true, defaultValue: bar.highlights }) as string[]) || bar.highlights;
  const tourLabel = bar.tour ? t(`bars.venues.${bar.name}.tour.label`, { defaultValue: bar.tour.label }) : '';
  const tourSchedule = bar.tour ? t(`bars.venues.${bar.name}.tour.schedule`, { defaultValue: bar.tour.schedule }) : '';
  const tourHint = bar.tour && bar.tour.hint ? t(`bars.venues.${bar.name}.tour.hint`, { defaultValue: bar.tour.hint }) : '';
  const directLabel = bar.tour && bar.tour.directBookingLabel
    ? t(`bars.venues.${bar.name}.tour.directLabel`, { defaultValue: bar.tour.directBookingLabel })
    : t('bars.bookDirect');
  const rating = findRating(bar.name);
  const cardClass = `lv-card lv-card-hover group overflow-hidden flex flex-col${bar.featured ? ' lv-card-featured' : ''}`;

  return (
    <article className={cardClass}>
      {/* Kuva */}
      <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
        <img
          src={image}
          alt={bar.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
        {bar.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-amber text-night text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-md">
            {t('bars.featuredBadge')}
          </span>
        )}
        <span className="absolute top-3 right-3 z-10">
          <VenueRating name={bar.name} lang={locale} />
        </span>
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <h3 className="font-heading text-2xl text-white tracking-wide leading-tight group-hover:text-amber transition-colors">
          {bar.name}
        </h3>
        <p className="text-[11px] text-amber/85 font-semibold uppercase tracking-[0.18em] mt-1 mb-3">{type}</p>
        <p className="text-[15px] text-white/80 leading-relaxed mb-4">{description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-xs bg-amber/10 text-amber/85 border border-amber/15 px-2.5 py-1 rounded-full">
              {h}
            </span>
          ))}
        </div>

        {/* Osoite, aukiolo, hinta: aina, koska data on jokaisella */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-start gap-2">
            <MapPin size={13} className="text-amber/70 mt-0.5 shrink-0" />
            <p className="text-[13px] text-white/70 leading-relaxed">{bar.address}</p>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={13} className="text-amber/70 mt-0.5 shrink-0" />
            <p className="text-[13px] text-white/70 leading-relaxed">{pickLocalised(bar.hours, locale)}</p>
          </div>
          <p className="text-[13px] text-amber/80 font-medium pt-1">{pickLocalised(bar.price, locale)}</p>
        </div>

        {/* Varattava kierros: vain todennettu data */}
        {bar.tour && (
          <div className="mt-5 p-4 bg-amber/[0.08] border border-amber/25 rounded-2xl">
            <div className="flex items-center gap-1.5 text-amber text-[10px] font-bold uppercase tracking-widest mb-2">
              <Ticket size={11} />
              {tourLabel}
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-sm text-white font-semibold leading-tight">
                {t(`bars.venues.${bar.name}.tour.priceFrom`, { defaultValue: bar.tour.priceFrom })}
              </p>
              <div className="flex items-start gap-1.5 text-xs text-white/80 leading-snug">
                <Calendar size={11} className="text-amber/70 mt-0.5 shrink-0" />
                <span>{tourSchedule}</span>
              </div>
              {tourHint && <p className="text-[11px] text-white/65 leading-snug">{tourHint}</p>}
            </div>
            {bar.tour.gygProductPath ? (
              <a
                href={gygDeepLink(bar.tour.gygProductPath, bar.tour.sid, locale)}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="inline-flex items-center justify-center gap-1.5 w-full min-h-[44px] bg-amber hover:bg-amber/90 text-night px-3 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
              >
                <Ticket size={12} />
                {t('bars.checkBook')}
              </a>
            ) : bar.tour.directBookingUrl ? (
              <a
                href={withReferral(bar.tour.directBookingUrl, `${campaign}_tour`)}
                target="_blank"
                rel="nofollow noopener"
                className="inline-flex items-center justify-center gap-1.5 w-full min-h-[44px] bg-amber hover:bg-amber/90 text-night px-3 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
              >
                <Ticket size={12} />
                {directLabel}
              </a>
            ) : null}
          </div>
        )}

        {/* Linkit: ruokalista ennen verkkosivua (ihminen etsii listaa, ei
            etusivua) ja Googlen kartta viimeisenä. Kosketusalue 44 px
            läpinäkyvällä paddingilla, teksti pysyy 12 px:ssä. */}
        <div className="mt-4 -mb-2 flex flex-wrap items-center gap-x-4 gap-y-0">
          <MenuLink
            bar={bar}
            label={t('bars.venueMenu')}
            labelPdf={t('bars.venueMenuPdf')}
            campaign={`${campaign}_menu`}
            className="py-2.5 text-xs font-semibold uppercase tracking-wider text-amber/90 hover:text-amber"
          />
          {bar.website && (
            <a
              href={withReferral(bar.website, campaign)}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white no-underline transition-colors"
            >
              {t('bars.venueWebsite')} <ExternalLink size={11} />
            </a>
          )}
          {rating?.mapsUri && (
            <a
              href={rating.mapsUri}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white no-underline transition-colors"
            >
              <Map size={11} /> {t('bars.venueMap')}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
