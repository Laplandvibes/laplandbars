import { Music, Calendar, Mic2, Radio } from 'lucide-react';

const events = [
  {
    venue: 'Hullu Poro Areena',
    location: 'Levi',
    type: 'Live Bands & DJs',
    description:
      'Nightly live performances during ski season featuring Finnish rock, pop, and international acts. The biggest apres-ski stage in Lapland.',
    icon: Music,
  },
  {
    venue: 'After Eight',
    location: 'Yllas',
    type: 'Live Music & Karaoke',
    description:
      'Weekend live bands and regular karaoke nights make this the cultural heart of Yllas nightlife. Local and touring Finnish artists perform here.',
    icon: Mic2,
  },
  {
    venue: 'Zoomit',
    location: 'Rovaniemi',
    type: 'DJ Nights & Events',
    description:
      'Rovaniemi\'s premier club hosts themed DJ nights, student events, and special parties throughout the year. The dance floor fills up after midnight.',
    icon: Radio,
  },
  {
    venue: 'Pubi Jokitupa',
    location: 'Yllas',
    type: 'Acoustic & Folk',
    description:
      'Intimate acoustic sessions and Finnish folk music in a cozy pub setting. The perfect soundtrack for a Lapland winter evening by the fire.',
    icon: Music,
  },
];

export default function LiveMusic() {
  return (
    <section id="live-music" className="py-20 px-4 bg-night-light/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-6 h-6 text-pink" />
            <span className="text-pink font-body text-sm uppercase tracking-widest">
              Entertainment
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Live Music & Events
          </h2>
          <p className="text-gray-light mt-4 max-w-2xl mx-auto">
            From roaring rock stages to intimate acoustic sets, Lapland
            venues deliver live entertainment that turns a cold Arctic
            night into a hot one.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.venue}
                className="bg-night-card border border-gray-dark rounded-2xl p-6 hover:border-pink/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
                    <Icon className="w-5 h-5 text-purple" />
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-light">
                    <Calendar className="w-3 h-3" />
                    Seasonal
                  </span>
                </div>
                <h3 className="font-heading text-2xl tracking-wide mb-1">
                  {event.venue}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-pink text-xs">{event.location}</span>
                  <span className="text-purple text-xs font-medium">
                    {event.type}
                  </span>
                </div>
                <p className="text-gray-light text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
