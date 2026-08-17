// World Bank API Indicator for External Debt
const INDICATOR = 'DT.DOD.DECT.CD';

// Advanced economies that do not report external debt to World Bank (Will stay grey on map)
const NON_REPORTING = [
  'USA', 'JPN', 'DEU', 'GBR', 'FRA', 'ITA', 'CAN', 'AUS', 'KOR', 
  'SAU', 'ESP', 'NLD', 'CHE', 'SWE', 'NOR', 'AUT', 'BEL', 'DNK', 
  'FIN', 'SGP', 'NZL', 'ISR', 'ARE', 'QAT', 'KWT', 'IRL', 'PRT', 
  'GRC', 'CZE'
];

// Helper: Get last 10 years range dynamically
const getYearRange = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear - 10}:${currentYear}`; 
};

// 1. Sync check for Maps to ignore Advanced Economies
export function hasExternalDebtData(countryCode: string): boolean {
  if (!countryCode) return false;
  return !NON_REPORTING.includes(countryCode.toUpperCase());
}

// 2. Fetch Global Data for Leaderboard & Map (With 10-Year Fallback)
export async function getGlobalDebtData() {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${INDICATOR}?format=json&per_page=5000&date=${getYearRange()}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours
    const data = await response.json();
    
    if (!data || !data[1]) return [];

    const records = data[1];
    const countryDataMap = new Map();

    records.forEach((record: any) => {
      const countryId = record.countryiso3code || record.country.id;
      const countryName = record.country.value;
      const value = record.value;
      const year = parseInt(record.date);

      if (!countryId || value === null) return;

      const existing = countryDataMap.get(countryId);
      // Logic: Save only the latest available year for each country
      if (!existing || existing.year < year) {
        countryDataMap.set(countryId, {
          code: countryId,
          name: countryName,
          debt: value,
          year: year
        });
      }
    });

    return Array.from(countryDataMap.values());
  } catch (error) {
    console.error("Error fetching global debt:", error);
    return [];
  }
}

// 3. Get Top Rankings dynamically
export async function getExternalDebtRankings(limit: number = 200) {
  const allData = await getGlobalDebtData();
  return allData
    .sort((a: any, b: any) => (b.debt || 0) - (a.debt || 0))
    .slice(0, limit);
}

// 4. Get specific country's full 10-year history
export async function getCountryDebt(countryCode: string) {
  if (!countryCode || !hasExternalDebtData(countryCode)) return null;
  
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${INDICATOR}?format=json&date=${getYearRange()}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    const data = await response.json();
    
    if (!data || !data[1]) return null;

    // Filter out nulls and sort by year
    const records = data[1]
      .filter((r: any) => r.value !== null)
      .map((r: any) => ({
        date: r.date,
        value: r.value
      }))
      .sort((a: any, b: any) => parseInt(a.date) - parseInt(b.date));

    if (records.length === 0) return null;

    return {
      records,
      latest: records[records.length - 1],
      previous: records.length > 1 ? records[records.length - 2] : null,
    };
  } catch (error) {
    console.error(`Error fetching debt for ${countryCode}:`, error);
    return null;
  }
}

// 5. Get latest single value for a country
export async function getLatestExternalDebt(countryCode: string) {
  const data = await getCountryDebt(countryCode);
  return data ? data.latest : null;
}

// 6. Get historical data for multiple countries (For Comparison Chart)
export async function getHistoricalDebtData(countryCodes: string[]) {
  if (!countryCodes || countryCodes.length === 0) return [];
  
  const yearMap = new Map<number, any>();
  
  for (const code of countryCodes) {
    const data = await getCountryDebt(code);
    if (data && data.records) {
      data.records.forEach((r: any) => {
        const year = parseInt(r.date);
        if (!yearMap.has(year)) {
          yearMap.set(year, { year });
        }
        yearMap.get(year)[code.toUpperCase()] = r.value;
      });
    }
  }

  return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
}

// 7. Get basic compare stats for info cards
export async function getCompareData(codes: string[] = ['IND', 'CHN']) {
  const results = [];
  for (const code of codes) {
    const latest = await getLatestExternalDebt(code);
    results.push({
      code: code.toUpperCase(),
      debt: latest ? latest.value : null,
      year: latest ? parseInt(latest.date) : null,
    });
  }
  return results;
}