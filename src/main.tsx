import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import i18n, { ensureLocaleLoaded, localeFromSegment, type Locale } from './i18n/config'
import App from './App.tsx'

// Determine the active locale from the URL before mounting React. We then
// await its translation chunk so the first paint is in the correct language
// (no English flash for /fi, /kr, /ja, etc.).
const initialSeg = window.location.pathname.split('/').filter(Boolean)[0];
const initialLocale: Locale = localeFromSegment(initialSeg);

const mount = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
};

if (initialLocale === 'en') {
  mount();
} else {
  ensureLocaleLoaded(initialLocale)
    .then(() => {
      // Always call changeLanguage: addResourceBundle alone never recomputes
      // i18n.resolvedLanguage, so skipping this left it at 'en' for the whole
      // session on every direct non-EN load.
      return i18n.changeLanguage(initialLocale);
    })
    .finally(mount);
}
