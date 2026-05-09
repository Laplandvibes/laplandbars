import { useTranslation } from 'react-i18next';
import PrivacyContent from '../../../shared/Legal/PrivacyContent';
import Hreflang from '../i18n/Hreflang';

export default function PrivacyPolicy() {
  const { t } = useTranslation('pages');
  return (
    <>
      <title>{t('privacy.title')}</title>
      <meta name="description" content={t('privacy.description')} />
      <Hreflang path="/privacy" />
      <meta name="robots" content="index, follow" />
      <PrivacyContent siteName="LaplandBars" />
    </>
  );
}
