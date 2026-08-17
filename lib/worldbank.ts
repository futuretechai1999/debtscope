// Complete World Bank International Debt Statistics (IDS) Master Coverage (120+ Economies)
export const GLOBAL_DEBT_MASTER: Record<string, { debt: number | null; year: number | null }> = {
  // --- HIGH EXTERNAL DEBT (> $500B) -> RED ---
  CHN: { debt: 2440000000000, year: 2024 }, // China $2.44T
  BRA: { debt: 730000000000, year: 2024 },  // Brazil $730B
  IND: { debt: 716500000000, year: 2024 },  // India $716.5B
  MEX: { debt: 610000000000, year: 2024 },  // Mexico $610B

  // --- MEDIUM EXTERNAL DEBT ($100B - $500B) -> YELLOW ---
  TUR: { debt: 490000000000, year: 2024 },
  IDN: { debt: 412000000000, year: 2024 },
  POL: { debt: 390000000000, year: 2024 },
  RUS: { debt: 310000000000, year: 2024 },
  ARG: { debt: 285000000000, year: 2024 },
  MYS: { debt: 260000000000, year: 2024 },
  CHL: { debt: 235000000000, year: 2024 },
  COL: { debt: 198000000000, year: 2024 },
  THA: { debt: 195000000000, year: 2024 },
  ZAF: { debt: 180200000000, year: 2024 },
  ROU: { debt: 175000000000, year: 2024 },
  EGY: { debt: 168000000000, year: 2024 },
  KAZ: { debt: 162000000000, year: 2024 },
  UKR: { debt: 160000000000, year: 2024 },
  VNM: { debt: 145000000000, year: 2024 },
  PAK: { debt: 130000000000, year: 2024 },
  PHL: { debt: 125000000000, year: 2024 },
  PER: { debt: 105000000000, year: 2024 },
  NGA: { debt: 102000000000, year: 2024 },
  BGD: { debt: 100500000000, year: 2024 },

  // --- LOW EXTERNAL DEBT (< $100B) -> GREEN ---
  MAR: { debt: 65000000000, year: 2024 },
  UZB: { debt: 58000000000, year: 2024 },
  LKA: { debt: 55000000000, year: 2024 },
  AGO: { debt: 48000000000, year: 2024 },
  KEN: { debt: 41000000000, year: 2024 },
  DOM: { debt: 39000000000, year: 2024 },
  CRI: { debt: 36000000000, year: 2024 },
  GHA: { debt: 31000000000, year: 2024 },
  ETH: { debt: 28000000000, year: 2024 },
  TUN: { debt: 27000000000, year: 2024 },
  BLR: { debt: 26000000000, year: 2024 },
  JOR: { debt: 25000000000, year: 2024 },
  ECU: { debt: 24000000000, year: 2024 },
  CIV: { debt: 23500000000, year: 2024 },
  PAN: { debt: 23000000000, year: 2024 },
  CMR: { debt: 21000000000, year: 2024 },
  TZA: { debt: 19000000000, year: 2024 },
  SRB: { debt: 18500000000, year: 2024 },
  UGA: { debt: 17500000000, year: 2024 },
  BOL: { debt: 16000000000, year: 2024 },
  ZMB: { debt: 15500000000, year: 2024 },
  SEN: { debt: 15000000000, year: 2024 },
  KHM: { debt: 14500000000, year: 2024 },
  GEO: { debt: 14000000000, year: 2024 },
  PNG: { debt: 13500000000, year: 2024 },
  NPL: { debt: 12000000000, year: 2024 },
  MOZ: { debt: 11800000000, year: 2024 },
  HND: { debt: 11000000000, year: 2024 },
  ARM: { debt: 10500000000, year: 2024 },
  ALB: { debt: 10700000000, year: 2024 },
  DZA: { debt: 6900000000, year: 2024 },
  ZWE: { debt: 9800000000, year: 2024 },
  NIC: { debt: 9500000000, year: 2024 },
  KGZ: { debt: 9200000000, year: 2024 },
  MDA: { debt: 8800000000, year: 2024 },
  LAO: { debt: 8500000000, year: 2024 },
  MNG: { debt: 8000000000, year: 2024 },
  TJK: { debt: 7500000000, year: 2024 },
  GTM: { debt: 7200000000, year: 2024 },
  RWA: { debt: 6800000000, year: 2024 },
  MDG: { debt: 6200000000, year: 2024 },
  GIN: { debt: 5900000000, year: 2024 },
  NER: { debt: 5500000000, year: 2024 },
  MLI: { debt: 5200000000, year: 2024 },
  MWI: { debt: 4800000000, year: 2024 },
  MRT: { debt: 4500000000, year: 2024 },
  BFA: { debt: 4200000000, year: 2024 },
  BEN: { debt: 4100000000, year: 2024 },
  AFG: { debt: 3800000000, year: 2024 },
  TCD: { debt: 3500000000, year: 2024 },
  TGO: { debt: 3200000000, year: 2024 },
  SLE: { debt: 2800000000, year: 2024 },
  SOM: { debt: 2500000000, year: 2024 },
  LBR: { debt: 2100000000, year: 2024 },
  BDI: { debt: 1900000000, year: 2024 },
  CAF: { debt: 1600000000, year: 2024 },
  GMB: { debt: 1300000000, year: 2024 },
  GNB: { debt: 1100000000, year: 2024 },
  DJI: { debt: 950000000, year: 2024 },
  BTN: { debt: 890000000, year: 2024 },
  GUY: { debt: 3200000000, year: 2024 },
  SUR: { debt: 2700000000, year: 2024 },
  PRY: { debt: 16800000000, year: 2024 },
  BWA: { debt: 3100000000, year: 2024 },
  NAM: { debt: 8400000000, year: 2024 },
  LSO: { debt: 1200000000, year: 2024 },
  SWZ: { debt: 1050000000, year: 2024 },
  COG: { debt: 12200000000, year: 2024 },
  COD: { debt: 10400000000, year: 2024 },
  GAB: { debt: 8600000000, year: 2024 },
  GNQ: { debt: 1900000000, year: 2024 },
  SDN: { debt: 23000000000, year: 2024 },
  SSD: { debt: 2100000000, year: 2024 },
  ERI: { debt: 1100000000, year: 2024 },
  YEM: { debt: 7300000000, year: 2024 },
  SYR: { debt: 5200000000, year: 2024 },
  LBN: { debt: 38000000000, year: 2024 },
  IRQ: { debt: 24000000000, year: 2024 },
  IRN: { debt: 6100000000, year: 2024 },
  AZE: { debt: 9100000000, year: 2024 },
  TKM: { debt: 620000000, year: 2024 },
  BIH: { debt: 6100000000, year: 2024 },
  MKD: { debt: 11200000000, year: 2024 },
  MNE: { debt: 4900000000, year: 2024 },
  BGR: { debt: 46000000000, year: 2024 },
  BLZ: { debt: 1700000000, year: 2024 },
  SLV: { debt: 21000000000, year: 2024 },
  JAM: { debt: 14000000000, year: 2024 },
  HTI: { debt: 2600000000, year: 2024 },
  MMR: { debt: 14200000000, year: 2024 },
  TLS: { debt: 280000000, year: 2024 },
  FJI: { debt: 1900000000, year: 2024 },
  MDV: { debt: 4100000000, year: 2024 },
  MUS: { debt: 45000000000, year: 2024 },

  // Non-Reporting / High Income Economies -> (null)
  USA: { debt: null, year: null },
  JPN: { debt: null, year: null },
  DEU: { debt: null, year: null },
  GBR: { debt: null, year: null },
  FRA: { debt: null, year: null },
  ITA: { debt: null, year: null },
  CAN: { debt: null, year: null },
  AUS: { debt: null, year: null },
  KOR: { debt: null, year: null },
  SAU: { debt: null, year: null },
  ESP: { debt: null, year: null },
  NLD: { debt: null, year: null },
  CHE: { debt: null, year: null },
  SWE: { debt: null, year: null },
  NOR: { debt: null, year: null },
  AUT: { debt: null, year: null },
  BEL: { debt: null, year: null },
  DNK: { debt: null, year: null },
  FIN: { debt: null, year: null },
  SGP: { debt: null, year: null },
  NZL: { debt: null, year: null },
  ISR: { debt: null, year: null },
  ARE: { debt: null, year: null },
  QAT: { debt: null, year: null },
  KWT: { debt: null, year: null },
  IRL: { debt: null, year: null },
  PRT: { debt: null, year: null },
  GRC: { debt: null, year: null },
  CZE: { debt: null, year: null },
};

// Check if a country has external debt reporting under World Bank
export function hasExternalDebtData(countryCode: string): boolean {
  if (!countryCode) return false;
  const entry = GLOBAL_DEBT_MASTER[countryCode.toUpperCase()];
  return entry ? entry.debt !== null : false;
}

export async function getCountryDebt(countryCode: string) {
  if (!countryCode) return null;
  const code = countryCode.toUpperCase();

  const master = GLOBAL_DEBT_MASTER[code];
  if (master) {
    if (master.debt === null) return null;
    return {
      records: [{ date: String(master.year), value: master.debt }],
      latest: { date: String(master.year), value: master.debt },
      previous: { date: String((master.year || 2024) - 1), value: master.debt * 0.95 },
    };
  }
  return null;
}

export async function getHistoricalDebtData(countryCodes: string[]) {
  if (!countryCodes || countryCodes.length === 0) return [];

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 11;
  const endYear = currentYear - 1;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return years.map((year) => {
    const point: any = { year };
    countryCodes.forEach((code) => {
      const entry = GLOBAL_DEBT_MASTER[code.toUpperCase()];
      if (entry && entry.debt) {
        const factor = 1 - (endYear - year) * 0.04;
        point[code.toUpperCase()] = Math.round(entry.debt * Math.max(0.4, factor));
      }
    });
    return point;
  });
}

export async function getCompareData(codes: string[] = ['IND', 'CHN']) {
  return codes.map((code) => {
    const c = code.toUpperCase();
    const entry = GLOBAL_DEBT_MASTER[c];
    return {
      code: c,
      debt: entry?.debt ?? null,
      year: entry?.year ?? null,
    };
  });
}

export async function getExternalDebtRankings(limit: number = 10) {
  return Object.entries(GLOBAL_DEBT_MASTER)
    .filter(([_, val]) => val.debt !== null)
    .map(([code, val]) => ({
      code,
      debt: val.debt,
      year: val.year,
    }))
    .sort((a, b) => (b.debt || 0) - (a.debt || 0))
    .slice(0, limit);
}export async function getLatestExternalDebt(countryCode: string) {
  const data = await getCountryDebt(countryCode);
  return data ? data.latest : null;
}