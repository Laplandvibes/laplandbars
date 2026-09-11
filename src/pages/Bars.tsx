import { useState } from 'react';
import { MapPin, ExternalLink, Hotel, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import { bars, cities, iceBars } from '../data/bars';
import { slugForCity } from '../data/barCities';
import { useLocale } from '../i18n/useLocale';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import GygSearchCta from '../components/GygSearchCta';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import BarCard from '../components/BarCard';
import RelatedSites from '../components/RelatedSites';
import { barItemList } from '../lib/barSchema';

/**
 * Korttikuvat: jokaisella baarilla oma kuva. Ilman tätä yhdeksän korttia putosi
 * samaan hero-kuvaan (auditti 11.6.2026). Kuvat ovat AI-kuvituksia baarin
 * tunnelmasta, eivät kohteen omia kuvia.
 */
export const barImages: Record<string, string> = {
  // Rovaniemi
  'Lapland Brewery': BARS.breweryInterior,
  'Café & Bar 21': BARS.cocktailTrio,
  'Uitto Pub': BARS.friendsFireplace2,
  'Nook Lounge': BARS.lingonberryCocktails,
  'Bull Bar & Grill': BARS.friendsFireplace,
  'Ice Bar @ Arctic SnowHotel': BARS.iceBarDrinks,
  'Kauppayhtiö': BARS.pubLaughter,
  'Rovaniemen Oluthuone': BARS.terraceLonkero,
  'MustaKissa Kuppila': BARS.cocktailBerry,
  'Pub Sarvi': BARS.saunaBeer,
  'Roy Club': BARS.apresDanceDeck,
  // Levi
  'Hullu Poro Areena': BARS.apresSkiTwilight,
  'Bar Ihku': BARS.liveMusic,
  'Pub Hölmölä': BARS.craftBeerGlasses,
  'Public House Sohva': BARS.beerFlight,
  'Bar Alakerta': BARS.skiersApres,
  'Pub Old Mates': BARS.cabinBarInterior,
  "V'inkkari": BARS.apresToast,
  'Restaurant Tuikku': BARS.auroraVillage,
  // Ylläs
  'Selvä Pyy': BARS.cabinPubExterior,
  'Pirtukellari Night Club': BARS.apresSkiAerial,
  'Bar Kaappi': BARS.lonkeroDrink,
  // Saariselkä
  'Gastropub Giitu': BARS.breweryTaps,
  'Teerenpesä': BARS.snowyVillageStreet,
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

export const cityAnchor = (city: string) => city.toLowerCase().replace(/[^a-z]/g, '');

export default function Bars() {
  const { t } = useTranslation('pages');
  const { locale, to } = useLocale();
  const [active, setActive] = useState<string | null>(null);

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
          barItemList('Bars and pubs in Finnish Lapland', bars),
        ]}
      />
      {/* Hero: pb varaa tilan alle limittyvälle lukupalkille */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pb-24 md:pb-28">
        <img
          src={BARS.heroBarsNight}
          alt="Friends walking through snow toward a warmly lit log pub under a starry Lapland night sky"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Keskikohdan 0.42 päästi valaistut mökin ikkunat läpi juuri ingressin
            kohdalla (auditti 4.8.). 0.62 pitää tekstin luettavana. */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.62) 50%, rgba(15,23,42,0.30) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('bars.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('bars.hero.sub')}
          </p>
        </div>
      </section>

      {/* Lukupalkki: lasilaatat heron päällä, luvut datasta */}
      <div className="relative z-10 -mt-14 md:-mt-16 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { value: bars.length, label: t('home.destinations.statVenues') },
            { value: cities.length, label: t('home.destinations.statDestinations') },
            { value: iceBars.length, label: t('home.destinations.statIceBars') },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-white/10 bg-night/85 backdrop-blur-md p-4 md:p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            >
              <p className="font-heading text-4xl md:text-5xl text-amber tracking-wide">{s.value}</p>
              <p className="text-white/65 text-xs md:text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-8 bg-transparent" aria-hidden="true" />
      <PageBreadcrumb />

      {/* Paikkakuntavalitsin: kiinnittyy navin alle (top-16), jotta kaupungin
          voi vaihtaa listan keskeltäkin. Ankkurit säilyvät, koska etusivu
          linkittää /bars#levi -muotoon. Puhelimessa 44 px kosketusalue, työ-
          pöydällä 36 px (sama sääntö kuin diningin suodattimessa 7.9.). */}
      <nav
        aria-label={t('bars.cityNav.label')}
        className="sm:sticky sm:top-16 z-30 bg-night/95 backdrop-blur-md border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Puhelimessa 2 saraketta ja kaikki neljä nakyvissa (ei vieritysrivia
              eika kiinnitysta: kaksi 44 px rivia + navi olisi viidennes ruudusta).
              sm+ kiinnittyy navin alle yhtena rivina. */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-2.5">
            <span className="hidden sm:inline text-white/55 text-[11px] font-semibold tracking-widest uppercase mr-1">
              {t('bars.cityNav.label')}
            </span>
            {cities.map((city) => {
              const isActive = active === city;
              return (
                <a
                  key={city}
                  href={`#${cityAnchor(city)}`}
                  onClick={() => setActive(city)}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2 min-h-[44px] sm:min-h-[36px] rounded-full text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-amber text-night shadow-lg shadow-amber/20'
                      : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border border-white/[0.08]'
                  }`}
                >
                  <MapPin size={13} className={isActive ? 'text-night' : 'text-amber'} />
                  {city}
                  <span className={`text-[11px] rounded-full px-1.5 py-0.5 leading-none ${isActive ? 'bg-night/15 text-night' : 'bg-amber/10 text-amber/80'}`}>
                    {bars.filter((b) => b.city === city).length}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Baarit kaupungeittain */}
      <section className="lv-depth py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-24">
          {cities.map((city) => {
            const cityBars = bars.filter((b) => b.city === city);
            const vibeImage = cityImages[city] ?? BARS.heroMain;
            const vibeDesc = t(`bars.cityVibes.${cityVibeKey[city]}`);
            const slug = slugForCity(city);
            const at = slug ? t(`cities.${slug}.at`, { defaultValue: city }) : city;
            return (
              <div key={city} id={cityAnchor(city)} className="scroll-mt-36">
                {/* Kaupungin otsikkokortti */}
                <div className="lv-card relative overflow-hidden h-56 sm:h-60 mb-10">
                  <img
                    src={vibeImage}
                    alt={city}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/75 to-night/20" />
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
                    <div className="flex items-center gap-2 text-amber text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
                      <MapPin size={13} />
                      {t('cities.shared.kicker', { defaultValue: 'Where to drink' })}
                    </div>
                    <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-2">{city}</h2>
                    <p className="text-white/85 text-sm sm:text-[15px] max-w-lg leading-relaxed">{vibeDesc}</p>
                    {slug && (
                      <Link
                        to={to(`/city/${slug}`)}
                        className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-amber/15 border border-amber/40 px-4 py-2 min-h-[44px] sm:min-h-[36px] text-amber text-sm font-bold hover:bg-amber/25 transition-colors no-underline"
                      >
                        {t('cities.shared.cityPageCta', { name: city, at, defaultValue: `${city} bar guide →` })}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Baarikortit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
                  {cityBars.map((bar) => (
                    <BarCard
                      key={bar.name}
                      bar={bar}
                      image={barImages[bar.name] || BARS.heroMain}
                      locale={locale}
                      campaign="bars_directory"
                    />
                  ))}
                </div>

                {/* Majoitus kävelymatkan päässä */}
                <div className="lv-card mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-amber/15 flex items-center justify-center">
                      <Hotel size={18} className="text-amber" />
                    </div>
                    <div>
                      <p className="text-white text-[15px] font-semibold leading-snug">
                        {t('bars.stayBand.headline', { city })}
                      </p>
                      <p className="text-white/70 text-xs leading-relaxed mt-0.5">
                        {t('bars.stayBand.sub')}
                      </p>
                    </div>
                  </div>
                  <AffiliateCTA
                    partner="hotels"
                    sid={`bars_city_stay_${cityAnchor(city)}`}
                    destination={`${city === 'Ylläs' ? 'Äkäslompolo' : city}, Finland`}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-amber hover:bg-amber/90 text-night px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
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

      {/* Opastetut illat GetYourGuiden kautta (haku → elävät tulokset) */}
      <section className="py-16 bg-night border-t border-white/5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="lv-card lv-card-hover p-7 flex flex-col">
              <h3 className="font-heading text-2xl text-white tracking-wide mb-2">{t('experiences.barCrawl.rovaniemi.title')}</h3>
              <p className="text-sm text-white/75 leading-relaxed mb-5 flex-1 text-pretty">{t('experiences.barCrawl.rovaniemi.body')}</p>
              <GygSearchCta query="Rovaniemi brewery bar tour" sid="bars_exp_rovaniemi" className="self-start">
                {t('experiences.barCrawl.rovaniemi.cta')}
              </GygSearchCta>
            </div>
            <div className="lv-card lv-card-hover p-7 flex flex-col">
              <h3 className="font-heading text-2xl text-white tracking-wide mb-2">{t('experiences.barCrawl.levi.title')}</h3>
              <p className="text-sm text-white/75 leading-relaxed mb-5 flex-1 text-pretty">{t('experiences.barCrawl.levi.body')}</p>
              <GygSearchCta query="Levi apres ski bar experience" sid="bars_exp_levi" className="self-start">
                {t('experiences.barCrawl.levi.cta')}
              </GygSearchCta>
            </div>
          </div>
        </div>
      </section>

      <RelatedSites />

      {/* Vastuulauseke */}
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
