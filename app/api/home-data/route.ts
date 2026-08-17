import { NextResponse } from 'next/server'
import { getCompareData, getExternalDebtRankings, getLatestExternalDebt } from '../../../lib/worldbank'

export async function GET() {
  try {
    const rankings = await getExternalDebtRankings(5)
    const compareData = await getCompareData(['IND', 'CHN'])

    // Total Top Debtors External Debt Calculation
    const totalExternalDebt = rankings.reduce(
      (total, country) => total + (country.debt || 0),
      0
    )

    // Live data for India fetch kar rahe hain
    const latestIndiaData = await getLatestExternalDebt('IND')
    
    const latestIndia = {
      code: 'IND',
      debt: latestIndiaData?.value || 716500000000,
      year: latestIndiaData ? parseInt(latestIndiaData.date) : 2024,
      yoyChange: '+4.2%', // UI ke liye static rakha hai
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