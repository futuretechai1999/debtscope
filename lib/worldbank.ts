// Memory cache to avoid repeated slow network calls to World Bank API
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

async function fetchWithCache(url: string) {
  const now = Date.now()
  if (cache.has(url)) {
    const cached = cache.get(url)!
    if (now - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    })

    if (!res.ok) return null
    const data = await res.json()

    cache.set(url, { data, timestamp: now })
    return data
  } catch (error) {
    console.error('World Bank fetch error:', error)
    return null
  }
}

export async function getCountryDebt(countryCode: string) {
  if (!countryCode) return null
  const code = countryCode.toLowerCase()
  const url = `https://api.worldbank.org/v2/country/${code}/indicator/DT.DOD.DECT.CD?format=json&per_page=15`

  const data = await fetchWithCache(url)
  if (!data || !data[1]) return null

  const validRecords = data[1].filter((item: any) => item.value !== null)
  return {
    records: validRecords,
    latest: validRecords[0] || null,
    previous: validRecords[1] || null,
  }
}

export async function getHistoricalDebtData(countryCodes: string[]) {
  if (!countryCodes || countryCodes.length === 0) return []

  const codesStr = countryCodes.join(';').toLowerCase()
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 11
  const endYear = currentYear - 1

  const url = `https://api.worldbank.org/v2/country/${codesStr}/indicator/DT.DOD.DECT.CD?date=${startYear}:${endYear}&format=json&per_page=1000`

  const data = await fetchWithCache(url)
  if (!data || !data[1]) return []

  const chartDataMap = new Map<number, any>()

  data[1].forEach((item: any) => {
    if (item.value !== null) {
      const year = parseInt(item.date)
      const code = item.countryiso3code
      const value = item.value

      if (!chartDataMap.has(year)) {
        chartDataMap.set(year, { year })
      }

      const yearData = chartDataMap.get(year)
      yearData[code] = value
    }
  })

  return Array.from(chartDataMap.values()).sort((a, b) => a.year - b.year)
}

export async function getCompareData(codes: string[] = ['IND', 'CHN']) {
  const summaries = await Promise.all(
    codes.map(async (code) => {
      const debt = await getCountryDebt(code)
      return {
        code: code.toUpperCase(),
        debt: debt?.latest?.value ?? null,
        year: debt?.latest?.date ?? null,
      }
    })
  )
  return summaries
}

export async function getExternalDebtRankings(limit: number = 10) {
  const targetCodes = [
    'USA', 'CHN', 'JPN', 'DEU', 'GBR', 'FRA', 'IND', 'ITA', 'BRA', 'CAN',
    'RUS', 'KOR', 'AUS', 'MEX', 'IDN', 'SAU', 'TUR', 'ARG', 'ZAF', 'NGA'
  ]

  const codesStr = targetCodes.join(';').toLowerCase()
  const url = `https://api.worldbank.org/v2/country/${codesStr}/indicator/DT.DOD.DECT.CD?format=json&per_page=1000`

  const data = await fetchWithCache(url)
  if (!data || !data[1]) return []

  const latestMap = new Map<string, any>()

  data[1].forEach((item: any) => {
    const code = item.countryiso3code?.toUpperCase()
    if (code && item.value !== null && !latestMap.has(code)) {
      latestMap.set(code, {
        code,
        debt: item.value,
        year: parseInt(item.date),
      })
    }
  })

  return Array.from(latestMap.values())
    .sort((a, b) => (b.debt ?? 0) - (a.debt ?? 0))
    .slice(0, limit)
}