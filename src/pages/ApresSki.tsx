import { Mountain, Music, Beer, Hotel, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { useLocale } from '../i18n/useLocale';

// Hotel search query + sid per resort (for the lodging partner via go.laplandvibes.com)
// Single-part place names only ("X, Finland") — "X, Lapland, Finland" can hit
// a HOTEL in Sembo's autosuggest. Ylläs searches use the main village
// Äkäslompolo (13 Sembo properties vs 3 on the bare "Ylläs" polygon).
const resortStays: Record<string, { query: string; sid: string; hintKey: string }> = {
  Levi: { query: 'Levi, Finland', sid: 'apres_stay_levi', hintKey: 'Levi' },
  'Ylläs': { query: 'Äkäslompolo, Finland', sid: 'apres_stay_yllas', hintKey: 'Yllas' },
  'Saariselkä': { query: 'Saariselkä, Finland', sid: 'apres_stay_saariselka', hintKey: 'Saariselka' },
  'Pyhä': { query: 'Pyhä, Finland', sid: 'apres_stay_pyha', hintKey: 'Pyha' },
};

const spotsMeta = [
  {
    resort: 'Levi',
    image: BARS.apresSkiLevi,
    venues: [
      { name: 'Hullu Poro Areena', highlight: true },
      { name: 'Bar Ihku', highlight: false },
      { name: 'Bar Alakerta', highlight: false },
      { name: 'Pub Hölmölä', highlight: false },
    ],
  },
  {
    resort: 'Ylläs',
    // Oma kuva: BARS.heroApres on tämän sivun hero, eli sama kuva olisi
    // näkynyt kahdesti.
    image: BARS.apresSkiTerrace,
    venues: [
      { name: 'Selvä Pyy', highlight: true },
      { name: 'Pirtukellari Night Club', highlight: false },
    ],
  },
];

type Pillar = { title: string; body: string };

export default function ApresSki() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  const pillarIcons = [Mountain, Music, Beer];
  const pillars = (t('apresSki.pillars', { returnObjects: true }) as Pillar[]) || [];
  return (
    <>
      <PageSeo
        titleKey="apresSki.title"
        descriptionKey="apresSki.description"
        path="/apres-ski"
        jsonLd={[
          pillarBreadcrumb('Après-Ski', '/apres-ski'),
          articleSchema(
            'Après-Ski Bars in Lapland',
            'After-ski drinking, dancing and live music across Lapland resorts.',
            '/apres-ski'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.heroApres}
          alt="Après-ski bar in Lapland"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('apresSki.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('apresSki.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

      {/* What makes Lapland après-ski different */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {pillars.map((p, i) => {
              const Icon = pillarIcons[i] ?? Mountain;
              return (
                <div key={p.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-amber" />
                  </div>
                  <h3 className="font-heading text-lg text-white tracking-wide mb-2">{p.title}</h3>
                  <p className="text-sm text-white/75 leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Atmosphere collage — deck party energy + the toast */}
      <section className="pb-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 sm:col-span-3">
              <img src={BARS.apresDanceDeck} alt="Skiers dancing with drinks raised at an outdoor après-ski deck party at twilight" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 sm:col-span-2">
              <img src={BARS.apresToast} alt="Beer mugs clinking in a toast in ski gloves against the low winter sun" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Venues by resort */}
      <section className="pb-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {spotsMeta.map((resort) => (
            <div key={resort.resort}>
              <div className="relative rounded-2xl overflow-hidden h-44 mb-8">
                <img src={resort.image} alt={resort.resort} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/60 to-transparent" />
                <div className="absolute inset-0 flex items-center px-8">
                  <h2 className="font-heading text-4xl text-white tracking-wide">{resort.resort}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {resort.venues.map((venue) => {
                  const type = t(`apresSki.venues.${venue.name}.type`);
                  const desc = t(`apresSki.venues.${venue.name}.desc`);
                  return (
                    <div
                      key={venue.name}
                      className={`bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 hover:border-amber/20 ${
                        venue.highlight ? 'border-amber/20' : 'border-white/10'
                      }`}
                    >
                      {venue.highlight && (
                        <span className="inline-block text-xs bg-amber/15 text-amber px-2 py-0.5 rounded-full mb-3 font-medium">
                          {t('apresSki.topInResort', { resort: resort.resort })}
                        </span>
                      )}
                      <h3 className="font-heading text-xl text-white tracking-wide mb-1">{venue.name}</h3>
                      <p className="text-xs text-white/65 uppercase tracking-wider mb-3">{type}</p>
                      <p className="text-sm text-white/80 leading-relaxed">{desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Per-resort lodging CTA */}
              {resortStays[resort.resort] && (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber/[0.05] border border-amber/15 rounded-xl p-5">
                  <div>
                    <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Hotel size={11} />
                      {t('apresSki.stayKicker', { resort: resort.resort })}
                    </p>
                    <p className="text-white/65 text-sm leading-relaxed">{t(`apresSki.stayHints.${resortStays[resort.resort].hintKey}`)}</p>
                  </div>
                  <AffiliateCTA
                    partner="hotels"
                    sid={resortStays[resort.resort].sid}
                    destination={resortStays[resort.resort].query}
                    className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
                  >
                    {t('apresSki.findHotel')}
                    <ExternalLink size={14} />
                  </AffiliateCTA>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Resort coverage band — Saariselkä + Pyhä get hotel CTAs even though they're not in the venues data yet */}
      <section className="pb-12 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber/[0.05] via-night/0 to-ice/[0.05] border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-2">
                {t('apresSki.north.title')}
              </h3>
              <p className="text-white/80 text-sm max-w-xl mx-auto">
                {t('apresSki.north.sub')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <AffiliateCTA
                partner="hotels"
                sid="apres_band_saariselka"
                destination="Saariselkä, Finland"
                className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all no-underline"
              >
                <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> {t('apresSki.north.saariselka')}</span>
                <ExternalLink size={13} className="text-white/75" />
              </AffiliateCTA>
              <AffiliateCTA
                partner="hotels"
                sid="apres_band_pyha"
                destination="Pyhä, Finland"
                className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all no-underline"
              >
                <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> {t('apresSki.north.pyha')}</span>
                <ExternalLink size={13} className="text-white/75" />
              </AffiliateCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Getting home after the resort night — Welcome Pickups (advertiser-brand-skinned) */}
      <section className="py-14 bg-night">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-4 text-balance">{t('apresSki.cta.title')}</h2>
          <p className="text-white/75 mb-8 text-pretty">{t('apresSki.cta.sub')}</p>
          <Link
            to={to('/bars')}
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
          >
            {t('apresSki.cta.btn')}
          </Link>
          <AffiliateDisclosure variant="full" className="mt-10 text-white/45" />
        </div>
      </section>
    </>
  );
}
