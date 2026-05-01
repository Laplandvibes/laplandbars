import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

declare global {
  function gtag(...args: unknown[]): void;
}

const CONSENT_KEY = 'laplandbars_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-night/98 backdrop-blur-md border-t border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-white/60 flex-1 leading-relaxed">
          We use cookies to understand how visitors use our site (Google Analytics).
          No personal data is collected without your consent.{' '}
          <Link to="/privacy" className="text-amber hover:text-amber/80 underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm bg-amber hover:bg-amber/90 text-night font-semibold px-5 py-2 rounded-full transition-all duration-200 cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
