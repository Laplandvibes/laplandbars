import { SUPPORTED_LOCALES, localePrefix } from './config';
import type { Locale } from './config';

/**
 * hreflang alternates only. Canonical is owned exclusively by PageSeo
 * (src/components/PageSeo.tsx) — never emit a second rel=canonical here.
 * Short hreflang codes + trailing-slash hrefs match the prerenderer
 * (_prerender_routes.mjs) and sitemap.xml.
 */
export default function Hreflang({
  path,
  origin = 'https://laplandbars.com',
}: {
  path: string;
  origin?: string;
}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const suffix = cleanPath === '/' ? '' : cleanPath;
  const urlFor = (loc: Locale) => {
    const prefix = localePrefix(loc);
    if (!prefix) return `${origin}${cleanPath === '/' ? '/' : cleanPath}`.replace(/\/?$/, '/');
    return `${origin}${prefix}${suffix}`.replace(/\/?$/, '/');
  };
  const enUrl = urlFor('en');

  return (
    <>
      {SUPPORTED_LOCALES.map((loc) => (
        <link key={loc} rel="alternate" hrefLang={loc} href={urlFor(loc)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  );
}
