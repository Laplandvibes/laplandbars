import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from './useLocale';

interface Props {
  /** Optional className for the wrapper. */
  className?: string;
  /** "pill" (default, on dark surfaces) or "inline" (white-band footer etc.). */
  variant?: 'pill' | 'inline';
}

/**
 * EN / FI toggle. Each language renders as a real anchor (`Link`) so search
 * engines can crawl the alternate locale and Cmd-click opens it in a new tab.
 * The non-active language stays clickable; the active one is styled
 * differently and gets `aria-current="page"`.
 */
export default function LanguageSwitcher({ className = '', variant = 'pill' }: Props) {
  const { locale, to, pathWithoutLocale } = useLocale();
  const { t } = useTranslation('common');

  const items: { code: 'en' | 'fi'; label: string; href: string }[] = [
    { code: 'en', label: t('lang.currentEN'), href: to(pathWithoutLocale, 'en') },
    { code: 'fi', label: t('lang.currentFI'), href: to(pathWithoutLocale, 'fi') },
  ];

  const baseClasses =
    variant === 'pill'
      ? 'px-2.5 py-1 rounded-full text-[11px] font-heading tracking-[0.18em] uppercase transition-colors duration-200'
      : 'px-2 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200';

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="group"
      aria-label={t('lang.switchTo')}
    >
      {items.map((item) => {
        const isActive = item.code === locale;
        const stateClasses = isActive
          ? variant === 'pill'
            ? 'bg-vibe-pink text-white'
            : 'text-vibe-pink underline underline-offset-4'
          : variant === 'pill'
            ? 'text-snow/70 hover:text-snow border border-white/15 hover:border-vibe-pink/50'
            : 'text-snow/55 hover:text-snow';

        return (
          <Link
            key={item.code}
            to={item.href}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.code === 'en' ? 'English' : 'Suomi'}
            hrefLang={item.code}
            className={`${baseClasses} ${stateClasses}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
