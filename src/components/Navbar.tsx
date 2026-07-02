import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from '../i18n/LanguageSwitcher';
import { useLocale } from '../i18n/useLocale';

const NAV_KEYS = [
  { key: 'bars', basePath: '/bars' },
  { key: 'iceBars', basePath: '/ice-bars' },
  { key: 'apresSki', basePath: '/apres-ski' },
  { key: 'cocktails', basePath: '/cocktails' },
  { key: 'craftBeer', basePath: '/craft-beer' },
  { key: 'drinkingCulture', basePath: '/drinking-culture' },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('nav');
  const { to, pathWithoutLocale } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-night/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={to('/')} className="no-underline">
            <Logo light />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.basePath}
                to={to(link.basePath)}
                className={`font-medium transition-colors duration-200 text-sm tracking-wide no-underline ${
                  pathWithoutLocale === link.basePath ? 'text-amber' : 'text-white/70 hover:text-amber'
                }`}
              >
                {t(`links.${link.key}`)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white hover:text-amber transition-colors"
            aria-label={t('menu')}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-night/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.basePath}
                to={to(link.basePath)}
                className={`block font-medium transition-colors duration-200 text-base no-underline py-2.5 ${
                  pathWithoutLocale === link.basePath ? 'text-amber' : 'text-white/70 hover:text-amber'
                }`}
              >
                {t(`links.${link.key}`)}
              </Link>
            ))}
            <div className="pt-2"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </nav>
  );
}
