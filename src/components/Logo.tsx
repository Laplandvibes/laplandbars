import type { CSSProperties } from 'react';

import { LV_SANAMERKKI, LV_SANAMERKKI_PIENI } from './lvSanamerkki';
// Sanamerkin leveys 1 px:n fontilla (Bebas Neue + tracking-wide). Puhelin- ja tablettinavissa koko lasketaan
// tästä ja vapaasta tilasta (index.css LV-NAV-SANAMERKKI): 24 px (tabletilla 30 px), pienempi vain kun ei mahdu.
const WM_STYLE = { '--lv-wm-k': 5.02, '--lv-wm-max-md': '30px' } as CSSProperties;

interface LogoProps {
  className?: string;
  light?: boolean;
  /** Navin sanamerkki: koko puhelin- ja tablettinavissa vapaan tilan mukaan (index.css LV-NAV-SANAMERKKI). */
  nav?: boolean;
}

/**
 * #LAPLANDBARS wordmark — LV brand signature.
 * Pattern per CLAUDE.md: # accent (amber) + LAPLAND (snow/white) + BARS (amber).
 */
export default function Logo({ className = '', light = false, nav = false }: LogoProps) {
  // Yläpalkissa pienen koon muoto (kirjainten reiät auki 16–21 px:n koossa), muualla virallinen.
  const LVS = nav ? LV_SANAMERKKI_PIENI : LV_SANAMERKKI;
  void light;
  return (
    <div className={`flex items-center ${className}`}>
      <span translate="no"
        className={`notranslate font-heading text-3xl tracking-wide leading-none ${nav ? ' lv-wm' : ''}`}
        data-lv-sanamerkki={nav ? '' : undefined}
        style={nav ? WM_STYLE : undefined}
      >
        {/* VIRALLINEN sanamerkki (Vesa 14.11.2026; yläpalkki 15.11.2026 "sama leveys kuin nyt"): piirros ./lvSanamerkki.ts,
            leveys = entisen tekstin leveys, osat perivät entiset värinsä (currentColor). Teksti ruudunlukijalle ja hakukoneelle. */}
        <svg viewBox={LVS.viewBox} aria-hidden="true" focusable="false" style={{ width: `${LVS.leveysEm}em`, height: 'auto', display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}>
          <path className="text-amber" fill="currentColor" fillRule="evenodd" d={LVS.d[0]} />
          <path className="text-white" fill="currentColor" fillRule="evenodd" d={LVS.d[1]} />
          <path className="text-amber" fill="currentColor" fillRule="evenodd" d={LVS.d[2]} />
        </svg>
        <span className="sr-only">#LAPLANDBARS</span>
      </span>
    </div>
  );
}
