import { useTranslation } from 'react-i18next';
import TermsContent from '../shared/Legal/TermsContent';
import PageSeo from '../components/PageSeo';
import { useLocale } from '../i18n/useLocale';

export default function Terms() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <PageSeo title={t('terms.title')} description={t('terms.description')} path="/terms" />
      <TermsContent siteName="LaplandBars" siteUrl="laplandbars.com" lang={locale} />
    </>
  );
}
