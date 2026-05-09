import { useLocale } from './useLocale';

export default function Hreflang({
  path,
  origin = 'https://laplandbars.com',
}: {
  path: string;
  origin?: string;
}) {
  const { locale } = useLocale();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const enUrl = `${origin}${cleanPath === '/' ? '/' : cleanPath}`;
  const fiUrl = `${origin}/fi${cleanPath === '/' ? '' : cleanPath}`;
  const canonical = locale === 'fi' ? fiUrl : enUrl;

  return (
    <>
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="fi" href={fiUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
    </>
  );
}
