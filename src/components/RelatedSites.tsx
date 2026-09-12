import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RelatedLink = { anchor: string; desc: string; href: string };

/**
 * Sisarsivustot. Sama `home.related`-kopio (12 kieltä) kuin ennen — ei uutta
 * käännettävää.
 *
 * Vesa 12.9.2026: *"tämä osio voisi olla upeampi, kuvat jne."* Osio oli kolme
 * tyhjää tekstilaatikkoa. Kysyttäessä hän valitsi **sisarsivuston oman
 * kuvakielen** valokuvan sijaan, ja se on myös ainoa rehellinen vaihtoehto:
 * baarisivustolla ei ole omaa kuvaa aiheeseen "missä syödä" eikä "yöelämä",
 * eikä verkostosääntö salli saman kuvan käyttöä kahdella sivustolla
 * (CLAUDE.md). Keksitty kuvituskuva olisi juuri se, mitä hän on toistuvasti
 * torjunut.
 *
 * 🔴 Hubin sama osio opetti tämän jo 29.8.2026: rivi tavallisia laatikoita
 * verkostolinkeille sai palautteen *"perus tekoäly grafiikat taas"* ja
 * peruttiin tunnissa (`laplandvibes/src/components/NetworkHub.tsx`). Siksi
 * kortin kuva on **verkoston sanamerkki itse**: `#LAPLANDNIGHTLIFE` Bebasilla,
 * risuaita ja brändisana vaaleanpunaisella (CLAUDE.md:n sanamerkkisääntö).
 * Se on iso, se on meidän, eikä se voi valehdella siitä mitä linkin takana on.
 *
 * Vaaleanpunainen esiintyy tällä sivustolla muuten vain jaetussa
 * evästebannerissa ja footerissa, joten se erottaa verkostolinkit sivuston
 * omasta amberista — se on merkitys, ei koriste.
 *
 * Kaupunkisivulla `links` ylikirjoitetaan kaupunkikohtaisilla osoitteilla.
 */

/** Verkkotunnus → sanamerkin brändisana. Tuntematon isäntä jää ilman merkkiä. */
const BRAND_WORD: Record<string, string> = {
  'laplandnightlife.com': 'NIGHTLIFE',
  'laplanddining.com': 'DINING',
  'laplandvisit.com': 'VISIT',
  'laplandvibes.com': 'VIBES',
  'laplandstays.com': 'STAYS',
  'laplandactivities.fi': 'ACTIVITIES',
  'laplandfood.com': 'FOOD',
  'laplandskiresorts.com': 'SKIRESORTS',
};

function brandWord(href: string): string | null {
  try {
    return BRAND_WORD[new URL(href).hostname.replace(/^www\./, '')] ?? null;
  } catch {
    return null;
  }
}

export default function RelatedSites({ links, className = '' }: { links?: RelatedLink[]; className?: string }) {
  const { t } = useTranslation('pages');
  const fallback = (t('home.related.links', { returnObjects: true }) as RelatedLink[]) || [];
  const items = links ?? fallback;
  if (!items.length) return null;
  return (
    <>
      {/* LV-DESIGN-SYSTEM §11b: lippuviiva merkitsee kohdan, jossa sivusto vaihtuu. */}
      <div aria-hidden="true" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ lineHeight: 0 }}>
        <div style={{ height: '3px', background: 'linear-gradient(to right, transparent 0%, #002F6C 15%, #F8FAFC 50%, #002F6C 85%, transparent 100%)' }} />
      </div>
      <section
        className={`py-16 sm:py-20 ${className}`}
        style={{ background: 'linear-gradient(to bottom, #0F172A 0%, rgba(0,47,108,0.16) 45%, rgba(0,47,108,0.12) 60%, #0F172A 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-amber font-bold mb-3">{t('home.related.eyebrow')}</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-wide mb-3 max-w-3xl">{t('home.related.title')}</h2>
          <p className="text-white/70 leading-relaxed max-w-2xl mb-10">{t('home.related.sub')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.map((link) => {
              const word = brandWord(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  className="bar-card bar-card-hover group relative overflow-hidden p-7 no-underline flex flex-col h-full"
                >
                  {/* Sanamerkki on kortin kuva: iso, meidän, eikä voi valehdella. */}
                  {word && (
                    <span className="font-heading tracking-wide text-[26px] sm:text-[30px] leading-none mb-6 block">
                      <span className="text-vibe-pink">#</span>
                      <span className="text-white">LAPLAND</span>
                      <span className="text-vibe-pink">{word}</span>
                    </span>
                  )}
                  <h3 className="font-heading text-2xl sm:text-[26px] text-white tracking-wide leading-[1.12] mb-3 group-hover:text-amber transition-colors">
                    {link.anchor}
                  </h3>
                  <p className="text-[15px] text-white/75 leading-relaxed mb-6">{link.desc}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber/90 group-hover:text-amber transition-colors">
                    {t('home.related.cta', { defaultValue: link.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') })}
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  {/* Hover: amber-viiva pohjaan, sivuston oma korostus. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-amber origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
