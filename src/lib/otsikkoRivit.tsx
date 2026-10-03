import { Fragment, type ReactNode } from 'react';

/* ── Otsikon rivit tietokoneella (Vesa 3.10.2026: "tehdään turhaan kolmirivisiä") ──────────────────────────────
 * Mitattu livenä 3.10. (scripts/audit_otsikkorivit.mjs, 12 kieltä × 1280/1536/1920): otsikon koko kasvaa näytön
 * mukana, palsta ei, joten pitkä kieli katkesi kolmelle riville tai jätti yhden sanan riville. Ratkaisu on sama
 * kuin hubin herossa (laplandvibes cadea06): rivit tulevat lauseen rakenteesta ja koko on pienempi kahdesta,
 * suunniteltu koko tai koko jolla pisin rivi mahtuu palstaan: min(--max, 100cqi / rivin leveys em-yksiköinä). */

const CJK = /[\u3000-\u30ff\u3400-\u9fff\uac00-\ud7af\uff00-\uffef]/;

/** Rivin leveysarvio em-yksiköinä Bebas Neuella. Merkkileveydet mitattu selaimessa 3.10.2026 (versaali 0,37–0,41 em,
 *  I 0,19, M/W 0,54–0,56, väli 0,16; CJK-varafontti 1,0 em); `tracking` = letter-spacing em-yksiköinä
 *  (tracking-wide 0.025, tracking-wider 0.05). Arvio on mittausta hieman suurempi, ettei rivi katkea arvion takia. */
export function bebasEm(s: string, tracking = 0): number {
  let w = 0;
  for (const ch of s) {
    w += tracking + (
      CJK.test(ch) ? 1.02
      : ch === ' ' ? 0.17
      : /[.,:;'’!¡]/.test(ch) ? 0.2
      : /[iíìIÍÌ]/.test(ch) ? 0.21
      : /[jJ]/.test(ch) ? 0.28
      : /[mM]/.test(ch) ? 0.55
      : /[wW]/.test(ch) ? 0.57
      : 0.415
    );
  }
  return w;
}

/** ja ja zh kirjoitetaan ilman välilyöntejä: ilman katkokohtia selain katkaisee rivin mistä tahansa merkistä. */
export const ilmanValeja = (lang: string) => lang === 'ja' || lang === 'zh-CN';

const segmentoija = (lang: string) => {
  try {
    return typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? new Intl.Segmenter(lang, { granularity: 'word' })
      : null;
  } catch {
    return null;
  }
};

/** ja/zh: teksti fraaseiksi, joiden väliin <wbr>. Sanojen rajat Intl.Segmenterilta; japanissa pelkät hiraganat
 *  (partikkelit, taivutuspäätteet) ja välimerkit liitetään edelliseen, jotta rivi ei ala "へ"- tai "。"-merkillä.
 *  Käytetään yhdessä `word-break: keep-all`:n kanssa, jolloin rivi katkeaa vain näistä kohdista. Muilla kielillä
 *  ja ilman Segmenteriä teksti palaa sellaisenaan. */
export function Fraasit({ text, lang }: { text: string; lang: string }): ReactNode {
  if (!ilmanValeja(lang)) return text;
  const seg = segmentoija(lang);
  if (!seg) return text;
  const osat: string[] = [];
  for (const { segment } of seg.segment(text)) {
    const liita = osat.length > 0 && (
      /^[\u3001\u3002\uff01\uff1f\uff0c\uff1a\uff1b)）」』】\u30fc]+$/.test(segment)
      || (lang === 'ja' && /^[\u3040-\u309f]+$/.test(segment))
    );
    if (liita) osat[osat.length - 1] += segment;
    else osat.push(segment);
  }
  return osat.map((o, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {o}
    </Fragment>
  ));
}

/** Lauseet omiksi osikseen: 。/！/？ jälkeen tai . ! ? jälkeen kun perässä on väli. */
export function lauseet(text: string): string[] {
  const osat = text.match(/.+?(?:[。！？]|[.!?](?=\s|$))\s*|.+$/gu);
  return osat ? osat.map((o) => o.trim()).filter(Boolean) : [text];
}
