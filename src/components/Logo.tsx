import type { CSSProperties } from 'react';

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
  void light;
  return (
    <div className={`flex items-center ${className}`}>
      <span
        className={`font-heading text-3xl md:text-4xl tracking-wide leading-none ${nav ? ' lv-wm' : ''}`}
        data-lv-sanamerkki={nav ? '' : undefined}
        style={nav ? WM_STYLE : undefined}
      >
        <span className="text-amber">#</span>
        <span className="text-white">LAPLAND</span>
        <span className="text-amber">BARS</span>
      </span>
    </div>
  );
}
