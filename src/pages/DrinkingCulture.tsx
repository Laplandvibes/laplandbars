import { Hotel, ExternalLink, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { useLocale } from '../i18n/useLocale';
import { PHOTO_BY, ILLUSTRATION_LABEL } from '../lib/venueImage';
import products from '../data/generated/product-images.json';

type PriceRow = { label: string; value: string };
type Product = { src: string; width: number; height: number; fit: string; title: string; artist: string; licence: string; licenceUrl: string; fileUrl: string };
const PRODUCTS = products as Record<string, Product>;

/**
 * Juomakulttuuri — pitkä juttu, kuusi lukua.
 *
 * 🔴🔴 Vesa 11.9.2026 kolmesti: sitaattikortti + gradientti + vierityspaljastus
 * = *"lovable ai geneeristä paskaa"*; sitten *"värimaailma pitää olla laatua"*;
 * ja bar-card-laatikoista tehty kaksipalstainen: *"siis aivan paska, mieti nyt
 * koko homma uusiksi, visuaalinen tyyli pitää olla meidän brändien mukainen
 * ja vaatimustaso"*. Sääntö: `_claude/feedback_ei_geneerista_ai_ulkoasua.md`.
 *
 * Mitä tämä versio tekee toisin:
 * 1. EI laatikoita. Luku on typografiaa: Bebas-numero + Bebas-otsikko,
 *    DM Sans -leipäteksti 62 merkin palstassa, faktat Suomen-sinisen
 *    pystyviivan takana (LV-DESIGN-SYSTEM §11b lippuaksenttikerros), hinnat
 *    hiusviivataulukkona. Sama editoriaalinen kieli kuin hubin blogissa.
 * 2. Rinnalla on AITO esine: Wikimedia Commonsin lisenssitarkistettu
 *    tuotekuva (Koskenkorva-pullo Helsingin kaupunginmuseon kuvassa,
 *    Finlandia-pullo, Lapin Kulta -tölkki, Hartwall-tölkki), tekijä ja
 *    lisenssi kuvan alla. Kalsarikännit ja sauna pitävät Vesan 10.7.
 *    hyväksymät kuvat, mutta merkittyinä kuvituskuviksi.
 * 3. Kuva on `sticky`: se pysyy paikallaan, kun luvun teksti vierii ohi.
 *    Se on se, mitä vierityksessä tapahtuu — ei paljastusanimaatio.
 * 4. Ei ihmiskollaasia sivun avauksessa; hero ajelehtii hitaasti kuten
 *    hubin blogissa (hyväksytty 5.9.2026, vain transform, 28 s).
 * 5. Ei uutta kopiota: kaikki tekstit ovat olemassa olevia avaimia 12 kielellä;
 *    sisällysrivin nimet leikataan luvun otsikosta ennen pilkkua.
 */
const CHAPTERS = [
  { id: 'koskenkorva', key: 'kossu', product: 'koskenkorva' },
  { id: 'finlandia', key: 'finlandia', product: 'finlandia' },
  { id: 'lapin-kulta', key: 'lapinKulta', product: 'lapinKulta' },
  { id: 'lonkero', key: 'lonkero', product: 'lonkero' },
  { id: 'kalsarikannit', key: 'kalsarikannit', illustration: BARS.kalsarikannitSofa },
  { id: 'sauna', key: 'sauna', illustration: BARS.saunaBeer },
] as const;

/** "Koskenkorva, kansallisväkevä" → "Koskenkorva"; "コスケンコルヴァ、国民の酒" → "コスケンコルヴァ". */
const shortName = (title: string) => title.split(/[,，、:：]/)[0].trim();
const noColon = (s: string) => s.replace(/[:：]\s*$/, '');
const nn = (i: number) => String(i + 1).padStart(2, '0');

export default function DrinkingCulture() {
  const { t } = useTranslation('pages');
  const { to, locale } = useLocale();
  const arr = (key: string) => (t(key, { returnObjects: true }) as string[]) || [];
  const intro = arr('drinkingCulture.intro');
  const priceRows = (t('drinkingCulture.lapinKulta.prices', { returnObjects: true }) as PriceRow[]) || [];
  const kalsariRules = arr('drinkingCulture.kalsarikannit.rules');
  const lonkeroBrandFacts = arr('drinkingCulture.lonkero.brand.facts');

  const figureFor = (c: (typeof CHAPTERS)[number]) => {
    if ('product' in c) return <ProductFigure p={PRODUCTS[c.product]} locale={locale} />;
    return <IllustrationFigure src={c.illustration} alt={t(`drinkingCulture.${c.key}.title`)} label={ILLUSTRATION_LABEL[locale]} />;
  };

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

      {/* Hero: valokuva ajelehtii hitaasti (transform only) */}
      <section className="dc-hero relative min-h-[62vh] flex items-end overflow-hidden">
        <img
          src={BARS.heroNightlife}
          alt="Cosy Finnish pub with fireplace"
          className="dc-hero-img absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.45) 45%, rgba(15,23,42,0.25) 100%)' }} />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-[0.95] max-w-4xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('drinkingCulture.hero.title')}
          </h1>
          <p className="mt-5 text-white/85 text-lg sm:text-xl max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('drinkingCulture.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

      {/* Johdanto + sisällys */}
      <section className="bg-night pt-14 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 text-white/85 text-lg sm:text-xl leading-[1.65]">
            {intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <nav aria-label={t('drinkingCulture.hero.title')} className="mt-12">
            <ol className="flex flex-wrap gap-x-8 gap-y-4">
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="group inline-flex items-baseline gap-2.5 no-underline">
                    <span className="font-heading text-xl text-amber leading-none">{nn(i)}</span>
                    <span className="text-[13px] uppercase tracking-[0.16em] text-white/65 group-hover:text-white transition-colors">
                      {shortName(t(`drinkingCulture.${c.key}.title`))}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>
      <FinnishDivider />

      {/* Luvut: Suomen-sininen häivevyöhyke keskellä (§11b), ei laatikoita */}
      <section
        className="bg-night"
        style={{ background: 'linear-gradient(to bottom, #0F172A 0%, #0F172A 12%, rgba(0,47,108,0.16) 40%, rgba(0,47,108,0.20) 55%, rgba(0,47,108,0.14) 72%, #0F172A 92%, #0F172A 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {CHAPTERS.map((c, i) => (
            <Chapter
              key={c.id}
              id={c.id}
              n={nn(i)}
              title={t(`drinkingCulture.${c.key}.title`)}
              body={arr(`drinkingCulture.${c.key}.body`)}
              figure={figureFor(c)}
              first={i === 0}
              extra={
                c.key === 'kalsarikannit' ? (
                  <p className="flex items-start gap-3 text-white/80 leading-[1.7] text-[17px]">
                    <BookOpen size={18} className="text-amber shrink-0 mt-1.5" />
                    <span>{t('drinkingCulture.kalsarikannit.book')}</span>
                  </p>
                ) : c.key === 'lonkero' ? (
                  <Facts label={t('drinkingCulture.lonkero.brand.kicker')}>
                    <p className="font-heading text-2xl text-white tracking-wide mb-2">{t('drinkingCulture.lonkero.brand.title')}</p>
                    <ul className="space-y-1.5">
                      {lonkeroBrandFacts.map((f, k) => (
                        <li key={k} className="flex gap-3 text-[15px] text-white/75 leading-relaxed">
                          <span className="text-amber mt-[9px] h-1.5 w-1.5 rounded-full bg-amber shrink-0" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Facts>
                ) : c.key === 'kossu' || c.key === 'finlandia' ? (
                  <Facts label={noColon(t(`drinkingCulture.${c.key}.factsLabel`))}>
                    <p className="text-[15px] text-white/75 leading-relaxed">{t(`drinkingCulture.${c.key}.facts`)}</p>
                  </Facts>
                ) : null
              }
            >
              {c.key === 'lapinKulta' && (
                <>
                  <div className="mt-12 lg:mt-14 max-w-3xl">
                    <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-5">
                      {t('drinkingCulture.lapinKulta.priceTitle')}
                    </h3>
                    <dl className="border-y border-white/10 divide-y divide-white/10">
                      {priceRows.map((row, k) => (
                        <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                          <dt className="text-[15px] text-white/80 leading-snug min-w-0">{row.label}</dt>
                          {/* Hinta ei saa rivittyä irti nimikkeestään (auditti 4.8.). */}
                          <dd className="font-heading text-xl text-amber tracking-wide whitespace-nowrap shrink-0">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-xs text-white/45 leading-relaxed">{t('drinkingCulture.lapinKulta.priceFootnote')}</p>
                  </div>
                  <div className="max-w-3xl">
                    <Facts label={noColon(t('drinkingCulture.lapinKulta.otherLabel'))}>
                      <p className="text-[15px] text-white/75 leading-relaxed">{t('drinkingCulture.lapinKulta.other')}</p>
                    </Facts>
                  </div>
                </>
              )}
              {c.key === 'kalsarikannit' && (
                <div className="mt-12 lg:mt-14 max-w-3xl">
                  <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-6">
                    {t('drinkingCulture.kalsarikannit.rulesTitle')}
                  </h3>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                    {kalsariRules.map((rule, k) => (
                      <li key={k} className="flex gap-4">
                        <span className="font-heading text-3xl text-amber leading-none w-9 shrink-0 pt-0.5">{nn(k)}</span>
                        <span className="text-[15px] text-white/80 leading-relaxed">{rule.replace(/^\d+[.)]\s*/, '')}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Chapter>
          ))}
        </div>
      </section>
      <FinnishDivider />

      {/* CTA */}
      <section className="py-16 bg-night aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-4">
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

/**
 * Yksi luku: numero + otsikko + leipäteksti vasemmalla (62 merkin palsta),
 * aito esine oikealla ja `sticky` niin, että se pysyy näkyvissä tekstin
 * vieriessä. Mobiilissa kuva ensin, sitten otsikko. `children` tulee luvun
 * alle täysleveänä (hintataulukko, säännöt).
 */
function Chapter({ id, n, title, body, figure, extra, first, children }: {
  id: string; n: string; title: string; body: string[]; figure: ReactNode; extra?: ReactNode; first?: boolean; children?: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-14 lg:py-20 ${first ? '' : 'border-t border-white/[0.07]'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-20 items-start">
        <div className="min-w-0 max-w-[62ch]">
          <div className="flex items-baseline gap-4 sm:gap-5 mb-6">
            <span className="font-heading text-5xl sm:text-6xl text-amber leading-none">{n}</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white tracking-wide leading-[1.02]">{title}</h2>
          </div>
          <div className="space-y-5 text-white/80 text-[17px] leading-[1.7]">
            {body.map((p, i) => <p key={i}>{p}</p>)}
            {extra}
          </div>
        </div>
        <div className="order-first lg:order-none lg:sticky lg:top-24">{figure}</div>
      </div>
      {children}
    </section>
  );
}

/** Faktalohko: ei laatikkoa, Suomen-sininen pystyviiva (§11b lippuaksentti). */
function Facts({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-8 border-l-2 border-finland-blue pl-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ice mb-2">{label}</p>
      {children}
    </div>
  );
}

/** Aito tuotekuva Commonsista: tekijä ja lisenssi näkyvissä (CC BY vaatii). */
function ProductFigure({ p, locale }: { p: Product | undefined; locale: keyof typeof PHOTO_BY }) {
  if (!p) return null;
  return (
    <figure className="m-0 mx-auto max-w-[340px] lg:max-w-none">
      <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-night-light aspect-[4/5]">
        <img src={p.src} alt={p.title} width={p.width} height={p.height} loading="lazy" decoding="async" className={`w-full h-full ${p.fit === 'contain' ? 'object-contain p-6' : 'object-cover'}`} />
      </div>
      <figcaption className="mt-2.5 text-[11px] leading-snug text-white/45">
        {PHOTO_BY[locale]}:{' '}
        <a href={p.fileUrl} target="_blank" rel="noopener nofollow" className="underline decoration-white/25 hover:text-white/70">{p.artist}</a>
        {' '}· Wikimedia Commons ·{' '}
        {p.licenceUrl ? (
          <a href={p.licenceUrl} target="_blank" rel="noopener nofollow" className="underline decoration-white/25 hover:text-white/70">{p.licence}</a>
        ) : p.licence}
      </figcaption>
    </figure>
  );
}

/** Vesan 10.7. hyväksymä AI-kuva — sallittu, mutta merkitään kuvituskuvaksi. */
function IllustrationFigure({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <figure className="m-0 mx-auto max-w-[340px] lg:max-w-none">
      <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-night-light aspect-[4/5]">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </div>
      <figcaption className="mt-2.5 text-[11px] leading-snug text-white/45">{label}</figcaption>
    </figure>
  );
}

/** LV-DESIGN-SYSTEM §11b: sininen–valkoinen–sininen häivyttyvä viiva osioiden väliin. */
function FinnishDivider() {
  return (
    <div aria-hidden="true" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ lineHeight: 0 }}>
      <div style={{ height: '3px', background: 'linear-gradient(to right, transparent 0%, #002F6C 15%, #F8FAFC 50%, #002F6C 85%, transparent 100%)' }} />
    </div>
  );
}
