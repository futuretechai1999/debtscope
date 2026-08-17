import { NextResponse } from 'next/server'
import { getCompareData, getExternalDebtRankings, GLOBAL_DEBT_MASTER } from '../../../lib/worldbank'

export async function GET() {
  try {
    const rankings = await getExternalDebtRankings(5)
    const compareData = await getCompareData(['IND', 'CHN'])

    // Total Top Debtors External Debt Calculation
    const totalExternalDebt = rankings.reduce(
      (total, country) => total + (country.debt || 0),
      0
    )

    const indiaEntry = GLOBAL_DEBT_MASTER['IND']
    const latestIndia = {
      code: 'IND',
      debt: indiaEntry?.debt || 716500000000,
      year: indiaEntry?.year || 2024,
      yoyChange: '+4.2%',
      debtToGdp: '18.7%',
    }

    return NextResponse.json({
      success: true,
      data: {
        totalExternalDebt,
        rankings,
        compareData,
        spotlight: latestIndia,
      },
    })
  } catch (error) {
    console.error('Home data API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate homepage metrics' },
      { status: 500 }
    )
  }
}