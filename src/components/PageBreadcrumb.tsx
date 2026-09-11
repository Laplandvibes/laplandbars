import Breadcrumbs from '../shared/Breadcrumbs';
import { useLocale } from '../i18n/useLocale';
import { useTranslation } from 'react-i18next';
import { BAR_CITIES } from '../data/barCities';

/**
 * Ecosystem breadcrumb, rendered BELOW the hero (mounted once inside each
 * subpage's hero) so it reads as the first line of page content instead of a
 * bar wedged between the nav and the hero. Self-hides on home + unmapped
 * routes (shared/Breadcrumbs returns null there), so it can be mounted
 * unconditionally.
 */
export default function PageBreadcrumb() {
  const { t } = useTranslation('nav');
  const { locale, to } = useLocale();
  const { t: tp, i18n } = useTranslation('pages');
  const labelMap: Record<string, string> = {
    '/bars': t('links.bars'),
    '/ice-bars': t('links.iceBars'),
    '/apres-ski': t('links.apresSki'),
    '/cocktails': t('links.cocktails'),
    '/craft-beer': t('links.craftBeer'),
    '/drinking-culture': t('links.drinkingCulture'),
  };
  // Kaupunkisivut: nimi kaupungin omasta lohkosta, EN-nimi jos käännös puuttuu.
  for (const c of BAR_CITIES) {
    labelMap[`/city/${c.slug}`] = i18n.exists(`pages:cities.${c.slug}.name`) ? (tp(`cities.${c.slug}.name`) as string) : c.name;
  }
  return (
    <Breadcrumbs
      lang={locale}
      to={to}
      labelMap={labelMap}
      className="bg-night text-snow border-b border-white/10"
      accentClassName="hover:text-vibe-pink hover:opacity-100"
    />
  );
}
