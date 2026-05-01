import { Mountain, MapPin, Star } from 'lucide-react';

const apresSkiSpots = [
  {
    resort: 'Levi',
    spots: [
      {
        name: 'Hullu Poro Areena',
        note: 'The undisputed king of Lapland apres-ski. Live bands, legendary atmosphere, and the wildest dance floor north of Helsinki.',
        highlight: true,
      },
      {
        name: 'Colorado Bar',
        note: 'Right at the base of Levi slopes. Grab a beer straight off the lift and unwind with fellow skiers.',
        highlight: false,
      },
    ],
  },
  {
    resort: 'Yllas',
    spots: [
      {
        name: 'Pubi Jokitupa',
        note: 'A warm and welcoming pub in Akaslompolo that serves as the main apres-ski hangout for the Yllas area. Live music on weekends.',
        highlight: true,
      },
      {
        name: 'After Eight',
        note: 'When the pub closes, the party moves here. Late-night dancing and drinks in the heart of Yllas village.',
        highlight: false,
      },
    ],
  },
  {
    resort: 'Saariselka',
    spots: [
      {
        name: 'Lapon Panimo',
        note: 'End your ski day with a locally brewed craft beer at the northernmost brewery pub in Finland. Fresh pints and a cozy atmosphere.',
        highlight: true,
      },
      {
        name: 'Cafe Bar Holiday Club',
        note: 'Convenient slope-side bar with panoramic views of the fells. Popular with families and groups looking for a relaxed wind-down.',
        highlight: false,
      },
    ],
  },
];

export default function ApresSki() {
  return (
    <section id="apres-ski" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="w-6 h-6 text-purple" />
            <span className="text-purple font-body text-sm uppercase tracking-widest">
              Slope-Side
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Apres-Ski Bars
          </h2>
          <p className="text-gray-light mt-4 max-w-2xl mx-auto">
            The best part of a ski day in Lapland starts when you take off
            your boots. These bars near the slopes keep the energy going
            with cold beers, live music, and unforgettable vibes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {apresSkiSpots.map((area) => (
            <div
              key={area.resort}
              className="bg-night-card border border-gray-dark rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Mountain className="w-5 h-5 text-pink" />
                <h3 className="font-heading text-2xl tracking-wide">
                  {area.resort}
                </h3>
              </div>
              <div className="space-y-5">
                {area.spots.map((spot) => (
                  <div key={spot.name} className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      {spot.highlight && (
                        <Star className="w-3.5 h-3.5 text-purple fill-purple" />
                      )}
                      <h4 className="font-heading text-lg tracking-wide">
                        {spot.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 text-pink text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      {area.resort}
                    </div>
                    <p className="text-gray-light text-sm leading-relaxed">
                      {spot.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
