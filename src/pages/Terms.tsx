import { useTranslation } from 'react-i18next';
import TermsContent from '../../../shared/Legal/TermsContent';
import Hreflang from '../i18n/Hreflang';

export default function Terms() {
  const { t } = useTranslation('pages');
  return (
    <>
      <title>{t('terms.title')}</title>
      <meta name="description" content={t('terms.description')} />
      <Hreflang path="/terms" />
      <meta name="robots" content="index, follow" />
      <TermsContent siteName="LaplandBars" siteUrl="laplandbars.com" />
    </>
  );
}
