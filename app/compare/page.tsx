import Link from 'next/link'
import DebtComparisonChart from '../../components/DebtComparisonChart'
import CountrySelector from '../../components/CountrySelector'
import CompareAIInsight from '../../components/CompareAIInsight'
import { getHistoricalDebtData } from '../../lib/worldbank'

interface CountryDetail {
  name: string
  code: string
  debt: number | null
  year: number | null
  prevDebt?: number | null
  change?: string
}

async function fetchCountrySummary(code: string): Promise<CountryDetail> {
  const url = `https://api.worldbank.org/v2/country/${code.toLowerCase()}/indicator/DT.DOD.DECT.CD?format=json&per_page=5`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    const data = await res.json()

    if (!data || !data[1]) {
      return { name: code, code, debt: null, year: null }
    }

    const countryName = data[1][0]?.country?.value || code
    const validRecords = data[1].filter((item: any) => item.value !== null)

    if (validRecords.length === 0) {
      return { name: countryName, code, debt: null, year: null }
    }

    const latest = validRecords[0]
    const previous = validRecords[1] || null

    let change = 'N/A'
    if (previous && previous.value && latest.value) {
      const diff = ((latest.value - previous.value) / previous.value) * 100
      change = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`
    }

    return {
      name: countryName,
      code,
      debt: latest.value,
      year: parseInt(latest.date),
      change,
    }
  } catch (error) {
    return { name: code, code, debt: null, year: null }
  }
}

const formatCurrency = (val: number | null) => {
  if (val === null) return 'Data unavailable'
  if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
  return `$${val.toLocaleString()}`
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ countries?: string }>
}) {
  const resolvedParams = await searchParams
  const rawCodes = resolvedParams.countries || 'IND,CHN'
  const countryCodes = rawCodes
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 4)

  const [countriesData, historicalData] = await Promise.all([
    Promise.all(countryCodes.map((code) => fetchCountrySummary(code))),
    getHistoricalDebtData(countryCodes),
  ])

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
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '24px',
            borderBottom: '1px solid #1e293b',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                color: '#94a3b8',
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              ← Back to Overview
            </Link>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Compare External Debt
            </h1>
            <p style={{ color: '#94a3b8', marginTop: '6px', fontSize: '14px' }}>
              Analyzing side-by-side World Bank external debt indicators.
            </p>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: '9999px',
            }}
          >
            {countryCodes.length} Countries Selected
          </span>
        </header>

        {/* Interactive Country Selector */}
        <CountrySelector selectedCodes={countryCodes} />

        {/* Country Summary Cards */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '28px',
          }}
        >
          {countriesData.map((country) => (
            <div
              key={country.code}
              style={{
                backgroundColor: '#0d1527',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {country.code}
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '4px 0 0 0' }}>
                    {country.name}
                  </h2>
                </div>
                <Link
                  href={`/country/${country.code}`}
                  style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none' }}
                >
                  Details →
                </Link>
              </div>

              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                  {formatCurrency(country.debt)}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {country.year ? `Latest Record: ${country.year}` : 'No recent records'}
                </div>
              </div>

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: '#94a3b8' }}>YoY Change:</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: country.change?.startsWith('+')
                      ? '#f87171'
                      : country.change?.startsWith('-')
                      ? '#4ade80'
                      : '#94a3b8',
                  }}
                >
                  {country.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* AI Insight Section */}
        <CompareAIInsight countries={countriesData} />

        {/* Historical Chart Section */}
        <section style={{ marginTop: '28px' }}>
          <DebtComparisonChart data={historicalData} countryCodes={countryCodes} />
        </section>
      </div>
    </main>
  )
}