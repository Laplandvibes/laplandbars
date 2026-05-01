/**
 * Per-page SEO component. Relies on React 19's metadata hoisting — emits
 * <title>, <meta>, <link rel="canonical"> and JSON-LD <script> tags into
 * <head> from the route component.
 *
 * Usage on a pillar page:
 *
 *   <PageSeo
 *     title="Ice Bars in Lapland"
 *     description="..."
 *     path="/ice-bars"
 *     jsonLd={iceBarsJsonLd}
 *   />
 */
interface PageSeoProps {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/ice-bars". Used to build canonical + og:url. */
  path: string;
  /** Optional OG image URL override. Falls back to site default. */
  ogImage?: string;
  /** Optional structured-data graph(s). Pass a single object or an array; we'll wrap in @graph. */
  jsonLd?: object | object[];
}

const ORIGIN = 'https://laplandbars.com';
const DEFAULT_OG = 'https://lh3.googleusercontent.com/d/1CXCw3caLeOTwU6Is4T_u6xG9TFF-uPGF=w1200';

export default function PageSeo({ title, description, path, ogImage, jsonLd }: PageSeoProps) {
  const url = `${ORIGIN}${path === '/' ? '' : path}`;
  const og = ogImage ?? DEFAULT_OG;
  const fullTitle = path === '/' ? title : `${title} | LaplandBars`;

  const graph = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : null;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={og} />
      <meta property="og:site_name" content="LaplandBars" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@laplandvibes" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
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
