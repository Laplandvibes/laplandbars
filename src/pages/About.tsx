import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import PageSeo from '../components/PageSeo';
import { useLocale } from '../i18n/useLocale';

export default function About() {
  const { t } = useTranslation('pages');
  const { to } = useLocale();
  // `min-h-screen` venytti lyhyen About-sivun täydeksi ruuduksi ja jätti
  // tabletilla ~500 px tyhjää viimeisen rivin ja footerin väliin.
  // Sisältö määrää korkeuden (auditti 4.8.).
  return (
    <div className="bg-night pt-24 pb-20">
      <PageSeo
        titleKey="about.title"
        descriptionKey="about.description"
        path="/about"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-5xl text-white tracking-wide mb-8">{t('about.h1')}</h1>
        <div className="space-y-5 text-white/80 leading-relaxed">
          <p>{t('about.body.0')}</p>
          <p>{t('about.body.1')}</p>
          <p>
            <Trans
              i18nKey="about.body.2"
              ns="pages"
              // The copy uses the <1> placeholder, and an ARRAY maps index 0
              // to <0> — so <1> matched nothing and the link rendered as plain
              // text in all twelve locales. Object form keys the placeholder
              // explicitly. (Pre-existing; noticed while extending this page.)
              components={{
                1: <a href="https://laplandvibes.com" className="text-amber hover:text-amber/80">LaplandVibes</a>,
              }}
            />
          </p>
          <p>
            <Trans
              i18nKey="about.body.3"
              ns="pages"
              components={{
                1: <a href="mailto:info@laplandvibes.com" className="text-amber hover:text-amber/80">info@laplandvibes.com</a>,
              }}
            />
          </p>
          {/* body.4 and body.5 are plain paragraphs with no link placeholders,
              so they render directly rather than through <Trans>. They sit last
              because 0-3 end on the operator and contact line, which reads as
              the sign-off. Whatever is in the array must be rendered here: the
              prerender harvests the whole block, so a paragraph the component
              skips would be text only the crawler sees. */}
          <p>{t('about.body.4')}</p>
          <p>{t('about.body.5')}</p>
        </div>
        <div className="mt-10">
          <Link to={to('/')} className="text-amber hover:text-amber/80 no-underline font-medium">{t('about.back')}</Link>
        </div>
      </div>
    </div>
  );
}
