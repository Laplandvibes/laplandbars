import type { NewsletterPopupCopy, NewsletterPopupTheme } from '../shared/NewsletterPopup';

/**
 * laplandbars.com: uutiskirjepopupin oma väri ja teksti.
 *
 * Vesa 23.9.2026: "tekstit ja värimaailma sivustokohtaisiksi" → "kyllä, vie
 * kaikille". Kuva, lomake, nappi ja #LAPLAND-merkki pysyvät verkoston yhteisinä.
 * Väri = tämän sivuston oma pääväri, mitattu elävältä etusivulta 23.9.2026
 * (meripihka #F59E0B on sivun pääväri). Kontrasti tarkistettu: napin teksti ≥ 4,5:1,
 * kuvan rengas ≥ 3:1 korttia vasten.
 * Teksti = sivun oma aihe lukijan näkökulmasta, 12 kielellä natiivina.
 * 🔴 Ei hälytyksiä, ei lähetystahtia, ei "ensimmäisenä" (9.8.2026 lupauspurku):
 * uutiskirje lähtee vain kun on kerrottavaa. Otsikko tulee jaetusta komponentista.
 */
export const POPUP_THEME: NewsletterPopupTheme = {
  surface: '#0F172A',
  accent: '#F59E0B',
  cta: '#F59E0B',
  onCta: '#0F172A',
};

export const POPUP_COPY: NewsletterPopupCopy = {
  en: {
    description: 'Founder of LaplandVibes. Ice bars, après-ski spots and pubs in the fell villages. I tell you where to start a Lapland evening and which bars stay with you.',
  },
  fi: {
    description: 'LaplandVibesin perustaja. Jääbaarit, afterski-paikat ja tunturikylien pubit. Kerron, mistä Lapin ilta kannattaa aloittaa ja mitkä baarit jäävät mieleen.',
  },
  de: {
    description: 'Gründer von LaplandVibes. Eisbars, Après-Ski-Lokale und die Pubs der Fjälldörfer. Ich verrate Ihnen, wo ein Abend in Lappland am besten beginnt und welche Bars im Gedächtnis bleiben.',
  },
  ja: {
    description: 'LaplandVibes創業者。アイスバー、アプレスキーの店、フェルの村のパブ。ラップランドの夜、最初の一軒はどこがよいか、記憶に残るのはどのバーかをお話しします。',
  },
  es: {
    description: 'Fundador de LaplandVibes. Bares de hielo, locales de après-ski y pubs en los pueblos de fjäll. Le digo por dónde empezar la noche en Laponia y qué bares se quedan en la memoria.',
  },
  'pt-BR': {
    description: 'Fundador do LaplandVibes. Bares de gelo, lugares de après-ski e pubs nas vilas de esqui. Conto por onde começar a noite na Lapônia e quais bares ficam na memória.',
  },
  'zh-CN': {
    description: 'LaplandVibes创始人。冰吧、滑雪后派对场地，还有山地村落的酒馆。拉普兰的夜晚该从哪里开场、哪些酒吧令人难忘，我来告诉你。',
  },
  ko: {
    description: 'LaplandVibes 창립자. 아이스 바, 애프터 스키, 펠 마을의 펍. 라플란드의 저녁을 어디서 시작할지, 어떤 바가 두고두고 생각나는지 알려드립니다.',
  },
  fr: {
    description: 'Fondateur de LaplandVibes. Bars de glace, adresses d\'après-ski et pubs des villages de fjäll. Je vous dis par où commencer la soirée en Laponie et quels bars on n\'oublie pas.',
  },
  it: {
    description: 'Fondatore di LaplandVibes. Ice bar, locali après-ski e pub nei villaggi dei fjäll. Le dico da dove conviene cominciare una serata in Lapponia e quali bar restano impressi.',
  },
  nl: {
    description: 'Oprichter van LaplandVibes. IJsbars, après-skiadressen en de pubs in de fjälldorpen. Van mij hoort u waar u een avond in Lapland begint en welke bars u bijblijven.',
  },
  sv: {
    description: 'Grundare av LaplandVibes. Isbarer, afterskiställen och pubar i fjällbyarna. Jag berättar var du ska börja kvällen i Lappland och vilka barer som stannar kvar i minnet.',
  },
};
