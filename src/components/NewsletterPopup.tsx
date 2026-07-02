import SharedNewsletterPopup from '../../../shared/NewsletterPopup';
import { trackNewsletterSignup } from '../lib/analytics';
import { useLocale } from '../i18n/useLocale'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const POPUP_COPY: Record<string, { headline: string; description: string }> = {
  en: { headline: 'Where Lapland actually drinks.', description: 'A new bar discovery each month, the après-ski lineup before the rest of the world hears, and the right pub when it is -25 °C outside.' },
  fi: { headline: 'Lapin baareissa, missä porukka oikeasti käy.', description: 'Yksi uusi baari tai pub kuukaudessa, Levin ja Ylläksen après-ski-listaus ennen muita ja oikea kapakka pakkasilla.' },
  de: { headline: 'Wo Lappland wirklich trinkt.', description: 'Eine neue Bar pro Monat, das Après-Ski-Lineup vor allen anderen und der richtige Pub bei -25 °C.' },
  ja: { headline: 'ラップランドが本当に飲みに行く場所。', description: '毎月ひとつ新しいバーを紹介。世界が気づく前のアフタースキー情報と、外が-25℃のときに行くべき店がわかります。' },
  es: { headline: 'Donde Laponia bebe de verdad.', description: 'Un bar nuevo por descubrir cada mes, la agenda de après-ski antes que nadie y el pub indicado cuando fuera hace -25 °C.' },
  'pt-BR': { headline: 'Onde a Lapônia bebe de verdade.', description: 'Um bar novo para descobrir a cada mês, a programação de après-ski antes de todo mundo e o pub certo quando estão -25 °C lá fora.' },
  'zh-CN': { headline: '拉普兰人真正喝酒的地方。', description: '每月发现一家新酒吧，抢先掌握滑雪后聚会的最新去处，以及零下25度时该钻进哪家酒馆。' },
  ko: { headline: '라플란드 사람들이 진짜 마시러 가는 곳.', description: '매달 새로운 바 한 곳을 소개하고, 누구보다 먼저 아프레 스키 일정을 알려드리며, 바깥이 영하 25도일 때 들어갈 펍을 짚어 드립니다.' },
  fr: { headline: 'Là où la Laponie boit vraiment.', description: 'Un nouveau bar à découvrir chaque mois, le programme après-ski avant tout le monde et le pub qu’il faut quand il fait -25 °C dehors.' },
  it: { headline: 'Dove la Lapponia beve davvero.', description: 'Un bar nuovo da scoprire ogni mese, il calendario après-ski prima di tutti e il pub giusto quando fuori ci sono -25 °C.' },
  nl: { headline: 'Waar Lapland echt drinkt.', description: 'Elke maand een nieuwe bar om te ontdekken, de après-ski-line-up voordat de rest het hoort en de juiste kroeg als het buiten -25 °C is.' },
};

export default function NewsletterPopup() {
  const { locale } = useLocale();
  const copy = POPUP_COPY[locale as string] ?? POPUP_COPY.en;
  return (
    <SharedNewsletterPopup
      lang={locale as 'en' | 'fi' | 'de' | 'ja' | 'es' | 'pt-BR' | 'zh-CN' | 'ko' | 'fr' | 'it' | 'nl'}
      siteId="laplandbars"
      brandWord="BARS"
      headline={copy.headline}
      description={copy.description}
      supabaseUrl={SUPABASE_URL}
      supabaseAnonKey={SUPABASE_ANON_KEY}
      onSubscribed={(s) => trackNewsletterSignup(s)}
    />
  );
}
