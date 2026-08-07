import { Flame, Snowflake, Beer, Wine, Star, Hotel, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { useLocale } from '../i18n/useLocale';

type PriceRow = { label: string; value: string };

export default function DrinkingCulture() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  const intro = (t('drinkingCulture.intro', { returnObjects: true }) as string[]) || [];
  const kossuBody = (t('drinkingCulture.kossu.body', { returnObjects: true }) as string[]) || [];
  const finlandiaBody = (t('drinkingCulture.finlandia.body', { returnObjects: true }) as string[]) || [];
  const lapinKultaBody = (t('drinkingCulture.lapinKulta.body', { returnObjects: true }) as string[]) || [];
  const lonkeroBody = (t('drinkingCulture.lonkero.body', { returnObjects: true }) as string[]) || [];
  const lonkeroBrandFacts = (t('drinkingCulture.lonkero.brand.facts', { returnObjects: true }) as string[]) || [];
  const kalsariBody = (t('drinkingCulture.kalsarikannit.body', { returnObjects: true }) as string[]) || [];
  const saunaBody = (t('drinkingCulture.sauna.body', { returnObjects: true }) as string[]) || [];
  const priceRows = (t('drinkingCulture.lapinKulta.prices', { returnObjects: true }) as PriceRow[]) || [];
  const kalsariRules = (t('drinkingCulture.kalsarikannit.rules', { returnObjects: true }) as string[]) || [];
  return (
    <>
      <PageSeo
        titleKey="drinkingCulture.title"
        descriptionKey="drinkingCulture.description"
        path="/drinking-culture"
        jsonLd={[
          pillarBreadcrumb('Drinking Culture', '/drinking-culture'),
          articleSchema(
            'Finnish Drinking Culture in Lapland',
            'How Finns actually drink: context for visitors.',
            '/drinking-culture'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.heroNightlife}
          alt="Cosy Finnish pub with fireplace"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('drinkingCulture.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('drinkingCulture.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

      {/* Intro */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 text-white/80 leading-relaxed">
            {intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Life & laughter collage */}
      <section className="pb-16 bg-night">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80">
              <img src={BARS.pubLaughter} alt="Friends laughing over beers in a cozy Lapland log pub" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80">
              <img src={BARS.terraceLonkero} alt="Friends toasting with long drinks on a summer terrace under the midnight sun" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Koskenkorva */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Flame size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                {t('drinkingCulture.kossu.title')}
              </h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              {kossuBody.map((p, i) => <p key={i}>{p}</p>)}
              <div className="bg-white/[0.03] border border-amber/15 rounded-2xl p-5">
                <p className="text-sm text-white/75">
                  <span className="text-amber font-medium">{t('drinkingCulture.kossu.factsLabel')}</span>{' '}
                  {t('drinkingCulture.kossu.facts')}
                </p>
              </div>
            </div>
          </div>

          {/* Finlandia Vodka */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Snowflake size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                {t('drinkingCulture.finlandia.title')}
              </h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              {finlandiaBody.map((p, i) => <p key={i}>{p}</p>)}
              <div className="bg-white/[0.03] border border-amber/15 rounded-2xl p-5">
                <p className="text-sm text-white/75">
                  <span className="text-amber font-medium">{t('drinkingCulture.finlandia.factsLabel')}</span>{' '}
                  {t('drinkingCulture.finlandia.facts')}
                </p>
              </div>
            </div>
          </div>

          {/* Lapin Kulta */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Star size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                {t('drinkingCulture.lapinKulta.title')}
              </h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              {lapinKultaBody.map((p, i) => <p key={i}>{p}</p>)}
              <div className="bg-amber/[0.05] border border-amber/20 rounded-2xl p-6">
                <p className="font-heading text-xl text-amber tracking-wide mb-4">
                  {t('drinkingCulture.lapinKulta.priceTitle')}
                </p>
                <div className="space-y-3 text-sm text-white/80">
                  {priceRows.map((row, i) => (
                    <div key={i} className={`flex justify-between items-center ${i < priceRows.length - 1 ? 'border-b border-white/5 pb-2' : ''}`}>
                      {/* Hinta ei saa rivittyä irti nimikkeestään: 375 px:ssä
                          "Koff Porter / erikoisuus (0,33 l, Alko)" työnsi "Alko)"
                          ja yksinäisen "€"-merkin omille riveilleen (auditti 4.8.). */}
                      <span className="min-w-0 pr-3">{row.label}</span>
                      <span className="text-amber font-medium whitespace-nowrap shrink-0">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-4">
                  {t('drinkingCulture.lapinKulta.priceFootnote')}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-amber/15 rounded-2xl p-5">
                <p className="text-sm text-white/75">
                  <span className="text-amber font-medium">{t('drinkingCulture.lapinKulta.otherLabel')}</span>{' '}
                  {t('drinkingCulture.lapinKulta.other')}
                </p>
              </div>
            </div>
          </div>

          {/* Lonkero */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Beer size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                {t('drinkingCulture.lonkero.title')}
              </h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              {lonkeroBody.map((p, i) => <p key={i}>{p}</p>)}

              {/* Hartwall Original Long Drink — the drink that started the category */}
              <div className="bg-amber/[0.05] border border-amber/20 rounded-2xl overflow-hidden !mt-6">
                {/* Lead: the poured long drink */}
                <div className="relative h-56 sm:h-72">
                  <img
                    src={BARS.lonkeroDrink}
                    alt="Sparkling grapefruit long drink in a tall glass with ice and a grapefruit wheel on a dark bar counter"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
                </div>

                {/* The iconic can + the facts */}
                <div className="p-6 grid grid-cols-[112px_1fr] sm:grid-cols-[140px_1fr] gap-5 sm:gap-6 items-start">
                  <figure className="m-0">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/25">
                      <img
                        src={BARS.lonkeroCan}
                        alt="Hartwall Original Long Drink, the iconic blue gin & grapefruit can, 5.5%"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <figcaption className="mt-1.5 text-[9px] leading-snug text-white/35">
                      Hartwall Original Long Drink ·{' '}
                      <a
                        href="https://commons.wikimedia.org/wiki/File:Hartwall_Original_Long_Drink.png"
                        target="_blank"
                        rel="noopener nofollow"
                        className="underline hover:text-white/55"
                      >
                        ComradeUranium / Wikimedia Commons
                      </a>{' '}
                      ·{' '}
                      <a
                        href="https://creativecommons.org/licenses/by-sa/4.0/"
                        target="_blank"
                        rel="noopener nofollow"
                        className="underline hover:text-white/55"
                      >
                        CC BY-SA 4.0
                      </a>
                    </figcaption>
                  </figure>

                  <div>
                    <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-1.5">
                      {t('drinkingCulture.lonkero.brand.kicker')}
                    </p>
                    <p className="font-heading text-2xl text-white tracking-wide mb-4">
                      {t('drinkingCulture.lonkero.brand.title')}
                    </p>
                    <ul className="space-y-2">
                      {lonkeroBrandFacts.map((fact, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-white/80 leading-relaxed">
                          <Star size={13} className="text-amber mt-1 shrink-0" />
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kalsarikännit */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Wine size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                {t('drinkingCulture.kalsarikannit.title')}
              </h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              {kalsariBody.map((p, i) => <p key={i}>{p}</p>)}
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 !mt-6">
                <img src={BARS.kalsarikannitSofa} alt="Kalsarikännit: relaxing at home on the sofa with a beer, snow falling outside" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
              </div>
              <div className="bg-amber/[0.05] border border-amber/20 rounded-2xl p-6">
                <p className="font-heading text-xl text-amber tracking-wide mb-3">
                  {t('drinkingCulture.kalsarikannit.rulesTitle')}
                </p>
                <ol className="space-y-2 text-sm text-white/80">
                  {kalsariRules.map((rule, i) => <li key={i}>{rule}</li>)}
                </ol>
              </div>
            </div>
          </div>

          {/* Sauna drinking */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Flame size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                {t('drinkingCulture.sauna.title')}
              </h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              {saunaBody.map((p, i) => <p key={i}>{p}</p>)}
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 !mt-6">
                <img src={BARS.saunaBeer} alt="Cooling off on the sauna porch with a cold beer at dusk" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-4">
            {t('drinkingCulture.cta.title')}
          </h2>
          <p className="text-white/75 mb-8 leading-relaxed">
            {t('drinkingCulture.cta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <AffiliateCTA
              partner="hotels"
              sid="drinking_culture_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              <Hotel size={20} />
              {t('drinkingCulture.cta.btnStay')}
            </AffiliateCTA>
            <Link
              to={to('/bars')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/15 no-underline"
            >
              {t('drinkingCulture.cta.btnExplore')}
              <ExternalLink size={18} />
            </Link>
          </div>
          <AffiliateDisclosure variant="full" className="mt-10 text-white/45" />
        </div>
      </section>
    </>
  );
}
