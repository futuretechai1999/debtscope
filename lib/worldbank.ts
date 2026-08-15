const WORLD_BANK_API = 'https://api.worldbank.org/v2'

const EXTERNAL_DEBT_INDICATOR = 'DT.DOD.DECT.CD'
const GDP_INDICATOR = 'NY.GDP.MKTP.CD'

export type DebtObservation = {
  countryCode: string
  year: number
  value: number | null
}

export type LatestDebtData = {
  countryCode: string
  year: number
  value: number
}

export type EconomicObservation = {
  countryCode: string
  year: number
  value: number | null
}

export type CompareObservation = {
  countryCode: string
  year: number
  debt: number | null
  gdp: number | null
  debtToGdp: number | null
  yoyChange: number | null
}

async function getIndicatorData(
  countryCode: string,
  indicator: string
): Promise<EconomicObservation[]> {
  const code = countryCode.toUpperCase()

  const url =
    `${WORLD_BANK_API}/country/${code}/indicator/${indicator}` +
    `?format=json&per_page=100`

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(
      `World Bank request failed: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  if (!Array.isArray(data) || !Array.isArray(data[1])) {
    throw new Error('Unexpected World Bank API response.')
  }

  return data[1]
    .map(
      (item: {
        countryiso3code?: string
        date?: string
        value?: number | null
      }) => ({
        countryCode: item.countryiso3code ?? code,
        year: Number(item.date),
        value: item.value ?? null,
      })
    )
    .filter(
      (item: EconomicObservation) =>
        Number.isFinite(item.year) &&
        item.value !== null &&
        Number.isFinite(item.value)
    )
}

export async function getExternalDebt(
  countryCode: string
): Promise<DebtObservation[]> {
  const history = await getIndicatorData(
    countryCode,
    EXTERNAL_DEBT_INDICATOR
  )

  return history.map((item) => ({
    countryCode: item.countryCode,
    year: item.year,
    value: item.value,
  }))
}

export async function getLatestExternalDebt(
  countryCode: string
): Promise<LatestDebtData | null> {
  const history = await getExternalDebt(countryCode)

  if (history.length === 0) {
    return null
  }

  const latest = history.reduce((latestItem, currentItem) =>
    currentItem.year > latestItem.year ? currentItem : latestItem
  )

  return {
    countryCode: latest.countryCode,
    year: latest.year,
    value: latest.value as number,
  }
}

export async function hasExternalDebtData(
  countryCode: string
): Promise<boolean> {
  const history = await getExternalDebt(countryCode)
  return history.length > 0
}

export async function getGDP(
  countryCode: string
): Promise<EconomicObservation[]> {
  return getIndicatorData(countryCode, GDP_INDICATOR)
}

export async function getCompareData(
  countryCode: string
): Promise<CompareObservation[]> {
  const [debtHistory, gdpHistory] = await Promise.all([
    getExternalDebt(countryCode),
    getGDP(countryCode),
  ])

  const gdpByYear = new Map<number, number>()

  for (const item of gdpHistory) {
    if (item.value !== null) {
      gdpByYear.set(item.year, item.value)
    }
  }

  const sortedDebt = [...debtHistory].sort(
    (a, b) => a.year - b.year
  )

  return sortedDebt.map((item, index) => {
    const debt = item.value
    const gdp = gdpByYear.get(item.year) ?? null

    const previous = index > 0 ? sortedDebt[index - 1] : null

    const yoyChange =
      previous &&
      previous.value !== null &&
      previous.value !== 0
        ? ((debt - previous.value) / previous.value) * 100
        : null

    const debtToGdp =
      debt !== null &&
      gdp !== null &&
      gdp !== 0
        ? (debt / gdp) * 100
        : null

    return {
      countryCode: item.countryCode,
      year: item.year,
      debt,
      gdp,
      debtToGdp,
      yoyChange,
    }
  })
}