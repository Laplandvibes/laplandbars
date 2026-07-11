import { Ticket, ArrowUpRight } from 'lucide-react';
import { trackAffiliateClick } from '../lib/analytics';
import { useLocale } from '../i18n/useLocale';
import type { Locale } from '../i18n/config';

/**
 * GetYourGuide SEARCH-link CTA for genuinely bookable bar / beer / cocktail /
 * pub-crawl experiences where we have NOT pinned a single verified product path.
 *
 * URL shape (verified HTTP 200, 2026-06-27):
 *   https://www.getyourguide.com/s/?q=<experience place>&partner_id=VRMKD7N
 *
 * The GYG search page resolves the query to real, current activity results in
 * the destination — so the link never 404s the way a stale product slug can
 * (premium_design_standard §6: affiliate links MUST resolve). We pass a SPECIFIC
 * query (e.g. "Rovaniemi brewery tour", "Levi bar crawl"), never a generic one.
 *
 * `partner_id` carries GYG affiliate attribution directly in the query string;
 * `cmp` is GYG's analog of our `sid` and shows the placement in the GYG dashboard.
 * These do NOT route through go.laplandvibes.com (that Worker collapses GYG slugs).
 *
 * Required affiliate <a> attributes (LV spec): target="_blank"
 * rel="sponsored nofollow noopener" — NO `noreferrer`.
 *
 * Only use this where the thing is actually a GYG-bookable guided experience
 * (brewery tour, tasting, cocktail class, pub crawl) — NOT for a walk-in pub,
 * a museum, or transport.
 */

const GYG_PARTNER_ID = 'VRMKD7N';

const GYG_DOMAIN: Record<Locale, string> = {
  en: 'https://www.getyourguide.com',
  fi: 'https://www.getyourguide.com',
  de: 'https://www.getyourguide.de',
  ja: 'https://www.getyourguide.com',
  es: 'https://www.getyourguide.es',
  'pt-BR': 'https://www.getyourguide.com.br',
  'zh-CN': 'https://www.getyourguide.com',
  ko: 'https://www.getyourguide.com',
  fr: 'https://www.getyourguide.fr',
  it: 'https://www.getyourguide.it',
  nl: 'https://www.getyourguide.nl',
};

export function gygSearchLink(query: string, sid: string, lang: Locale = 'en'): string {
  const url = new URL(`${GYG_DOMAIN[lang] ?? GYG_DOMAIN.en}/s/`);
  url.searchParams.set('q', query);
  url.searchParams.set('partner_id', GYG_PARTNER_ID);
  url.searchParams.set('cmp', `lv_laplandbars_${sid}`);
  return url.toString();
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
