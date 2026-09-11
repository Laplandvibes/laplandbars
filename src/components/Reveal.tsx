import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Vierityspaljastus ilman animaatiokirjastoa (CLAUDE.md: pelkkä CSS).
 *
 * Vesa 11.9.2026 /drinking-culture-sivusta: *"paljon emotion graphic aina kun
 * selaa alaspäin jotain tapahtuisi"*. IntersectionObserver lisää `is-in`-luokan
 * kerran, kun lohko tulee ruutuun; siirtymä on CSS:ssä (`.lv-reveal`,
 * index.css) ja koskee vain `opacity`a ja `transform`ia. `prefers-reduced-
 * motion` sammuttaa sen. Lepotila ilman JS:ää on NÄKYVÄ (luokka lisätään
 * vasta kun observer on olemassa), joten prerender-lohko ja hakukone eivät
 * näe piilotettua sisältöä.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** ms, porrastukseen ruudukossa */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'figure';
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('lv-reveal');
    el.style.transitionDelay = delay ? `${delay}ms` : '';
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
