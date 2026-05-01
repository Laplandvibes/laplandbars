import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Bell, Snowflake, Music, Beer, AlertCircle } from 'lucide-react';
import { trackNewsletterSignup } from '../lib/analytics';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const SOURCE = 'laplandbars';

// Per LV rule (feedback_one_newsletter_human_voice.md): ONE newsletter across
// the network, framed as #LaplandVibes — not a per-site sub-brand. The source
// tag differentiates the referring site for analytics; the reader sees the
// master newsletter.
const benefits: { icon: typeof Bell; title: string; body: string }[] = [
  {
    icon: Bell,
    title: 'When the aurora actually shows',
    body: "We watch the FMI forecast every clear night. When KP lines up, we drop you a heads-up — so you can be in the bar with the right window when the lights come on.",
  },
  {
    icon: Snowflake,
    title: 'When the ice bars open',
    body: "Arctic SnowHotel and Lainio rebuild every December. We share the actual opening dates and which year's theme is worth the trip — before the booking pages fill.",
  },
  {
    icon: Music,
    title: "Who's playing après-ski",
    body: "Hullu Poro Areena drops its season lineup in November. We pass on the names worth flying in for, the small Bar Levi Ihku nights, and the Saariselkä gigs nobody else flags.",
  },
  {
    icon: Beer,
    title: 'New bars worth a detour',
    body: "Lapon Panimo's seasonal taps. A pop-up cocktail bar in Rovaniemi. A new brewery on the Tornio side. We tell you about openings while they still feel new.",
  },
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setError(null);
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Newsletter is offline — try again later');
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
          ? `Could not subscribe (${err.message}). Try again or email info@laplandvibes.com.`
          : 'Could not subscribe. Try again or email info@laplandvibes.com.',
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
            The <span className="font-heading tracking-wider">#LAPLANDVIBES</span> newsletter
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white tracking-wide mb-4">
            We mostly drink in Lapland.<br className="hidden sm:block" /> Then we write what we learn.
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            One short email when the aurora window opens, when the ice bars unveil their winter, or when an
            après-ski lineup actually deserves a flight. Written from Finland, in English. Roughly once a month —
            never on a schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {benefits.map((b) => {
            const Icon = b.icon;
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
              <p className="text-base font-medium">Got you. We'll see you under the aurora.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-4 rounded-xl text-night bg-white placeholder:text-night/50 focus:outline-none focus:ring-2 focus:ring-white/70 border border-white/40"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-4 bg-white font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ color: '#DB2777' }}
              >
                {status === 'loading' ? 'Sending…' : 'Send me Lapland'}
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
            One email when there's something to say. Unsubscribe with one click — no questions.{' '}
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
