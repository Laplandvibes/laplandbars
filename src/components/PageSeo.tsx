/**
 * Per-page SEO component. Relies on React 19's metadata hoisting — emits
 * <title>, <meta>, <link rel="canonical"> + hreflang and JSON-LD into <head>
 * from the route component.
 *
 * Locale-aware (i18n migration 2026-05-09): pass `titleKey` + `descriptionKey`
 * pointing to the `pages` namespace. Passes the literal `title`/`description`
 * still work for backwards compatibility.
 */
import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';

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
const DEFAULT_OG = 'https://lh3.googleusercontent.com/d/1CXCw3caLeOTwU6Is4T_u6xG9TFF-uPGF=w1200';

export default function PageSeo({ title, description, titleKey, descriptionKey, path, ogImage, jsonLd }: PageSeoProps) {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  const resolvedTitle = titleKey ? t(titleKey) : (title ?? '');
  const resolvedDesc = descriptionKey ? t(descriptionKey) : (description ?? '');

  const enUrl = `${ORIGIN}${path === '/' ? '/' : path}`;
  const fiUrl = `${ORIGIN}/fi${path === '/' ? '' : path}`;
  const currentUrl = locale === 'fi' ? fiUrl : enUrl;
  const og = ogImage ?? DEFAULT_OG;
  const fullTitle = (path === '/' || resolvedTitle.includes('|')) ? resolvedTitle : `${resolvedTitle} | LaplandBars`;

  const graph = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : null;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDesc} />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="fi" href={fiUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDesc} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={og} />
      <meta property="og:site_name" content="LaplandBars" />
      <meta property="og:locale" content={locale === 'fi' ? 'fi_FI' : 'en_US'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@laplandvibes" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDesc} />
      <meta name="twitter:image" content={og} />
      {graph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
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
    inLanguage: 'en',
    author: { '@type': 'Organization', name: 'LaplandVibes editorial team', url: 'https://laplandvibes.com' },
    publisher: {
      '@type': 'Organization',
      name: 'LaplandBars',
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/favicon.svg` },
    },
  };
}
