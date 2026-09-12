import { BARS, CARDS } from './images';

/**
 * Baarikorttien VARAKUVAT — omat AI-kuvitukset, ei kohteen omia kuvia.
 *
 * 🔴 Vesa 12.9.2026: tämä ei ole kattava lista eikä saa olla. Kortti näyttää
 * ensisijaisesti kohteen OMAN kuvan (`venue-images.runtime.json`); tänne
 * kuuluu vain kuvitus, joka on erikseen katsottu kyseiselle kohteelle
 * sopivaksi. Jos nimeä ei ole täällä eikä omaa kuvaa ole, kortti piirtää
 * tyyppipaneelin — ÄLÄ lisää `|| BARS.heroMain` mihinkään kutsupaikkaan:
 * se pudotti 40 uutta kohdetta samaan kuvaan (mitattu 12.9.2026).
 *
 * Oma moduuli siksi, että etusivu ei vetäisi koko /bars-sivua bundleensa.
 */
export const barImages: Record<string, string> = {
  // Rovaniemi
  // Varakuva vain siltä varalta ettei omaa kuvaa ole hyväksytty; EI breweryInterior,
  // jonka tynnyreissä lukee keksitty "LAPON PANIMO" (kuvien tekstiauditti 17.8.2026).
  'Lapland Brewery': BARS.craftBeerGlasses,
  'Café & Bar 21': CARDS.cocktailTrio,
  'Uitto Pub': BARS.friendsFireplace2,
  'Nook Lounge': BARS.lingonberryCocktails,
  'Bull Bar & Grill': BARS.friendsFireplace,
  'Ice Bar @ Arctic SnowHotel': BARS.iceBarDrinks,
  'Kauppayhtiö': BARS.liveMusicVenue, // pubLaughter on nyt /bars-sivun hero
  'Rovaniemen Oluthuone': BARS.terraceLonkero,
  'MustaKissa Kuppila': CARDS.cocktailBerry,
  'Pub Sarvi': CARDS.saunaBeer,
  'Roy Club': BARS.apresDanceDeck,
  // Levi
  'Hullu Poro Areena': BARS.apresSkiTwilight,
  'Bar Ihku': BARS.liveMusic,
  'Pub Hölmölä': BARS.craftBeerGlasses,
  'Public House Sohva': BARS.beerFlight,
  // Varakuvan on oltava VAAKA: pystykuvasta (720x1280) nakyi 16:10-kehyksessa
  // vain 31 % (mitattu 12.9.2026).
  'Bar Alakerta': CARDS.beerFlight,
  'Pub Old Mates': BARS.cabinBarInterior,
  "V'inkkari": BARS.apresToast,
  'Restaurant Tuikku': BARS.auroraVillage,
  // Ylläs
  'Selvä Pyy': BARS.cabinPubExterior,
  // 🔴 apresSkiAerial oli pysty JA sen rakennuksessa lukee "HULLU PORO" —
  // eri yritys, eri kylä. Kuva ei saa nimeta vaaraa yritysta.
  'Pirtukellari Night Club': CARDS.auroraLounge,
  'Bar Kaappi': BARS.lonkeroDrink,
  // Saariselkä
  'Gastropub Giitu': BARS.breweryTaps,
  'Teerenpesä': BARS.auroraLogCabins, // snowyVillageStreet sisältää keksityn PUB ÄKÄS -kyltin (muisti 11.7.)
};
