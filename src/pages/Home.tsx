import { ChevronDown, MapPin, ExternalLink, Snowflake, Music, Beer, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BARS } from '../data/images';
import { getFeaturedBars, cities } from '../data/bars';
import PageSeo from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import Newsletter from '../components/Newsletter';

const barImages: Record<string, string> = {
  'Lapland Brewery Pub': BARS.breweryInterior,
  'Café & Bar 21': BARS.cocktailTrio,
  'Ice Bar @ Arctic SnowHotel': BARS.iceBarDrinks,
  'Hullu Poro Areena': BARS.apresSkiTwilight,
  'Bar Ihku': BARS.liveMusic,
  'Selvä Pyy': BARS.cabinPubExterior,
  'Gastropub Giitu': BARS.breweryTaps,
};

const categoryCards = [
  {
    title: 'Ice Bars',
    desc: 'Drink from glasses made of ice inside bars carved from snow and ice. A uniquely Arctic experience rebuilt every winter.',
    image: BARS.heroIceBars,
    to: '/ice-bars',
    icon: Snowflake,
  },
  {
    title: 'Après-Ski',
    desc: 'From Hullu Poro Areena\'s 1,700-person stage to cosy fell pubs. Lapland après-ski is legendary for good reason.',
    image: BARS.heroApres,
    to: '/apres-ski',
    icon: Beer,
  },
  {
    title: 'Live Music',
    desc: 'Open stage jams, live bands, karaoke in wooden barns. The best music nights in Lapland happen after the Northern Lights come out.',
    image: BARS.liveMusic,
    to: '/bars',
    icon: Music,
  },
];

export default function Home() {
  const featured = getFeaturedBars();

  return (
    <>
      <PageSeo
        title="LaplandBars — Best Bars, Pubs & Ice Bars in Finnish Lapland"
        description="The best bars, pubs, ice bars and après-ski venues in Finnish Lapland — Rovaniemi, Levi, Ylläs, Saariselkä. Verified by people who actually live here."
        path="/"
        jsonLd={[
          {
            '@type': 'WebPage',
            name: 'LaplandBars — Best Bars, Pubs & Ice Bars in Finnish Lapland',
            url: 'https://laplandbars.com/',
            description: 'Definitive guide to bars and nightlife in Finnish Lapland.',
            inLanguage: 'en',
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'When are ice bars open in Finnish Lapland?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Ice bars are open roughly from December through early April, depending on temperatures. They are rebuilt from snow and ice every winter and melt away each spring — they do not exist in summer.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the après-ski scene like in Lapland?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Levi and Ylläs run the busiest après-ski in Finland — Hullu Poro Areena seats 1,700 and headlines big names through the season. Saariselkä and Pyhä keep things smaller and more intimate.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can you drink Finnish craft beer in Lapland?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes — local breweries like Lapin Panimo (Tornio) and Mathildedal in Rovaniemi serve their beers in pubs across the region. Most bars carry at least a few Finnish craft taps alongside Lapin Kulta.',
                },
              },
            ],
          },
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={BARS.heroMain}
          alt="Aurora bar in Lapland"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/60 to-night/95" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-amber text-sm font-semibold tracking-[0.3em] uppercase mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">Finnish Lapland</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Raise a Glass<br />to the Arctic
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Ice bars carved from snow. Legendary après-ski arenas. Cosy pubs with Northern Lights through the window.
            The best bars in Finnish Lapland — real and verified.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <AffiliateCTA
              partner="hotels"
              sid="home_hero_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              <Hotel size={20} />
              Find a Stay Nearby
            </AffiliateCTA>
            <Link
              to="/bars"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/20 no-underline"
            >
              Browse Bars
              <ChevronDown size={20} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white/50" />
        </div>
      </section>

      {/* Featured bars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              Featured Venues
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Handpicked bars and experiences that define Lapland nightlife.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((bar) => (
              <Link
                key={bar.name}
                to="/bars"
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber/30 transition-all duration-300 flex flex-col no-underline"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img
                    src={barImages[bar.name] || BARS.heroMain}
                    alt={bar.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-night/30" />
                  <div className="absolute top-3 left-3 bg-amber/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-night">{bar.price.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading text-xl tracking-wide text-white group-hover:text-amber transition-colors mb-1">
                    {bar.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
                    <MapPin size={12} className="text-amber shrink-0" />
                    {bar.city}
                    <span className="text-white/20">·</span>
                    <span className="truncate">{bar.type}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
                    {bar.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bar.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="text-xs bg-amber/10 text-amber/70 px-2 py-1 rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/bars"
              className="inline-flex items-center gap-2 text-amber hover:text-amber/80 font-semibold transition-colors no-underline"
            >
              View All Bars
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              Three Ways to Drink in Lapland
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.to}
                  className="group relative rounded-2xl overflow-hidden h-96 no-underline block"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <div className="w-12 h-12 bg-amber/20 rounded-xl flex items-center justify-center mb-3">
                      <Icon size={24} className="text-amber" />
                    </div>
                    <h3 className="font-heading text-2xl text-white tracking-wide mb-2">{card.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* By city */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-night overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-[120px] animate-[aurora-drift_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ice/5 rounded-full blur-[100px] animate-[aurora-drift_14s_ease-in-out_infinite_reverse]" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
            Browse by Destination
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12">
            Choose your resort and discover what\'s open tonight.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, i) => (
              <Link
                key={city}
                to={`/bars#${city.toLowerCase().replace(/[^a-z]/g, '')}`}
                className="group px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-amber/10 hover:border-amber/40 hover:text-amber hover:scale-105 transition-all duration-300 font-medium no-underline"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MapPin size={14} className="inline mr-2 -mt-0.5 group-hover:text-amber transition-colors" />
                {city}
              </Link>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-12 text-center">
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">16</p>
              <p className="text-white/40 text-sm mt-1">Verified venues</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">4</p>
              <p className="text-white/40 text-sm mt-1">Destinations</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-amber tracking-wide">3</p>
              <p className="text-white/40 text-sm mt-1">Ice bars</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter — pink gradient section, only non-dark surface on the page */}
      <Newsletter />

      {/* Stay near the action — lodging-first affiliate band */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-night-light/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-semibold tracking-widest uppercase mb-4">
              <Hotel size={12} />
              Stay nearby
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-4">
              Sleep Walking Distance from the Bar
            </h2>
            <p className="text-white/55 text-lg max-w-2xl mx-auto">
              Pick where you want to drink, book a room around the corner. Live availability via Hotels.com.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { city: 'Rovaniemi', sid: 'home_stay_rovaniemi', sub: 'Bars + ice bars · airport access' },
              { city: 'Levi', sid: 'home_stay_levi', sub: 'Hullu Poro après-ski · slope-side' },
              { city: 'Ylläs', sid: 'home_stay_yllas', sub: 'Lainio Snow Village · forest pubs' },
              { city: 'Saariselkä', sid: 'home_stay_saariselka', sub: 'Aurora pubs · Inari/Kakslauttanen close' },
            ].map((d) => (
              <AffiliateCTA
                key={d.city}
                partner="hotels"
                sid={d.sid}
                destination={`${d.city}, Lapland, Finland`}
                className="group bg-white/[0.03] border border-white/10 hover:border-amber/40 rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.05] no-underline flex flex-col"
              >
                <div className="flex items-center gap-2 text-amber/80 group-hover:text-amber text-xs uppercase tracking-widest mb-3 transition-colors">
                  <MapPin size={12} />
                  {d.city}
                </div>
                <h3 className="font-heading text-2xl text-white tracking-wide mb-1.5 group-hover:text-amber transition-colors">
                  Stay in {d.city}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">{d.sub}</p>
                <div className="flex items-center gap-1.5 text-amber text-sm font-semibold">
                  Browse hotels
                  <ExternalLink size={14} />
                </div>
              </AffiliateCTA>
            ))}
          </div>

          <p className="text-white/35 text-xs text-center mt-8 max-w-2xl mx-auto leading-relaxed">
            Hotels.com bookings via go.laplandvibes.com — affiliate commission supports the site at no extra cost to you.
          </p>
        </div>
      </section>
    </>
  );
}
