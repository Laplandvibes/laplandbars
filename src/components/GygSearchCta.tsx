import { Ticket, ArrowUpRight } from 'lucide-react';
import { trackAffiliateClick } from '../lib/analytics';
import { GYG_WORKER_LANG } from '../lib/gyg';
import { useLocale } from '../i18n/useLocale';
import type { Locale } from '../i18n/config';

/**
 * GetYourGuide SEARCH-link CTA for genuinely bookable bar / beer / cocktail /
 * pub-crawl experiences where we have NOT pinned a single verified product path.
 *
 * Reitittää Workerin kautta 2026-08-03 alkaen:
 *   https://go.laplandvibes.com/go/activities?sid=<sid>&language=<koodi>&q=<haku>
 * Worker rakentaa GYG:n /s?q=-haun, injektoi partner_id+cmp:n JA kääntää
 * `language`-koodin kielipolkuprefiksiksi (ainoa lokalisointi jota GYG
 * kunnioittaa — raaka ?language= on GYG:llä no-op, ja vanha getyourguide.de-
 * domain-taulu jätti muut kielet englanniksi). Suora GYG-linkitys menettäisi
 * lisäksi D1-klikkilokin. Aiempi kommentti "Worker collapses GYG slugs" oli
 * curl-bot-fallback-artefakti, ei totta.
 *
 * We pass a SPECIFIC query (e.g. "Rovaniemi brewery tour", "Levi bar crawl"),
 * never a generic one. Required affiliate <a> attributes (LV spec):
 * target="_blank" rel="sponsored nofollow noopener" — NO `noreferrer`.
 *
 * Only use this where the thing is actually a GYG-bookable guided experience
 * (brewery tour, tasting, cocktail class, pub crawl) — NOT for a walk-in pub,
 * a museum, or transport.
 */

export function gygSearchLink(query: string, sid: string, lang: Locale = 'en'): string {
  const params = new URLSearchParams({ sid });
  const gygLang = GYG_WORKER_LANG[lang];
  if (gygLang) params.set('language', gygLang);
  params.set('q', query);
  return `https://go.laplandvibes.com/go/activities?${params.toString()}`;
}

interface GygSearchCtaProps {
  /** Specific GYG search query, e.g. "Rovaniemi brewery tour". Never generic. */
  query: string;
  /** Per-placement analytics tag (snake_case), e.g. 'bars_crawl_rovaniemi'. */
  sid: string;
  /** Visible button label. */
  children: React.ReactNode;
  className?: string;
  /** `button` = pill CTA, `link` = inline text link with arrow. */
  variant?: 'button' | 'link';
}

export default function GygSearchCta({
  query,
  sid,
  children,
  className = '',
  variant = 'button',
}: GygSearchCtaProps) {
  const { locale } = useLocale();
  const href = gygSearchLink(query, sid, locale);

  if (variant === 'link') {
    return (
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => trackAffiliateClick('getyourguide', `gyg_search:${sid}`, href)}
        className={`inline-flex items-center gap-1.5 text-amber hover:text-amber/80 text-sm font-semibold no-underline transition-colors ${className}`}
      >
        {children}
        <ArrowUpRight size={14} className="shrink-0" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => trackAffiliateClick('getyourguide', `gyg_search:${sid}`, href)}
      className={`inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber/90 text-night px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-[1.02] shadow-md shadow-amber/20 no-underline ${className}`}
    >
      <Ticket size={15} className="shrink-0" />
      {children}
    </a>
  );
}
