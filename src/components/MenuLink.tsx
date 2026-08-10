import { ExternalLink } from 'lucide-react';
import { menuFor } from '../data/bars';
import { withReferral } from '../lib/withReferral';

interface Props {
  /**
   * Riittää että paikalla on nimi: rekisteri on avainnettu nimestä johdetulla
   * slugilla. Näin sama komponentti palvelee sekä `Bar`- että `IceBar`-tyyppiä,
   * joilla on eri kenttäjoukot.
   */
  bar: { name: string };
  /** Lokalisoitu "Menu". Nuoli/ikoni tulee tästä komponentista. */
  label: string;
  /** Lokalisoitu "Menu (PDF)". PDF käyttäytyy mobiilissa eri tavalla. */
  labelPdf: string;
  /** utm_campaign, esim. 'bars_menu_directory'. */
  campaign: string;
  className?: string;
}

/**
 * Linkki baarin omaan juoma- tai ruokalistaan.
 *
 * Ei renderöi mitään jos linkkiä ei ole, jottei korttiin jää kuollutta nappia:
 * 10/26 baarilla on menu, lopuilla rekisterissä on kirjattu syy.
 *
 * `rel="nofollow noopener"` ilman `noreferrer`-arvoa — verkoston standardi
 * (laplanddining). `noreferrer` estäisi kumppania näkemästä mistä liikenne tuli.
 */
export default function MenuLink({ bar, label, labelPdf, campaign, className = '' }: Props) {
  const menu = menuFor(bar);
  if (!menu) return null;
  return (
    <a
      href={withReferral(menu.url, campaign)}
      target="_blank"
      rel="nofollow noopener"
      className={`inline-flex items-center gap-1 text-[11px] no-underline transition-colors ${className}`}
    >
      {menu.kind === 'pdf' ? labelPdf : label} <ExternalLink size={10} />
    </a>
  );
}
