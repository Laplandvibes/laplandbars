import { Flame, Snowflake, Beer, Wine, Star, Hotel, ExternalLink, Quote, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import Reveal from '../components/Reveal';
import { useLocale } from '../i18n/useLocale';

type PriceRow = { label: string; value: string };

/**
 * Juomakulttuuri.
 *
 * Vesa 11.9.2026: *"tässä juomakulttuuri osiossa on mahdollisuuksia vaikka
 * mihin kun vähän laitetaan efforttia … voisiko olla kaksi rinnakkain … paljon
 * emotion graphic aina kun selaa alaspäin jotain tapahtuisi"*. Sivu oli yksi
 * 3xl-levyinen tekstipalsta (6 lukua, ~2 400 sanaa) ilman yhtään kuvaa
 * Koskenkorvan, Finlandian ja Lapin Kullan kohdalla.
 *
 * Nyt jokainen luku on kaksipalstainen: teksti toisella puolella, "tunne-
 * grafiikka" toisella — valokuva, iso Bebas-sitaatti luvun omasta tekstistä tai
 * hintataulukko — vuorotellen vasen/oikea. Jokainen luku paljastuu vieritettäessä
 * (`Reveal`, pelkkä CSS-siirtymä). Sitaatit ovat kunkin kielen omasta
 * tekstistä, eivät käännettyjä koristeita. Kalsarikännit sai kirjaviittauksen
 * (Rantanen 2018, S&S / HarperCollins), 12 kielellä.
 */
export default function DrinkingCulture() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  const arr = (key: string) => (t(key, { returnObjects: true }) as string[]) || [];
  const intro = arr('drinkingCulture.intro');
  const kossuBody = arr('drinkingCulture.kossu.body');
  const finlandiaBody = arr('drinkingCulture.finlandia.body');
  const lapinKultaBody = arr('drinkingCulture.lapinKulta.body');
  const lonkeroBody = arr('drinkingCulture.lonkero.body');
  const lonkeroBrandFacts = arr('drinkingCulture.lonkero.brand.facts');
  const kalsariBody = arr('drinkingCulture.kalsarikannit.body');
  const saunaBody = arr('drinkingCulture.sauna.body');
  const priceRows = (t('drinkingCulture.lapinKulta.prices', { returnObjects: true }) as PriceRow[]) || [];
  const kalsariRules = arr('drinkingCulture.kalsarikannit.rules');

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

      {/* Johdanto */}
      <section className="py-16 bg-night">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 text-white/85 text-[17px] leading-relaxed">
            {intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Reveal>
      </section>

      {/* Elämää ja naurua: kollaasi */}
      <section className="pb-16 bg-night">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <Reveal className="bar-card relative overflow-hidden h-64 sm:h-80">
              <img src={BARS.pubLaughter} alt="Friends laughing over beers in a cozy Lapland log pub" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
            </Reveal>
            <Reveal delay={120} className="bar-card relative overflow-hidden h-64 sm:h-80">
              <img src={BARS.terraceLonkero} alt="Friends toasting with long drinks on a summer terrace under the midnight sun" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Luvut: teksti + tunnegrafiikka rinnakkain, vuorotellen */}
      <section className="bar-depth py-8 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 lg:space-y-32">

          {/* Koskenkorva: sitaattipaneeli oikealla */}
          <Chapter
            icon={<Flame size={24} className="text-amber" />}
            title={t('drinkingCulture.kossu.title')}
            body={kossuBody}
            mediaSide="right"
            media={
              <QuotePanel
                quote={t('drinkingCulture.kossu.quote', { defaultValue: 'It is not glamorous. That is the point.' })}
                kicker="Koskenkorva"
                tone="amber"
              />
            }
            footer={
              <FactBox label={t('drinkingCulture.kossu.factsLabel')} text={t('drinkingCulture.kossu.facts')} />
            }
          />

          {/* Finlandia: jäinen sitaattipaneeli vasemmalla */}
          <Chapter
            icon={<Snowflake size={24} className="text-amber" />}
            title={t('drinkingCulture.finlandia.title')}
            body={finlandiaBody}
            mediaSide="left"
            media={
              <QuotePanel
                quote={t('drinkingCulture.finlandia.quote', { defaultValue: 'The water is the star.' })}
                kicker="Finlandia · 1970"
                tone="ice"
              />
            }
            footer={
              <FactBox label={t('drinkingCulture.finlandia.factsLabel')} text={t('drinkingCulture.finlandia.facts')} />
            }
          />

          {/* Lapin Kulta: hintataulukko oikealla */}
          <Chapter
            icon={<Star size={24} className="text-amber" />}
            title={t('drinkingCulture.lapinKulta.title')}
            body={lapinKultaBody}
            mediaSide="right"
            media={
              <div className="bar-card p-6 sm:p-7">
                <p className="font-heading text-2xl text-amber tracking-wide mb-4">
                  {t('drinkingCulture.lapinKulta.priceTitle')}
                </p>
                <div className="space-y-3 text-sm text-white/80">
                  {priceRows.map((row, i) => (
                    <div key={i} className={`flex justify-between items-center ${i < priceRows.length - 1 ? 'border-b border-white/5 pb-2' : ''}`}>
                      {/* Hinta ei saa rivittyä irti nimikkeestään (auditti 4.8.). */}
                      <span className="min-w-0 pr-3">{row.label}</span>
                      <span className="text-amber font-medium whitespace-nowrap shrink-0">{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-4">
                  {t('drinkingCulture.lapinKulta.priceFootnote')}
                </p>
              </div>
            }
            footer={
              <FactBox label={t('drinkingCulture.lapinKulta.otherLabel')} text={t('drinkingCulture.lapinKulta.other')} />
            }
          />

          {/* Lonkero: Hartwall-kortti vasemmalla */}
          <Chapter
            icon={<Beer size={24} className="text-amber" />}
            title={t('drinkingCulture.lonkero.title')}
            body={lonkeroBody}
            mediaSide="left"
            media={
              <div className="bar-card overflow-hidden">
                <div className="relative h-52 sm:h-60">
                  <img
                    src={BARS.lonkeroDrink}
                    alt="Sparkling grapefruit long drink in a tall glass with ice and a grapefruit wheel on a dark bar counter"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
                </div>
                <div className="p-5 sm:p-6 grid grid-cols-[96px_1fr] sm:grid-cols-[120px_1fr] gap-5 items-start">
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
                    <figcaption className="mt-1.5 text-[9px] leading-snug text-white/40">
                      Hartwall Original Long Drink ·{' '}
                      <a href="https://commons.wikimedia.org/wiki/File:Hartwall_Original_Long_Drink.png" target="_blank" rel="noopener nofollow" className="underline hover:text-white/60">
                        ComradeUranium / Wikimedia Commons
                      </a>{' '}
                      ·{' '}
                      <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener nofollow" className="underline hover:text-white/60">
                        CC BY-SA 4.0
                      </a>
                    </figcaption>
                  </figure>
                  <div>
                    <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-1.5">
                      {t('drinkingCulture.lonkero.brand.kicker')}
                    </p>
                    <p className="font-heading text-2xl text-white tracking-wide mb-3">
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
            }
          />

          {/* Kalsarikännit: sohvakuva oikealla, kirja tekstissä, säännöt alla */}
          <Chapter
            icon={<Wine size={24} className="text-amber" />}
            title={t('drinkingCulture.kalsarikannit.title')}
            body={kalsariBody}
            mediaSide="right"
            extra={
              <p className="flex items-start gap-2.5 text-white/80 leading-relaxed bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3">
                <BookOpen size={16} className="text-amber shrink-0 mt-1" />
                <span>{t('drinkingCulture.kalsarikannit.book', { defaultValue: 'The idea even has its own book: Miska Rantanen’s Kalsarikänni (S&S, 2018), published in English the same year as Pantsdrunk by HarperCollins.' })}</span>
              </p>
            }
            media={
              <div className="bar-card relative overflow-hidden h-72 sm:h-96">
                <img src={BARS.kalsarikannitSofa} alt="Kalsarikännit: relaxing at home on the sofa with a beer, snow falling outside" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
              </div>
            }
            footer={
              <div className="bar-card p-6 sm:p-7">
                <p className="font-heading text-xl text-amber tracking-wide mb-3">
                  {t('drinkingCulture.kalsarikannit.rulesTitle')}
                </p>
                <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-white/80">
                  {kalsariRules.map((rule, i) => <li key={i}>{rule}</li>)}
                </ol>
              </div>
            }
          />

          {/* Sauna: kuva vasemmalla */}
          <Chapter
            icon={<Flame size={24} className="text-amber" />}
            title={t('drinkingCulture.sauna.title')}
            body={saunaBody}
            mediaSide="left"
            media={
              <div className="bar-card relative overflow-hidden h-72 sm:h-96">
                <img src={BARS.saunaBeer} alt="Cooling off on the sauna porch with a cold beer at dusk" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
              </div>
            }
          />

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-night/95 aurora-glow">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
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
        </Reveal>
      </section>
    </>
  );
}

/** Yksi luku: otsikko + teksti toisella puolella, media toisella. */
function Chapter({
  icon, title, body, media, mediaSide, extra, footer,
}: {
  icon: ReactNode;
  title: string;
  body: string[];
  media: ReactNode;
  mediaSide: 'left' | 'right';
  extra?: ReactNode;
  footer?: ReactNode;
}) {
  const textOrder = mediaSide === 'left' ? 'md:order-2' : 'md:order-1';
  const mediaOrder = mediaSide === 'left' ? 'md:order-1' : 'md:order-2';
  return (
    <Reveal as="section" className="scroll-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className={`${textOrder} min-w-0`}>
          <div className="flex items-center gap-3 mb-6">
            {icon}
            <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide">{title}</h2>
          </div>
          <div className="space-y-4 text-white/80 leading-relaxed text-[16px]">
            {body.map((p, i) => <p key={i}>{p}</p>)}
            {extra}
          </div>
        </div>
        <Reveal delay={150} className={`${mediaOrder} min-w-0`}>
          {media}
        </Reveal>
      </div>
      {footer && <Reveal delay={100} className="mt-8">{footer}</Reveal>}
    </Reveal>
  );
}

/** Iso Bebas-sitaatti luvun omasta tekstistä. Ei numeroita, ei mittaristoa. */
function QuotePanel({ quote, kicker, tone }: { quote: string; kicker: string; tone: 'amber' | 'ice' }) {
  const bg = tone === 'amber'
    ? 'bg-gradient-to-br from-amber/25 via-night-light/60 to-night'
    : 'bg-gradient-to-br from-ice/25 via-night-light/60 to-night';
  const accent = tone === 'amber' ? 'text-amber' : 'text-ice';
  return (
    <div className={`bar-card relative overflow-hidden ${bg} p-8 sm:p-10 min-h-[18rem] sm:min-h-[22rem] flex flex-col justify-end`}>
      <Quote size={56} className={`absolute top-6 left-6 ${accent} opacity-25 -scale-x-100`} strokeWidth={1.5} aria-hidden="true" />
      <p className={`text-[11px] font-bold uppercase tracking-[0.25em] ${accent} mb-4`}>{kicker}</p>
      <p className="font-heading text-4xl sm:text-5xl lg:text-[3.4rem] text-white tracking-wide leading-[1.05] text-balance">{quote}</p>
    </div>
  );
}

function FactBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="bar-card p-6">
      <p className="text-sm text-white/80 leading-relaxed">
        <span className="text-amber font-semibold">{label}</span>{' '}
        {text}
      </p>
    </div>
  );
}
