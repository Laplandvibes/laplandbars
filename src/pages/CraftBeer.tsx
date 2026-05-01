import { Beer, Hotel, ExternalLink, Compass } from 'lucide-react';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';

const breweries = [
  {
    name: 'Lapon Panimo',
    location: 'Saariselkä',
    description: 'The northernmost craft brewery in Finland. Founded in Saariselkä — one of the most remote locations any brewery operates from. Their beers use pure Arctic water and locally inspired ingredients: spruce tips, lingonberries, rye. The brewery has a small pub where you can drink fresh beer metres from where it was made.',
    beers: ['Arctic Lager', 'Spruce Tip Pale Ale', 'Lingonberry Wheat', 'Dark Arctic Porter'],
    featured: true,
  },
  {
    name: 'Tornion Panimo',
    location: 'Tornio (Swedish border)',
    description: 'Award-winning craft brewery at the Swedish-Finnish border town of Tornio. Known for their Arctic Circle Ale and innovative Nordic-style brewing. They export throughout the Nordics and have won multiple awards at Scandinavian beer competitions.',
    beers: ['Arctic Circle Ale', 'Border Stout', 'Midnight Sun IPA', 'Nordic Lager'],
    featured: true,
  },
  {
    name: 'Lapland Brewery',
    location: 'Rovaniemi',
    description: 'The brewery pub in Rovaniemi city centre. Beers brewed on-site, served at the bar alongside the tanks. Watch the brewing process while drinking the results. Their seasonal releases often incorporate ingredients foraged from the Lappish forest around the city.',
    beers: ['House Lager', 'Amber Fell Ale', 'Smoked Rye Porter', 'Seasonal specials'],
    featured: false,
  },
];

const beerStyles = [
  {
    style: 'Arctic Lager',
    desc: 'Clean, crisp, brewed with glacial Arctic water. The baseline of Finnish craft beer — deceptively simple, surprisingly good.',
  },
  {
    style: 'Spruce Tip Ale',
    desc: 'Foraged spruce tips collected in spring. Resinous, herbal, unlike anything from a southern brewery. A genuinely Arctic flavour.',
  },
  {
    style: 'Berry Wheat',
    desc: 'Wild lingonberry or cloudberry added to a wheat beer base. Tart, fruity, and seasonal — you can taste where it came from.',
  },
  {
    style: 'Smoked Porter',
    desc: 'Rich, dark, with smoke from Finnish birch wood. A winter beer for cold nights by a fire. Pairs well with reindeer.',
  },
  {
    style: 'Rye Saison',
    desc: 'Finnish rye — a staple grain of northern food culture — used in a Belgian-style saison. Earthy, spicy, unusual.',
  },
  {
    style: 'Midnight Sun IPA',
    desc: 'Brewed during the polar day in summer. Citrus-forward, bitter, and named after the phenomenon that makes Arctic hop growing possible.',
  },
];

export default function CraftBeer() {
  return (
    <>
      <PageSeo
        title="Craft Beer in Lapland — Local Breweries & Where to Drink"
        description="Lapland craft beer guide: Lapin Panimo, Mathildedal, and the pubs across Rovaniemi, Levi and Saariselkä that pour the local taps."
        path="/craft-beer"
        jsonLd={[
          pillarBreadcrumb('Craft Beer', '/craft-beer'),
          articleSchema(
            'Craft Beer in Finnish Lapland',
            'Local breweries and where to find them on tap.',
            '/craft-beer'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.craftBeerGlasses}
          alt="Craft beer in Lapland"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/65 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Craft Beer
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            Finnish craft beer is built on the same principles as Finnish food: pure water,
            wild local ingredients, and no shortcuts. The Arctic brings its own flavour
            to every pint.
          </p>
        </div>
      </section>

      {/* Brewery listings */}
      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="relative rounded-2xl overflow-hidden h-72">
              <img src={BARS.breweryInterior} alt="Lapon Panimo brewery" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white/70 text-sm font-medium">Lapon Panimo, Saariselkä</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-72">
              <img src={BARS.craftBeerGlasses} alt="Craft beer glasses" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breweries.map((brewery) => (
              <div
                key={brewery.name}
                className={`bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 hover:border-amber/20 ${
                  brewery.featured ? 'border-amber/20' : 'border-white/10'
                }`}
              >
                {brewery.featured && (
                  <div className="flex items-center gap-2 text-amber text-xs uppercase tracking-widest mb-4">
                    <Beer size={12} />
                    Featured Brewery
                  </div>
                )}
                <h3 className="font-heading text-xl text-white tracking-wide mb-1">{brewery.name}</h3>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-4">{brewery.location}</p>
                <p className="text-sm text-white/55 leading-relaxed mb-5">{brewery.description}</p>
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Known Beers</p>
                  <div className="flex flex-wrap gap-2">
                    {brewery.beers.map((beer) => (
                      <span key={beer} className="text-xs bg-amber/8 text-amber/70 px-2 py-1 rounded-full">
                        {beer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beer styles */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl text-white tracking-wide mb-4">
              Arctic Beer Styles
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Finnish craft brewers use ingredients from the same landscape as the chefs.
              The forest floor is as important as the brewery.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {beerStyles.map((s) => (
              <div key={s.style} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-amber/20 transition-all">
                <h3 className="font-heading text-lg text-amber tracking-wide mb-2">{s.style}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brewery & food tours via GetYourGuide */}
      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ice/10 border border-ice/30 text-ice text-[11px] font-semibold uppercase tracking-widest mb-3">
              <Compass size={11} />
              Tours & tastings
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">
              Brewery & food tours bookable now
            </h2>
            <p className="text-white/55 text-sm sm:text-base max-w-2xl mx-auto">
              Live availability from GetYourGuide. Brewery visits, distillery tastings and Lappish food experiences in
              Rovaniemi, Saariselkä and beyond.
            </p>
          </div>

          {/* GYG widget — auto-populated by the Integration Analyzer in <head> */}
          <div
            data-gyg-widget="activities"
            data-gyg-partner-id="VRMKD7N"
            data-gyg-number-of-items="6"
            data-gyg-cmp="laplandbars-craftbeer"
            data-gyg-q="Lapland brewery beer tour tasting"
            data-gyg-locale-code="en-US"
            data-gyg-currency="EUR"
            className="min-h-[200px]"
          />

          {/* Fallback link if GYG returns no brewery-specific results */}
          <div className="mt-8 text-center">
            <AffiliateCTA
              partner="activities"
              sid="craftbeer_gyg_lapland_food"
              destination="rovaniemi-l2653"
              className="inline-flex items-center gap-2 text-amber hover:text-amber/80 text-sm font-semibold no-underline"
            >
              See all food & drink experiences in Lapland on GetYourGuide
              <ExternalLink size={14} />
            </AffiliateCTA>
          </div>
        </div>
      </section>

      {/* Stay near the brewery */}
      <section className="py-16 bg-night/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber/[0.06] via-night/0 to-ice/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2">
                <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Hotel size={11} />
                  Stay near the brewery
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-3">
                  Skip the taxi — book a hotel within walking distance
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Lapon Panimo's pub closes at 11pm. Tornion Panimo is across the river from town. Lapland Brewery sits
                  in central Rovaniemi. Pick the brewery, book a hotel within walking distance.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <AffiliateCTA
                  partner="hotels"
                  sid="craftbeer_stay_saariselka_lapon"
                  destination="Saariselkä, Lapland, Finland"
                  className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all no-underline"
                >
                  <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> Saariselkä (Lapon Panimo)</span>
                  <ExternalLink size={13} className="text-white/40" />
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="craftbeer_stay_rovaniemi"
                  destination="Rovaniemi, Lapland, Finland"
                  className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all no-underline"
                >
                  <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> Rovaniemi (Lapland Brewery)</span>
                  <ExternalLink size={13} className="text-white/40" />
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="craftbeer_stay_tornio"
                  destination="Tornio, Finland"
                  className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all no-underline"
                >
                  <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> Tornio (Tornion Panimo)</span>
                  <ExternalLink size={13} className="text-white/40" />
                </AffiliateCTA>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
