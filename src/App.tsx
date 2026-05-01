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

function AppLayout() {
  return (
    <div className="min-h-screen bg-night text-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bars" element={<Bars />} />
          <Route path="/ice-bars" element={<IceBars />} />
          <Route path="/apres-ski" element={<ApresSki />} />
          <Route path="/cocktails" element={<Cocktails />} />
          <Route path="/craft-beer" element={<CraftBeer />} />
          <Route path="/drinking-culture" element={<DrinkingCulture />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
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
