/**
 * AD_SLOTS — etusivun standardimainospaikat (LV Media -inventaari).
 *
 * JAETTU MALLI: sponsors[0] = pääkumppani (MainPartnerBanner heti heron alle),
 * sponsors[1] = kakkospääkumppani (HomeAdSlots-osio 1. sisältöosion jälkeen).
 * Tyhjät paikat renderöivät house-adin → https://laplandvibes.com/media/site/laplandbars
 *
 * Myyntiprosessi: kauppa → täytä sponsor/spot → build → deploy --branch=main.
 */
import type { HomeAdSlotsConfig } from '../shared/HomeAdSlots';
import { DEFAULT_PREMIUM_SPOTS } from '../shared/PremiumSpotGrid';

export const AD_SLOTS: HomeAdSlotsConfig = {
  siteSlug: 'laplandbars',
  sponsors: [null, null],
  spots: DEFAULT_PREMIUM_SPOTS,
};
