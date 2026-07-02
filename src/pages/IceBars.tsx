import { Snowflake, Thermometer, MapPin, Hotel, ExternalLink, Ticket, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import { iceBars, pickLocalised } from '../data/bars';
import { useLocale } from '../i18n/useLocale';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { gygDeepLink } from '../lib/gyg';

type ExpectItem = { title: string; body: string };

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
          alt="Ice bar interior with sculptures"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)' }} />
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

      {/* Ice bar listings */}
      <section className="py-8 pb-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Featured image left */}
            <div className="relative rounded-2xl overflow-hidden h-80 lg:h-auto min-h-[320px]">
              <img
                src={BARS.iceBarTunnel}
                alt="Ice bar tunnel"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden h-80 lg:h-auto min-h-[320px]">
              <img
                src={BARS.iceBarDrinks}
                alt="Drinks on ice bar counter"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {iceBars.map((bar) => {
              const description = t(`iceBars.venues.${bar.name}.description`, { defaultValue: bar.description });
              const highlight = t(`iceBars.venues.${bar.name}.highlight`, { defaultValue: bar.highlight });
              const stayHint = t(`iceBars.venues.${bar.name}.stayHint`, { defaultValue: bar.stayHint });
              return (
                <div
                  key={bar.name}
                  className="bg-white/[0.03] border border-ice/15 rounded-2xl p-6 hover:border-ice/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-ice text-xs uppercase tracking-widest mb-4">
                    <Snowflake size={14} />
                    {t('iceBars.iceBarKicker')}
                  </div>
                  <h3 className="font-heading text-xl text-white tracking-wide mb-1">{bar.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/65 mb-4">
                    <MapPin size={11} className="text-ice" />
                    {bar.location}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">{description}</p>
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <Snowflake size={11} className="text-ice" />
                      {highlight}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <Thermometer size={11} className="text-ice" />
                      {pickLocalised(bar.temp, locale)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <Calendar size={11} className="text-ice" />
                      {pickLocalised(bar.season, locale)}
                    </div>
                    <p className="text-xs text-white font-semibold pt-1">{pickLocalised(bar.price, locale)}</p>
                  </div>

                  {/* Visit CTA — deep-linked GYG product (verified slug) */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-amber text-[10px] font-bold uppercase tracking-widest mb-2">
                      <Ticket size={11} />
                      {t('iceBars.bookKicker')}
                    </div>
                    <a
                      href={gygDeepLink(bar.visitGygProductPath, bar.visitSid)}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-amber hover:bg-amber/90 text-night px-3 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
                    >
                      <Ticket size={12} />
                      {t('iceBars.bookCta')}
                    </a>
                  </div>

                  {/* Hotel CTA — on-site lodging */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[11px] text-white/75 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Hotel size={11} className="text-amber" />
                      {t('iceBars.stayKicker')}
                    </p>
                    <p className="text-xs text-white/80 mb-2 leading-relaxed">{stayHint}</p>
                    <AffiliateCTA
                      partner="hotels"
                      sid={bar.staySid}
                      destination={bar.stayQuery}
                      className="inline-flex items-center gap-1.5 text-amber/90 hover:text-amber text-xs font-semibold no-underline"
                    >
                      {t('iceBars.stayCta')}
                      <ExternalLink size={11} />
                    </AffiliateCTA>
                  </div>

                  {/* Secondary venue website */}
                  {bar.website && (
                    <div className="mt-3 text-right">
                      <a
                        href={bar.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-white/65 hover:text-white/80 no-underline transition-colors"
                      >
                        {t('iceBars.venueWebsite')} <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lodging-first band — snow suites are a Lapland icon */}
          <div className="mt-12 bg-gradient-to-br from-ice/[0.06] via-night/0 to-amber/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-[11px] font-semibold uppercase tracking-widest mb-3">
                  <Snowflake size={11} />
                  {t('iceBars.band.kicker')}
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">
                  {t('iceBars.band.title')}
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {t('iceBars.band.body')}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <AffiliateCTA
                  partner="hotels"
                  sid="icebar_band_arctic_snowhotel"
                  destination="Arctic SnowHotel, Rovaniemi, Finland"
                  className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-3 rounded-full font-semibold text-sm transition-all shadow-lg shadow-amber/20 no-underline"
                >
                  <Hotel size={16} />
                  {t('iceBars.band.ctaArctic')}
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="icebar_band_lainio"
                  destination="Lainio Snow Village, Ylläs, Finland"
                  className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all border border-white/15 no-underline"
                >
                  <Hotel size={16} />
                  {t('iceBars.band.ctaLainio')}
                </AffiliateCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-8 text-center">{t('iceBars.expect.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {expectItems.map((item) => (
              <div key={item.title} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <h3 className="font-heading text-lg text-ice tracking-wide mb-2">{item.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed text-pretty">{item.body}</p>
              </div>
            ))}
          </div>
          <AffiliateDisclosure variant="full" className="mt-10 text-white/45 max-w-2xl mx-auto" />
        </div>
      </section>
    </>
  );
}
