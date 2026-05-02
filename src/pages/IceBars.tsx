import { Snowflake, Thermometer, MapPin, Hotel, ExternalLink, Ticket, Calendar } from 'lucide-react';
import { BARS } from '../data/images';
import { iceBars } from '../data/bars';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import { gygDeepLink } from '../lib/gyg';

export default function IceBars() {
  return (
    <>
      <PageSeo
        title="Ice Bars in Finnish Lapland"
        description="Built from snow and ice every winter, melted every spring. A guide to the actual ice bars in Finnish Lapland — Arctic SnowHotel, Lainio Snow Village, and what to expect inside."
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
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/65 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="flex justify-center mb-4">
            <Snowflake size={32} className="text-ice" />
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Ice Bars
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Built from snow and ice every winter. Melted every spring. Gone until next December.
            This is not a theme bar — it's a seasonal Arctic phenomenon.
          </p>
        </div>
      </section>

      {/* What is an ice bar */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-white/60 leading-relaxed">
            <p>
              Every autumn, crews of ice artists and construction workers descend on the snow villages of
              Finnish Lapland. They cut blocks of ice from frozen lakes, pack tonnes of snow into
              moulds, and sculpt bars, chairs, arches and figures by hand. By December, the results
              are ready: fully functioning bars operating at -5°C, where every surface — walls,
              bar counter, glasses — is made of ice.
            </p>
            <p>
              Each year brings a new theme. The sculptures are never the same. What you experience in
              one winter won't exist in the next. That impermanence is the point. An ice bar is,
              by definition, temporary — which is what makes it worth experiencing before it's gone.
            </p>
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
            {iceBars.map((bar) => (
              <div
                key={bar.name}
                className="bg-white/[0.03] border border-ice/15 rounded-2xl p-6 hover:border-ice/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-ice text-xs uppercase tracking-widest mb-4">
                  <Snowflake size={14} />
                  Ice Bar
                </div>
                <h3 className="font-heading text-xl text-white tracking-wide mb-1">{bar.name}</h3>
                <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
                  <MapPin size={11} className="text-ice" />
                  {bar.location}
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-4">{bar.description}</p>
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Snowflake size={11} className="text-ice" />
                    {bar.highlight}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Thermometer size={11} className="text-ice" />
                    {bar.temp}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Calendar size={11} className="text-ice" />
                    {bar.season}
                  </div>
                  <p className="text-xs text-white font-semibold pt-1">{bar.price}</p>
                </div>

                {/* Visit CTA — deep-linked GYG product (verified slug) */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-amber text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Ticket size={11} />
                    Book the visit
                  </div>
                  <a
                    href={gygDeepLink(bar.visitGygProductPath, bar.visitSid)}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="inline-flex items-center justify-center gap-1.5 w-full bg-amber hover:bg-amber/90 text-night px-3 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-amber/20 no-underline"
                  >
                    <Ticket size={12} />
                    Check availability & book
                  </a>
                </div>

                {/* Hotel CTA — on-site lodging */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[11px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Hotel size={11} className="text-amber" />
                    Stay on-site
                  </p>
                  <p className="text-xs text-white/55 mb-2 leading-relaxed">{bar.stayHint}</p>
                  <AffiliateCTA
                    partner="hotels"
                    sid={bar.staySid}
                    destination={bar.stayQuery}
                    className="inline-flex items-center gap-1.5 text-amber/90 hover:text-amber text-xs font-semibold no-underline"
                  >
                    Book a room nearby
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
                      className="inline-flex items-center gap-1 text-[11px] text-white/35 hover:text-white/60 no-underline transition-colors"
                    >
                      Venue website <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Lodging-first band — snow suites are a Lapland icon */}
          <div className="mt-12 bg-gradient-to-br from-ice/[0.06] via-night/0 to-amber/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber/15 border border-amber/30 text-amber text-[11px] font-semibold uppercase tracking-widest mb-3">
                  <Snowflake size={11} />
                  Sleep in the snow
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">
                  Don't just visit. Sleep in a snow room.
                </h3>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                  Snow suites at Arctic SnowHotel, Lainio Snow Village and Kakslauttanen rebuild every December. -5 °C
                  inside, thermal-rated sleeping bag, breakfast in the warm restaurant. One night is plenty — you'll
                  remember it for years.
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
                  Arctic SnowHotel rooms
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="icebar_band_lainio"
                  destination="Lainio Snow Village, Ylläs, Finland"
                  className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all border border-white/15 no-underline"
                >
                  <Hotel size={16} />
                  Lainio Snow Village
                </AffiliateCTA>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-8 text-center">What to Expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: 'Temperature', body: 'Around -5°C inside. All ice bars provide thermal capes, suits or jackets included in the entry price. Dress in layers underneath.' },
              { title: 'Duration', body: 'Most visitors spend 20–45 minutes inside. Enough for 1–2 drinks and photos. Your fingers will tell you when it\'s time to leave.' },
              { title: 'Drinks', body: 'Classic cocktails, warm mulled wine, and Arctic-inspired specials. Served in cups or glasses made of ice — yes, you drink from ice.' },
              { title: 'Season', body: 'Open from approximately December to April, depending on temperatures. Some years are longer. Ice bars do not exist in summer.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <h3 className="font-heading text-lg text-ice tracking-wide mb-2">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
