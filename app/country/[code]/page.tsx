import Link from 'next/link'
import DebtComparisonChart from '../../../components/DebtComparisonChart'
import { getHistoricalDebtData } from '../../../lib/worldbank'
import { findCountry } from '../../../lib/countries'

interface DebtObservation {
  date: string
  value: number | null
}

async function getCountryDebtDetails(code: string) {
  const url = `https://api.worldbank.org/v2/country/${code.toLowerCase()}/indicator/DT.DOD.DECT.CD?format=json&per_page=15`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    const data = await res.json()

    if (!data || !data[1]) {
      return { records: [], latest: null, previous: null }
    }

    const validRecords: DebtObservation[] = data[1].filter(
      (item: any) => item.value !== null
    )

    return {
      records: validRecords,
      latest: validRecords[0] || null,
      previous: validRecords[1] || null,
    }
  } catch (error) {
    console.error('Error fetching country debt details:', error)
    return { records: [], latest: null, previous: null }
  }
}

const formatCurrency = (val: number | null) => {
  if (val === null) return 'Data unavailable'
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} Trillion`
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`
  return `$${val.toLocaleString()}`
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const resolvedParams = await params
  const rawCode = resolvedParams.code.toUpperCase()

  const countryMeta = findCountry(rawCode)
  const countryName = countryMeta?.name || rawCode
  const flag = countryMeta?.flag || '🌐'

  const [{ latest, previous }, historicalData] = await Promise.all([
    getCountryDebtDetails(rawCode),
    getHistoricalDebtData([rawCode]),
  ])

  let yoyChange = 'N/A'
  if (latest && previous && latest.value && previous.value) {
    const diff = ((latest.value - previous.value) / previous.value) * 100
    yoyChange = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`
  }

  const hasData = Boolean(latest && latest.value !== null)

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
        {/* Navigation / Header */}
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

        {/* Country Title Block */}
        <div
          style={{
            backgroundColor: '#0d1527',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '48px', lineHeight: 1 }}>{flag}</span>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#38bdf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  ISO-3: {rawCode}
                </span>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    margin: '4px 0 0 0',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {countryName}
                </h1>
              </div>
            </div>

            <Link
              href={`/compare?countries=${rawCode},CHN`}
              style={{
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Compare with others →
            </Link>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              backgroundColor: '#0d1527',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
              TOTAL EXTERNAL DEBT
            </span>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: hasData ? '#ffffff' : '#94a3b8',
                marginTop: '8px',
              }}
            >
              {hasData ? formatCurrency(latest?.value ?? null) : 'Data unavailable'}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Indicator: DT.DOD.DECT.CD
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#0d1527',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
              YEAR-OVER-YEAR CHANGE
            </span>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                marginTop: '8px',
                color: yoyChange.startsWith('+')
                  ? '#f87171'
                  : yoyChange.startsWith('-')
                  ? '#4ade80'
                  : '#94a3b8',
              }}
            >
              {yoyChange}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Annual net variation
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#0d1527',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
              LATEST OBSERVATION YEAR
            </span>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '8px',
              }}
            >
              {latest?.date || 'N/A'}
            </div>
            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Official World Bank reporting
            </span>
          </div>
        </div>

        {/* Data Unavailable Warning Box */}
        {!hasData && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '28px',
              color: '#fca5a5',
              fontSize: '14px',
            }}
          >
            <strong>Official data unavailable:</strong> No published external debt observations exist for{' '}
            {countryName} under the World Bank external debt indicator (`DT.DOD.DECT.CD`).
          </div>
        )}

        {/* Historical Chart */}
        {hasData && (
          <div style={{ marginBottom: '28px' }}>
            <DebtComparisonChart data={historicalData} countryCodes={[rawCode]} />
          </div>
        )}

        {/* Footer Note */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#64748b',
            fontSize: '12px',
          }}
        >
          <span>DebtScope Country Profile</span>
          <span>Data source: World Bank International Debt Statistics</span>
        </div>
      </div>
    </main>
  )
}