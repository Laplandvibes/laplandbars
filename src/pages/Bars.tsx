import { MapPin, Clock, ExternalLink, Hotel } from 'lucide-react';
import { BARS } from '../data/images';
import { bars, cities } from '../data/bars';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';

const barImages: Record<string, string> = {
  // Rovaniemi — each unique
  'Lapland Brewery Pub': BARS.breweryInterior,
  'Café & Bar 21': BARS.cocktailTrio,
  'Uitto Pub': BARS.friendsFireplace2,
  'Nook Lounge': BARS.lingonberryCocktails,
  'Bull Bar & Grill': BARS.friendsFireplace,
  'Ice Bar @ Arctic SnowHotel': BARS.iceBarDrinks,
  // Levi — each unique
  'Hullu Poro Areena': BARS.apresSkiTwilight,
  'Bar Ihku': BARS.liveMusic,
  'Pub Hölmölä': BARS.craftBeerGlasses,
  'Pub Sohva': BARS.beerFlight,
  'Bar Alakerta': BARS.skiersApres,
  'Pub Old Mates': BARS.cabinBarInterior,
  // Ylläs — each unique
  'Selvä Pyy': BARS.cabinPubExterior,
  'Pirtukellari Night Club': BARS.apresSkiAerial,
  // Saariselkä — each unique
  'Gastropub Giitu': BARS.breweryTaps,
  'Pirtti Pub & Restaurant': BARS.auroraLounge,
};

const cityVibes: Record<string, { desc: string; image: string }> = {
  Rovaniemi: {
    desc: 'The Arctic capital after dark — craft brewery pubs, cocktail bars, and an actual bar made of ice.',
    image: BARS.whiskyBar,
  },
  Levi: {
    desc: 'Finland\'s après-ski capital. Hullu Poro Areena holds 1,700 people. The mountain closes at 4pm and the party starts at 4:01.',
    image: BARS.apresSkiLevi,
  },
  Ylläs: {
    desc: 'Quieter than Levi, warmer than anywhere. Cosy fell pubs where locals and visitors mix without pretension.',
    image: BARS.heroNightlife,
  },
  Saariselkä: {
    desc: 'Remote, dark, and surprisingly well-stocked. Gastropub Giitu has one of the best craft beer selections above the Arctic Circle.',
    image: BARS.heroMain,
  },
};

export default function Bars() {
  return (
    <>
      <PageSeo
        title="Best Bars & Pubs in Finnish Lapland"
        description="A city-by-city guide to bars and pubs across Finnish Lapland — Rovaniemi, Levi, Ylläs, Saariselkä. Featured venues, local picks, and the actual atmosphere of each."
        path="/bars"
        jsonLd={[
          pillarBreadcrumb('Bars', '/bars'),
          articleSchema(
            'Best Bars & Pubs in Finnish Lapland',
            'City-by-city guide to bars and pubs in Lapland.',
            '/bars'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.pubExterior}
          alt="Lapland bar exterior at night"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/65 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Bars & Pubs
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Every bar listed here is real, open, and worth your evening.
            No sponsored placements, no filler — just Lapland's actual drinking culture.
          </p>
        </div>
      </section>

      {/* Bars by city */}
      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {cities.map((city) => {
            const cityBars = bars.filter((b) => b.city === city);
            const vibe = cityVibes[city];
            return (
              <div key={city} id={city.toLowerCase().replace(/[^a-z]/g, '')}>
                {/* City header */}
                <div className="relative rounded-2xl overflow-hidden h-48 mb-8">
                  <img
                    src={vibe.image}
                    alt={city}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center px-8">
                    <div className="flex items-center gap-2 text-amber text-sm font-semibold tracking-widest uppercase mb-2">
                      <MapPin size={14} />
                      {city}
                    </div>
                    <h2 className="font-heading text-4xl text-white tracking-wide mb-2">{city}</h2>
                    <p className="text-white/60 text-sm max-w-md leading-relaxed">{vibe.desc}</p>
                  </div>
                </div>

                {/* Bar cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cityBars.map((bar) => (
                    <div
                      key={bar.name}
                      className={`group bg-white/[0.03] border rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber/25 flex flex-col ${
                        bar.featured ? 'border-amber/20 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]' : 'border-white/10'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden shrink-0">
                        <img
                          src={barImages[bar.name] || BARS.heroMain}
                          alt={bar.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-night/30" />
                        {bar.featured && (
                          <span className="absolute top-3 left-3 text-xs bg-amber/90 text-night px-2.5 py-0.5 rounded-full font-bold">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-heading text-lg text-white tracking-wide mb-1 group-hover:text-amber transition-colors">{bar.name}</h3>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-3">{bar.type}</p>
                        <p className="text-sm text-white/55 leading-relaxed mb-4">{bar.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {bar.highlights.slice(0, 3).map((h) => (
                            <span key={h} className="text-xs bg-amber/10 text-amber/70 px-2 py-1 rounded-full">
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Info block */}
                        <div className="mt-auto space-y-2 pt-4 border-t border-white/5">
                          <div className="flex items-start gap-2">
                            <MapPin size={13} className="text-amber/60 mt-0.5 shrink-0" />
                            <p className="text-xs text-white/40 leading-relaxed">{bar.address}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock size={13} className="text-amber/60 mt-0.5 shrink-0" />
                            <p className="text-xs text-white/40 leading-relaxed">{bar.hours}</p>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <p className="text-xs text-amber/70 font-medium">{bar.price}</p>
                            {bar.website && (
                              <a
                                href={bar.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber/80 no-underline font-medium transition-colors"
                              >
                                Website <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Per-city hotel CTA — sleep within walking distance */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber/[0.04] border border-amber/15 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber/15 flex items-center justify-center">
                      <Hotel size={18} className="text-amber" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-snug">
                        Stay walking distance from these {city} bars
                      </p>
                      <p className="text-white/50 text-xs leading-relaxed mt-0.5">
                        Live availability via Hotels.com — book directly, no extra fees.
                      </p>
                    </div>
                  </div>
                  <AffiliateCTA
                    partner="hotels"
                    sid={`bars_city_stay_${city.toLowerCase().replace(/[^a-z]/g, '')}`}
                    destination={`${city}, Lapland, Finland`}
                    className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
                  >
                    {`Hotels in ${city}`}
                    <ExternalLink size={14} />
                  </AffiliateCTA>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/25 text-sm leading-relaxed">
            Prices and opening hours change seasonally. Always verify directly with the venue before visiting.
            This guide is maintained as accurately as possible but is not a real-time booking platform.
          </p>
        </div>
      </section>
    </>
  );
}
