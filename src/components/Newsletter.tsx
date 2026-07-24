import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Bell, Snowflake, Music, Beer, AlertCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { trackNewsletterSignup } from '../lib/analytics';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const SOURCE = 'laplandbars';

// Per LV rule (feedback_one_newsletter_human_voice.md): ONE newsletter across
// the network, framed as #LaplandVibes — not a per-site sub-brand. The source
// tag differentiates the referring site for analytics; the reader sees the
// master newsletter.
const benefitIcons = [Bell, Snowflake, Music, Beer];

type Benefit = { title: string; body: string };

export default function Newsletter() {
  const { t } = useTranslation('pages');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const benefits = (t('newsletter.benefits', { returnObjects: true }) as Benefit[]) || [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setError(null);
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
        body: JSON.stringify({ email, source: SOURCE }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      trackNewsletterSignup(data?.alreadySubscribed ? `${SOURCE}-already` : SOURCE);
      setStatus('done');
    } catch (err) {
      setStatus('error');
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
      className="py-20 sm:py-24 px-4 sm:px-6"
      style={{ background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' }}
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
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="newsletter-email">{t('newsletter.emailLabel')}</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
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
            </form>
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
