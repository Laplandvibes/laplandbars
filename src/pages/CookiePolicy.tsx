import { useTranslation } from 'react-i18next';
import CookieContent from '../../../shared/Legal/CookieContent';
import Hreflang from '../i18n/Hreflang';

export default function CookiePolicy() {
  const { t } = useTranslation('pages');
  return (
    <>
      <title>{t('cookie.title')}</title>
      <meta name="description" content={t('cookie.description')} />
      <Hreflang path="/cookie-policy" />
      <meta name="robots" content="index, follow" />
      <CookieContent siteId="laplandbars" siteName="LaplandBars" />
    </>
  );
}
