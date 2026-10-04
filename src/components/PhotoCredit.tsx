import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { creditFor, photoKey, type PhotoCredit as Credit } from '../data/photoCredits';
import { useLocale } from '../i18n/useLocale';
import type { Locale as Lang } from '../i18n/config';

/**
 * Kuvan merkintä: oikean valokuvan tekijä + lisenssi, tai tekoälykuvituksen "Kuvituskuva".
 *
 * Vesa 4.10.2026: verkoston tekoälykuvat aidoiksi valokuviksi. Wikimedia Commonsin
 * CC BY / CC BY-SA -kuva vaatii tekijän, lisenssin JA lisenssilinkin näkyviin
 * (CC BY-SA 4.0 §3(a)(1)(C)). Merkintä tulee kuvan polusta (`creditFor`), joten se ei voi
 * unohtua yhdeltä pinnalta.
 *
 * - `linked` (oletus): tekijä linkkinä Commonsin tiedostosivulle, lisenssi linkkinä
 *   lisenssiin. Käytä kun kuva EI ole linkin sisällä (hero, osion kuva).
 * - `linked={false}`: pelkkä teksti, kun koko kortti on linkki (sisäkkäinen linkki on
 *   virheellistä HTML:ää). Linkit ovat silloin sivun lopun kuvaluettelossa.
 *
 * Bars-versio (kopio laplandnightlifesta 4.10.2026): lisäksi oma kuva ("Kuva: LaplandVibes")
 * ja `illustration`-etuliite nimetyn kohteen kuvituskuvalle.
 *
 * Aina oikea alakulma, 9–10 px (Vesa 23.9.2026: *"kuvatiedot pitää olla aina oikea alalaita,
 * ei me mainosteta sitä"*). Kontrasti tulee kiinteästä pohjasta: valkoinen `bg-black/55`:n
 * päällä on puhtaan valkoisen kuvan päälläkin 4,7:1, joten merkintä on luettava minkä
 * tahansa kuvan päällä (verkoston mitattu malli, laplandactivities 24.9.2026).
 * `rel` sisältää `noopener` mutta EI `noreferrer` (verkoston sääntö).
 */

export const ILLUSTRATION_LABEL: Record<Lang, string> = {
  en: 'Illustration', fi: 'Kuvituskuva', de: 'Symbolbild', ja: 'イメージ画像', es: 'Imagen ilustrativa',
  'pt-BR': 'Imagem ilustrativa', 'zh-CN': '示意图', ko: '이미지 사진', fr: "Image d'illustration",
  it: 'Immagine illustrativa', nl: 'Illustratiebeeld', sv: 'Illustrationsbild',
};

const PHOTO: Record<Lang, string> = {
  en: 'Photo', fi: 'Kuva', de: 'Foto', ja: '写真', es: 'Foto', 'pt-BR': 'Foto',
  'zh-CN': '图片', ko: '사진', fr: 'Photo', it: 'Foto', nl: 'Foto', sv: 'Foto',
};

const LIST_TITLE: Record<Lang, string> = {
  en: 'Photo credits', fi: 'Kuvat ja lisenssit', de: 'Bildnachweise', sv: 'Bildkällor', ja: '写真クレジット',
  es: 'Créditos fotográficos', 'pt-BR': 'Créditos das fotos', 'zh-CN': '图片来源', ko: '사진 출처',
  fr: 'Crédits photo', it: 'Crediti fotografici', nl: 'Fotoverantwoording',
};

const LIST_LEAD: Record<Lang, string> = {
  en: 'The photographs on this page come from Wikimedia Commons under the licence shown; each link opens the original file and its licence.',
  fi: 'Tämän sivun valokuvat ovat Wikimedia Commonsista mainitulla lisenssillä; linkit avaavat alkuperäisen tiedoston ja lisenssin.',
  de: 'Die Fotos auf dieser Seite stammen von Wikimedia Commons unter der angegebenen Lizenz; jeder Link öffnet die Originaldatei und ihre Lizenz.',
  sv: 'Bilderna på den här sidan kommer från Wikimedia Commons under angiven licens; länkarna öppnar originalfilen och licensen.',
  ja: 'このページの写真はWikimedia Commonsから記載のライセンスで使用しており、リンク先で元ファイルとライセンスを確認できます。',
  es: 'Las fotos de esta página proceden de Wikimedia Commons con la licencia indicada; cada enlace abre el archivo original y su licencia.',
  'pt-BR': 'As fotos desta página vêm do Wikimedia Commons com a licença indicada; cada link abre o arquivo original e sua licença.',
  'zh-CN': '本页照片来自维基共享资源，采用所示许可协议；链接指向原始文件及其许可。',
  ko: '이 페이지의 사진은 위키미디어 공용에서 표시된 라이선스로 사용하며, 링크는 원본 파일과 라이선스로 연결됩니다.',
  fr: 'Les photos de cette page proviennent de Wikimedia Commons sous la licence indiquée ; chaque lien ouvre le fichier original et sa licence.',
  it: 'Le foto di questa pagina provengono da Wikimedia Commons con la licenza indicata; ogni link apre il file originale e la sua licenza.',
  nl: "De foto's op deze pagina komen van Wikimedia Commons onder de vermelde licentie; elke link opent het originele bestand en de licentie.",
};

/* ── Sivun kuvaluettelo: jokainen renderöity krediitti ilmoittautuu, luettelo listaa ne ── */
type Reg = { add: (k: string) => void; remove: (k: string) => void; keys: string[] };
const CreditsCtx = createContext<Reg | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const add = useCallback((k: string) => setCounts((c) => ({ ...c, [k]: (c[k] ?? 0) + 1 })), []);
  const remove = useCallback((k: string) => setCounts((c) => {
    const n = (c[k] ?? 1) - 1;
    const next = { ...c };
    if (n <= 0) delete next[k]; else next[k] = n;
    return next;
  }), []);
  const value = useMemo(() => ({ add, remove, keys: Object.keys(counts) }), [add, remove, counts]);
  return <CreditsCtx.Provider value={value}>{children}</CreditsCtx.Provider>;
}

function useRegister(key: string) {
  const reg = useContext(CreditsCtx);
  const add = reg?.add;
  const remove = reg?.remove;
  useEffect(() => {
    if (!key || !add || !remove) return;
    add(key);
    return () => remove(key);
  }, [key, add, remove]);
}

const LINK = 'lv-tap underline decoration-white/50 underline-offset-2 hover:decoration-white';

export function PhotoCredit({ src, linked = true, className = '', illustration = false }: { src?: string | null; linked?: boolean; className?: string; illustration?: boolean }) {
  const { locale: lang } = useLocale();
  const c = creditFor(src);
  useRegister(c && !c.own ? photoKey(src) : '');
  if (!c) return null;
  // Yksi rivi (whitespace-nowrap): kaksirivinen merkintä nousi kortin otsikon päälle
  // (tekstipaallekkain-portti 4.10.2026, "Ximonic (Simo Räsänen) · CC BY-SA 4.0" 280 px:n kortissa).
  const base = `absolute bottom-0 right-0 z-20 max-w-full whitespace-nowrap rounded-tl bg-black/55 px-1.5 py-[2px] text-[9px] sm:text-[10px] leading-tight text-white ${className}`;
  if (c.own) {
    return <span className={base} data-photo-credit="">{PHOTO[lang]}: <span translate="no">LaplandVibes{c.place ? ` · ${c.place}` : ''}</span></span>;
  }
  return (
    <span className={base} data-photo-credit="">
      {/* Kuvituskuva = aito valokuva aiheesta, ei tästä kohteesta (nimetty kohde ilman omaa kuvaa). */}
      {illustration && <>{ILLUSTRATION_LABEL[lang]} · </>}
      {PHOTO[lang]}:{' '}
      {linked ? (
        <>
          <a href={c.sourceUrl} target="_blank" rel="noopener" className={LINK} translate="no">{c.author}</a>
          {' · '}
          {c.licenseUrl ? (
            <a href={c.licenseUrl} target="_blank" rel="license noopener" className={`${LINK} whitespace-nowrap`} translate="no">{c.license}</a>
          ) : (
            <span className="whitespace-nowrap" translate="no">{c.license}</span>
          )}
        </>
      ) : (
        <>
          <span translate="no">{c.author}</span> · <span className="whitespace-nowrap" translate="no">{c.license}</span>
        </>
      )}
    </span>
  );
}

/** Valokuvalle krediitti; tekoälykuvalle ei mitään (sivuston omat merkinnät hoitavat). */
export default function ImageMark({ src, linked = true }: { src?: string | null; linked?: boolean }) {
  if (creditFor(src)) return <PhotoCredit src={src} linked={linked} />;
  return null;
}

/** Totuudellinen kuvateksti: krediitin alt, tai annettu varateksti tekoälykuvitukselle. */
export function photoAlt(src: string | null | undefined, fallback: string): string {
  return creditFor(src)?.alt ?? fallback;
}

/** Sivun lopun kuvaluettelo: tämän sivun valokuvat linkkeineen (tiedostosivu + lisenssi). */
export function PhotoCreditList() {
  const { locale: lang } = useLocale();
  const reg = useContext(CreditsCtx);
  const credits = (reg?.keys ?? []).map((k) => creditFor(k)).filter((c): c is Credit => !!c);
  if (!credits.length) return null;
  const seen = new Set<string>();
  const uniq = credits.filter((c) => (seen.has(c.sourceUrl) ? false : (seen.add(c.sourceUrl), true)));
  return (
    <section aria-labelledby="photo-credits-h" className="bg-night px-4 sm:px-6 lg:px-8 py-10 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <h2 id="photo-credits-h" className="font-heading text-2xl text-white tracking-wide mb-2">{LIST_TITLE[lang]}</h2>
        <p className="text-white/80 text-base leading-relaxed mb-4">{LIST_LEAD[lang]}</p>
        <ul className="columns-1 sm:columns-2 gap-8 text-base leading-relaxed text-white/80">
          {uniq.map((c) => (
            <li key={c.sourceUrl} className="break-inside-avoid mb-1.5">
              {/* Tiedostonimi, tekijä ja lisenssi ovat tunnisteita, eivät käännettävää tekstiä. */}
              <a href={c.sourceUrl} target="_blank" rel="noopener" className="lv-tap text-ice underline underline-offset-2 hover:text-white break-words" translate="no">{c.title}</a>
              {' · '}<span translate="no">{c.author}</span>{' · '}
              {c.licenseUrl ? (
                <a href={c.licenseUrl} target="_blank" rel="license noopener" className="lv-tap whitespace-nowrap underline underline-offset-2 hover:text-white" translate="no">{c.license}</a>
              ) : (
                <span className="whitespace-nowrap" translate="no">{c.license}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
