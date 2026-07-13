import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import SharedFooter from '../../shared/Footer';
import type { FooterDict } from '../../shared/Footer';
import SharedCookieBanner from '../../shared/CookieBanner';
import NewsletterPopup from './components/NewsletterPopup';
const Home = lazy(() => import('./pages/Home'))
const Bars = lazy(() => import('./pages/Bars'))
const IceBars = lazy(() => import('./pages/IceBars'))
const ApresSki = lazy(() => import('./pages/ApresSki'))
const Cocktails = lazy(() => import('./pages/Cocktails'))
const CraftBeer = lazy(() => import('./pages/CraftBeer'))
const DrinkingCulture = lazy(() => import('./pages/DrinkingCulture'))
const About = lazy(() => import('./pages/About'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))
import { useLocale } from './i18n/useLocale';
import LocaleAutoRedirect from './i18n/LocaleAutoRedirect';

function useFooterPillarLinks() {
  const { t, i18n } = useTranslation('common');
  const tx = (key: string, fallback: string): string =>
    i18n.exists(`common:${key}`) ? (t(key) as string) : fallback;
  return [
    { name: tx('footer.pillars.bars',      'Bars'),             href: '/bars' },
    { name: tx('footer.pillars.iceBars',   'Ice Bars'),         href: '/ice-bars' },
    { name: tx('footer.pillars.apresSki',  'Après-Ski'),        href: '/apres-ski' },
    { name: tx('footer.pillars.cocktails', 'Cocktails'),        href: '/cocktails' },
    { name: tx('footer.pillars.craftBeer', 'Craft Beer'),       href: '/craft-beer' },
    { name: tx('footer.pillars.culture',   'Drinking Culture'), href: '/drinking-culture' },
  ];
}

function useFooterDict(): FooterDict {
  const { t, i18n } = useTranslation('common');
  const tx = (key: string): string | undefined =>
    i18n.exists(`common:${key}`) ? (t(key) as string) : undefined;
  return {
    networkBadge: tx('footer.networkBadge'),
    tagline: tx('footer.tagline'),
    groups: {
      stay:       tx('footer.groups.stay'),
      eatDrink:   tx('footer.groups.eatDrink'),
      do:         tx('footer.groups.do'),
      explore:    tx('footer.groups.explore'),
      essentials: tx('footer.groups.essentials'),
    },
    travelGuideKicker: tx('footer.travelGuideKicker'),
    about: {
      eyebrow: tx('footer.about.eyebrow'),
      body:    tx('footer.about.body'),
      badge:   tx('footer.about.badge'),
    },
    spottedError: {
      title: tx('footer.spottedError.title'),
      body:  tx('footer.spottedError.body'),
      cta:   tx('footer.spottedError.cta'),
    },
    partner: {
      title: tx('footer.partner.title'),
      body:  tx('footer.partner.body'),
      cta:   tx('footer.partner.cta'),
    },
    press: {
      title: tx('footer.press.title'),
      body:  tx('footer.press.body'),
      cta:   tx('footer.press.cta'),
    },
    affiliate: tx('footer.affiliate'),
    copyright: tx('footer.copyright'),
    websiteBy: tx('footer.websiteBy'),
    legal: {
      privacy: tx('footer.legal.privacy'),
      cookie:  tx('footer.legal.cookie'),
      terms:   tx('footer.legal.terms'),
      contact: tx('footer.legal.contact'),
    },
    siteLabels: {
      hotelDeals: tx('footer.siteLabels.hotelDeals'),
      staysCabins: tx('footer.siteLabels.staysCabins'),
      whereToStay: tx('footer.siteLabels.whereToStay'),
      familyFriendly: tx('footer.siteLabels.familyFriendly'),
      localFood: tx('footer.siteLabels.localFood'),
      fineDining: tx('footer.siteLabels.fineDining'),
      barsPubs: tx('footer.siteLabels.barsPubs'),
      activities: tx('footer.siteLabels.activities'),
      huskySafaris: tx('footer.siteLabels.huskySafaris'),
      skiResorts: tx('footer.siteLabels.skiResorts'),
      snowmobileTours: tx('footer.siteLabels.snowmobileTours'),
      spaWellness: tx('footer.siteLabels.spaWellness'),
      nightlife: tx('footer.siteLabels.nightlife'),
      natureParks: tx('footer.siteLabels.natureParks'),
      travelGuide: tx('footer.siteLabels.travelGuide'),
      christmas: tx('footer.siteLabels.christmas'),
      giftsSouvenirs: tx('footer.siteLabels.giftsSouvenirs'),
      travelBlog: tx('footer.siteLabels.travelBlog'),
      dealsOffers: tx('footer.siteLabels.dealsOffers'),
      transport: tx('footer.siteLabels.transport'),
      carRental: tx('footer.siteLabels.carRental'),
      workInLapland: tx('footer.siteLabels.workInLapland'),
    },
  };
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LocaleSync() { useLocale(); return null; }

const PREFIXES = ['', '/fi', '/de', '/ja', '/es', '/br', '/cn', '/kr', '/fr', '/it', '/nl', '/sv'];
const PAGES: { path: string; element: React.ReactNode }[] = [
  { path: '/', element: <Home /> },
  { path: '/bars', element: <Bars /> },
  { path: '/ice-bars', element: <IceBars /> },
  { path: '/apres-ski', element: <ApresSki /> },
  { path: '/cocktails', element: <Cocktails /> },
  { path: '/craft-beer', element: <CraftBeer /> },
  { path: '/drinking-culture', element: <DrinkingCulture /> },
  { path: '/about', element: <About /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/cookie-policy', element: <CookiePolicy /> },
];
const ROUTES: { path: string; element: React.ReactNode }[] = [];
for (const p of PAGES) {
  for (const prefix of PREFIXES) {
    const full = prefix === '' ? p.path : (p.path === '/' ? prefix : `${prefix}${p.path}`);
    ROUTES.push({ path: full, element: p.element });
  }
}
// Catch-all — unknown URLs get the shared network 404 instead of a blank
// page. Not looped through PREFIXES: "*" already matches every locale.
ROUTES.push({ path: '*', element: <NotFound /> });

function AppLayout() {
  const { i18n } = useTranslation('common');
  const pillarLinks = useFooterPillarLinks();
  const dict = useFooterDict();
  return (
    <div className="min-h-screen bg-night text-white">
      <ScrollToTop />
      <LocaleAutoRedirect />
      <LocaleSync />
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
          {ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
        </Suspense>
      </main>
      <SharedFooter pillarLinks={pillarLinks} dict={dict} />
      <SharedCookieBanner consentKey="laplandbars_cookie_consent" lang={i18n.language} />
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
