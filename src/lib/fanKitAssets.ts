import type { FleetShipRequest } from './types';

export const fpsTeamImage = new URL(
  '../../Fankit_2025_11_19/FPS-team.webp',
  import.meta.url,
).href;

export const manufacturerLogos = {
  aegis: new URL('../../Fankit_2025_11_19/03_LOGOS/AEGIS_DYNAMICS_WHITE.png', import.meta.url)
    .href,
  anvil: new URL('../../Fankit_2025_11_19/03_LOGOS/ANVIL_AEROSPACE_WHITE.png', import.meta.url)
    .href,
  argo: new URL('../../Fankit_2025_11_19/03_LOGOS/Argo_Logo_Main_Light.png', import.meta.url)
    .href,
  aopoa: new URL('../../Fankit_2025_11_19/03_LOGOS/Aopoa_Logo_Main_Light.png', import.meta.url)
    .href,
  banu: new URL('../../Fankit_2025_11_19/03_LOGOS/BANU_WHITE.png', import.meta.url).href,
  consolidatedOutland: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/CONSOLIDATED_OUTLAND_WHITE.png',
    import.meta.url,
  ).href,
  crusader: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/CRUSADER_INDUSTRIES_WHITE.png',
    import.meta.url,
  ).href,
  drake: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/DRAKE_INTERPLANETARY_WHITE.png',
    import.meta.url,
  ).href,
  esperia: new URL('../../Fankit_2025_11_19/03_LOGOS/ESPERIA_WHITE.png', import.meta.url).href,
  gatac: new URL('../../Fankit_2025_11_19/03_LOGOS/Gatac_Logo_Main_Light.png', import.meta.url)
    .href,
  kruger: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/KRUGER_INTERGALACTIC_WHITE.png',
    import.meta.url,
  ).href,
  misc: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/MISC_Logo_SecondaryMark_white.png',
    import.meta.url,
  ).href,
  mirai: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/MISC_Mirai_Logo_IconMark_4k.png',
    import.meta.url,
  ).href,
  origin: new URL(
    '../../Fankit_2025_11_19/03_LOGOS/ORIGIN_JUMPWORKS_WHITE.png',
    import.meta.url,
  ).href,
  rsi: new URL('../../Fankit_2025_11_19/03_LOGOS/RSI_WHITE.png', import.meta.url).href,
  tumbril: new URL('../../Fankit_2025_11_19/03_LOGOS/TUMBRIL_WHITE.png', import.meta.url).href,
} as const;

export function getManufacturerLogo(manufacturer: string): string | null {
  const normalized = manufacturer.toLowerCase();

  if (normalized.includes('aegis')) return manufacturerLogos.aegis;
  if (normalized.includes('anvil')) return manufacturerLogos.anvil;
  if (normalized.includes('argo')) return manufacturerLogos.argo;
  if (normalized.includes('aopoa')) return manufacturerLogos.aopoa;
  if (normalized.includes('banu')) return manufacturerLogos.banu;
  if (normalized.includes('consolidated')) return manufacturerLogos.consolidatedOutland;
  if (normalized.includes('crusader')) return manufacturerLogos.crusader;
  if (normalized.includes('drake')) return manufacturerLogos.drake;
  if (normalized.includes('esperia')) return manufacturerLogos.esperia;
  if (normalized.includes('gatac')) return manufacturerLogos.gatac;
  if (normalized.includes('kruger')) return manufacturerLogos.kruger;
  if (normalized.includes('mirai')) return manufacturerLogos.mirai;
  if (normalized.includes('misc')) return manufacturerLogos.misc;
  if (normalized.includes('origin')) return manufacturerLogos.origin;
  if (normalized.includes('roberts') || normalized === 'rsi') return manufacturerLogos.rsi;
  if (normalized.includes('tumbril')) return manufacturerLogos.tumbril;

  return null;
}

export function getRequestImage(request: FleetShipRequest): string | undefined {
  if (request.categoryKey === 'marines') {
    return fpsTeamImage;
  }

  return request.imageUrl;
}
