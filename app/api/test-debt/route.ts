import { NextResponse } from 'next/server'
import {
  hasExternalDebtData,
  getLatestExternalDebt,
} from '../../../lib/worldbank'

export async function GET() {
  const countries = ['IND', 'CHN', 'JPN']

  const results = await Promise.all(
    countries.map(async (code) => {
      const available = await hasExternalDebtData(code)
      const latest = available
        ? await getLatestExternalDebt(code)
        : null

      return {
        countryCode: code,
        available,
        latest,
      }
    })
  )

  return NextResponse.json({
    success: true,
    results,
  })
}