import { Mountain, Music, Beer, Hotel, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';

// Hotel search query + sid per resort (for Hotels.com via go.laplandvibes.com)
const resortStays: Record<string, { query: string; sid: string; hint: string }> = {
  Levi: { query: 'Levi, Lapland, Finland', sid: 'apres_stay_levi', hint: 'Slope-side at Hullu Poro, Levi Hotel Spa, K5 Levi.' },
  'Ylläs': { query: 'Ylläs, Lapland, Finland', sid: 'apres_stay_yllas', hint: 'Lapland Hotels Äkäshotelli, log cabins, ski-in/ski-out.' },
  'Saariselkä': { query: 'Saariselkä, Lapland, Finland', sid: 'apres_stay_saariselka', hint: 'Holiday Club Saariselkä, Santa\'s Hotel, glass igloos nearby.' },
  'Pyhä': { query: 'Pyhä, Lapland, Finland', sid: 'apres_stay_pyha', hint: 'Pyhä Igloos, Hotel Pyhätunturi, log cabin chalets.' },
};

const spots = [
  {
    resort: 'Levi',
    image: BARS.apresSkiLevi,
    venues: [
      {
        name: 'Hullu Poro Areena',
        type: 'Live Music Arena',
        desc: 'The undisputed king. 1,700-capacity venue at the base of the front slope. Top Finnish artists, DJs and live bands nightly during ski season. The après-ski that other Lapland resorts aspire to.',
        highlight: true,
      },
      {
        name: 'Bar Levi Ihku',
        type: 'Nightclub',
        desc: 'A Levi legend. Already full by 9pm and going strong at 2am. Karaoke, dancing, Finnish locals and international skiers — everyone ends up here eventually.',
        highlight: false,
      },
      {
        name: 'Bar Alakerta',
        type: 'Live Music Bar',
        desc: 'Open Stage Jams on Sundays. The après-ski for people who\'d rather listen to a guitarist than a DJ. Sunny terrace, proper atmosphere.',
        highlight: false,
      },
      {
        name: 'Pub Hölmölä',
        type: 'Pub',
        desc: '"Levi\'s funniest pub." Board games, billiards, brewery beers, and bar food. The slow-down option after a big day on the slopes.',
        highlight: false,
      },
    ],
  },
  {
    resort: 'Ylläs',
    image: BARS.heroApres,
    venues: [
      {
        name: 'Selvä Pyy',
        type: 'Pub & Restaurant',
        desc: 'The go-to après-ski spot in Äkäslompolo village. Craft beers, cocktails, Finnish pub food in a log-cabin atmosphere. Finnish locals and resort visitors sharing the same space — warm, easy, unpretentious.',
        highlight: true,
      },
      {
        name: 'Pirtukellari Night Club',
        type: 'Nightclub',
        desc: 'The only nightclub in Ylläs, tucked inside Lapland Hotels Äkäshotelli. When the pubs wind down, the party moves underground. Fri–Sat only, but peak season nights are genuinely wild.',
        highlight: false,
      },
    ],
  },
];

export default function ApresSki() {
  return (
    <>
      <PageSeo
        title="Après-Ski Bars in Lapland — Levi, Ylläs, Saariselkä"
        description="From Hullu Poro Areena's 1,700-person stage to slope-side log cabins. A guide to après-ski venues across Lapland's ski resorts."
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
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/65 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Après-Ski
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            In Lapland, the slopes close at 4pm and the party starts at 4:01.
            Finnish après-ski is louder, warmer, and more honest than anywhere else.
          </p>
        </div>
      </section>

      {/* What makes Lapland après-ski different */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mountain, title: 'Slope-side', body: 'The best après-ski bars are literally at the base of the slopes. Ski to the door, skis on the rack, beer in hand.' },
              { icon: Music, title: 'Live music', body: 'Not DJs with laptops — actual bands. Finnish rock, folk, and pop performed in wooden venues with proper stage lighting.' },
              { icon: Beer, title: 'Finnish spirit', body: 'No pretension. Finnish après-ski is for everyone: locals, tourists, families, groups. The atmosphere is the attraction.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-amber" />
                </div>
                <h3 className="font-heading text-lg text-white tracking-wide mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venues by resort */}
      <section className="pb-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {spots.map((resort) => (
            <div key={resort.resort}>
              <div className="relative rounded-2xl overflow-hidden h-44 mb-8">
                <img src={resort.image} alt={resort.resort} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/60 to-transparent" />
                <div className="absolute inset-0 flex items-center px-8">
                  <h2 className="font-heading text-4xl text-white tracking-wide">{resort.resort}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {resort.venues.map((venue) => (
                  <div
                    key={venue.name}
                    className={`bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 hover:border-amber/20 ${
                      venue.highlight ? 'border-amber/20' : 'border-white/10'
                    }`}
                  >
                    {venue.highlight && (
                      <span className="inline-block text-xs bg-amber/15 text-amber px-2 py-0.5 rounded-full mb-3 font-medium">
                        #1 in {resort.resort}
                      </span>
                    )}
                    <h3 className="font-heading text-xl text-white tracking-wide mb-1">{venue.name}</h3>
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-3">{venue.type}</p>
                    <p className="text-sm text-white/55 leading-relaxed">{venue.desc}</p>
                  </div>
                ))}
              </div>

              {/* Per-resort lodging CTA */}
              {resortStays[resort.resort] && (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber/[0.05] border border-amber/15 rounded-xl p-5">
                  <div>
                    <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Hotel size={11} />
                      Stay in {resort.resort}
                    </p>
                    <p className="text-white/65 text-sm leading-relaxed">{resortStays[resort.resort].hint}</p>
                  </div>
                  <AffiliateCTA
                    partner="hotels"
                    sid={resortStays[resort.resort].sid}
                    destination={resortStays[resort.resort].query}
                    className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
                  >
                    Find a hotel
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
                Skiing further north?
              </h3>
              <p className="text-white/55 text-sm max-w-xl mx-auto">
                Saariselkä and Pyhä are quieter, more intimate après-ski destinations than Levi or Ylläs. Worth it for the smaller crowds and aurora-bar density.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <AffiliateCTA
                partner="hotels"
                sid="apres_band_saariselka"
                destination="Saariselkä, Lapland, Finland"
                className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all no-underline"
              >
                <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> Saariselkä hotels</span>
                <ExternalLink size={13} className="text-white/40" />
              </AffiliateCTA>
              <AffiliateCTA
                partner="hotels"
                sid="apres_band_pyha"
                destination="Pyhä, Lapland, Finland"
                className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all no-underline"
              >
                <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> Pyhä hotels</span>
                <ExternalLink size={13} className="text-white/40" />
              </AffiliateCTA>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-4">See All Bars</h2>
          <p className="text-white/50 mb-8">Browse the full list of bars and pubs across all four destinations.</p>
          <Link
            to="/bars"
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
          >
            All Bars & Pubs
          </Link>
        </div>
      </section>
    </>
  );
}
