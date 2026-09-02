import { Info } from 'lucide-react';
import { useLocale } from '../i18n/useLocale';
import type { Locale } from '../i18n/config';

/**
 * FTC/GDPR affiliate disclosure line, localised to all 11 site languages.
 *
 * Mirrors the canonical ecosystem disclosure copy (the same wording the shared
 * Footer renders). `compact` is for an inline line next to a single ad/CTA card;
 * `full` is for footer / page-top blocks.
 *
 * Every affiliate <a> on the site already carries rel="sponsored nofollow
 * noopener"; this component is the visible companion disclosure required on
 * every page that renders a monetised link (premium_design_standard §6).
 */

const DISCLOSURE: Record<Locale, string> = {
  en: 'This page contains affiliate links. If you book or buy through them, LaplandVibes may earn a commission at no extra cost to you.',
  fi: 'Tällä sivulla on kumppanilinkkejä. Jos varaat tai ostat niiden kautta, LaplandVibes voi saada provision. Sinulle se ei maksa yhtään enempää.',
  de: 'Diese Seite enthält Partnerlinks. Wenn Sie darüber buchen oder kaufen, kann LaplandVibes eine Provision ohne Mehrkosten für Sie erhalten.',
  ja: 'このページにはアフィリエイトリンクが含まれます。リンク経由で予約・購入された場合、追加費用なしでLaplandVibesに手数料が支払われることがあります。',
  es: 'Esta página contiene enlaces de afiliación. Si reserva o compra a través de ellos, LaplandVibes puede recibir una comisión sin coste adicional para usted.',
  'pt-BR':
    'Esta página contém links de afiliados. Se você reservar ou comprar por meio deles, a LaplandVibes pode receber comissão sem custo adicional para você.',
  'zh-CN':
    '本页面包含联盟链接。如果您通过这些链接预订或购买，LaplandVibes 可能会获得佣金，您无需支付额外费用。',
  ko: '이 페이지에는 제휴 링크가 포함되어 있습니다. 이 링크를 통해 예약하거나 구매하시면 귀하에게 추가 비용이 발생하지 않으며, LaplandVibes가 수수료를 받습니다.',
  fr: "Cette page contient des liens d'affiliation. Si vous réservez ou achetez via ces liens, LaplandVibes peut percevoir une commission sans coût supplémentaire pour vous.",
  it: 'Questa pagina contiene link di affiliazione. Se prenota o acquista tramite essi, LaplandVibes può ricevere una commissione senza costi aggiuntivi per Lei.',
  nl: 'Deze pagina bevat affiliate-links. Als u hierdoor boekt of koopt, kan LaplandVibes een commissie ontvangen zonder extra kosten voor u.',
  sv: 'Den här sidan innehåller affiliatelänkar. Om du bokar eller köper via dem kan LaplandVibes få en provision utan extra kostnad för dig.',
};

interface AffiliateDisclosureProps {
  /** Override the language; defaults to the locale derived from the URL. */
  lang?: Locale;
  className?: string;
  /** `compact` for inline-near-CTA placement, `full` for footer/page blocks. */
  variant?: 'compact' | 'full';
}

export default function AffiliateDisclosure({
  lang: langProp,
  className = '',
  variant = 'full',
}: AffiliateDisclosureProps) {
  const { locale } = useLocale();
  const lang = langProp ?? locale;
  const text = DISCLOSURE[lang];

  return (
    <p
      className={`flex items-center gap-2 ${
        variant === 'compact' ? 'text-xs' : 'text-sm justify-center'
      } ${className}`}
      role="note"
    >
      <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="text-balance">{text}</span>
    </p>
  );
}
