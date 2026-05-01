import { Flame, Snowflake, Beer, Wine, Star, Hotel, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';

export default function DrinkingCulture() {
  return (
    <>
      <PageSeo
        title="Finnish Drinking Culture — A Lapland Primer"
        description="What Finnish drinking culture actually looks like in Lapland — kalsarikännit, Alko, sauna beers, the unwritten rules. Honest context for visitors."
        path="/drinking-culture"
        jsonLd={[
          pillarBreadcrumb('Drinking Culture', '/drinking-culture'),
          articleSchema(
            'Finnish Drinking Culture in Lapland',
            'How Finns actually drink — context for visitors.',
            '/drinking-culture'
          ),
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={BARS.heroNightlife}
          alt="Cosy Finnish pub with fireplace"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/50 to-night" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5">
            Finnish Drinking Culture
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            From Koskenkorva on a Friday night to kalsarikännit in your underwear —
            a guide to how Finns actually drink.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 text-white/60 leading-relaxed">
            <p>
              Finnish drinking culture is built on contradictions. Finland has some of the strictest
              alcohol laws in Europe — state-controlled off-licences, limited pub hours, high taxes
              — and some of the most enthusiastic drinkers. Alcohol here is not background noise.
              It's a deliberate act, taken seriously and often done with ceremony.
            </p>
            <p>
              In Lapland specifically, drinking is inseparable from the environment. You drink
              after a day on the slopes, after a snowmobile tour, after a Northern Lights watch.
              The cold makes the warm drink better. The dark makes the candlelit pub cosier.
              The silence makes the laughter louder.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16 bg-night">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Koskenkorva */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Flame size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                Koskenkorva — The National Spirit
              </h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                If Finland has a national spirit — spiritually and literally — it's Koskenkorva.
                "Kossu" to anyone who knows it. A 38% ABV grain spirit distilled from Finnish
                barley in the village of Koskenkorva, Ostrobothnia, since 1953. The distillery
                runs 24 hours a day, every day of the year.
              </p>
              <p>
                Koskenkorva is not vodka — it's specifically a grain spirit, with a slightly
                rougher, more characterful profile than filtered vodka. It is, however, extremely
                clean: distilled to a very high purity, with minimal congeners. The hangover, Finns
                will tell you, is almost nonexistent compared to cheaper spirits. This is either
                true or a very successful piece of Finnish mythology.
              </p>
              <p>
                How do Finns drink it? Cold, straight, from a small glass. Sometimes with a beer
                chaser (the combination is called a <em className="text-white/80">viina + kalja</em>
                — the classic Finnish working-class pairing). In Lapland, you'll find it at every
                pub, usually on a speed rail. It's been on Finnish tables at weddings, funerals,
                Saturday saunas and Sunday breakfasts. It is not glamorous. That's the point.
              </p>
              <div className="bg-white/[0.03] border border-amber/15 rounded-2xl p-5">
                <p className="text-sm text-white/50">
                  <span className="text-amber font-medium">Quick facts:</span> Produced by Altia (now Anora Group).
                  Over 10 million litres sold annually in Finland.
                  The village of Koskenkorva has a population of ~1,500 people.
                  The distillery is one of the most efficient grain distilleries in the world,
                  producing zero waste — the grain residue feeds livestock.
                </p>
              </div>
            </div>
          </div>

          {/* Finlandia Vodka */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Snowflake size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                Finlandia Vodka — Finland to the World
              </h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                While Koskenkorva is for Finns, Finlandia is Finland's gift to the rest of the world.
                Launched in 1970 — the same year as the first Earth Day, which is either a coincidence
                or a very deliberate piece of brand positioning — Finlandia was one of the first
                premium vodkas to market "purity" as its central selling point.
              </p>
              <p>
                The recipe is simple by design: six-row barley grown in Finland, glacial spring water
                from Rajamäki, 200km north of Helsinki. The water is the star. Finnish glacial spring
                water is some of the softest in the world — low in minerals, low in hardness —
                which produces a distinctly clean, light vodka with virtually no aftertaste.
              </p>
              <p>
                Finlandia is distilled over 200 times through a continuous distillation process —
                not batch-distilled like most premium spirits. The result is extremely consistent.
                It has won international blind tastings against much more expensive competitors.
                In Finland, it's still reasonably priced. Abroad, it wears its Finnish credentials
                as a badge of premium quality.
              </p>
              <div className="bg-white/[0.03] border border-amber/15 rounded-2xl p-5">
                <p className="text-sm text-white/50">
                  <span className="text-amber font-medium">Quick facts:</span> Owned by Brown-Forman (Jack Daniel's parent company)
                  since 2004. Available in over 80 countries.
                  The iconic frosted bottle design has barely changed since 1970.
                  Produced at the Rajamäki distillery, which has been making spirits since 1888.
                </p>
              </div>
            </div>
          </div>

          {/* Lapin Kulta */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Star size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                Lapin Kulta — Gold from the Arctic
              </h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                If any beer truly belongs in a guide to Lapland bars, it's <strong className="text-white/80">Lapin Kulta</strong> —
                literally "Lapland's Gold." Brewed in Tornio, on the Finnish-Swedish border at the mouth
                of the Tornionjoki river, since 1873. For over 150 years, this beer has been made
                with water from one of the northernmost brewing sources in the world.
              </p>
              <p>
                Lapin Kulta is Finland's classic pale lager — clean, light, malty, and uncomplicated.
                It won't win craft beer awards, and it doesn't try to. It's the beer that's been on
                Finnish cabin tables, sauna benches, and festival grounds for five generations. When Finns
                say "grab a beer," this is often the beer they mean. In Lapland specifically, ordering
                Lapin Kulta in a local pub feels right in a way no imported lager ever could.
              </p>
              <p>
                The brand has changed hands — from Hartwall to Heineken International — but the beer
                itself remains a Finnish staple. You'll find it in every Lapland bar, every supermarket,
                every Alko. It is, in the best possible sense, completely ordinary.
              </p>
              <div className="bg-amber/[0.05] border border-amber/20 rounded-2xl p-6">
                <p className="font-heading text-xl text-amber tracking-wide mb-4">
                  Finnish Beer — What It Costs
                </p>
                <div className="space-y-3 text-sm text-white/55">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span>Lapin Kulta (0.33L can, supermarket)</span>
                    <span className="text-amber font-medium">~€2.30</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span>Karhu lager (0.33L can, supermarket)</span>
                    <span className="text-amber font-medium">~€2.30</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span>Sandels lager (0.33L can, supermarket)</span>
                    <span className="text-amber font-medium">~€2.20</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span>Koff Porter / speciality (0.33L, Alko)</span>
                    <span className="text-amber font-medium">~€3.50–4.50</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span>Draft pint in a Lapland bar</span>
                    <span className="text-amber font-medium">~€6–8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Craft beer pint in a Lapland bar</span>
                    <span className="text-amber font-medium">~€7–10</span>
                  </div>
                </div>
                <p className="text-xs text-white/30 mt-4">
                  Prices approximate as of 2025. Strong beers (above 5.5% ABV) can only be bought at Alko state liquor stores.
                  Supermarkets sell beers up to 5.5% ABV.
                </p>
              </div>
              <div className="bg-white/[0.03] border border-amber/15 rounded-2xl p-5">
                <p className="text-sm text-white/50">
                  <span className="text-amber font-medium">Other Finnish lagers worth knowing:</span>{' '}
                  <strong className="text-white/70">Karhu</strong> ("Bear") — Finland's best-selling beer, slightly maltier than Lapin Kulta.
                  <strong className="text-white/70"> Sandels</strong> — named after a Finnish war hero, popular budget lager.
                  <strong className="text-white/70"> Olvi</strong> — brewed in Iisalmi since 1878, the only major Finnish brewery still Finnish-owned.
                  <strong className="text-white/70"> Koff</strong> — Helsinki's oldest brewery brand (1819), now owned by Sinebrychoff/Carlsberg.
                </p>
              </div>
            </div>
          </div>

          {/* Lonkero */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Beer size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                Lonkero — Born for the Olympics
              </h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                In 1952, Helsinki hosted the Summer Olympics. There was a problem: the city didn't
                have enough bars to serve the international crowd, and Finland's strict licensing
                laws made opening new ones nearly impossible. The state alcohol monopoly, Alko,
                came up with a solution: a ready-to-drink canned cocktail that could be sold legally
                at the Olympic venues.
              </p>
              <p>
                The drink they created was the <strong className="text-white/80">lonkero</strong> —
                Finnish gin mixed with grapefruit soda. Light, refreshing, slightly bitter.
                5.5% ABV. Sold in tall cans with a distinctive label. It was such a hit that they
                kept making it after the Olympics ended. Finland has been drinking lonkero ever since.
              </p>
              <p>
                Today lonkero is a proper cultural institution — there's a "lonkero holiday" in
                Finnish culture (the last Friday of July), and the Long Drink category has inspired
                the entire modern RTD category globally. Hartford Distilling in the US even launched
                an American version called "The Long Drink" after learning about the Finnish original.
                It is possibly the most successful accidental export in Finnish drinks history.
              </p>
            </div>
          </div>

          {/* Kalsarikännit */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Wine size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                Kalsarikännit — The Art of Pants Drinking
              </h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                There is a Finnish concept that has no direct equivalent in any other language:
                <strong className="text-white/80"> kalsarikännit</strong>. From <em>kalsarit</em>
                (underpants) and <em>känni</em> (being drunk). Literally: "pants drunk."
                The practice of getting drunk at home, alone or with close companions,
                in your underwear, with absolutely no intention of going out.
              </p>
              <p>
                This is not a shameful thing in Finland. It is not considered antisocial.
                It is considered, by many Finns, to be the pinnacle of relaxation — a deliberate
                rejection of the social performance required by going to a bar. No getting dressed.
                No waiting for taxis. No small talk with strangers. Just your sofa, your drink of
                choice, and the freedom to watch whatever you want on television.
              </p>
              <p>
                In 2018, the Finnish government's Foreign Ministry officially endorsed the concept
                as part of a national campaign to explain Finnish culture to the world. They released
                a set of emoji depicting kalsarikännit — a person in underwear with a drink.
                The campaign went viral globally. Finland was briefly the most discussed country
                in international news for a reason that had nothing to do with politics.
              </p>
              <p>
                Kalsarikännit is not just a joke. It reflects something genuine about Finnish
                culture: the value of solitude, the comfort of one's own home, and a deep national
                suspicion of performative socialising. In Lapland, where winters are long,
                dark, and cold, kalsarikännit is practically a survival mechanism.
              </p>
              <div className="bg-amber/[0.05] border border-amber/20 rounded-2xl p-6">
                <p className="font-heading text-xl text-amber tracking-wide mb-3">
                  How to practise kalsarikännit properly
                </p>
                <ol className="space-y-2 text-sm text-white/55">
                  <li>1. Put on the most comfortable underwear you own.</li>
                  <li>2. Stock the refrigerator before nightfall (this is non-negotiable).</li>
                  <li>3. Turn off your phone notifications.</li>
                  <li>4. Sit down. Do not stand up for at least two hours.</li>
                  <li>5. Drink slowly. This is not a race.</li>
                  <li>6. Do not, under any circumstances, make plans to go out later.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sauna drinking */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Flame size={24} className="text-amber" />
              <h2 className="font-heading text-3xl text-white tracking-wide">
                Sauna & Sisu — The Full Picture
              </h2>
            </div>
            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                Finnish drinking culture cannot be separated from the sauna. The standard Finnish
                Saturday follows a precise order: work, sauna, beer. The beer is consumed
                <em className="text-white/80"> in</em> the sauna or immediately after — when the
                body temperature is still high and the cold beer creates an almost physiological
                effect. This combination is so culturally embedded that most Finnish summer cottages
                have a dedicated sauna-beer ritual that begins at approximately 4pm and continues
                until someone falls asleep in the boat.
              </p>
              <p>
                In Lapland, the sauna is even more central. After a day in -30°C, a sauna is not
                a luxury — it's rehydration, recovery, and socialising combined. Many Lapland
                hotels and cabins have private saunas. The combination of sauna, cold plunge into
                the lake or snow, and cold beer is, according to Finns, better than any spa treatment
                in the world. They are probably right.
              </p>
              <p>
                <strong className="text-white/80">Sisu</strong> — the uniquely Finnish concept of
                stoic determination, resilience in the face of adversity — applies to drinking too.
                A Finn who has been drinking for seven hours and still makes it to work on Monday
                is not considered irresponsible. They are considered to have sisu.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl text-white tracking-wide mb-4">
            Experience It Yourself
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            The theory is interesting. The practice is better.
            Find the bars where Finnish drinking culture is alive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <AffiliateCTA
              partner="hotels"
              sid="drinking_culture_stay_lapland"
              destination="Lapland, Finland"
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber/90 text-night px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber/25 no-underline"
            >
              <Hotel size={20} />
              Find a Stay in Lapland
            </AffiliateCTA>
            <Link
              to="/bars"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 border border-white/15 no-underline"
            >
              Explore All Bars
              <ExternalLink size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
