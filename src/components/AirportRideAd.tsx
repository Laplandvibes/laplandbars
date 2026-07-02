import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Car, ShieldCheck, Moon } from 'lucide-react';
import { welcomePickupsLink, WELCOME_PICKUPS } from '../config/partners';
import { trackAffiliateClick } from '../lib/analytics';
import AffiliateDisclosure from './AffiliateDisclosure';
import { useLocale } from '../i18n/useLocale';
import type { Locale } from '../i18n/config';

/**
 * Affiliate ad — Welcome Pickups (Travelpayouts), private airport transfers.
 *
 * Why it fits laplandbars: a night out in Lapland starts and ends with a ride.
 * There is no late taxi rank at a small northern airport, the bars are spread
 * between resorts, and the ride back to the cabin at 02:00 in −20 °C is the part
 * nobody plans. A pre-booked driver with a fixed price agreed up front is the
 * sober, sensible answer. Angle for a BARS site: the safe ride home after the
 * night, plus the meet-at-arrivals transfer on the way in.
 *
 * Skinned in WELCOME PICKUPS' OWN brand (premium_design_standard §6): a clean
 * white card, their real green mark, their bright teal-green accent and a green
 * CTA, framed as a distinct partner unit on the dark amber page.
 *
 * Service advertiser → no product feed. Per affiliate_ad_creative_process §4 the
 * visual is the real logo + a tasteful brand-CSS "pickup" stage (a car sliding
 * toward a meeting pin), NOT a fabricated photo.
 *
 * Offer hook: evergreen only — meet-and-greet, fixed price agreed in advance,
 * English-speaking local drivers. No time-limited % (would go stale).
 *
 * Pure CSS/Tailwind animation only; scroll reveal is progressive enhancement
 * (always visible pre-JS) and disabled under prefers-reduced-motion.
 *
 * Required affiliate attributes (LV spec): target="_blank"
 * rel="sponsored nofollow noopener" — NO `noreferrer`.
 */

/** Welcome Pickups brand accents — bright green + a deeper green for AA text/CTA. */
const WP_GREEN = '#00D6A0';
const WP_DEEP = '#067A5E';

export default function AirportRideAd({
  sid = 'bars_safe_ride_home',
  className = '',
}: {
  sid?: string;
  className?: string;
}) {
  const { locale } = useLocale();

  const href = welcomePickupsLink(sid);

  const rootRef = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || revealed) return;
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    const t = window.setTimeout(() => setRevealed(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [armed, revealed]);

  const animState = !armed ? 'off' : revealed ? 'in' : 'pending';

  const pick = (m: Record<Locale, string>) => m[locale];

  const adLabel = pick({
    en: 'Ad', fi: 'Mainos', de: 'Anzeige', ja: '広告', es: 'Anuncio',
    'pt-BR': 'Anúncio', 'zh-CN': '广告', ko: '광고', fr: 'Annonce',
    it: 'Annuncio', nl: 'Advertentie',
  });

  const eyebrow = pick({
    en: 'Airport transfer', fi: 'Lentokenttäkuljetus', de: 'Flughafentransfer',
    ja: '空港送迎', es: 'Traslado del aeropuerto', 'pt-BR': 'Traslado do aeroporto',
    'zh-CN': '机场接送', ko: '공항 픽업', fr: 'Transfert aéroport',
    it: 'Transfer aeroporto', nl: 'Luchthaventransfer',
  });

  const headline = pick({
    en: 'The smart ride home after the night out.',
    fi: 'Fiksu kyyti kotiin illan jälkeen.',
    de: 'Die clevere Heimfahrt nach der durchzechten Nacht.',
    ja: '飲んだ夜の、賢い帰り道。',
    es: 'La forma inteligente de volver a casa tras la noche.',
    'pt-BR': 'O jeito inteligente de voltar para casa depois da noite.',
    'zh-CN': '尽兴一夜后,聪明的回程。',
    ko: '한잔한 밤, 똑똑하게 집으로.',
    fr: 'Le retour malin après la soirée.',
    it: 'Il modo intelligente di tornare a casa dopo la serata.',
    nl: 'Slim thuiskomen na het stappen.',
  });

  const sub = pick({
    en: 'Lapland bars are spread between resorts and there is no taxi rank waiting outside at 2am. Book Welcome Pickups and the same driver who met you at arrivals takes you back, fixed price agreed up front. Nobody in the group has to stay sober to drive, and nobody waits in the cold.',
    fi: 'Lapin baarit ovat hajallaan eri keskuksissa, eikä ulkona odota taksijonoa kahdelta yöllä. Varaa Welcome Pickups, niin sama kuljettaja joka otti sinut vastaan kentällä vie myös takaisin, hinta sovittu etukäteen. Kenenkään porukasta ei tarvitse pysyä selvänä kuskina eikä kukaan jää palelemaan kadulle.',
    de: 'Die Bars in Lappland liegen verstreut zwischen den Orten, und um 2 Uhr nachts wartet draußen kein Taxi. Buchen Sie Welcome Pickups, und derselbe Fahrer, der Sie an der Ankunft abgeholt hat, bringt Sie wieder zurück, Festpreis vorab vereinbart. Niemand in der Gruppe muss nüchtern als Fahrer bleiben, und keiner wartet in der Kälte.',
    ja: 'ラップランドのバーは各リゾートに点在し、深夜2時に外でタクシーが待っていることはありません。Welcome Pickups を予約すれば、到着時に出迎えてくれた同じドライバーが帰りも送ってくれます。料金は事前確定。グループの誰かが運転のためにしらふでいる必要はなく、寒い中で待つこともありません。',
    es: 'Los bares de Laponia están repartidos entre estaciones y a las 2 de la madrugada no hay parada de taxis esperando fuera. Reserva Welcome Pickups y el mismo conductor que te recibió en llegadas te lleva de vuelta, con el precio fijado de antemano. Nadie del grupo tiene que quedarse sobrio para conducir y nadie espera con frío.',
    'pt-BR': 'Os bares da Lapônia ficam espalhados entre as estações e às 2h da manhã não há ponto de táxi esperando lá fora. Reserve a Welcome Pickups e o mesmo motorista que recebeu você no desembarque leva você de volta, com preço combinado antes. Ninguém do grupo precisa ficar sóbrio para dirigir e ninguém espera no frio.',
    'zh-CN': '拉普兰的酒吧分散在各个度假区,凌晨两点门外不会有出租车在等。预订 Welcome Pickups,在到达口接你的那位司机也会送你回去,价格事先谈好。同行的人不用为了开车而保持清醒,也没人要在寒风里等。',
    ko: '라플란드의 바는 리조트마다 흩어져 있고 새벽 2시에 밖에서 기다리는 택시 줄도 없습니다. Welcome Pickups를 예약하면 도착장에서 맞아준 그 기사가 돌아가는 길도 데려다줍니다. 요금은 미리 정해져 있고요. 일행 중 누구도 운전 때문에 멀쩡히 있을 필요가 없고, 추운 데서 기다릴 일도 없습니다.',
    fr: 'Les bars de Laponie sont disséminés entre les stations et à 2 h du matin aucune file de taxis n’attend dehors. Réservez Welcome Pickups : le chauffeur qui vous a accueilli à l’arrivée vous ramène, prix fixé à l’avance. Personne dans le groupe n’a à rester sobre pour conduire, et personne n’attend dans le froid.',
    it: 'I bar della Lapponia sono sparsi tra le località e alle 2 di notte non c’è una fila di taxi ad aspettare fuori. Prenota Welcome Pickups e lo stesso autista che ti ha accolto agli arrivi ti riporta indietro, prezzo concordato in anticipo. Nessuno del gruppo deve restare sobrio per guidare e nessuno aspetta al freddo.',
    nl: 'De bars in Lapland liggen verspreid tussen de resorts en om 2 uur ’s nachts staat er buiten geen taxi te wachten. Boek Welcome Pickups en dezelfde chauffeur die je bij aankomst opwachtte, brengt je terug, prijs vooraf afgesproken. Niemand in het gezelschap hoeft nuchter te blijven om te rijden, en niemand staat in de kou te wachten.',
  });

  const trust: { icon: typeof Car; label: string }[] = [
    {
      icon: ShieldCheck,
      label: pick({
        en: 'Fixed price agreed in advance',
        fi: 'Kiinteä hinta sovittu etukäteen',
        de: 'Festpreis vorab vereinbart',
        ja: '料金は事前確定',
        es: 'Precio fijo acordado de antemano',
        'pt-BR': 'Preço fixo combinado antes',
        'zh-CN': '价格事先谈好,固定不变',
        ko: '사전 확정 고정 요금',
        fr: 'Prix fixe convenu à l’avance',
        it: 'Prezzo fisso concordato prima',
        nl: 'Vaste prijs vooraf afgesproken',
      }),
    },
    {
      icon: Moon,
      label: pick({
        en: 'A sober driver for the ride back',
        fi: 'Selvä kuljettaja paluumatkalle',
        de: 'Nüchterner Fahrer für die Rückfahrt',
        ja: '帰りはしらふのドライバー',
        es: 'Un conductor sobrio para la vuelta',
        'pt-BR': 'Um motorista sóbrio para a volta',
        'zh-CN': '回程有清醒的司机',
        ko: '돌아오는 길은 멀쩡한 기사가',
        fr: 'Un chauffeur sobre pour le retour',
        it: 'Un autista sobrio per il ritorno',
        nl: 'Een nuchtere chauffeur voor terug',
      }),
    },
    {
      icon: Car,
      label: pick({
        en: 'Meets you at arrivals on the way in',
        fi: 'Vastassa aulassa tulomatkalla',
        de: 'Empfängt dich bei der Ankunft',
        ja: '行きは到着口で出迎え',
        es: 'Te recibe en llegadas a la ida',
        'pt-BR': 'Recebe você no desembarque na ida',
        'zh-CN': '去程在到达口接你',
        ko: '갈 때는 도착장에서 마중',
        fr: 'Vous accueille à l’arrivée à l’aller',
        it: 'Ti accoglie agli arrivi all’andata',
        nl: 'Wacht je op bij aankomst op de heenweg',
      }),
    },
  ];

  const cta = pick({
    en: 'Book a transfer', fi: 'Varaa kuljetus', de: 'Transfer buchen',
    ja: '送迎を予約', es: 'Reservar traslado', 'pt-BR': 'Reservar traslado',
    'zh-CN': '预订接送', ko: '픽업 예약', fr: 'Réserver un transfert',
    it: 'Prenota un transfer', nl: 'Transfer boeken',
  });

  const poweredBy = pick({
    en: 'By Welcome Pickups', fi: 'Tarjoaa Welcome Pickups', de: 'Von Welcome Pickups',
    ja: '提供：Welcome Pickups', es: 'Por Welcome Pickups', 'pt-BR': 'Pela Welcome Pickups',
    'zh-CN': '由 Welcome Pickups 提供', ko: 'Welcome Pickups 제공', fr: 'Par Welcome Pickups',
    it: 'Di Welcome Pickups', nl: 'Door Welcome Pickups',
  });

  const chip = pick({
    en: 'English-speaking local drivers',
    fi: 'Englantia puhuvat paikalliskuljettajat',
    de: 'Englischsprachige Fahrer vor Ort',
    ja: '英語が話せる地元ドライバー',
    es: 'Conductores locales que hablan inglés',
    'pt-BR': 'Motoristas locais que falam inglês',
    'zh-CN': '会说英语的本地司机',
    ko: '영어 가능한 현지 기사',
    fr: 'Chauffeurs locaux anglophones',
    it: 'Autisti locali che parlano inglese',
    nl: 'Engelssprekende lokale chauffeurs',
  });

  return (
    <section
      ref={rootRef}
      data-anim={animState}
      className={`lb-wp-ad group/ad relative overflow-hidden rounded-3xl bg-white text-stone-900 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.6)] ring-1 ring-stone-900/10 ${className}`}
      style={{ borderTop: `4px solid ${WP_GREEN}` }}
      aria-label={headline}
    >
      <style>{`
        .lb-wp-ad[data-anim='pending'] .lb-rise { opacity: 0; transform: translateY(14px); }
        .lb-wp-ad[data-anim='in'] .lb-rise {
          opacity: 1; transform: none;
          transition: opacity .6s ease, transform .6s cubic-bezier(.22,.61,.36,1);
        }
        .lb-wp-ad[data-anim='in'] .lb-rise-1 { transition-delay: .05s; }
        .lb-wp-ad[data-anim='in'] .lb-rise-2 { transition-delay: .13s; }
        .lb-wp-ad[data-anim='in'] .lb-rise-3 { transition-delay: .21s; }

        .lb-wp-ad[data-anim='pending'] .lb-stage { opacity: 0; transform: scale(.94); }
        .lb-wp-ad[data-anim='in'] .lb-stage {
          opacity: 1; transform: scale(1);
          transition: opacity .7s ease, transform .9s cubic-bezier(.22,.61,.36,1);
        }

        /* A car badge sliding gently toward the meeting pin. */
        .lb-wp-ad[data-anim='in'] .lb-car { animation: lb-drive 4.5s ease-in-out infinite; }
        @keyframes lb-drive {
          0%,100% { transform: translateX(-10px); }
          50%     { transform: translateX(10px); }
        }
        /* Pin bob. */
        .lb-wp-ad[data-anim='in'] .lb-pin { animation: lb-bob 3s ease-in-out infinite; }
        @keyframes lb-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        /* Dashed route draw. */
        .lb-wp-ad .lb-route { stroke-dasharray: 6 7; stroke-dashoffset: 0; }
        .lb-wp-ad[data-anim='in'] .lb-route { animation: lb-dash 1.6s linear infinite; }
        @keyframes lb-dash { to { stroke-dashoffset: -26; } }

        @media (prefers-reduced-motion: reduce) {
          .lb-wp-ad .lb-rise,
          .lb-wp-ad .lb-stage { opacity: 1 !important; transform: none !important; transition: none !important; }
          .lb-wp-ad .lb-car,
          .lb-wp-ad .lb-pin,
          .lb-wp-ad .lb-route { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(0,214,160,0.20), transparent)' }}
      />

      <div className="relative grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        {/* ── Copy column ─────────────────────────────────────────────── */}
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="lb-rise lb-rise-1 mb-5 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span
                className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ backgroundColor: 'rgba(6,122,94,0.10)', color: WP_DEEP }}
              >
                {adLabel}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: WP_DEEP }}>
                {eyebrow}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-2">
              <img
                src={WELCOME_PICKUPS.logo}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-7 w-7 sm:h-8 sm:w-8"
              />
              <span className="text-base font-bold leading-tight tracking-tight text-stone-900 sm:text-lg">
                Welcome
                <br className="hidden sm:block" /> Pickups
              </span>
            </span>
          </div>

          <h2 className="lb-rise lb-rise-1 mb-3 max-w-xl text-2xl font-bold leading-tight text-stone-900 sm:text-3xl text-balance">
            {headline}
          </h2>
          <p className="lb-rise lb-rise-2 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base text-pretty">
            {sub}
          </p>

          <ul className="lb-rise lb-rise-2 mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
            {trust.map((tItem) => (
              <li key={tItem.label} className="flex items-center gap-2 text-sm text-stone-700">
                <tItem.icon className="h-4 w-4 shrink-0" style={{ color: WP_DEEP }} aria-hidden="true" />
                <span>{tItem.label}</span>
              </li>
            ))}
          </ul>

          <div
            className="lb-rise lb-rise-3 mt-6 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: 'rgba(0,214,160,0.16)', color: WP_DEEP }}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{chip}</span>
          </div>

          <div className="lb-rise lb-rise-3 mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={href}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => trackAffiliateClick(WELCOME_PICKUPS.slug, `airport_ride:${sid}`, href)}
              className="group/cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-4 font-semibold text-white no-underline shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: WP_DEEP, boxShadow: '0 14px 30px -12px rgba(6,122,94,0.5)' }}
            >
              {cta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <p className="text-[11px] uppercase tracking-[0.12em] text-stone-400">{poweredBy}</p>
          </div>

          <AffiliateDisclosure variant="compact" className="mt-6 !text-stone-500" />
        </div>

        {/* ── Brand visual stage (pickup, no fake photo) ──────────────── */}
        <div
          className="relative min-h-[18rem] overflow-hidden lg:min-h-full"
          style={{ background: 'linear-gradient(155deg, #E2FBF2 0%, #C2F4E3 55%, #A6ECD6 100%)' }}
          aria-hidden="true"
        >
          <div className="lb-stage relative flex h-full w-full items-center justify-center p-8">
            <div className="relative h-40 w-full max-w-[18rem]">
              {/* Dashed route between car and pin */}
              <svg viewBox="0 0 240 80" className="absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden="true">
                <path
                  className="lb-route"
                  d="M40 40 H200"
                  fill="none"
                  stroke={WP_DEEP}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.45"
                />
              </svg>
              {/* Car badge (left, slides) */}
              <div className="lb-car absolute left-0 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl bg-white shadow-[0_14px_36px_-12px_rgba(6,122,94,0.55)] ring-1 ring-white/70">
                <Car className="h-8 w-8" style={{ color: WP_DEEP }} aria-hidden="true" />
              </div>
              {/* Meeting pin (right, bobs) — Welcome Pickups mark */}
              <div className="lb-pin absolute right-0 top-1/2 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_16px_40px_-12px_rgba(6,122,94,0.6)] ring-1 ring-white/70">
                <img
                  src={WELCOME_PICKUPS.logo}
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
