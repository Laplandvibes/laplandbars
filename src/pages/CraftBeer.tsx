import { Beer, Hotel, ExternalLink, Compass, UtensilsCrossed, Flame, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BARS } from '../data/images';
import PageSeo, { pillarBreadcrumb, articleSchema } from '../components/PageSeo';
import AffiliateCTA from '../components/AffiliateCTA';
import GygSearchCta, { gygSearchLink } from '../components/GygSearchCta';
import type { Locale } from '../i18n/config';
import AffiliateDisclosure from '../components/AffiliateDisclosure';
import PageBreadcrumb from '../components/PageBreadcrumb';

type Brewery = { name: string; location: string; description: string };
type Style = { style: string; desc: string };

const breweryBeers: Record<string, string[]> = {
  'Lapon Panimo': ['Arctic Lager', 'Spruce Tip Pale Ale', 'Lingonberry Wheat', 'Dark Arctic Porter'],
  'Tornion Panimo': ['Arctic Circle Ale', 'Border Stout', 'Midnight Sun IPA', 'Nordic Lager'],
  'Lapland Brewery': ['House Lager', 'Amber Fell Ale', 'Smoked Rye Porter', 'Seasonal specials'],
};

const featuredFlags: Record<string, boolean> = {
  'Lapon Panimo': true,
  'Tornion Panimo': true,
  'Lapland Brewery': false,
};

// Map the page language → GetYourGuide widget locale code, so the embedded tour
// cards render in the visitor's language. Without this the GYG SDK geo-defaults
// to Finnish (the partner's home market), regardless of the page language.
const GYG_LOCALE: Record<string, string> = {
  en: 'en-US', fi: 'fi-FI', de: 'de-DE', ja: 'ja-JP', es: 'es-ES',
  'pt-BR': 'pt-BR', 'zh-CN': 'zh-CN', ko: 'ko-KR', fr: 'fr-FR', it: 'it-IT', nl: 'nl-NL',
};

// Shown when the embed is blocked (ad-block / tracking protection) so the box
// reads as an enticing panel instead of empty. The GygSearchCta below is the CTA.
const GYG_FALLBACK_LEAD: Record<string, string> = {
  en: 'Lappish food, tasting and brewery-adjacent experiences — live prices and instant confirmation.',
  fi: 'Lappilaista ruokaa, maisteluja ja panimoretkiä — live-hinnat ja välitön vahvistus.',
  de: 'Lappländisches Essen, Verkostungen und brauereinahe Erlebnisse — Live-Preise und sofortige Bestätigung.',
  ja: 'ラップランドの食、テイスティング、醸造関連の体験 — リアルタイムの料金と即時確認。',
  es: 'Comida lapona, catas y experiencias cerca de cervecerías: precios en tiempo real y confirmación inmediata.',
  'pt-BR': 'Comida lapônia, degustações e experiências ligadas a cervejarias — preços em tempo real e confirmação imediata.',
  'zh-CN': '拉普兰美食、品鉴及酒厂相关体验——实时价格、即时确认。',
  ko: '라플란드 음식, 시음, 양조장 관련 체험 — 실시간 가격과 즉시 확정.',
  fr: 'Cuisine laponne, dégustations et expériences autour des brasseries — prix en temps réel et confirmation immédiate.',
  it: 'Cucina lappone, degustazioni ed esperienze legate ai birrifici — prezzi in tempo reale e conferma immediata.',
  nl: 'Laplandse gerechten, proeverijen en brouwerij-ervaringen — actuele prijzen en directe bevestiging.',
};

// Bookable-experience cards shown when the GYG embed is blocked (ad-block /
// tracking protection) — a working affiliate booking path per card instead of
// a lone icon + one sentence. Links use GYG search (never 404s a stale slug).
const GYG_FALLBACK_CARDS: Array<{
  icon: typeof Beer;
  q: string;
  sid: string;
  title: Record<string, string>;
  desc: Record<string, string>;
}> = [
  {
    icon: UtensilsCrossed,
    q: 'Lappish dinner Rovaniemi',
    sid: 'craftbeer_card_dinner',
    title: {
      en: 'Lappish dinner experiences', fi: 'Lappilaiset illalliset',
      de: 'Lappländische Dinner-Erlebnisse', ja: 'ラップランドのディナー体験',
      es: 'Cenas laponas', 'pt-BR': 'Jantares lapões', 'zh-CN': '拉普兰晚餐体验',
      ko: '라플란드 디너 체험', fr: 'Dîners lapons', it: 'Cene lapponi', nl: 'Laplandse diners',
    },
    desc: {
      en: 'Reindeer, arctic char and open-fire salmon at a log table.',
      fi: 'Poroa, nieriää ja loimulohta kelopöydässä.',
      de: 'Rentier, Saibling und Flammlachs am Blockhaustisch.',
      ja: 'トナカイ、イワナ、炙りサーモンをログテーブルで。',
      es: 'Reno, trucha ártica y salmón a la llama en mesa de madera.',
      'pt-BR': 'Rena, truta ártica e salmão na chama em mesa rústica.',
      'zh-CN': '驯鹿肉、北极红点鲑、明火烤三文鱼。',
      ko: '순록, 북극 곤들매기, 장작불 연어.',
      fr: 'Renne, omble chevalier et saumon au feu de bois.',
      it: 'Renna, salmerino artico e salmone alla fiamma.',
      nl: 'Rendier, ridderforel en vuurzalm aan een blokhuttafel.',
    },
  },
  {
    icon: Beer,
    q: 'Rovaniemi food tasting tour',
    sid: 'craftbeer_card_tasting',
    title: {
      en: 'Food & tasting tours', fi: 'Ruoka- ja maistelukierrokset',
      de: 'Food- & Tasting-Touren', ja: 'フード＆テイスティングツアー',
      es: 'Tours gastronómicos y catas', 'pt-BR': 'Tours gastronômicos e degustações',
      'zh-CN': '美食品鉴之旅', ko: '푸드 & 시음 투어',
      fr: 'Visites gourmandes et dégustations', it: 'Tour gastronomici e degustazioni',
      nl: 'Food- & proeverijtours',
    },
    desc: {
      en: 'A local guide, small groups, glass in hand.',
      fi: 'Paikallisopas, pienet ryhmät, lasi kädessä.',
      de: 'Lokaler Guide, kleine Gruppen, Glas in der Hand.',
      ja: '地元ガイドと小グループで、グラス片手に。',
      es: 'Guía local, grupos pequeños, copa en mano.',
      'pt-BR': 'Guia local, grupos pequenos, copo na mão.',
      'zh-CN': '本地向导、小团出行、举杯同行。',
      ko: '현지 가이드, 소규모 그룹, 손에는 잔.',
      fr: 'Guide local, petits groupes, verre à la main.',
      it: 'Guida locale, piccoli gruppi, bicchiere in mano.',
      nl: 'Lokale gids, kleine groepen, glas in de hand.',
    },
  },
  {
    icon: Flame,
    q: 'Rovaniemi sauna evening',
    sid: 'craftbeer_card_sauna',
    title: {
      en: 'Sauna & drinks evenings', fi: 'Sauna- ja juomaillat',
      de: 'Sauna- & Drinks-Abende', ja: 'サウナ＆ドリンクの夜',
      es: 'Noches de sauna y copas', 'pt-BR': 'Noites de sauna e drinques',
      'zh-CN': '桑拿与美酒之夜', ko: '사우나 & 드링크의 밤',
      fr: 'Soirées sauna & boissons', it: 'Serate sauna e drink',
      nl: 'Sauna- & drankavonden',
    },
    desc: {
      en: 'Steam, a cold dip and a cold one afterwards — very Finnish.',
      fi: 'Löylyä, avanto ja kylmä juoma perään — hyvin suomalaista.',
      de: 'Aufguss, Eisbad und danach ein kaltes Bier — sehr finnisch.',
      ja: '蒸気、氷水、その後の一杯 — フィンランド流。',
      es: 'Vapor, baño helado y una bebida fría después: muy finlandés.',
      'pt-BR': 'Vapor, mergulho gelado e uma bebida gelada depois — bem finlandês.',
      'zh-CN': '蒸汽、冰水、事后一杯冰饮——非常芬兰。',
      ko: '증기, 얼음물 입수, 그리고 시원한 한 잔 — 핀란드식.',
      fr: 'Vapeur, bain glacé et une boisson fraîche ensuite — très finlandais.',
      it: 'Vapore, tuffo nel ghiaccio e una bevanda fredda dopo — molto finlandese.',
      nl: 'Stoom, ijsduik en daarna een koud biertje — heel Fins.',
    },
  },
];

export default function CraftBeer() {
  const { t, i18n } = useTranslation('pages');
  const lang = i18n.language;
  const breweries = (t('craftBeer.breweries', { returnObjects: true }) as Brewery[]) || [];
  const styles = (t('craftBeer.styles', { returnObjects: true }) as Style[]) || [];
  const gygRef = useRef<HTMLDivElement>(null);
  const [gygBlocked, setGygBlocked] = useState(false);

  // If no iframe has mounted shortly after render, the GYG embed is blocked —
  // swap the empty box for a designed panel (the GygSearchCta below is the CTA).
  useEffect(() => {
    // Poll until the iframe mounts (slow loads mount well after 2.5 s) — a
    // one-shot check left the fallback stuck on (Vesa 2026-07-12).
    setGygBlocked(false);
    let cancelled = false;
    let waited = 0;
    const FIRST_CHECK = 2500;
    const STEP = 1000;
    const MAX_WAIT = 12000;
    const tick = (delay: number): ReturnType<typeof setTimeout> =>
      setTimeout(() => {
        if (cancelled) return;
        waited += delay;
        if (gygRef.current?.querySelector('iframe')) {
          setGygBlocked(false);
          return;
        }
        setGygBlocked(true);
        if (waited < MAX_WAIT) tick(STEP);
      }, delay);
    const timer = tick(FIRST_CHECK);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lang]);
  return (
    <>
      <PageSeo
        titleKey="craftBeer.title"
        descriptionKey="craftBeer.description"
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
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.42) 50%, rgba(15,23,42,0.30) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white tracking-wide mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {t('craftBeer.hero.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t('craftBeer.hero.sub')}
          </p>
        </div>
      </section>
      <PageBreadcrumb />

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
            {breweries.map((brewery) => {
              const featured = featuredFlags[brewery.name] ?? false;
              const beers = breweryBeers[brewery.name] ?? [];
              return (
                <div
                  key={brewery.name}
                  className={`bg-white/[0.03] border rounded-2xl p-6 transition-all duration-300 hover:border-amber/20 ${
                    featured ? 'border-amber/20' : 'border-white/10'
                  }`}
                >
                  {featured && (
                    <div className="flex items-center gap-2 text-amber text-xs uppercase tracking-widest mb-4">
                      <Beer size={12} />
                      {t('craftBeer.featuredKicker')}
                    </div>
                  )}
                  <h3 className="font-heading text-xl text-white tracking-wide mb-1">{brewery.name}</h3>
                  <p className="text-xs text-white/65 uppercase tracking-wider mb-4">{brewery.location}</p>
                  <p className="text-sm text-white/80 leading-relaxed mb-5">{brewery.description}</p>
                  <div>
                    <p className="text-xs text-white/65 uppercase tracking-wider mb-2">{t('craftBeer.knownBeers')}</p>
                    <div className="flex flex-wrap gap-2">
                      {beers.map((beer) => (
                        <span key={beer} className="text-xs bg-amber/8 text-amber/70 px-2 py-1 rounded-full">
                          {beer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Beer styles */}
      <section className="py-16 bg-night/95 aurora-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl text-white tracking-wide mb-4">
              {t('craftBeer.stylesTitle')}
            </h2>
            <p className="text-white/75 max-w-2xl mx-auto">
              {t('craftBeer.stylesSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {styles.map((s) => (
              <div key={s.style} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-amber/20 transition-all">
                <h3 className="font-heading text-lg text-amber tracking-wide mb-2">{s.style}</h3>
                <p className="text-sm text-white/75 leading-relaxed">{s.desc}</p>
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
              {t('craftBeer.tours.kicker')}
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-3">
              {t('craftBeer.tours.title')}
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
              {t('craftBeer.tours.sub')}
            </p>
          </div>

          {/* GYG widget — auto-populated by the Integration Analyzer in <head>.
              q note: GYG has zero brewery/distillery inventory in Lapland — the
              old "brewery beer tour tasting" q fell back to aurora/fishing
              bestsellers. Current q title-matches the Lappish dinner/tasting
              products the section copy also promises (verified 6/6 food results
              in en/fi/de/ja via the widget frame endpoint, 2026-07-07). */}
          <div
            ref={gygRef}
            key={`gyg-${lang}`}
            data-gyg-widget="activities"
            data-gyg-partner-id="VRMKD7N"
            data-gyg-number-of-items="6"
            data-gyg-cmp="laplandbars-craftbeer"
            data-gyg-q="food tasting Lappish dinner Rovaniemi"
            data-gyg-locale-code={GYG_LOCALE[lang] ?? 'en-US'}
            data-gyg-currency="EUR"
            className={gygBlocked ? 'h-0 overflow-hidden' : 'min-h-[200px]'}
          />

          {gygBlocked && (
            <div>
              <p className="text-white/80 text-sm leading-relaxed max-w-xl mx-auto text-center mb-6">
                {GYG_FALLBACK_LEAD[lang] ?? GYG_FALLBACK_LEAD.en}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {GYG_FALLBACK_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <a
                      key={card.sid}
                      href={gygSearchLink(card.q, card.sid, lang as Locale)}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-amber/30 hover:bg-white/[0.05] transition-all no-underline"
                    >
                      <span className="grid place-items-center w-10 h-10 rounded-full bg-amber/15 border border-amber/40 text-amber mb-3">
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </span>
                      <span className="text-white font-semibold text-sm mb-1.5 flex items-center gap-1">
                        {card.title[lang] ?? card.title.en}
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </span>
                      <span className="text-white/70 text-xs leading-relaxed">
                        {card.desc[lang] ?? card.desc.en}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback link if GYG returns no brewery-specific results — GYG search
              (resolves to live results, never 404s a stale product slug) */}
          <div className="mt-8 text-center">
            <GygSearchCta
              query="Rovaniemi brewery tour tasting"
              sid="craftbeer_gyg_search_rovaniemi"
              variant="link"
            >
              {t('craftBeer.tours.fallback')}
            </GygSearchCta>
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
                  {t('craftBeer.stay.kicker')}
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide mb-3">
                  {t('craftBeer.stay.title')}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {t('craftBeer.stay.body')}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <AffiliateCTA
                  partner="hotels"
                  sid="craftbeer_stay_saariselka_lapon"
                  destination="Saariselkä, Lapland, Finland"
                  className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all no-underline"
                >
                  <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> {t('craftBeer.stay.ctaSaariselka')}</span>
                  <ExternalLink size={13} className="text-white/75" />
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="craftbeer_stay_rovaniemi"
                  destination="Rovaniemi, Lapland, Finland"
                  className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all no-underline"
                >
                  <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> {t('craftBeer.stay.ctaRovaniemi')}</span>
                  <ExternalLink size={13} className="text-white/75" />
                </AffiliateCTA>
                <AffiliateCTA
                  partner="hotels"
                  sid="craftbeer_stay_tornio"
                  destination="Tornio, Finland"
                  className="inline-flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber/30 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all no-underline"
                >
                  <span className="flex items-center gap-2"><Hotel size={14} className="text-amber" /> {t('craftBeer.stay.ctaTornio')}</span>
                  <ExternalLink size={13} className="text-white/75" />
                </AffiliateCTA>
              </div>
            </div>
          </div>
          <AffiliateDisclosure variant="full" className="mt-10 text-white/45 max-w-2xl mx-auto" />
        </div>
      </section>
    </>
  );
}
