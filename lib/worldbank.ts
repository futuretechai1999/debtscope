const WORLD_BANK_API = 'https://api.worldbank.org/v2'
const EXTERNAL_DEBT_INDICATOR = 'DT.DOD.DECT.CD'

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

/**
 * Fetch external debt history for any country.
 */
export async function getExternalDebt(
  countryCode: string
): Promise<DebtObservation[]> {
  const code = countryCode.toUpperCase()

  const url =
    `${WORLD_BANK_API}/country/${code}/indicator/${EXTERNAL_DEBT_INDICATOR}` +
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
      (item: DebtObservation) =>
        Number.isFinite(item.year) &&
        item.value !== null &&
        Number.isFinite(item.value)
    )
}

/**
 * Get the latest available external debt value.
 */
export async function getLatestExternalDebt(
  countryCode: string
): Promise<LatestDebtData | null> {
  const history = await getExternalDebt(countryCode)

  if (history.length === 0) {
    return null
  }

  const latest = history.reduce((latest, current) =>
    current.year > latest.year ? current : latest
  )

  return {
    countryCode: latest.countryCode,
    year: latest.year,
    value: latest.value as number,
  }
}

/**
 * Check whether usable external debt data exists
 * for the selected World Bank indicator.
 */
export async function hasExternalDebtData(
  countryCode: string
): Promise<boolean> {
  const history = await getExternalDebt(countryCode)

  return history.length > 0
}