import { Hotel, ExternalLink, Martini } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import GygSearchCta from '../components/GygSearchCta';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';

type CocktailItem = { name: string; ingredients: string; description: string; season: string };
type IngredientItem = { name: string; note: string };

const cocktailImages = [BARS.cocktailSour, BARS.cocktailAurora, BARS.cocktailBerry];

export default function Cocktails() {
  const { t } = useTranslation('pages');
  const cocktails = (t('cocktails.cocktails', { returnObjects: true }) as CocktailItem[]) || [];
  const ingredients = (t('cocktails.ingredients', { returnObjects: true }) as IngredientItem[]) || [];
  return (
    <>
      <PageSeo
        titleKey="cocktails.title"
        descriptionKey="cocktails.description"
        path="/cocktails"
        jsonLd={[
          pillarBreadcrumb('Cocktails', '/cocktails'),
          articleSchema(
            'Arctic Cocktails in Finnish Lapland',
            'Cocktail culture built on local Arctic ingredients.',
            '/cocktails'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.cocktailAurora}
          alt="Arctic cocktails"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('cocktails.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('cocktails.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

      {/* Featured cocktails */}
      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {cocktails.map((c, i) => (
              <div
                key={c.name}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-80 ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <img src={cocktailImages[i] ?? BARS.cocktailAurora} alt={c.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent" />
                </div>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <p className="text-xs text-amber/70 uppercase tracking-widest mb-3">{c.season}</p>
                  <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">{c.name}</h2>
                  <p className="text-white/65 text-sm mb-4 font-mono">{c.ingredients}</p>
                  <p className="text-white/80 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arctic ingredients */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl text-white tracking-wide mb-4">
              {t('cocktails.ingredientsTitle')}
            </h2>
            <p className="text-white/75 max-w-2xl mx-auto">
              {t('cocktails.ingredientsSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ingredients.map((ing) => (
              <div key={ing.name} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-amber/20 transition-all">
                <h3 className="font-heading text-lg text-amber tracking-wide mb-2">{ing.name}</h3>
                <p className="text-sm text-white/75 leading-relaxed">{ing.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bookable cocktail & tasting experiences via GetYourGuide (search → live results) */}
      <section className="py-16 bg-night/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber/[0.07] via-night/0 to-ice/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber text-[11px] font-semibold uppercase tracking-widest mb-4">
              <Martini size={11} />
              {t('experiences.cocktail.kicker')}
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3 text-balance">
              {t('experiences.cocktail.title')}
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-7 text-pretty">
              {t('experiences.cocktail.body')}
            </p>
            <GygSearchCta query="Rovaniemi cocktail tasting experience" sid="cocktails_exp_lapland">
              {t('experiences.cocktail.cta')}
            </GygSearchCta>
          </div>
        </div>
      </section>

      {/* Stay near the cocktail bar */}
      <section className="py-14 bg-night">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber/[0.05] border border-amber/15 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Hotel size={11} />
                {t('cocktails.stayBand.kicker')}
              </p>
              <h3 className="font-heading text-2xl text-white tracking-wide mb-1.5">
                {t('cocktails.stayBand.title')}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                {t('cocktails.stayBand.sub')}
              </p>
            </div>
            <AffiliateCTA
              partner="hotels"
              sid="cocktails_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
            >
              {t('cocktails.stayBand.cta')}
              <ExternalLink size={14} />
            </AffiliateCTA>
          </div>
          <AffiliateDisclosure variant="full" className="mt-8 text-white/45 max-w-2xl mx-auto" />
        </div>
      </section>
    </>
  );
}
