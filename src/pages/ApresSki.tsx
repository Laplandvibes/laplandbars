import { Hotel, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BARS, CARDS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import BarCard from '../components/BarCard';
import { bars } from '../data/bars';
import { useLocale } from '../i18n/useLocale';
import ImageMark, { photoAlt } from '../components/PhotoCredit';

// Hotel search query + sid per resort (for the lodging partner via go.laplandvibes.com)
// Single-part place names only ("X, Finland") — "X, Lapland, Finland" can hit
// a HOTEL in Sembo's autosuggest. Ylläs searches use the main village
// Äkäslompolo (13 Sembo properties vs 3 on the bare "Ylläs" polygon).
const resortStays: Record<string, { query: string; sid: string; hintKey: string }> = {
  Levi: { query: 'Levi, Finland', sid: 'apres_stay_levi', hintKey: 'Levi' },
  'Ylläs': { query: 'Äkäslompolo, Finland', sid: 'apres_stay_yllas', hintKey: 'Yllas' },
  'Saariselkä': { query: 'Saariselkä, Finland', sid: 'apres_stay_saariselka', hintKey: 'Saariselka' },
  'Pyhä': { query: 'Pyhä, Finland', sid: 'apres_stay_pyha', hintKey: 'Pyha' },
  Ruka: { query: 'Ruka, Finland', sid: 'apres_stay_ruka', hintKey: 'Ruka' },
  Salla: { query: 'Salla, Finland', sid: 'apres_stay_salla', hintKey: 'Salla' },
  Luosto: { query: 'Luosto, Finland', sid: 'apres_stay_luosto', hintKey: 'Luosto' },
  'Iso-Syöte': { query: 'Syöte, Finland', sid: 'apres_stay_isosyote', hintKey: 'IsoSyote' },
};

/** Après-ski-paikat ovat kaikki bars.ts:ssä (osoite, aukiolo, hinta, verkkosivu). */
const BAR_BY_NAME = new Map(bars.map((b) => [b.name, b]));

type ResortMeta = {
  resort: string;
  slug: string;
  /** Naytetaan nimen vieressa vain kun kohde EI ole Lapissa. */
  region?: string;
  venues: { name: string; highlight: boolean }[];
};

const spotsMeta: ResortMeta[] = [
  {
    resort: 'Levi',
    slug: 'levi',
    venues: [
      { name: 'Hullu Poro Areena', highlight: true },
      { name: 'Bar Ihku', highlight: false },
      { name: 'Bar Alakerta', highlight: false },
      { name: 'Pub Hölmölä', highlight: false },
    ],
  },
  {
    resort: 'Ylläs',
    slug: 'yllas',
    venues: [
      { name: 'Selvä Pyy', highlight: true },
      { name: 'Pirtukellari Night Club', highlight: false },
    ],
  },
  {
    resort: 'Pyhä',
    slug: 'pyha',
    venues: [
      { name: 'Hanki Baari Pyhä', highlight: true },
      { name: 'Mesta', highlight: false },
      { name: 'Pyhä Dreams Wine Bar', highlight: false },
      { name: 'CAMP Kitchen & Bar PYHÄ', highlight: false },
      { name: 'Restaurant Huttuhippu', highlight: false },
      { name: 'Sport Bar Pyhä', highlight: false },
    ],
  },
  {
    resort: 'Luosto',
    slug: 'luosto',
    venues: [
      { name: 'Rumpu Bar (Rumpubaari)', highlight: true },
      { name: 'Nightclub Karhu', highlight: false },
    ],
  },
  {
    resort: 'Salla',
    slug: 'salla',
    venues: [
      { name: 'Keloravintola', highlight: true },
      { name: 'Papana Pupi', highlight: false },
    ],
  },
  {
    resort: 'Saariselkä',
    slug: 'saariselka',
    venues: [
      { name: 'Restaurant Pirtti', highlight: true },
    ],
  },
  {
    resort: 'Ruka',
    slug: 'ruka',
    region: 'Koillismaa',
    venues: [
      { name: 'Bar Ihku Ruka', highlight: true },
      { name: 'Ravintola Zone', highlight: false },
      { name: 'Restaurant Colorado Ruka', highlight: false },
      { name: 'Hanki Baari', highlight: false },
      { name: 'Rinneravintola Piste', highlight: false },
      { name: 'Lobby Bar Scandic Rukahovi', highlight: false },
    ],
  },
  {
    resort: 'Iso-Syöte',
    slug: 'iso-syote',
    region: 'Syöte',
    venues: [
      { name: 'Pärjä Ski Bistro', highlight: true },
      { name: 'TunturiPUB', highlight: false },
    ],
  },
];

type Pillar = { title: string; body: string };

export default function ApresSki() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const pillars = (t('apresSki.pillars', { returnObjects: true }) as Pillar[]) || [];
  return (
    <>
      <PageSeo
        titleKey="apresSki.title"
        descriptionKey="apresSki.description"
        path="/apres-ski"
        jsonLd={[
          pillarBreadcrumb('Après-Ski', '/apres-ski'),
          {
            '@type': 'ItemList',
            name: 'Après-ski venues in Finnish Lapland',
            numberOfItems: spotsMeta.reduce((n, r) => n + r.venues.length, 0),
            itemListElement: spotsMeta.flatMap((r) =>
              r.venues.map((v) => ({
                '@type': 'ListItem',
                name: v.name,
                item: { '@type': 'BarOrPub', name: v.name, address: { '@type': 'PostalAddress', addressLocality: r.resort, addressCountry: 'FI' } },
              })),
            ).map((x, i) => ({ ...x, position: i + 1 })),
          },
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
          alt={photoAlt(BARS.heroApres, 'Après-ski bar in Lapland')}
          className="absolute inset-0 w-full h-full object-cover"
          /* Vesa 18.10.2026: *"kuvaa voisi nostaa jolloin rinnettä näkyy vähemmän ja itse baari näkyisi"*.
             Jääbaari (liput, sisäänkäynti) on kuvan alaneljänneksellä; keskikohdistus näytti rinteen. */
          style={{ objectPosition: 'center 85%' }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {/* 18.10.2026 (Vesa: "ei oikein mitään fiilistä herätä"): tasainen 0,56–0,88-peite peitti koko
            kuvan. Nyt tummennus on soikiona tekstin takana ja reunat jäävät kirkkaiksi; alareuna liukuu
            murupolun väriin. Après-skin kuvassa ingressin alla on paljasta lunta: heroteksti-portti mittasi
            0,64-keskellä 3,6–4,2:1, joten tällä sivulla keskikohta 0,74. */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse 78% 72% at 50% 52%, rgba(15,23,42,0.74) 0%, rgba(15,23,42,0.52) 55%, rgba(15,23,42,0.2) 100%), linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 28%)' }} />
        {/* 4.10.2026: valokuva (lumi, jää, valo) on kirkkaampi kuin entinen tekoälykuva: heroteksti-portti
            mittasi ingressin 2,0–3,2:1. Keskikaista 0,42 → 0,68 (valkoinen teksti ≥ 4,5:1 valkoisenkin kohdan päällä). */}
        {/* Puhelimella ingressi täyttää koko leveyden: lisäpeite (heroteksti-portti 375 px, 4.10.2026). */}
        <div className="absolute inset-0 bg-night/25 sm:hidden pointer-events-none" aria-hidden="true" />
        <ImageMark src={BARS.heroApres} />
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

      {/* Mika Lapin apres-skissa on toisin.
          Vesa 12.9.2026: *"tama alku taalla on todella poor"* ja syyksi
          "tyhjat ikonilaatikot" + "ei kuvia". Kolme pyoreaa laatikkoa ikonilla
          oli sama vikaluokka kuin diningin KPI-laatat. Nyt sama teksti (12
          kielta, ei uutta kaannettavaa) on numeroituna editoriaalina kuten
          juomakulttuurin luvuissa, ja rinnalla on kuva. Samalla poistui
          alempi kahden AI-kuvan kollaasi: saanto
          `_claude/feedback_ei_geneerista_ai_ulkoasua.md` kieltaa ihmisia
          esittavien AI-kuvien kollaasit. */}
      <section className="py-16 bg-night">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 lg:gap-16 items-start">
            <ol className="min-w-0 max-w-[58ch] space-y-8">
              {pillars.map((p, i) => (
                <li key={p.title} className="flex gap-5 sm:gap-6">
                  <span className="font-heading text-4xl sm:text-5xl text-amber leading-none w-12 shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-2">{p.title}</h2>
                    <p className="text-[17px] text-white/80 leading-[1.7]">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="order-first lg:order-none lg:sticky lg:top-24 mx-auto max-w-[380px] lg:max-w-none w-full">
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 aspect-[16/10]">
                <img
                  src={CARDS.apresToast}
                  alt={photoAlt(CARDS.apresToast, 'Après-ski by the slopes')}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <ImageMark src={CARDS.apresToast} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venues by resort */}
      <section className="bar-depth pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Kohdevalitsin: sivu on pitka (8 kohdetta, 25 paikkaa), joten
              lukija paasee suoraan omaan hiihtokeskukseensa. Ei uutta
              kaannettavaa: nimet ja luvut ovat sellaisinaan. */}
          <nav aria-label={t('apresSki.hero.title')} className="mb-14 -mt-2">
            <ul className="flex flex-wrap gap-2.5">
              {spotsMeta.map((r) => (
                <li key={r.slug}>
                  <a
                    href={`#${r.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] hover:border-amber/45 hover:bg-amber/10 px-4 min-h-[40px] text-sm font-semibold text-white/85 hover:text-white no-underline transition-colors"
                  >
                    {r.resort}
                    <span className="text-[11px] font-bold text-amber/80">{r.venues.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Vesa 18.10.2026: *"mikä ihme tämä apres ski teema on ja meininki, aivan paskaa?
              ihan keskeneräinen?"*. Ennen: pieni kuva + jättimäinen hotellinappi + tekstilaatikot
              ilman yhtään linkkiä, eli lukija ei päässyt minnekään muualle kuin majoitukseen.
              Nyt jokainen paikka on sama BarCard kuin /bars-sivulla: oma kuva, aukiolo, osoite,
              hinta ja linkit (ruokalista, verkkosivu, kartta). Kuvaus on after ski -näkökulma
              (apresSki.venues.*, 12 kieltä). Majoitus on otsikkorivin toissijainen nappi. */}
          {spotsMeta.map((resort) => {
            const stay = resortStays[resort.resort];
            return (
              <div key={resort.resort} id={resort.slug} className="scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 mb-8 pb-5 border-b border-white/10">
                  <div className="min-w-0">
                    <div className="flex items-baseline flex-wrap gap-x-4 gap-y-2">
                      <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide">{resort.resort}</h2>
                      {resort.region && (
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-ice/85 border border-ice/25 rounded-full px-2.5 py-1">
                          {resort.region}
                        </span>
                      )}
                    </div>
                    {stay && (
                      <p className="mt-2 text-[15px] text-white/80 leading-relaxed max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 text-amber text-xs font-semibold uppercase tracking-widest mr-2 align-[1px]">
                          <Hotel size={12} />
                          {t('apresSki.stayKicker', { resort: resort.resort })}
                        </span>
                        {t(`apresSki.stayHints.${stay.hintKey}`)}
                      </p>
                    )}
                  </div>
                  {stay && (
                    <AffiliateCTA
                      partner="hotels"
                      sid={stay.sid}
                      destination={stay.query}
                      className="shrink-0 self-start md:self-auto inline-flex items-center justify-center gap-2 border border-amber/55 text-amber hover:bg-amber hover:text-night px-5 min-h-[44px] rounded-full font-semibold text-sm transition-colors whitespace-nowrap no-underline"
                    >
                      {t('apresSki.findHotel')}
                      <ExternalLink size={14} />
                    </AffiliateCTA>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {resort.venues.map((venue) => {
                    const bar = BAR_BY_NAME.get(venue.name);
                    if (!bar) return null;
                    return (
                      <BarCard
                        key={venue.name}
                        bar={bar}
                        locale={locale}
                        campaign={`bars_apres_${resort.slug.replace(/-/g, '_')}`}
                        typeLabel={t(`apresSki.venues.${venue.name}.type`)}
                        description={t(`apresSki.venues.${venue.name}.desc`)}
                        badge={venue.highlight ? t('apresSki.topInResort', { resort: resort.resort }) : null}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Mista apres-skita EI loytynyt. Yhta arvokas tulos kuin loytyneet:
              Olos, Pallas ja Suomu listaavat rinneravintoloita mutta eivat
              yhtaan baaria tai yokerhoa; Kilpisjarvella ei ole rinteita. */}
          <p className="text-sm text-white/55 leading-relaxed border-l-2 border-finland-blue pl-5 max-w-3xl">
            {t('apresSki.notFound')}
          </p>
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
