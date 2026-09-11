import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RelatedLink = { anchor: string; desc: string; href: string };

/**
 * Sisarsivustot, tiivis muoto alasivuille. Sama `home.related`-kopio (12 kieltä)
 * kuin etusivulla — ei uutta käännettävää. Mitattu 11.9.2026: /bars-, /ice-bars-
 * ja /apres-ski-sivuilta ei ollut yhtään sisältölinkkiä sisarsivustoille,
 * vain footerin verkkoluettelo. Hakukone ja lukija tarvitsevat linkin siitä
 * kohdasta jossa aihe vaihtuu (baarin jälkeen ruoka, yökerhot, majoitus).
 *
 * Kaupunkisivulla `links` ylikirjoitetaan kaupunkikohtaisilla osoitteilla
 * (laplanddining.com/city/{slug}/, laplandnightlife.com/city/{slug}/).
 */
export default function RelatedSites({ links, className = '' }: { links?: RelatedLink[]; className?: string }) {
  const { t } = useTranslation('pages');
  const fallback = (t('home.related.links', { returnObjects: true }) as RelatedLink[]) || [];
  const items = links ?? fallback;
  if (!items.length) return null;
  return (
    <section className={`py-14 bg-night border-t border-white/[0.06] ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-amber font-bold mb-2">{t('home.related.eyebrow')}</p>
        <h2 className="font-heading text-3xl sm:text-4xl text-white tracking-wide mb-6">{t('home.related.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {items.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener"
              className="lv-card lv-card-hover group p-6 no-underline flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-heading text-2xl text-white tracking-wide group-hover:text-amber transition-colors">
                  {link.anchor}
                </h3>
                <ArrowUpRight size={20} className="shrink-0 text-amber/70 group-hover:text-amber transition-colors" />
              </div>
              <p className="text-sm text-white/75 leading-relaxed">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
