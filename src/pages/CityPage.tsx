import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, Info, ExternalLink } from 'lucide-react';
import { useLocale } from '../i18n/useLocale';
import { localePrefix } from '../i18n/config';
import PageSeo from '../components/PageSeo';
import BarCard from '../components/BarCard';
import AffiliateCTA from '../components/AffiliateCTA';
import PageBreadcrumb from '../components/PageBreadcrumb';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import RelatedSites from '../components/RelatedSites';
import NotFound from './NotFound';
import { BAR_CITIES, cityBySlug, barsForCity, SISTER_CITY_URLS } from '../data/barCities';
import { findRating } from '../components/VenueRating';
import { barItemList } from '../lib/barSchema';
import { barImages } from '../data/barCardImages';

const ORIGIN = 'https://laplandbars.com';

/**
 * Yhden kaupungin baarisivu (/city/{slug}).
 *
 * MIKSI (GSC 11.9.2026, 3 kk): sivustolla oli 11 reittiä eikä yhtään
 * kaupunkisivua. "baarit rovaniemi", "pub rovaniemi", "baarit levi" osuivat
 * yhteen pitkään /bars-listaan sijoilla 28–54 ja toivat 0 klikkiä. Sisarsivut
 * laplanddining (7.9.) ja laplandnightlife tekivät saman ja rankkaavat
 * samoille aikomuksille sijoilla 5–12. Aikomus "baarit Rovaniemellä" tarvitsee
 * oman sivun, ei ankkurilinkin listaan.
 *
 * Sivu ei keksi mitään: kortit, luvut ja osoitteet tulevat samasta datasta
 * kuin /bars. Kaupunkikohtainen teksti (pages.json `cities.{slug}`) nimeää
 * vain sen minkä data näyttää. Jos kaupungille ei ole käännöstä, i18next
 * putoaa englantiin, joten sivu ei koskaan jää tyhjäksi.
 */
export default function CityPage() {
  const { t, i18n } = useTranslation('pages');
  const { locale, to } = useLocale();
  const { slug } = useParams<{ slug: string }>();

  const city = cityBySlug(slug);
  // Tuntematon slug saa verkoston 404:n, ei tyhjää runkoa: tämä on myös se
  // portti joka estää /city/mikä-tahansa -roskaa indeksoitumasta.
  if (!city) return <NotFound />;

  const list = barsForCity(city.city);
  const path = `/city/${city.slug}`;
  const prefix = localePrefix(locale);

  const tx = (key: string, fallback: string): string =>
    i18n.exists(`pages:${key}`) ? (t(key) as string) : fallback;

  const cityKey = `cities.${city.slug}`;
  const name = tx(`${cityKey}.name`, city.name);
  /** Paikannimen muoto "kaupungissa X" -lauseissa: suomessa nimi taipuu
   *  (Rovaniemi → Rovaniemellä), muissa kielissä prepositio hoitaa sen. */
  const at = tx(`${cityKey}.at`, name);
  const tagline = tx(`${cityKey}.tagline`, '');
  const intro = tx(`${cityKey}.intro`, '');
  const knowRaw = t(`${cityKey}.know`, { returnObjects: true });
  const know: string[] = Array.isArray(knowRaw) ? (knowRaw as string[]) : [];

  const ratings = list.map((b) => findRating(b.name)?.rating).filter((n): n is number => typeof n === 'number');
  const best = ratings.length ? Math.max(...ratings) : null;

  const title = tx(`${cityKey}.title`, `Bars in ${name} | LaplandBars`);
  const description = tx(
    `${cityKey}.description`,
    `Where to drink in ${name}: pubs, cocktail bars and après-ski with Google ratings, opening hours and prices.`,
  );

  const countLabel = t('cities.shared.countLabel', {
    count: list.length,
    name,
    at,
    defaultValue: `${list.length} bars in ${at}`,
  });

  const others = BAR_CITIES.filter((c) => c.slug !== city.slug);

  // Sisarsivustojen SAMAN kaupungin sivut: syömään, yökerhoihin. Kolmas
  // linkki on koko verkoston matkasuunnittelu, kuten etusivulla.
  //
  // 🔴 Vain ne sisarsivut, jotka OIKEASTI vastaavat 200. Mitattu 12.9.2026:
  // seitsemästä uudesta kaupungista laplanddiningilla on sivu neljälle ja
  // laplandnightlifella viidelle. Ehdoton linkki olisi tuottanut 8 kuollutta
  // linkkiä × 12 kieltä. Lippu on `barCities.ts`:n `sisters`.
  const related = [
    city.sisters.dining && {
      anchor: t('cities.shared.eatHere', { name, at, defaultValue: `Where to eat in ${at}` }),
      desc: t('home.related.links.1.desc'),
      href: SISTER_CITY_URLS.dining(city.slug, prefix),
    },
    city.sisters.nightlife && {
      anchor: t('cities.shared.nightlifeHere', { name, at, defaultValue: `Nightlife in ${at}` }),
      desc: t('home.related.links.0.desc'),
      href: SISTER_CITY_URLS.nightlife(city.slug, prefix),
    },
    {
      anchor: t('home.related.links.2.anchor'),
      desc: t('home.related.links.2.desc'),
      href: 'https://laplandvisit.com',
    },
  ].filter(Boolean) as { anchor: string; desc: string; href: string }[];

  return (
    <>
      <PageSeo
        title={title}
        description={description}
        path={path}
        ogImage={city.img ? `${ORIGIN}${city.img}` : undefined}
        jsonLd={[
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
              { '@type': 'ListItem', position: 2, name: 'Bars', item: `${ORIGIN}/bars/` },
              { '@type': 'ListItem', position: 3, name: city.name, item: `${ORIGIN}${path}/` },
            ],
          },
          barItemList(`Bars in ${city.name}`, list),
        ]}
      />

      {/* Hero: sama svh-mitta ja md+-pakoluukku kuin muilla sivuilla */}
      <section className="relative min-h-[46svh] flex items-center justify-center overflow-hidden [@media(max-height:900px)_and_(min-width:768px)]:!items-start [@media(max-height:900px)_and_(min-width:768px)]:pt-24">
        {/* Kuva vain jos kaupungille on valittu sellainen; ks. barCities.ts. */}
        {city.img ? (
          <>
            <img
              src={city.img}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/60 to-night" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-night" style={{ background: 'radial-gradient(80% 70% at 50% 0%, rgba(245,158,11,0.12) 0%, rgba(15,23,42,0) 68%)' }} />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
          <p className="inline-flex items-center gap-2 text-amber text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
            <MapPin size={13} /> {t('cities.shared.kicker', { defaultValue: 'Where to drink' })}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wide text-white leading-[1.05] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
            {tx(`${cityKey}.h1`, `Bars in ${name}`)}
          </h1>
          {tagline && (
            <p className="mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto text-white/85 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
              {tagline}
            </p>
          )}
          <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/75 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-semibold">
              {countLabel}
            </span>
            {best !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-semibold">
                <Star size={12} className="text-amber fill-amber" />
                {t('cities.shared.bestRated', {
                  rating: best.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                  defaultValue: `Top rated ${best.toFixed(1)}`,
                })}
              </span>
            )}
          </p>
        </div>
      </section>

      <PageBreadcrumb />

      {/* Johdanto + hyvä tietää */}
      {(intro || know.length > 0) && (
        <section className="bg-gradient-to-b from-night via-night-light/40 to-night py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-5">
            {intro && <p className="text-white/85 text-[17px] leading-relaxed">{intro}</p>}
            {know.length > 0 && (
              <ul className="mt-8 space-y-3">
                {know.map((item) => (
                  <li key={item} className="flex gap-3 text-white/75 text-[15px] leading-relaxed">
                    <Info size={16} className="text-amber/70 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-8 text-[13px] text-white/50 leading-relaxed">
              {t('cities.shared.hoursNote', {
                defaultValue: 'Opening hours move with the ski season. Check the bar’s own page before you head out.',
              })}
            </p>
          </div>
        </section>
      )}

      {/* Baarit */}
      <section className="bar-depth pb-20 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-wide text-white mb-8">{countLabel}</h2>
          <div className="grid gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {list.map((bar) => (
              <BarCard
                key={bar.name}
                bar={bar}
                image={barImages[bar.name]}
                locale={locale}
                campaign={`bars_city_${city.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Majoitus samassa kaupungissa: syvin parametri jonka pinta tietää */}
      <section className="bg-night pb-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-white mb-3">
            {t('cities.shared.stayHeadline', { name, at, defaultValue: `Staying in ${at}?` })}
          </h2>
          <p className="text-white/70 text-[15px] leading-relaxed mb-6">
            {t('cities.shared.stayLead', { defaultValue: 'Book a room within walking distance of the bars above.' })}
          </p>
          <AffiliateCTA
            partner="hotels"
            sid={`city_${city.slug}_stay`}
            destination={city.stayQuery}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber px-7 py-3.5 min-h-[44px] text-night font-bold tracking-wide hover:bg-amber/90 transition-colors shadow-lg shadow-amber/20 no-underline"
          >
            {t('cities.shared.stayCta', { name, at, defaultValue: `Find stays in ${at}` })}
            <ExternalLink size={14} />
          </AffiliateCTA>
        </div>
      </section>

      {/* Muut kaupungit + koko lista: sisäinen linkitys, joka tekee kaupunki-
          sivuista verkoston eikä saaria. */}
      <section className="bg-night pb-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-heading text-2xl sm:text-3xl tracking-wide text-white mb-6">
            {t('cities.shared.otherCities', { defaultValue: 'Drink somewhere else in Lapland' })}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {others.map((c) => (
              <Link
                key={c.slug}
                to={to(`/city/${c.slug}`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 min-h-[44px] sm:min-h-0 text-white/80 text-sm font-semibold hover:border-amber/50 hover:text-amber transition-colors no-underline"
              >
                <MapPin size={12} className="opacity-60" />
                {tx(`cities.${c.slug}.name`, c.name)}
              </Link>
            ))}
            <Link
              to={to('/bars')}
              className="inline-flex items-center rounded-full bg-amber/15 border border-amber/40 px-4 py-2 min-h-[44px] sm:min-h-0 text-amber text-sm font-bold hover:bg-amber/25 transition-colors no-underline"
            >
              {t('cities.shared.allBars', { defaultValue: 'All bars →' })}
            </Link>
          </div>
        </div>
      </section>

      <RelatedSites links={related} />

      <section className="py-8 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AffiliateDisclosure variant="full" className="text-white/45" />
        </div>
      </section>
    </>
  );
}
