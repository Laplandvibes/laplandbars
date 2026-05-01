import { MapPin, Beer, Wine, Music, PartyPopper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Bar {
  name: string;
  type: string;
  description: string;
  icon: LucideIcon;
}

interface Area {
  name: string;
  bars: Bar[];
}

const areas: Area[] = [
  {
    name: 'Rovaniemi',
    bars: [
      {
        name: 'Cafe & Bar 21',
        type: 'Cocktail Bar',
        description:
          'Stylish cocktail bar in the heart of Rovaniemi serving creative drinks and a curated wine list. A favorite among locals and visitors looking for a refined night out.',
        icon: Wine,
      },
      {
        name: 'Kauppayhti\u00F6',
        type: 'Craft Beer Bar',
        description:
          'Housed in a historic building, this craft beer focused bar offers an impressive rotating selection of Finnish and international microbrews alongside hearty pub food.',
        icon: Beer,
      },
      {
        name: 'Bull Bar',
        type: 'Sports Bar',
        description:
          'The go-to sports bar in Rovaniemi with large screens, billiards, and a lively atmosphere. Great for watching hockey games with a cold pint in hand.',
        icon: PartyPopper,
      },
      {
        name: 'Zoomit',
        type: 'Nightclub',
        description:
          'Rovaniemi\'s premier nightclub featuring DJs, dance floors, and themed nights. The place to be for late-night revelry in the Arctic capital.',
        icon: Music,
      },
    ],
  },
  {
    name: 'Levi',
    bars: [
      {
        name: 'Hullu Poro Areena',
        type: 'Legendary Apr\u00E8s-Ski',
        description:
          'The most famous apr\u00E8s-ski bar in all of Finland. Hullu Poro (Crazy Reindeer) is an institution with live music, dancing on tables, and an electric atmosphere every night of ski season.',
        icon: Music,
      },
      {
        name: 'Colorado Bar',
        type: 'Bar & Lounge',
        description:
          'A popular bar in the center of Levi village offering cocktails, beer, and a relaxed atmosphere. A great spot to start or end your evening in Levi.',
        icon: Wine,
      },
      {
        name: 'Ihku Bar',
        type: 'Bar & Nightlife',
        description:
          'Modern bar with a vibrant atmosphere, creative cocktails, and DJ nights. Located in the heart of Levi, it draws a young and energetic crowd.',
        icon: PartyPopper,
      },
    ],
  },
  {
    name: 'Yllas',
    bars: [
      {
        name: 'Pubi Jokitupa',
        type: 'Traditional Pub',
        description:
          'A cozy, traditional Lappish pub by the river in Akaslompolo village. Known for its warm atmosphere, local beers, and live music nights during the ski season.',
        icon: Beer,
      },
      {
        name: 'After Eight',
        type: 'Bar & Music Venue',
        description:
          'The main nightlife spot in Yllas, featuring live bands, karaoke nights, and a dance floor. Popular with both locals and visitors throughout the winter season.',
        icon: Music,
      },
    ],
  },
  {
    name: 'Saariselka',
    bars: [
      {
        name: 'Lapon Panimo',
        type: 'Local Brewery & Pub',
        description:
          'Saariselka\'s own microbrewery serving fresh, locally brewed beers in a rustic Lappish setting. Try their seasonal specialties made with pure Lapland water.',
        icon: Beer,
      },
      {
        name: 'Caf\u00E9 Bar Holiday Club',
        type: 'Bar & Lounge',
        description:
          'A comfortable bar within the Holiday Club resort, offering a wide selection of drinks and a relaxed apr\u00E8s-ski atmosphere with views of the fell landscape.',
        icon: Wine,
      },
    ],
  },
];

export default function BarGrid() {
  return (
    <section id="bars-by-area" className="py-20 px-4 bg-night-light/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-pink" />
            <span className="text-pink font-body text-sm uppercase tracking-widest">
              By Location
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Best Bars by Area
          </h2>
          <p className="text-gray-light mt-4 max-w-2xl mx-auto">
            Whether you are in the Arctic capital of Rovaniemi or hitting
            the slopes at Levi, every Lapland destination has its own
            distinctive nightlife scene.
          </p>
        </div>

        {areas.map((area) => (
          <div key={area.name} className="mb-14 last:mb-0">
            <h3 className="font-heading text-3xl tracking-wide mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple" />
              {area.name}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {area.bars.map((bar) => {
                const Icon = bar.icon;
                return (
                  <div
                    key={bar.name}
                    className="bg-night-card border border-gray-dark rounded-xl p-5 hover:border-purple/40 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-purple" />
                      </div>
                      <span className="text-xs text-pink font-medium uppercase tracking-wider">
                        {bar.type}
                      </span>
                    </div>
                    <h4 className="font-heading text-xl tracking-wide mb-2">
                      {bar.name}
                    </h4>
                    <p className="text-gray-light text-sm leading-relaxed">
                      {bar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
