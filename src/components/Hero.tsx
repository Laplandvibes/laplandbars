import { MapPin, Clock, Snowflake } from 'lucide-react';
import Logo from './Logo';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient with neon glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night-light to-night" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-pink/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-light/6 rounded-full blur-[80px]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Logo className="scale-125 md:scale-150" />
        </div>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wide mb-6">
          <span className="text-white">Best Bars & Pubs in</span>
          <br />
          <span className="bg-gradient-to-r from-purple via-pink to-purple-light bg-clip-text text-transparent">
            Finnish Lapland
          </span>
        </h1>

        <p className="text-gray-light text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          From legendary ice bars carved in snow to cozy pubs by the fire,
          discover the nightlife that makes Lapland unforgettable after the
          northern lights fade.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-light">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple" />
            <span>Rovaniemi, Levi, Yllas, Saariselka</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink" />
            <span>Open year-round</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-purple-light" />
            <span>Ice bars in winter season</span>
          </div>
        </div>

        <div className="mt-12">
          <a
            href="#ice-bars"
            className="inline-block bg-purple hover:bg-purple-light text-white font-body font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
          >
            Explore Venues
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-night to-transparent" />
    </section>
  );
}
