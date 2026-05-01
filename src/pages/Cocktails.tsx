import { Hotel, ExternalLink } from 'lucide-react';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';

const cocktails = [
  {
    name: 'Cloudberry Sour',
    ingredients: 'Finnish gin · cloudberry liqueur · lemon juice · egg white · sugar syrup',
    description: 'The signature Arctic cocktail. Cloudberries — the gold of the Arctic — ripen for just 2–3 weeks each July in subarctic bogs. Their honey-sweet tartness works perfectly in a sour. The egg white foam carries the scent of the fell straight to your nose.',
    image: BARS.cocktailSour,
    season: 'Cloudberry: July–August',
  },
  {
    name: 'Northern Lights',
    ingredients: 'Finnish vodka · blue curaçao · tonic water · edible shimmer · lime',
    description: 'The show-off cocktail. Blue-green shimmer swirling in a glass — a deliberate tribute to the aurora borealis. Best ordered somewhere with a window facing north. The glitter settles in about 30 seconds; drink it before it does.',
    image: BARS.cocktailAurora,
    season: 'Aurora: September–March',
  },
  {
    name: 'Lingonberry Spritz',
    ingredients: 'Prosecco · lingonberry juice · elderflower liqueur · soda water · fresh lingonberries',
    description: 'Deep ruby-red, tart, refreshing. Wild Lapland lingonberries — Finland\'s most-picked berry — balance the floral elderflower against the bubbles. Simple but precisely right. The kind of drink that looks beautiful in a candlelit bar.',
    image: BARS.cocktailBerry,
    season: 'Lingonberry: August–October',
  },
];

const arcticIngredients = [
  { name: 'Cloudberry (Lakka)', note: 'The rarest Arctic berry — grows only in subarctic bogs, 2–3 weeks a year. Used in liqueur, sorbet, sour mixes.' },
  { name: 'Lingonberry', note: 'Finland\'s most beloved wild berry. Tart, earthy, versatile. Used in juice, liqueur, and garnishes.' },
  { name: 'Birch Sap', note: 'Collected in early spring when the sap runs. Clean, faintly sweet. Used in craft spirits and cocktail mixers.' },
  { name: 'Arctic Thyme', note: 'Foraged from fell meadows. More intense than cultivated thyme due to the extreme growing conditions.' },
  { name: 'Sea Buckthorn', note: 'Bright orange berries with more vitamin C per gram than oranges. Used in sours and shots.' },
  { name: 'Finnish Gin', note: 'Several Finnish distilleries produce gin infused with Arctic botanicals — birch, juniper, cloudberry, spruce tip.' },
];

export default function Cocktails() {
  return (
    <>
      <PageSeo
        title="Arctic Cocktails — Lingonberry, Cloudberry & Aurora-Inspired Drinks"
        description="Cocktails built around Lapland ingredients — lingonberry, cloudberry, sea buckthorn, birch syrup. Where to find the best Arctic cocktail bars."
        path="/cocktails"
        jsonLd={[
          pillarBreadcrumb('Cocktails', '/cocktails'),
          articleSchema(
            'Arctic Cocktails in Finnish Lapland',
            'Cocktail culture built on local Arctic ingredients.',
            '/cocktails'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.cocktailAurora}
          alt="Arctic cocktails"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/65 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Arctic Cocktails
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            The same Arctic conditions that make Lapland's wild berries extraordinary
            make them exceptional in a glass. This is cocktail culture built on foraged ingredients
            you can't get anywhere else.
          </p>
        </div>
      </section>

      {/* Featured cocktails */}
      <section className="py-16 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {cocktails.map((c, i) => (
              <div
                key={c.name}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-80 ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <img src={c.image} alt={c.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/40 to-transparent" />
                </div>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <p className="text-xs text-amber/70 uppercase tracking-widest mb-3">{c.season}</p>
                  <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">{c.name}</h2>
                  <p className="text-white/30 text-sm mb-4 font-mono">{c.ingredients}</p>
                  <p className="text-white/60 leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Arctic ingredients */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl text-white tracking-wide mb-4">
              The Ingredients
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Arctic conditions produce extreme ingredients — plants that develop higher concentrations of flavour
              and nutrients to survive the cold and the endless summer sun.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {arcticIngredients.map((ing) => (
              <div key={ing.name} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-amber/20 transition-all">
                <h3 className="font-heading text-lg text-amber tracking-wide mb-2">{ing.name}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{ing.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay near the cocktail bar */}
      <section className="py-14 bg-night">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber/[0.05] border border-amber/15 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-amber text-[11px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Hotel size={11} />
                Stay near the cocktail bar
              </p>
              <h3 className="font-heading text-2xl text-white tracking-wide mb-1.5">
                Don't drive home — book a room nearby
              </h3>
              <p className="text-white/55 text-sm leading-relaxed max-w-xl">
                Most of the best cocktail bars are in Rovaniemi, Levi or Saariselkä. Hotels with walking-distance access:
              </p>
            </div>
            <AffiliateCTA
              partner="hotels"
              sid="cocktails_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap shadow-md shadow-amber/20 no-underline"
            >
              Find hotels in Lapland
              <ExternalLink size={14} />
            </AffiliateCTA>
          </div>
        </div>
      </section>
    </>
  );
}
