import { Snowflake, MapPin, Thermometer } from 'lucide-react';

const iceBars = [
  {
    name: 'SnowVillage IceBar',
    location: 'Yllas, Lainio',
    description:
      'An extraordinary bar carved entirely from snow and ice, featuring intricate ice sculptures and frozen furniture. Sip drinks from glasses made of pure ice while surrounded by art installations that change each winter season.',
    highlight: 'Drinks served in ice glasses',
    temp: '-5°C inside',
  },
  {
    name: 'Arctic SnowHotel IceBar',
    location: 'Rovaniemi',
    description:
      'Located inside the Arctic SnowHotel complex, 25 minutes from Rovaniemi. Rebuilt from scratch every December — new themes and ice sculptures carved by a rotating cast of international ice artists each season.',
    highlight: 'New theme every winter',
    temp: '-5°C inside',
  },
  {
    name: 'Lainio Snow Village',
    location: 'Yllas, Lainio',
    description:
      'One of the original snow villages in Lapland — running since 1999. The complex includes a full ice restaurant, ice bar, ice chapel, and themed snow suites with hand-carved sculptures throughout.',
    highlight: 'Operating since 1999',
    temp: '-5°C inside',
  },
];

export default function IceBars() {
  return (
    <section id="ice-bars" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Snowflake className="w-6 h-6 text-purple-light" />
            <span className="text-purple-light font-body text-sm uppercase tracking-widest">
              Unique Experiences
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide">
            Ice Bars & Unique Venues
          </h2>
          <p className="text-gray-light mt-4 max-w-2xl mx-auto">
            Step inside bars made entirely of ice and snow. These seasonal
            venues are rebuilt every winter with new themes, offering drinks
            in frozen glasses at a constant -5 degrees Celsius.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {iceBars.map((bar) => (
            <div
              key={bar.name}
              className="bg-night-card border border-purple/20 rounded-2xl p-6 hover:border-purple/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.15)] group"
            >
              <div className="flex items-start justify-between mb-4">
                <Snowflake className="w-10 h-10 text-purple-light opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="flex items-center gap-1 text-xs text-purple-light bg-purple/10 px-3 py-1 rounded-full">
                  <Thermometer className="w-3 h-3" />
                  {bar.temp}
                </span>
              </div>
              <h3 className="font-heading text-2xl tracking-wide mb-2">
                {bar.name}
              </h3>
              <div className="flex items-center gap-1 text-pink text-sm mb-4">
                <MapPin className="w-3.5 h-3.5" />
                {bar.location}
              </div>
              <p className="text-gray-light text-sm leading-relaxed mb-4">
                {bar.description}
              </p>
              <div className="text-purple text-xs font-semibold uppercase tracking-wider">
                {bar.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
