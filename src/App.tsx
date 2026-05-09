import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import SharedFooter from '../../shared/Footer';
import SharedCookieBanner from '../../shared/CookieBanner';
import NewsletterPopup from './components/NewsletterPopup';
import Home from './pages/Home';
import Bars from './pages/Bars';
import IceBars from './pages/IceBars';
import ApresSki from './pages/ApresSki';
import Cocktails from './pages/Cocktails';
import CraftBeer from './pages/CraftBeer';
import DrinkingCulture from './pages/DrinkingCulture';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
import { useLocale } from './i18n/useLocale';

const pillarLinks = [
  { name: 'Bars', href: '/bars' },
  { name: 'Ice Bars', href: '/ice-bars' },
  { name: 'Après-Ski', href: '/apres-ski' },
  { name: 'Cocktails', href: '/cocktails' },
  { name: 'Craft Beer', href: '/craft-beer' },
  { name: 'Drinking Culture', href: '/drinking-culture' },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LocaleSync() { useLocale(); return null; }

const ROUTES: { path: string; element: React.ReactNode }[] = [
  { path: '/', element: <Home /> },
  { path: '/fi', element: <Home /> },
  { path: '/bars', element: <Bars /> },
  { path: '/fi/bars', element: <Bars /> },
  { path: '/ice-bars', element: <IceBars /> },
  { path: '/fi/ice-bars', element: <IceBars /> },
  { path: '/apres-ski', element: <ApresSki /> },
  { path: '/fi/apres-ski', element: <ApresSki /> },
  { path: '/cocktails', element: <Cocktails /> },
  { path: '/fi/cocktails', element: <Cocktails /> },
  { path: '/craft-beer', element: <CraftBeer /> },
  { path: '/fi/craft-beer', element: <CraftBeer /> },
  { path: '/drinking-culture', element: <DrinkingCulture /> },
  { path: '/fi/drinking-culture', element: <DrinkingCulture /> },
  { path: '/about', element: <About /> },
  { path: '/fi/about', element: <About /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/fi/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/fi/terms', element: <Terms /> },
  { path: '/cookie-policy', element: <CookiePolicy /> },
  { path: '/fi/cookie-policy', element: <CookiePolicy /> },
];

function AppLayout() {
  return (
    <div className="min-h-screen bg-night text-white">
      <ScrollToTop />
      <LocaleSync />
      <Navbar />
      <main>
        <Routes>
          {ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </main>
      <SharedFooter pillarLinks={pillarLinks} />
      <SharedCookieBanner consentKey="laplandbars_cookie_consent" />
      <NewsletterPopup />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
