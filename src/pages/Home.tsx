import { ChevronDown, MapPin, ExternalLink, Snowflake, Music, Beer, Hotel, ArrowUpRight, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BARS, isSummerSeason } from '../data/images';
import { getFeaturedBars, cities, pickLocalised } from '../data/bars';
import PageSeo from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AirportRideAd from '../components/AirportRideAd';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import Newsletter from '../components/Newsletter';
import { useLocale } from '../i18n/useLocale';

const barImages: Record<string, string> = {
  'Lapland Brewery Pub': BARS.breweryInterior,
  'Café & Bar 21': BARS.cocktailTrio,
  'Ice Bar @ Arctic SnowHotel': BARS.iceBarDrinks,
  'Hullu Poro Areena': BARS.apresSkiTwilight,
  'Bar Ihku': BARS.liveMusic,
  'Selvä Pyy': BARS.cabinPubExterior,
  'Gastropub Giitu': BARS.breweryTaps,
};

const categoryCardsMeta = [
  { image: BARS.heroIceBars, to: '/ice-bars', icon: Snowflake },
  { image: BARS.heroApres, to: '/apres-ski', icon: Beer },
  { image: BARS.liveMusic, to: '/bars', icon: Music },
];

const stayCardsMeta = [
  { cityKey: 'Rovaniemi', subKey: 'rovaniemi', sid: 'home_stay_rovaniemi' },
  { cityKey: 'Levi', subKey: 'levi', sid: 'home_stay_levi' },
  { cityKey: 'Ylläs', subKey: 'yllas', sid: 'home_stay_yllas' },
  { cityKey: 'Saariselkä', subKey: 'saariselka', sid: 'home_stay_saariselka' },
];

type CategoryCard = { title: string; desc: string };
type FaqItem = { q: string; a: string };
type RelatedLink = { anchor: string; desc: string; href: string };

export default function Home() {
  const featured = getFeaturedBars();
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const categoryCards = (t('home.categories.cards', { returnObjects: true }) as CategoryCard[]) || [];
  const faqItems = (t('home.faq.items', { returnObjects: true }) as FaqItem[]) || [];
  const relatedLinks = (t('home.related.links', { returnObjects: true }) as RelatedLink[]) || [];

  const faqPageSchema = {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <PageSeo
        titleKey="home.title"
        descriptionKey="home.description"
        path="/"
        jsonLd={[
          {
            '@type': 'WebPage',
            name: 'LaplandBars — Best Bars, Pubs & Ice Bars in Finnish Lapland',
            url: 'https://laplandbars.com/',
            description: 'Definitive guide to bars and nightlife in Finnish Lapland.',
            inLanguage: 'en',
          },
          faqPageSchema,
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={isSummerSeason() ? BARS.heroMainSummer : BARS.heroMain}
          alt="Bar in Finnish Lapland"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/60 to-night/95" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-amber text-sm font-semibold tracking-[0.3em] uppercase mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">{t('home.eyebrow')}</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight mb-6 text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {t('home.hero.headlineLine1')}<br />{t('home.hero.headlineLine2')}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            {isSummerSeason() ? t('home.hero.subSummer') : t('home.hero.sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <AffiliateCTA
              partner="hotels"
              sid="home_hero_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              <Hotel size={20} />
              {t('home.hero.ctaStay')}
            </AffiliateCTA>
            <Link
              to={to('/bars')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/20 no-underline"
            >
              {t('home.hero.ctaBrowse')}
              <ChevronDown size={20} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white/75" />
        </div>
      </section>

      {/* Featured bars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">
              {t('home.featured.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((bar) => {
              const type = t(`bars.venues.${bar.name}.type`, { defaultValue: bar.type });
              const description = t(`bars.venues.${bar.name}.description`, { defaultValue: bar.description });
              const highlights = (t(`bars.venues.${bar.name}.highlights`, { returnObjects: true, defaultValue: bar.highlights }) as string[]) || bar.highlights;
              return (
                <Link
                  key={bar.name}
                  to={to('/bars')}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber/30 transition-all duration-300 flex flex-col no-underline"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden shrink-0">
                    <img
                      src={barImages[bar.name] || BARS.heroMain}
                      alt={bar.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-night/30" />
                    <div className="absolute top-3 left-3 bg-amber/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-night">{pickLocalised(bar.price, locale).split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading text-xl tracking-wide text-white group-hover:text-amber transition-colors mb-1">
                      {bar.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/65 mb-3">
                      <MapPin size={12} className="text-amber shrink-0" />
                      {bar.city}
                      <span className="text-white/75">·</span>
                      <span className="truncate">{type}</span>
                    </div>
                    <p className="text-sm text-white/75 leading-relaxed mb-4 flex-1">
                      {description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {highlights.slice(0, 3).map((h) => (
                        <span key={h} className="text-xs bg-amber/10 text-amber/70 px-2 py-1 rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to={to('/bars')}
              className="inline-flex items-center gap-2 text-amber hover:text-amber/80 font-semibold transition-colors no-underline"
            >
              {t('home.featured.viewAll')}
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('home.categories.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryCardsMeta.map((meta, i) => {
              const Icon = meta.icon;
              const card = categoryCards[i] || { title: '', desc: '' };
              return (
                <Link
                  key={meta.to}
                  to={to(meta.to)}
                  className="group relative rounded-2xl overflow-hidden h-96 no-underline block"
                >
                  <img
                    src={meta.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <div className="w-12 h-12 bg-amber/20 rounded-xl flex items-center justify-center mb-3">
                      <Icon size={24} className="text-amber" />
                    </div>
                    <h3 className="font-heading text-2xl text-white tracking-wide mb-2">{card.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* By city */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-night overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-[120px] animate-[aurora-drift_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ice/5 rounded-full blur-[100px] animate-[aurora-drift_14s_ease-in-out_infinite_reverse]" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
            {t('home.destinations.title')}
          </h2>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-12">
            {t('home.destinations.sub')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, i) => (
              <Link
                key={city}
                to={to(`/bars#${city.toLowerCase().replace(/[^a-z]/g, '')}`)}
                className="group px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-amber/10 hover:border-amber/40 hover:text-amber hover:scale-105 transition-all duration-300 font-medium no-underline"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MapPin size={14} className="inline mr-2 -mt-0.5 group-hover:text-amber transition-colors" />
                {city}
              </Link>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-12 text-center">
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">16</p>
              <p className="text-white/65 text-sm mt-1">{t('home.destinations.statVenues')}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">4</p>
              <p className="text-white/65 text-sm mt-1">{t('home.destinations.statDestinations')}</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">3</p>
              <p className="text-white/65 text-sm mt-1">{t('home.destinations.statIceBars')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter — pink gradient section, only non-dark surface on the page */}
      <Newsletter />

      {/* Stay near the action — lodging-first affiliate band */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night-light/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-semibold tracking-widest uppercase mb-4">
              <Hotel size={12} />
              {t('home.stayBand.kicker')}
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('home.stayBand.title')}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {t('home.stayBand.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stayCardsMeta.map((d) => (
              <AffiliateCTA
                key={d.cityKey}
                partner="hotels"
                sid={d.sid}
                destination={`${d.cityKey}, Lapland, Finland`}
                className="group bg-white/[0.03] border border-white/10 hover:border-amber/40 rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.05] no-underline flex flex-col"
              >
                <div className="flex items-center gap-2 text-amber/80 group-hover:text-amber text-xs uppercase tracking-widest mb-3 transition-colors">
                  <MapPin size={12} />
                  {d.cityKey}
                </div>
                <h3 className="font-heading text-2xl text-white tracking-wide mb-1.5 group-hover:text-amber transition-colors">
                  {t('home.stayBand.cardCtaLabel', { city: d.cityKey })}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed mb-4 flex-1">{t(`home.stayBand.subs.${d.subKey}`)}</p>
                <div className="flex items-center gap-1.5 text-amber text-sm font-semibold">
                  {t('home.stayBand.browseCta')}
                  <ExternalLink size={14} />
                </div>
              </AffiliateCTA>
            ))}
          </div>

          <p className="text-white/80 text-xs text-center mt-8 max-w-2xl mx-auto leading-relaxed">
            {t('home.stayBand.disclaimer')}
          </p>
        </div>
      </section>

      {/* Getting home — Welcome Pickups airport/ride ad (advertiser-brand-skinned) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-semibold tracking-widest uppercase mb-4">
              <Car size={12} />
              {t('rideBand.kicker')}
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-3 text-balance">
              {t('rideBand.title')}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto text-pretty">
              {t('rideBand.sub')}
            </p>
          </div>
          <AirportRideAd sid="home_safe_ride_home" />
        </div>
      </section>

      {/* FAQ — visible Q&A, mirrored by FAQPage JSON-LD in PageSeo above */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('home.faq.title')}
            </h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">
              {t('home.faq.sub')}
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((f) => (
              <details
                key={f.q}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl px-5 sm:px-6 py-4 open:border-amber/30 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-heading text-xl sm:text-2xl text-white tracking-wide group-open:text-amber transition-colors">
                  {f.q}
                  <ChevronDown size={20} className="shrink-0 text-amber transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="text-white/80 leading-relaxed mt-3">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related sites — contextual sibling links across the LaplandVibes network */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night/95 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-amber font-bold mb-3">{t('home.related.eyebrow')}</p>
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              {t('home.related.title')}
            </h2>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">
              {t('home.related.sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="group bg-white/[0.03] border border-white/10 hover:border-amber/40 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-0.5 no-underline flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-heading text-2xl text-white tracking-wide group-hover:text-amber transition-colors">
                    {link.anchor}
                  </h3>
                  <ArrowUpRight size={20} className="shrink-0 text-amber/70 group-hover:text-amber transition-colors" />
                </div>
                <p className="text-sm text-white/75 leading-relaxed">{link.desc}</p>
              </a>
            ))}
          </div>

          <AffiliateDisclosure variant="full" className="mt-12 text-white/45 max-w-2xl mx-auto" />
        </div>
      </section>
    </>
  );
}
