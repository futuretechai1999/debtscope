import countries from 'world-countries'

export type DebtScopeCountry = {
  name: string
  code2: string
  code3: string
  flag: string
}

export const allCountries: DebtScopeCountry[] = countries
  .map((country) => ({
    name: country.name.common,
    code2: country.cca2,
    code3: country.cca3,
    flag: country.flag,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function findCountry(query: string): DebtScopeCountry | null {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return null
  }

  return (
    allCountries.find(
      (country) =>
        country.name.toLowerCase() === normalized ||
        country.code2.toLowerCase() === normalized ||
        country.code3.toLowerCase() === normalized
    ) ?? null
  )
}