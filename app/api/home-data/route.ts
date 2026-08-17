import { NextResponse } from 'next/server'
import {
  getCompareData,
  getExternalDebtRankings,
} from '../../../lib/worldbank'

export async function GET() {
  try {
    const [indiaHistory, rankings] = await Promise.all([
      getCompareData('IND'),
      getExternalDebtRankings(300),
    ])

    const latestIndia = indiaHistory.at(-1) ?? null
    const globalDebt = rankings.reduce(
      (total, country) => total + country.value,
      0
    )

    return NextResponse.json({
      india: latestIndia
        ? {
            debt: latestIndia.debt,
            year: latestIndia.year,
            yoyChange: latestIndia.yoyChange,
            debtToGdp: latestIndia.debtToGdp,
          }
        : null,
      globalDebt,
      countryCount: rankings.length,
      latestYear: Math.max(
        ...rankings.map((country) => country.year)
      ),
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to load World Bank data.' },
      { status: 503 }
    )
  }
}
