/**
 * Valokuvien tekijätiedot JA lisenssikuitti (kuvavaihto 4.10.2026).
 *
 * Vesa 4.10.2026: *"tee ne kaikki"* = verkoston tekoälykuvat aidoiksi valokuviksi.
 * Kohteiden omat kuvat ovat yhä `venue-images.runtime.json`issa ("Kuva: <domain>").
 * Tämä taulu kattaa herot, kaupunkikuvat, cocktail-/après-/jääbaarikuvat ja
 * nimettyjen kohteiden KUVITUSKUVAT (kohde ilman omaa kuvaa: aito valokuva aiheesta,
 * merkintä "Kuvituskuva" + tekijä — ei koskaan esitetä vierasta kuvaa kohteen omana).
 *
 * Jokainen Commons-tiedosto tarkistettu 4.10.2026: aihe ja paikka Commonsin kuvauksesta
 * ja luokista; lisenssi ei NC/ND; tiedoston sha1 = rajapinnan sha1; ei toisella
 * LV-sivustolla (_kuvavaihto-20261004/claim.mjs + saman session sisarruudut käsin).
 * Jääbaarin kuvista hylättiin ruutu, jossa näkyi väkevän alkoholin (Minttu) mainos
 * pääaiheen kohdalla: väkevien mainonta on alkoholilain vastaista.
 *
 * 🔴 CC BY-SA -kuvia EI rajata: vain pienennys. Kortin 16:10-kehys rajaa selaimessa
 * (object-cover). Siksi `scripts/gen-card-crops.mjs` ei enää käsittele näitä nimiä.
 * 🔴 Avaimet normalisoidaan (`photoKey`): version-images.mjs lisää `?v=` distissä.
 */
export type PhotoCredit = {
  author: string;
  license: string;
  /** Tyhjä public domain -kuvalle ja omalle kuvalle. */
  licenseUrl: string;
  /** Commonsin tiedostosivu (tyhjä omalle kuvalle). */
  sourceUrl: string;
  title: string;
  alt: string;
  /** LV:n oma valokuva (ei lisenssiä; merkintä "Kuva: LaplandVibes"). */
  own?: boolean;
  /** Mitä paikkaa kuva esittää, kun se ei näy tiedostonimestä (oma kuva). */
  place?: string;
  taken: string;
  changes: string;
  fetched: string;
  cost: '0 €';
};

export const PHOTO_CREDITS: Record<string, PhotoCredit> = {
  "/images/drive/cocktailTrio.webp": {
    author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Colorful_cocktails_with_fresh_ingredients_displayed_on_a_bar_counter.jpg", title: "Colorful cocktails with fresh ingredients displayed on a bar counter.jpg",
    alt: "Colourful cocktails with mint and lime on a bar counter",
    taken: "2017-04-12 17:51:39", changes: "Pienennetty 4928×3264 → .webp 2400x1590; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/cards/cocktailTrio.webp": {
    author: "Shixart1985", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Colorful_cocktails_with_fresh_ingredients_displayed_on_a_bar_counter.jpg", title: "Colorful cocktails with fresh ingredients displayed on a bar counter.jpg",
    alt: "Colourful cocktails with mint and lime on a bar counter",
    taken: "2017-04-12 17:51:39", changes: "Pienennetty 4928×3264 → .webp 800x530; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/whiskyBar.webp": {
    author: "Hansjoerg Eberle", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Rovaniemi,_Finland_-_panoramio_(10).jpg", title: "Rovaniemi, Finland - panoramio (10).jpg",
    alt: "Shop and hotel lights in central Rovaniemi on a November night",
    taken: "2 November 2015", changes: "Pienennetty 5184×3456 → .webp 2400x1600; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/apresSkiLevi.webp": {
    author: "Евгений Гранат", license: "Public domain", licenseUrl: "",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Levi_-_Zero_Point.JPG", title: "Levi - Zero Point.JPG",
    alt: "Skiers outside the Zero Point bar in Levi village centre in winter",
    taken: "2007-12-31", changes: "Pienennetty 2560×1920 → .webp 2400x1800; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/heroNightlife.webp": {
    author: "Estormiz", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hotel_On-Piste_Yll%C3%A4s_20080305.jpg", title: "Hotel On-Piste Ylläs 20080305.jpg",
    alt: "Hotel On-Piste at the Ylläs ski resort on a March evening",
    taken: "5 March 2008", changes: "Pienennetty 3300×2477 → .webp 2400x1801; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/drinkingCultureHero.webp": {
    author: "Estormiz", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jumpru_Pub_Bar_Oulu_20130718.jpg", title: "Jumpru Pub Bar Oulu 20130718.jpg",
    alt: "Bottles and glasses behind the bar of Pub Jumpru in Oulu",
    taken: "18 July 2013, 20:02:42", changes: "Pienennetty 2460×1845 → .webp 2400x1800; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/heroMain.webp": {
    author: "LaplandVibes", license: "", licenseUrl: "", own: true, place: "Wanha Mestari, Tornio",
    sourceUrl: "", title: "own:20260721_230946",
    alt: "The bar counter of pub Wanha Mestari in Tornio, with lonkero and karaoke nights chalked above it",
    taken: "2026-07-21 23:09", changes: "Oma kuva (Galaxy S25 Edge 4000×3000), rajattu x 1000–4000, y 450–2550 (ihmiset pois), pienennetty → .webp 2400x1680.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/citySaariselka.webp": {
    author: "Nicolas Buffler", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Laponie_2019_(32316754597).jpg", title: "Laponie 2019 (32316754597).jpg",
    alt: "Snowy fell landscape seen from Kaunispää in Saariselkä on a February morning",
    taken: "2019-02-21 10:55", changes: "Pienennetty 3008×1692 → .webp 2400x1350; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/heroIceBars.webp": {
    author: "Timo Newton-Syms", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ice_Bar_(4466369333).jpg", title: "Ice Bar (4466369333).jpg",
    alt: "The ice counter and ice block seats inside the Chalet Ruka Peak ice bar in Ruka",
    taken: "2010-03-27 12:30", changes: "Pienennetty 1600×1200 → .webp 1600x1200; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/cards/heroIceBars.webp": {
    author: "Timo Newton-Syms", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ice_Bar_(4466369333).jpg", title: "Ice Bar (4466369333).jpg",
    alt: "The ice counter and ice block seats inside the Chalet Ruka Peak ice bar in Ruka",
    taken: "2010-03-27 12:30", changes: "Pienennetty 1600×1200 → .webp 800x600; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/heroApres.webp": {
    author: "Timo Newton-Syms", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ice_Bar_(33156840765).jpg", title: "Ice Bar (33156840765).jpg",
    alt: "The slope-side ice bar on the Masto hill in Ruka",
    taken: "2017-02-27 14:09", changes: "Pienennetty 3072×1728 → .webp 2400x1350; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/cards/heroApres.webp": {
    author: "Timo Newton-Syms", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ice_Bar_(33156840765).jpg", title: "Ice Bar (33156840765).jpg",
    alt: "The slope-side ice bar on the Masto hill in Ruka",
    taken: "2017-02-27 14:09", changes: "Pienennetty 3072×1728 → .webp 800x450; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/pubLaughter.webp": {
    author: "JIP", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Interior_of_restaurant_Treffi_Pub_in_November_2023.jpg", title: "Interior of restaurant Treffi Pub in November 2023.jpg",
    alt: "Wooden tables and warm lamps inside Treffi Pub in Helsinki",
    taken: "2023-11-15", changes: "Pienennetty 4608×3456 → .webp 2400x1800; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/craftBeerGlasses.webp": {
    author: "Lapinpanimo", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lapin_panimo_008.jpg", title: "Lapin panimo 008.jpg",
    alt: "Kero Ale, Lapin Amber Lager and Aihki Dark Lager, the first beers of Lapin Panimo",
    taken: "2016-08-31", changes: "Pienennetty 4016×5822 → .webp 2400x3479; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/cocktailBerry.webp": {
    author: "Tommi Nummelin", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Suomuurain.JPG", title: "Suomuurain.JPG",
    alt: "An almost ripe cloudberry among its leaves",
    taken: "2013-07-06 18:31:32", changes: "Pienennetty 3227×2420 → .webp 1600x1200; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/cocktailAurora.webp": {
    author: "Petrdolomicky", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Cocktail_Blue_Lagoon_at_the_pitch_bar.jpg", title: "Cocktail Blue Lagoon at the pitch bar.jpg",
    alt: "A Blue Lagoon cocktail made with vodka and blue curaçao",
    taken: "2025-12-26 22:19:14", changes: "Pienennetty 3000×4000 → .webp 1600x2133; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/lingonberryCocktails.webp": {
    author: "Arto J", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lingonberry_(Vaccinium_vitis-idaea)_-_panoramio.jpg", title: "Lingonberry (Vaccinium vitis-idaea) - panoramio.jpg",
    alt: "Ripe lingonberries on the forest floor in late August",
    taken: "29 August 2015", changes: "Pienennetty 3065×2302 → .webp 1600x1202; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/drive/apresToast.webp": {
    author: "Timo Newton-Syms", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ice_Bar_(4466369129).jpg", title: "Ice Bar (4466369129).jpg",
    alt: "Skiers outside the Chalet Ruka Peak ice bar by the slopes in Ruka",
    taken: "2010-03-27 12:36", changes: "Pienennetty 1600×1200 → .webp 1600x1200; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
  "/images/cards/apresToast.webp": {
    author: "Timo Newton-Syms", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ice_Bar_(4466369129).jpg", title: "Ice Bar (4466369129).jpg",
    alt: "Skiers outside the Chalet Ruka Peak ice bar by the slopes in Ruka",
    taken: "2010-03-27 12:36", changes: "Pienennetty 1600×1200 → .webp 800x600; ei rajausta, ei muita muutoksia.", fetched: '2026-10-04', cost: '0 €',
  },
};

export function photoKey(src?: string | null): string {
  if (!src) return '';
  return src.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
}

const BY_KEY: Record<string, PhotoCredit> = Object.fromEntries(
  Object.entries(PHOTO_CREDITS).map(([k, v]) => [photoKey(k), v]),
);

export function creditFor(src?: string | null): PhotoCredit | undefined {
  return BY_KEY[photoKey(src)];
}
