import { useTranslation } from 'react-i18next';
import CookieContent from '../shared/Legal/CookieContent';
import PageSeo from '../components/PageSeo';
import { useLocale } from '../i18n/useLocale';

export default function CookiePolicy() {
  const { t } = useTranslation('pages');
  const { locale } = useLocale();
  return (
    <>
      <PageSeo title={t('cookie.title')} description={t('cookie.description')} path="/cookie-policy" />
      <CookieContent siteId="laplandbars" siteName="LaplandBars" lang={locale} />
    </>
  );
}
