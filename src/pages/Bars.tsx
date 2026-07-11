import { MapPin, Clock, ExternalLink, Hotel, Ticket, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import { bars, cities, pickLocalised } from '../data/bars';
import { useLocale } from '../i18n/useLocale';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import GygSearchCta from '../components/GygSearchCta';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { gygDeepLink } from '../lib/gyg';

const barImages: Record<string, string> = {
  // Rovaniemi — each unique
  'Lapland Brewery Pub': BARS.breweryInterior,
  'Café & Bar 21': BARS.cocktailTrio,
  'Uitto Pub': BARS.friendsFireplace2,
  'Nook Lounge': BARS.lingonberryCocktails,
  'Bull Bar & Grill': BARS.friendsFireplace,
  'Ice Bar @ Arctic SnowHotel': BARS.iceBarDrinks,
  // Levi — each unique
  'Hullu Poro Areena': BARS.apresSkiTwilight,
  'Bar Ihku': BARS.liveMusic,
  'Pub Hölmölä': BARS.craftBeerGlasses,
  'Pub Sohva': BARS.beerFlight,
  'Bar Alakerta': BARS.skiersApres,
  'Pub Old Mates': BARS.cabinBarInterior,
  // Ylläs — each unique
  'Selvä Pyy': BARS.cabinPubExterior,
  'Pirtukellari Night Club': BARS.apresSkiAerial,
  // Saariselkä — each unique
  'Gastropub Giitu': BARS.breweryTaps,
  'Pirtti Pub & Restaurant': BARS.auroraLounge,
};

const cityImages: Record<string, string> = {
  Rovaniemi: BARS.whiskyBar,
  Levi: BARS.apresSkiLevi,
  Ylläs: BARS.heroNightlife,
  Saariselkä: BARS.heroMain,
};

const cityVibeKey: Record<string, string> = {
  Rovaniemi: 'Rovaniemi',
  Levi: 'Levi',
  Ylläs: 'Yllas',
  Saariselkä: 'Saariselka',
};

export default function Bars() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <PageSeo
        titleKey="bars.title"
        descriptionKey="bars.description"
        path="/bars"
        jsonLd={[
          pillarBreadcrumb('Bars', '/bars'),
          articleSchema(
            'Best Bars & Pubs in Finnish Lapland',
            'City-by-city guide to bars and pubs in Lapland.',
            '/bars'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.pubExterior}
          alt="Lapland bar exterior at night"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('bars.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('bars.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

      {/* Bars by city */}
      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {cities.map((city) => {
            const cityBars = bars.filter((b) => b.city === city);
            const vibeImage = cityImages[city] ?? BARS.heroMain;
            const vibeDesc = t(`bars.cityVibes.${cityVibeKey[city]}`);
            return (
              <div key={city} id={city.toLowerCase().replace(/[^a-z]/g, '')}>
                {/* City header */}
                <div className="relative rounded-2xl overflow-hidden h-48 mb-8">
                  <img
                    src={vibeImage}
                    alt={city}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center px-8">
                    <div className="flex items-center gap-2 text-amber text-sm font-semibold tracking-widest uppercase mb-2">
                      <MapPin size={14} />
                      {city}
                    </div>
                    <h2 className="font-heading text-4xl text-white tracking-wide mb-2">{city}</h2>
                    <p className="text-white/80 text-sm max-w-md leading-relaxed">{vibeDesc}</p>
                  </div>
                </div>

                {/* Bar cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cityBars.map((bar) => {
                    const type = t(`bars.venues.${bar.name}.type`, { defaultValue: bar.type });
                    const description = t(`bars.venues.${bar.name}.description`, { defaultValue: bar.description });
                    const highlights = (t(`bars.venues.${bar.name}.highlights`, { returnObjects: true, defaultValue: bar.highlights }) as string[]) || bar.highlights;
                    const tourLabel = bar.tour ? t(`bars.venues.${bar.name}.tour.label`, { defaultValue: bar.tour.label }) : '';
                    const tourSchedule = bar.tour ? t(`bars.venues.${bar.name}.tour.schedule`, { defaultValue: bar.tour.schedule }) : '';
                    const tourHint = bar.tour && bar.tour.hint ? t(`bars.venues.${bar.name}.tour.hint`, { defaultValue: bar.tour.hint }) : '';
                    const directLabel = bar.tour && bar.tour.directBookingLabel ? t(`bars.venues.${bar.name}.tour.directLabel`, { defaultValue: bar.tour.directBookingLabel }) : t('bars.bookDirect');
                    return (
                      <div
                        key={bar.name}
                        className={`group bg-white/[0.03] border rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber/25 flex flex-col ${
                          bar.featured ? 'border-amber/20 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]' : 'border-white/10'
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden shrink-0">
                          <img
                            src={barImages[bar.name] || BARS.heroMain}
                            alt={bar.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-night/30" />
                          {bar.featured && (
                            <span className="absolute top-3 left-3 text-xs bg-amber/90 text-night px-2.5 py-0.5 rounded-full font-bold">
                              {t('bars.featuredBadge')}
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-heading text-lg text-white tracking-wide mb-1 group-hover:text-amber transition-colors">{bar.name}</h3>
                          <p className="text-xs text-white/80 uppercase tracking-wider mb-3">{type}</p>
                          <p className="text-sm text-white/80 leading-relaxed mb-4">{description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {highlights.slice(0, 3).map((h) => (
                              <span key={h} className="text-xs bg-amber/10 text-amber/70 px-2 py-1 rounded-full">
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* Info block */}
                          <div className="mt-auto space-y-2 pt-4 border-t border-white/5">
                            <div className="flex items-start gap-2">
                              <MapPin size={13} className="text-amber/60 mt-0.5 shrink-0" />
                              <p className="text-xs text-white/65 leading-relaxed">{bar.address}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock size={13} className="text-amber/60 mt-0.5 shrink-0" />
                              <p className="text-xs text-white/65 leading-relaxed">{pickLocalised(bar.hours, locale)}</p>
                            </div>
                            <p className="text-xs text-amber/70 font-medium pt-1">{pickLocalised(bar.price, locale)}</p>
                          </div>

                          {/* Bookable tour / experience — verified data only */}
                          {bar.tour && (
                            <div className="mt-4 p-4 bg-amber/[0.07] border border-amber/25 rounded-xl">
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
                                {tourHint && (
                                  <p className="text-[11px] text-white/65 leading-snug">{tourHint}</p>
                                )}
                              </div>
                              {bar.tour.gygProductPath ? (
                                <a
                                  href={gygDeepLink(bar.tour.gygProductPath, bar.tour.sid)}
                                  target="_blank"
                                  rel="sponsored nofollow noopener"
                                  className="inline-flex items-center justify-center gap-1.5 w-full bg-amber hover:bg-amber/90 text-night px-3 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
                                >
                                  <Ticket size={12} />
                                  {t('bars.checkBook')}
                                </a>
                              ) : bar.tour.directBookingUrl ? (
                                <a
                                  href={bar.tour.directBookingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 w-full bg-amber hover:bg-amber/90 text-night px-3 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
                                >
                                  <Ticket size={12} />
                                  {directLabel}
                                </a>
                              ) : null}
                            </div>
                          )}

                          {/* Secondary venue website link */}
                          {bar.website && (
                            <div className="mt-3 text-right">
                              <a
                                href={bar.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-white/80 hover:text-white/80 no-underline transition-colors"
                              >
                                {t('bars.venueWebsite')} <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Per-city hotel CTA — sleep within walking distance */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber/[0.04] border border-amber/15 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber/15 flex items-center justify-center">
                      <Hotel size={18} className="text-amber" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-snug">
                        {t('bars.stayBand.headline', { city })}
                      </p>
                      <p className="text-white/75 text-xs leading-relaxed mt-0.5">
                        {t('bars.stayBand.sub')}
                      </p>
                    </div>
                  </div>
                  <AffiliateCTA
                    partner="hotels"
                    sid={`bars_city_stay_${city.toLowerCase().replace(/[^a-z]/g, '')}`}
                    destination={`${city}, Lapland, Finland`}
                    className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
                  >
                    {t('bars.stayBand.cta', { city })}
                    <ExternalLink size={14} />
                  </AffiliateCTA>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bookable guided bar/brewery experiences via GetYourGuide (search → live results) */}
      <section className="py-16 bg-night-light/40 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber text-[11px] font-semibold uppercase tracking-widest mb-3">
              <Ticket size={11} />
              {t('experiences.barCrawl.kicker')}
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide text-balance">
              {t('experiences.barCrawl.sectionTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white/[0.03] border border-white/10 hover:border-amber/30 rounded-2xl p-6 transition-all flex flex-col">
              <h3 className="font-heading text-2xl text-white tracking-wide mb-2">{t('experiences.barCrawl.rovaniemi.title')}</h3>
              <p className="text-sm text-white/75 leading-relaxed mb-5 flex-1 text-pretty">{t('experiences.barCrawl.rovaniemi.body')}</p>
              <GygSearchCta query="Rovaniemi brewery bar tour" sid="bars_exp_rovaniemi" className="self-start">
                {t('experiences.barCrawl.rovaniemi.cta')}
              </GygSearchCta>
            </div>
            <div className="bg-white/[0.03] border border-white/10 hover:border-amber/30 rounded-2xl p-6 transition-all flex flex-col">
              <h3 className="font-heading text-2xl text-white tracking-wide mb-2">{t('experiences.barCrawl.levi.title')}</h3>
              <p className="text-sm text-white/75 leading-relaxed mb-5 flex-1 text-pretty">{t('experiences.barCrawl.levi.body')}</p>
              <GygSearchCta query="Levi apres ski bar experience" sid="bars_exp_levi" className="self-start">
                {t('experiences.barCrawl.levi.cta')}
              </GygSearchCta>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/75 text-sm leading-relaxed text-pretty">
            {t('bars.disclaimer')}
          </p>
          <AffiliateDisclosure variant="full" className="mt-6 text-white/45" />
        </div>
      </section>
    </>
  );
}
