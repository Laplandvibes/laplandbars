import { Snowflake, Thermometer, MapPin, Hotel, ExternalLink, Ticket, Calendar, Clock, GlassWater } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BARS, CARDS } from '../data/images';
import { iceBars, pickLocalised } from '../data/bars';
import { useLocale } from '../i18n/useLocale';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import MenuLink from '../components/MenuLink';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import VenuePhoto from '../components/VenuePhoto';
import { gygDeepLink } from '../lib/gyg';
import { withReferral } from '../lib/withReferral';
import ImageMark, { photoAlt } from '../components/PhotoCredit';

type ExpectItem = { title: string; body: string };

/** Pikatietojen ikonit samassa järjestyksessä kuin iceBars.expect.items (lämpötila, kesto, juomat, kausi). */
const EXPECT_ICONS = [Thermometer, Clock, GlassWater, Calendar];

export default function IceBars() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  const intro = (t('iceBars.intro', { returnObjects: true }) as string[]) || [];
  const expectItems = (t('iceBars.expect.items', { returnObjects: true }) as ExpectItem[]) || [];
  return (
    <>
      <PageSeo
        titleKey="iceBars.title"
        descriptionKey="iceBars.description"
        path="/ice-bars"
        jsonLd={[
          pillarBreadcrumb('Ice Bars', '/ice-bars'),
          articleSchema(
            'Ice Bars in Finnish Lapland',
            'Where to drink inside a bar carved from ice and snow.',
            '/ice-bars'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.heroIceBars}
          alt={photoAlt(BARS.heroIceBars, 'Ice bar interior')}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {/* 18.10.2026 (Vesa: "ei oikein mitään fiilistä herätä"): tasainen 0,56–0,88-peite peitti koko
            kuvan. Nyt tummennus on soikiona tekstin takana (0,62 keskellä = valkoinen teksti ≥ 4,5:1
            valkoisen lumen päällä) ja reunat jäävät kirkkaiksi; alareuna liukuu murupolun väriin. */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(15,23,42,0.64) 0%, rgba(15,23,42,0.42) 55%, rgba(15,23,42,0.18) 100%), linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 28%)' }} />
        {/* 4.10.2026: valokuva (lumi, jää, valo) on kirkkaampi kuin entinen tekoälykuva: heroteksti-portti
            mittasi ingressin 2,0–3,2:1. Keskikaista 0,42 → 0,68 (valkoinen teksti ≥ 4,5:1 valkoisenkin kohdan päällä). */}
        <ImageMark src={BARS.heroIceBars} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="flex justify-center mb-4">
            <Snowflake size={32} className="text-ice drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]" />
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('iceBars.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('iceBars.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

      {/* What is an ice bar */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-white/80 leading-relaxed">
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Pikatiedot ennen listaa. Vesa 18.10.2026 sivun lopun "Mitä odottaa" -laatikoista:
          *"onko tämän osion funktio ja tyyli mietitty vai onko tämä vaan täytteeksi laitettu?"*.
          Neljä vastausta (lämpötila, kesto, juomat, kausi) ovat ne, jotka lukija tarvitsee ENNEN
          kuin valitsee jääbaarin ja varaa: siksi ne ovat nyt listan yläpuolella yhtenä paneelina,
          eivät sivun lopussa neljänä irrallisena laatikkona. Teksti on sama (12 kieltä). */}
      {expectItems.length > 0 && (
        <section className="bg-night pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-5">{t('iceBars.expect.title')}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl ring-1 ring-ice/20 bg-ice/[0.04] overflow-hidden">
              {expectItems.map((item, i) => {
                const Icon = EXPECT_ICONS[i] ?? Snowflake;
                const edges = [
                  i > 0 ? 'border-t border-white/10' : '',
                  i === 1 ? 'sm:border-t-0' : '',
                  i % 2 === 1 ? 'sm:border-l sm:border-white/10' : '',
                  i > 0 ? 'lg:border-t-0 lg:border-l lg:border-white/10' : '',
                ].join(' ');
                return (
                  <div key={item.title} className={`p-5 sm:p-6 ${edges}`}>
                    <dt className="flex items-center gap-2 font-heading text-xl text-ice tracking-wide mb-2">
                      <Icon size={18} className="shrink-0" aria-hidden="true" />
                      {item.title}
                    </dt>
                    <dd className="text-[15px] text-white/85 leading-relaxed text-pretty">{item.body}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>
      )}

      {/* Ice bar listings */}
      <section className="bar-depth py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {iceBars.map((bar) => {
              const description = t(`iceBars.venues.${bar.name}.description`, { defaultValue: bar.description });
              const highlight = t(`iceBars.venues.${bar.name}.highlight`, { defaultValue: bar.highlight });
              const stayHint = t(`iceBars.venues.${bar.name}.stayHint`, { defaultValue: bar.stayHint });
              return (
                <article
                  key={bar.name}
                  className="bar-card bar-card-hover group overflow-hidden flex flex-col h-full"
                >
                  {/* Kohteen oma kuva merkintoineen; SnowVillagella ei ole omaa kuvaa (sivusto on
                      bottisuojan takana, eikä verkostolla ole vapaata kuvaa), joten se saa kuvituksen
                      ja "Kuvituskuva"-merkinnan. 18.10.2026: 16:10 → 4:3 (Vesa: "liian pienet kuvat"). */}
                  <VenuePhoto
                    name={bar.name}
                    fallback={CARDS.iceBarTunnel}
                    alt={bar.name}
                    locale={locale}
                    className="aspect-[4/3] shrink-0"
                    hoverZoom
                  />
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-ice text-xs font-semibold uppercase tracking-[0.16em] mb-3">
                      <Snowflake size={14} />
                      {t('iceBars.iceBarKicker')}
                    </div>
                    <h3 className="font-heading text-2xl text-white tracking-wide leading-[1.15] mb-1.5">{bar.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/75 mb-4">
                      <MapPin size={14} className="text-ice shrink-0" />
                      {bar.location}
                    </div>
                    <p className="text-[15px] text-white/85 leading-relaxed mb-5">{description}</p>
                    <ul className="space-y-2 pt-4 border-t border-white/10 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <Snowflake size={14} className="text-ice mt-1 shrink-0" />
                        {highlight}
                      </li>
                      <li className="flex items-start gap-2">
                        <Thermometer size={14} className="text-ice mt-1 shrink-0" />
                        {pickLocalised(bar.temp, locale)}
                      </li>
                      <li className="flex items-start gap-2">
                        <Calendar size={14} className="text-ice mt-1 shrink-0" />
                        {pickLocalised(bar.season, locale)}
                      </li>
                    </ul>
                    <p className="text-sm text-white font-semibold mt-3">{pickLocalised(bar.price, locale)}</p>

                    {/* Toiminnot pohjassa samassa järjestyksessä joka kortissa: vierailun varaus (vain
                        kun GYG-tuote on yhä olemassa — kaksi kolmesta poistui 30.7.2026 ja GYG ohjaa
                        poistetun tuotteen kaupunkilistaan), majoitus lähellä, sitten lista ja verkkosivu. */}
                    <div className="mt-auto pt-5 space-y-3">
                      {bar.visitGygProductPath && (
                        <a
                          href={gygDeepLink(bar.visitGygProductPath, bar.visitSid, locale)}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className="inline-flex items-center justify-center gap-1.5 w-full min-h-[44px] bg-amber hover:bg-amber/90 text-night px-4 rounded-full text-sm font-bold transition-all shadow-md shadow-amber/20 no-underline"
                        >
                          <Ticket size={14} />
                          {t('iceBars.bookCta')}
                        </a>
                      )}
                      <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-4">
                        <p className="text-xs text-amber font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Hotel size={12} />
                          {t('iceBars.stayKicker')}
                        </p>
                        <p className="text-sm text-white/80 leading-relaxed mb-2">{stayHint}</p>
                        <AffiliateCTA
                          partner="hotels"
                          sid={bar.staySid}
                          destination={bar.stayQuery}
                          className="lv-tap inline-flex items-center gap-1.5 text-amber hover:text-amber/80 text-sm font-semibold no-underline"
                        >
                          {t('iceBars.stayCta')}
                          <ExternalLink size={13} />
                        </AffiliateCTA>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 -mb-2">
                        <MenuLink
                          bar={bar}
                          label={t('bars.venueMenu')}
                          labelPdf={t('bars.venueMenuPdf')}
                          campaign="bars_menu_ice_bars"
                          className="py-2.5 text-[13px] font-semibold uppercase tracking-wider text-amber hover:text-amber/80"
                        />
                        {bar.website && (
                          <a
                            href={withReferral(bar.website, 'bars_ice_bars')}
                            target="_blank"
                            rel="nofollow noopener"
                            className="lv-tap inline-flex items-center gap-1 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-white/80 hover:text-white no-underline transition-colors"
                          >
                            {t('iceBars.venueWebsite')} <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Data provenance — hours/prices checked against the venues' own sites */}
          <p className="mt-6 text-center text-[11px] text-white/45">
            {t('iceBars.verifiedNote')}
          </p>

          {/* Lodging-first band — snow suites are a Lapland icon */}
          {/* 18.10.2026: kaistalla on nyt kuva lumihotellin käytävästä. Pelkkä teksti ja kaksi
              nappia näyttivät mainokselta; kuva kertoo mitä "nuku lumihuoneessa" tarkoittaa. */}
          <div className="bar-card mt-12 overflow-hidden bg-gradient-to-br from-ice/[0.06] via-night/0 to-amber/[0.04]">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                <img
                  src={BARS.snowHotelRooms}
                  alt={photoAlt(BARS.snowHotelRooms, 'Snow hotel rooms')}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <ImageMark src={BARS.snowHotelRooms} />
              </div>
              <div className="p-8 sm:p-10 self-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-[11px] font-semibold uppercase tracking-widest mb-3">
                  <Snowflake size={11} />
                  {t('iceBars.band.kicker')}
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">
                  {t('iceBars.band.title')}
                </h3>
                <p className="text-white/85 text-[15px] sm:text-base leading-relaxed mb-6">
                  {t('iceBars.band.body')}
                </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <AffiliateCTA
                  partner="hotels"
                  sid="icebar_band_arctic_snowhotel"
                  destination="Arctic SnowHotel & Glass Igloos"
                  className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-3 rounded-full font-semibold text-sm transition-all shadow-lg shadow-amber/20 no-underline"
                >
                  <Hotel size={16} />
                  {t('iceBars.band.ctaArctic')}
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="icebar_band_lainio"
                  destination="Kittilä, Finland"
                  className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all border border-white/15 no-underline"
                >
                  <Hotel size={16} />
                  {t('iceBars.band.ctaLainio')}
                </AffiliateCTA>
              </div>
              </div>
            </div>
          </div>
          <AffiliateDisclosure variant="full" className="mt-10 text-white/45 max-w-2xl mx-auto" />
        </div>
      </section>

    </>
  );
}
