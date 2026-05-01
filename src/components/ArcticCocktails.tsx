import { GlassWater, Sparkles } from 'lucide-react';

const cocktails = [
  {
    name: 'Cloudberry Sour',
    ingredients: 'Gin, cloudberry liqueur, lemon juice, egg white, sugar syrup',
    description:
      'A silky, golden sour that showcases the prized Arctic cloudberry. The egg white creates a velvety foam while the cloudberry delivers a unique sweet-tart flavor that is unmistakably Lappish.',
    color: 'from-amber-500/20 to-orange-500/10',
  },
  {
    name: 'Arctic Negroni',
    ingredients: 'Finnish gin, Campari, sweet vermouth, juniper garnish',
    description:
      'A Nordic twist on the Italian classic, made with Finnish gin infused with hand-picked Arctic botanicals. Served over a single clear ice cube with a fresh juniper sprig.',
    color: 'from-red-500/20 to-pink/10',
  },
  {
    name: 'Lingonberry Spritz',
    ingredients: 'Prosecco, lingonberry juice, elderflower liqueur, soda water',
    description:
      'A refreshing, ruby-red spritz made with wild Lapland lingonberries. The tart berries balance beautifully with the floral elderflower and bubbling prosecco.',
    color: 'from-rose-500/20 to-red-400/10',
  },
  {
    name: 'Northern Lights',
    ingredients: 'Vodka, blue curacao, tonic water, edible shimmer, lime',
    description:
      'A mesmerizing cocktail that captures the aurora borealis in a glass. The shimmering blue-green drink swirls with edible glitter, creating an otherworldly visual experience.',
    color: 'from-purple/20 to-emerald-500/10',
  },
];

export default function ArcticCocktails() {
  return (
    <section id="cocktails" className="py-20 px-4 bg-night-light/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GlassWater className="w-6 h-6 text-pink" />
            <span className="text-pink font-body text-sm uppercase tracking-widest">
              Signature Drinks
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Arctic Cocktail Culture
          </h2>
          <p className="text-gray-light mt-4 max-w-2xl mx-auto">
            Lapland bartenders turn wild Arctic berries and Nordic
            botanicals into cocktails you will not find south of the Arctic
            Circle. These signature drinks define the northern bar scene.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail.name}
              className="bg-night-card border border-gray-dark rounded-2xl p-6 hover:border-pink/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${cocktail.color} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple" />
                  <span className="text-purple text-xs font-semibold uppercase tracking-wider">
                    Signature
                  </span>
                </div>
                <h3 className="font-heading text-2xl tracking-wide mb-2">
                  {cocktail.name}
                </h3>
                <p className="text-pink text-xs mb-3 font-medium">
                  {cocktail.ingredients}
                </p>
                <p className="text-gray-light text-sm leading-relaxed">
                  {cocktail.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
