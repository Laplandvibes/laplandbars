import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Bell, Snowflake, Music, Beer, AlertCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';
import { trackNewsletterSignup } from '../lib/analytics';
import FounderByline from '../../../shared/FounderByline';

/**
 * [LV-FUNNEL 2026-08-21] Lomakesuppilon eventit Umamiin — paikallinen apuri,
 * ei jaettua importtia (vendoroitu sync on refresh-only). Ei saa koskaan
 * rikkoa lomaketta. Standardi: memory _procedural/lv_form_funnel_events.md.
 */
function track(event: string, data?: Record<string, unknown>) {
  try {
    (window as unknown as { umami?: { track: (e: string, d?: unknown) => void } }).umami?.track(event, data);
  } catch { /* ignore */ }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const SOURCE = 'laplandbars';

// Per LV rule (feedback_one_newsletter_human_voice.md): ONE newsletter across
// the network, framed as #LaplandVibes — not a per-site sub-brand. The source
// tag differentiates the referring site for analytics; the reader sees the
// master newsletter.
const benefitIcons = [Bell, Snowflake, Music, Beer];

type Benefit = { title: string; body: string };

// [LV-CONSENT-V2 2026-08-14] Suostumusteksti pidetään tässä tiedostossa eikä
// locales/*/pages.json:ssa: teksti on juridinen tallenne, joka lähetetään
// palvelimelle sanatarkasti (`consentText`), joten se ei saa elää erillään
// lähettävästä koodista. Kieli valitaan samasta i18n-hookista kuin muukin
// tämän komponentin teksti — avaimet ovat i18n/config.ts:n SUPPORTED_LOCALES.
type ConsentCopy = { consent: string; privacy: string };

const CONSENT_COPY: Record<string, ConsentCopy> = {
  en: {
    consent: 'Yes, send the LaplandVibes newsletter (travel tips, seasonal updates and offers) to this email address. I confirm I am 18 or over.',
    privacy: 'Privacy Policy',
  },
  fi: {
    consent: 'LaplandVibes saa lähettää minulle uutiskirjettä (matkailuvinkkejä, sesonkitietoa ja tarjouksia) antamaani sähköpostiosoitteeseen. Olen täyttänyt 18 vuotta.',
    privacy: 'Tietosuojaseloste',
  },
  de: {
    consent: 'Ja, LaplandVibes darf mir den Newsletter mit Reisetipps, Saisoninfos und Angeboten an diese E-Mail-Adresse senden. Ich bin mindestens 18 Jahre alt.',
    privacy: 'Datenschutzerklärung',
  },
  ja: {
    consent: '入力したメールアドレス宛に、LaplandVibesがニュースレター（旅のヒント、シーズン情報、キャンペーン情報）を送ることに同意します。私は18歳以上です。',
    privacy: 'プライバシーポリシー',
  },
  es: {
    consent: 'Acepto recibir en mi correo el boletín de LaplandVibes (consejos de viaje, información de temporada y ofertas) y confirmo que tengo al menos 18 años.',
    privacy: 'Política de privacidad',
  },
  'pt-BR': {
    consent: 'Aceito receber a newsletter da LaplandVibes no e-mail informado, com dicas de viagem, informações de temporada e ofertas. Tenho 18 anos ou mais.',
    privacy: 'Política de Privacidade',
  },
  'zh-CN': {
    consent: '我同意 LaplandVibes 向我填写的邮箱发送订阅邮件，内容包括拉普兰旅行建议、季节资讯和优惠信息，并确认本人已年满18周岁。',
    privacy: '隐私政策',
  },
  ko: {
    consent: '입력한 이메일 주소로 LaplandVibes가 보내는 여행 팁·시즌 정보·프로모션 소식 뉴스레터 수신에 동의하며, 만 18세 이상임을 확인합니다.',
    privacy: '개인정보처리방침',
  },
  fr: {
    consent: "J'accepte de recevoir la newsletter LaplandVibes (conseils voyage, infos saisonnières, offres) à cette adresse e-mail et je confirme avoir 18 ans ou plus.",
    privacy: 'Politique de confidentialité',
  },
  it: {
    consent: "Sì, desidero ricevere la newsletter di LaplandVibes (consigli di viaggio, novità stagionali e offerte) all'indirizzo indicato. Ho almeno 18 anni.",
    privacy: 'Informativa sulla privacy',
  },
  nl: {
    consent: 'Ja, LaplandVibes mag de nieuwsbrief met reistips, seizoensinfo en aanbiedingen naar dit e-mailadres sturen. Ik ben 18 jaar of ouder.',
    privacy: 'Privacyverklaring',
  },
  sv: {
    consent: 'Ja, jag vill ha nyhetsbrevet från LaplandVibes med restips, säsongsinfo och erbjudanden till min e-postadress. Jag är minst 18 år.',
    privacy: 'Integritetspolicy',
  },
};

function consentCopyFor(lng: string | undefined): ConsentCopy {
  if (!lng) return CONSENT_COPY.en;
  if (CONSENT_COPY[lng]) return CONSENT_COPY[lng];
  const base = lng.split('-')[0];
  const match = Object.keys(CONSENT_COPY).find((k) => k.split('-')[0] === base);
  return match ? CONSENT_COPY[match] : CONSENT_COPY.en;
}

export default function Newsletter() {
  const { t } = useTranslation('pages');
  const [email, setEmail] = useState('');
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const benefits = (t('newsletter.benefits', { returnObjects: true }) as Benefit[]) || [];
  // Locale from the URL prefix (useLocale) — NOT i18n.resolvedLanguage: on a
  // direct non-EN load the locale bundle is registered without a
  // changeLanguage() call, so resolvedLanguage stays 'en' for the session and
  // the consent checkbox rendered English on an otherwise localized page
  // (same bug as the hub, fixed network-wide 2026-08-15).
  const { locale } = useLocale();
  const consentCopy = consentCopyFor(locale);
  // [LV-FUNNEL] view = osio vieritetty näkyviin (kerran), start = 1. fokus,
  // blocked kerran per submit-yritys (natiivi invalid laukeaa per kenttä).
  const funnelData = { surface: 'inline', lang: locale };
  const sectionRef = useRef<HTMLElement | null>(null);
  const startTracked = useRef(false);
  const blockedTracked = useRef(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        track('nl_view', funnelData);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const trackStart = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    track('nl_start', funnelData);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !consented || status === 'loading') {
      if (status !== 'loading') track('nl_blocked', { ...funnelData, reason: !email ? 'email' : 'consent' });
      return;
    }

    setStatus('loading');
    setError(null);
    track('nl_submit', funnelData);
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Newsletter is offline. Try again later');
      }
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          source: SOURCE,
          // [LV-CONSENT-V2 2026-08-14] Palvelin vaatii nämä (z.literal(true)):
          // ilman niitä rivi ei synny lainkaan. `consentText` on se teksti
          // jonka käyttäjä näki omalla kielellään, ei englanninkielinen vakio.
          consent: true,
          ageConfirmed: true,
          consentText: consentCopy.consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      trackNewsletterSignup(data?.alreadySubscribed ? `${SOURCE}-already` : SOURCE);
      track('nl_success', data?.alreadySubscribed ? { ...funnelData, already: true } : funnelData);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      track('nl_error', funnelData);
      setError(
        err instanceof Error
          ? `${t('newsletter.errorPrefix')} (${err.message}). ${t('newsletter.errorFallback')}`
          : t('newsletter.errorFallback'),
      );
    }
  }

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="py-20 sm:py-24 px-4 sm:px-6"
      style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7E22CE 35%, #BE185D 70%, #DB2777 100%)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/85 font-semibold mb-3">
            <Trans
              i18nKey="newsletter.kicker"
              ns="pages"
              components={[<span key="0" className="font-heading tracking-wider">#LAPLANDVIBES</span>]}
            />
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white tracking-wide mb-4">
            {t('newsletter.headlineLine1')}<br className="hidden sm:block" /> {t('newsletter.headlineLine2')}
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('newsletter.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {benefits.map((b, i) => {
            const Icon = benefitIcons[i] ?? Bell;
            return (
              <div
                key={b.title}
                className="bg-white/12 backdrop-blur-sm border border-white/25 rounded-2xl p-5 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-bold text-base mb-1.5">{b.title}</p>
                <p className="text-white/85 text-sm leading-relaxed">{b.body}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center max-w-xl mx-auto">
          {status === 'done' ? (
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <p className="text-base font-medium">{t('newsletter.doneMessage')}</p>
            </div>
          ) : (
            <><FounderByline tone="pink" />
            <form
              onSubmit={onSubmit}
              onInvalidCapture={(e) => {
                if (blockedTracked.current) return;
                blockedTracked.current = true;
                window.setTimeout(() => { blockedTracked.current = false; }, 400);
                const t = e.target as HTMLInputElement;
                track('nl_blocked', { ...funnelData, reason: t.type === 'checkbox' ? 'consent' : 'email' });
              }}
              className="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <label className="sr-only" htmlFor="newsletter-email">{t('newsletter.emailLabel')}</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onFocus={trackStart}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.emailPlaceholder')}
                required
                className="flex-1 px-5 py-4 rounded-xl text-night bg-white placeholder:text-night/50 focus:outline-none focus:ring-2 focus:ring-white/70 border border-white/40"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-4 bg-white font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ color: '#DB2777' }}
              >
                {status === 'loading' ? t('newsletter.submitLoading') : t('newsletter.submitIdle')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <label className="w-full flex items-start gap-3 text-left cursor-pointer">
                <input
                  type="checkbox"
                  checked={consented}
                  onFocus={trackStart}
                  onChange={(e) => setConsented(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 shrink-0 accent-white cursor-pointer"
                />
                <span className="text-white/85 text-xs leading-relaxed">
                  {consentCopy.consent}{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => e.stopPropagation()}
                    className="underline hover:text-white"
                  >
                    {consentCopy.privacy}
                  </a>
                </span>
              </label>
            </form></>
          )}

          {error && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <p className="text-white/75 text-xs mt-5">
            <Trans
              i18nKey="newsletter.footnote"
              ns="pages"
              components={[<a key="0" href="/privacy" className="underline hover:text-white">Privacy</a>]}
            />
          </p>
        </div>
      </div>
    </section>
  );
}
