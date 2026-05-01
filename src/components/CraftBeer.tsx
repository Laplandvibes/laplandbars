import { Beer, Hop, Award } from 'lucide-react';

const breweries = [
  {
    name: 'Lapon Panimo',
    location: 'Saariselka',
    description:
      'The northernmost microbrewery in Finland, Lapon Panimo crafts beers using pure Arctic water and locally inspired recipes. Their seasonal brews often feature ingredients like spruce tips and lingonberries.',
  },
  {
    name: 'Tornion Panimo',
    location: 'Tornio',
    description:
      'Located at the Swedish border, Tornion Panimo is an award-winning craft brewery known for their Arctic Circle Ale and innovative Nordic-style beers. They export throughout the Nordics.',
  },
  {
    name: 'Sievin Panimo',
    location: 'Northern Ostrobothnia',
    description:
      'A small-batch artisan brewery producing characterful ales and lagers. Their commitment to traditional brewing methods combined with modern flavors makes them a favorite across northern Finland.',
  },
];

const beerStyles = [
  { name: 'Arctic Lager', note: 'Clean, crisp, brewed with Arctic water' },
  { name: 'Spruce Tip Ale', note: 'Pale ale with foraged spruce tips' },
  { name: 'Berry Wheat', note: 'Wheat beer with wild Lapland berries' },
  { name: 'Smoked Porter', note: 'Rich, smoky, perfect for cold nights' },
];

export default function CraftBeer() {
  return (
    <section id="craft-beer" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beer className="w-6 h-6 text-purple" />
            <span className="text-purple font-body text-sm uppercase tracking-widest">
              Local Brews
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Craft Beer Guide
          </h2>
          <p className="text-gray-light mt-4 max-w-2xl mx-auto">
            Finland's craft beer revolution has reached the Arctic.
            Northern breweries turn pure Lapland water and wild ingredients
            into exceptional beers you will not find anywhere else.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {breweries.map((brewery) => (
            <div
              key={brewery.name}
              className="bg-night-card border border-gray-dark rounded-2xl p-6 hover:border-purple/40 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <Hop className="w-5 h-5 text-purple" />
                <Award className="w-4 h-4 text-pink" />
              </div>
              <h3 className="font-heading text-2xl tracking-wide mb-1">
                {brewery.name}
              </h3>
              <p className="text-pink text-sm mb-3">{brewery.location}</p>
              <p className="text-gray-light text-sm leading-relaxed">
                {brewery.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-night-card border border-purple/20 rounded-2xl p-8">
          <h3 className="font-heading text-2xl tracking-wide mb-6 text-center">
            Styles to Try in Lapland
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {beerStyles.map((style) => (
              <div
                key={style.name}
                className="bg-night/60 rounded-xl p-4 text-center"
              >
                <Beer className="w-6 h-6 text-purple mx-auto mb-2" />
                <h4 className="font-heading text-lg tracking-wide mb-1">
                  {style.name}
                </h4>
                <p className="text-gray-light text-xs">{style.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
