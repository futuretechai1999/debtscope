import Link from 'next/link'
import FullWorldMap, { CountryMapData } from '../../components/FullWorldMap'
import { allCountries } from '../../lib/countries'
import { GLOBAL_DEBT_MASTER } from '../../lib/worldbank'

export default function MapPage() {
  const mapData: CountryMapData[] = allCountries.map((c) => {
    const code = c.code3.toUpperCase()
    const master = GLOBAL_DEBT_MASTER[code]

    return {
      name: c.name,
      code,
      flag: c.flag || '🌐',
      debt: master?.debt ?? null,
      year: master?.year ?? null,
    }
  })

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
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
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
            paddingBottom: '20px',
            borderBottom: '1px solid #1e293b',
            marginBottom: '24px',
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
            Geographic Intelligence
          </span>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              margin: '6px 0 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            Global Debt Map
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '6px', fontSize: '14px' }}>
            Explore external debt across countries powered by World Bank indicator `DT.DOD.DECT.CD`.
          </p>
        </header>

        <FullWorldMap countries={mapData} />
      </div>
    </main>
  )
}