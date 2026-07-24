/**
 * Per-page SEO component. Relies on React 19's metadata hoisting — emits
 * <title>, <meta>, <link rel="canonical"> + hreflang and JSON-LD into <head>
 * from the route component.
 *
 * Locale-aware (i18n migration 2026-05-09): pass `titleKey` + `descriptionKey`
 * pointing to the `pages` namespace. Passes the literal `title`/`description`
 * still work for backwards compatibility.
 *
 * 2026-05-21: hreflang + og:locale extended to all 11 supported locales;
 * JSON-LD inLanguage injection.
 */
import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';
import { SUPPORTED_LOCALES, LOCALE_BCP47, localisedPath, type Locale } from '../i18n/config';

interface PageSeoProps {
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  /** Site-relative path (no locale prefix), e.g. "/ice-bars". */
  path: string;
  ogImage?: string;
  jsonLd?: object | object[];
}

const ORIGIN = 'https://laplandbars.com';
const SITE_NAME = 'LaplandBars';
const DEFAULT_OG = 'https://laplandbars.com/images/drive/cocktailTrio.webp';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US', fi: 'fi_FI', de: 'de_DE', ja: 'ja_JP', es: 'es_ES',
  'pt-BR': 'pt_BR', 'zh-CN': 'zh_CN', ko: 'ko_KR', fr: 'fr_FR', it: 'it_IT', nl: 'nl_NL',
  sv: 'sv_SE',
};

function injectInLanguage(node: unknown, bcp47: string): unknown {
  if (Array.isArray(node)) return node.map((n) => injectInLanguage(n, bcp47));
  if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    if (o['@type'] && o.inLanguage === undefined) o.inLanguage = bcp47;
    if (Array.isArray(o['@graph'])) o['@graph'] = (o['@graph'] as unknown[]).map((n) => injectInLanguage(n, bcp47));
    return o;
  }
  return node;
}

export default function PageSeo({ title, description, titleKey, descriptionKey, path, ogImage, jsonLd }: PageSeoProps) {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  const resolvedTitle = titleKey ? t(titleKey) : (title ?? '');
  const resolvedDesc = descriptionKey ? t(descriptionKey) : (description ?? '');

  // Trailing-slash form matches the prerendered static HTML and sitemap.xml
  // (Cloudflare Pages serves /path/index.html at /path/ with 200; the no-slash
  // form 308-redirects).
  const enUrl = `${ORIGIN}${path === '/' ? '/' : path}`.replace(/\/?$/, '/');
  const currentUrl = `${ORIGIN}${localisedPath(path, locale)}`.replace(/\/?$/, '/');
  const og = ogImage ?? DEFAULT_OG;
  const bcp47 = LOCALE_BCP47[locale];
  const fullTitle = (path === '/' || resolvedTitle.includes('|')) ? resolvedTitle : `${resolvedTitle} | ${SITE_NAME}`;

  const graphItems = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : null;
  const localizedGraph = graphItems
    ? (injectInLanguage(JSON.parse(JSON.stringify(graphItems)), bcp47) as unknown[])
    : null;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDesc} />
      <link rel="canonical" href={currentUrl} />
      {/* Short hreflang codes (en, fi, pt-BR, zh-CN, …) + trailing-slash hrefs:
          must match the prerenderer (_prerender_routes.mjs) and sitemap.xml. */}
      {SUPPORTED_LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${ORIGIN}${localisedPath(path, l)}`.replace(/\/?$/, '/')} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDesc} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={og} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={OG_LOCALE[locale]} />
      {SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALE[l]} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@laplandvibes" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDesc} />
      <meta name="twitter:image" content={og} />
      {localizedGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': localizedGraph }),
          }}
        />
      )}
    </>
  );
}

/** Helper: BreadcrumbList for a single pillar (Home → Pillar). */
export function pillarBreadcrumb(pillarName: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: pillarName, item: `${ORIGIN}${path}` },
    ],
  };
}

/** Helper: Article (suitable for guide-style pillar pages). */
export function articleSchema(headline: string, description: string, path: string) {
  return {
    '@type': 'Article',
    headline,
    description,
    url: `${ORIGIN}${path}`,
    // inLanguage intentionally NOT set here — PageSeo's injectInLanguage fills
    // the current locale's BCP-47 code (a hardcoded 'en' blocked that ×11).
    author: { '@type': 'Organization', name: 'LaplandVibes editorial team', url: 'https://laplandvibes.com' },
    publisher: {
      '@type': 'Organization',
      name: 'LaplandBars',
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/favicon.svg` },
    },
  };
}
