import Link from 'next/link'
import { getExternalDebtRankings } from '../../lib/worldbank'
import DebtWorldMap from '../../components/DebtWorldMap'

export default async function MapPage() {
  const rankings = await getExternalDebtRankings(300)

  const mapCountries = rankings.map((country) => ({
    code: country.countryCode,
    name: country.countryName,
    value: country.value,
    year: country.year,
  }))

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#07111F',
        color: '#FFFFFF',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: 'min(1240px, calc(100% - 48px))',
          margin: '0 auto',
          padding: '48px 0 80px',
        }}
      >
        <Link
          href="/"
          style={{
            color: '#34D6E7',
            textDecoration: 'none',
            fontSize: '15px',
          }}
        >
          ← Back to home
        </Link>

        <div style={{ marginTop: '38px' }}>
          <div
            style={{
              color: '#34D6E7',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1.5px',
            }}
          >
            DEBTSCOPE WORLD MAP
          </div>

          <h1
            style={{
              margin: '12px 0 0',
              fontSize: '48px',
              lineHeight: 1.1,
            }}
          >
            Global external debt
          </h1>

          <p
            style={{
              marginTop: '14px',
              color: '#9FB3C8',
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '780px',
            }}
          >
            Explore the latest available external debt data
            across countries. Hover over a country and click
            to open its detailed DebtScope page.
          </p>
        </div>

        <section
          style={{
            marginTop: '32px',
            background: '#0F1C2E',
            border: '1px solid #1E3550',
            borderRadius: '20px',
            padding: '18px',
          }}
        >
          <DebtWorldMap countries={mapCountries} />
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          <InfoCard
            title="Data source"
            value="World Bank"
            description="External debt stocks, total"
          />

          <InfoCard
            title="Countries"
            value={String(mapCountries.length)}
            description="Countries with usable observations"
          />

          <InfoCard
            title="Metric"
            value="External debt"
            description="Current US dollars"
          />

          <InfoCard
            title="Update"
            value="Automatic"
            description="Source data revalidated periodically"
          />
        </div>

        <div
          style={{
            marginTop: '20px',
            color: '#71869C',
            fontSize: '13px',
            lineHeight: 1.6,
          }}
        >
          Source: World Bank — External debt stocks,
          total (current US$), indicator DT.DOD.DECT.CD.
        </div>
      </div>
    </main>
  )
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div
      style={{
        background: '#0F1C2E',
        border: '1px solid #1E3550',
        borderRadius: '18px',
        padding: '22px',
      }}
    >
      <div
        style={{
          color: '#9FB3C8',
          fontSize: '14px',
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '25px',
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: '6px',
          color: '#71869C',
          fontSize: '13px',
        }}
      >
        {description}
      </div>
    </div>
  )
}