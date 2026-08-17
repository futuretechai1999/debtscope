import Link from 'next/link'
import { allCountries } from '../../lib/countries'

interface RankingCountry {
  name: string
  code: string
  flag: string
  debt: number | null
  year: number | null
}

async function fetchAllRankings(): Promise<RankingCountry[]> {
  // Top developing and emerging economies with active World Bank external debt reporting
  const targetCodes = [
    'CHN', 'IND', 'BRA', 'MEX', 'IDN', 'TUR', 'ARG', 'ZAF', 'NGA', 'EGY',
    'PAK', 'BGD', 'VNM', 'PHL', 'THA', 'COL', 'CHL', 'MYS', 'POL', 'PER',
    'ROU', 'KAZ', 'UKR', 'MAR', 'UZB', 'KEN', 'ETH', 'GHA', 'LKA', 'USA', 'JPN', 'DEU'
  ]

  const codesStr = targetCodes.join(';').toLowerCase()
  const url = `https://api.worldbank.org/v2/country/${codesStr}/indicator/DT.DOD.DECT.CD?format=json&per_page=1000`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    const data = await res.json()

    if (!data || !data[1]) return []

    const latestByCountry = new Map<string, { debt: number; year: number }>()

    data[1].forEach((item: any) => {
      const code = item.countryiso3code?.toUpperCase()
      if (code && item.value !== null && !latestByCountry.has(code)) {
        latestByCountry.set(code, {
          debt: item.value,
          year: parseInt(item.date),
        })
      }
    })

    const results: RankingCountry[] = targetCodes.map((code) => {
      const meta = allCountries.find((c) => c.code3.toUpperCase() === code)
      const debtInfo = latestByCountry.get(code)

      return {
        name: meta?.name || code,
        code,
        flag: meta?.flag || '🌐',
        debt: debtInfo?.debt ?? null,
        year: debtInfo?.year ?? null,
      }
    })

    // Sort by Debt descending (highest to lowest), unavailable data at the bottom
    return results.sort((a, b) => {
      if (a.debt === null) return 1
      if (b.debt === null) return -1
      return b.debt - a.debt
    })
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return []
  }
}

const formatCurrency = (val: number | null) => {
  if (val === null) return 'Data unavailable'
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`
  return `$${val.toLocaleString()}`
}

export default async function RankingsPage() {
  const rankingList = await fetchAllRankings()

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#070b14',
        color: '#ffffff',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              color: '#94a3b8',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Overview
          </Link>
        </div>

        <header
          style={{
            paddingBottom: '24px',
            borderBottom: '1px solid #1e293b',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#38bdf8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Global Intelligence
          </span>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              margin: '6px 0 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            Global External Debt Leaderboard
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '6px', fontSize: '14px' }}>
            Rankings powered by World Bank International Debt Statistics (`DT.DOD.DECT.CD`).
          </p>
        </header>

        {/* Informational Context Banner */}
        <div
          style={{
            backgroundColor: '#0d1527',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#94a3b8',
          }}
        >
          <strong style={{ color: '#38bdf8' }}>Data Note:</strong> World Bank external debt statistics report on developing and emerging markets. Advanced economies (e.g. US, Japan) do not report under this indicator and appear as &quot;Data unavailable&quot;.
        </div>

        {/* Rankings Table */}
        <div
          style={{
            backgroundColor: '#0d1527',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 180px 120px 100px',
              padding: '14px 20px',
              borderBottom: '1px solid #1e293b',
              fontSize: '12px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>#</span>
            <span>Country</span>
            <span>External Debt</span>
            <span>Year</span>
            <span style={{ textAlign: 'right' }}>Profile</span>
          </div>

          {rankingList.map((country, index) => {
            const hasData = country.debt !== null
            const rankStr = index < 9 ? `0${index + 1}` : `${index + 1}`

            return (
              <div
                key={country.code}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 180px 120px 100px',
                  padding: '16px 20px',
                  borderBottom:
                    index === rankingList.length - 1
                      ? 'none'
                      : '1px solid #141e33',
                  alignItems: 'center',
                  fontSize: '14px',
                  backgroundColor: hasData ? 'transparent' : 'rgba(15, 23, 42, 0.4)',
                }}
              >
                <span
                  style={{
                    color: hasData && index < 3 ? '#38bdf8' : '#64748b',
                    fontWeight: 700,
                  }}
                >
                  {hasData ? rankStr : '—'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{country.flag}</span>
                  <span style={{ fontWeight: 600, color: hasData ? '#ffffff' : '#94a3b8' }}>
                    {country.name}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#1e293b',
                      color: '#94a3b8',
                    }}
                  >
                    {country.code}
                  </span>
                </div>

                <span
                  style={{
                    fontWeight: 700,
                    color: hasData ? '#ffffff' : '#64748b',
                  }}
                >
                  {formatCurrency(country.debt)}
                </span>

                <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                  {country.year ? country.year : 'N/A'}
                </span>

                <div style={{ textAlign: 'right' }}>
                  <Link
                    href={`/country/${country.code}`}
                    style={{
                      fontSize: '12px',
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}