import { useTranslation } from 'react-i18next';
import PrivacyContent from '../shared/Legal/PrivacyContent';
import PageSeo from '../components/PageSeo';
import { useLocale } from '../i18n/useLocale';

export default function PrivacyPolicy() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <PageSeo title={t('privacy.title')} description={t('privacy.description')} path="/privacy" />
      <PrivacyContent siteName="LaplandBars" lang={locale} />
    </>
  );
}
