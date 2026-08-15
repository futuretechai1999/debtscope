import Link from 'next/link'
import {
  getCompareData,
  type CompareObservation,
} from '../../../lib/worldbank'
import { allCountries } from '../../../lib/countries'
import DebtComparisonChart from '../../../components/DebtComparisonChart'

function formatDebt(value: number | null) {
  if (value === null) return 'Unavailable'

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }

  return `$${(value / 1_000_000).toFixed(2)}M`
}

function formatPercent(value: number | null) {
  if (value === null) return 'Unavailable'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatRatio(value: number | null) {
  if (value === null) return 'Unavailable'
  return `${value.toFixed(2)}%`
}

function getCountryMeta(code: string) {
  const normalizedCode = code.toUpperCase()

  const country = allCountries.find(
    (item) => item.code3.toUpperCase() === normalizedCode
  )

  if (!country) {
    return null
  }

  return {
    name: country.name,
    code3: country.code3.toUpperCase(),
    code2: country.code2.toUpperCase(),
  }
}

function getFlagUrl(code2: string) {
  return `https://flagcdn.com/40x30/${code2.toLowerCase()}.png`
}

type CountryPageProps = {
  params: Promise<{
    code: string
  }>
}

export default async function CountryPage({
  params,
}: CountryPageProps) {
  const resolvedParams = await params
  const code = resolvedParams.code.toUpperCase()

  const country = getCountryMeta(code)

  if (!country) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#07111F',
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
          padding: '48px',
        }}
      >
        <div
          style={{
            width: 'min(900px, 100%)',
            margin: '0 auto',
          }}
        >
          <Link
            href="/"
            style={{
              color: '#34D6E7',
              textDecoration: 'none',
            }}
          >
            ← Back to home
          </Link>

          <div
            style={{
              marginTop: '60px',
              background: '#0F1C2E',
              border: '1px solid #1E3550',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <h1 style={{ margin: 0 }}>Country not found</h1>

            <p
              style={{
                color: '#9FB3C8',
                lineHeight: 1.6,
                marginTop: '12px',
              }}
            >
              We could not find a country matching the requested
              country code.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const history = await getCompareData(country.code3)

  const latest: CompareObservation | null =
    history.length > 0
      ? history.reduce((latestItem, currentItem) =>
          currentItem.year > latestItem.year
            ? currentItem
            : latestItem
        )
      : null

  if (!latest) {
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
            width: 'min(1100px, calc(100% - 48px))',
            margin: '0 auto',
            padding: '48px 0 80px',
          }}
        >
          <Link
            href="/"
            style={{
              color: '#34D6E7',
              textDecoration: 'none',
            }}
          >
            ← Back to home
          </Link>

          <div style={{ marginTop: '40px' }}>
            <div
              style={{
                color: '#34D6E7',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1.5px',
              }}
            >
              DEBTSCOPE COUNTRY
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              <img
                src={getFlagUrl(country.code2)}
                alt={`${country.name} flag`}
                width="40"
                height="30"
                style={{
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #1E3550',
                }}
              />

              <h1
                style={{
                  margin: 0,
                  fontSize: '48px',
                }}
              >
                {country.name}
              </h1>
            </div>

            <p
              style={{
                color: '#9FB3C8',
                fontSize: '18px',
                lineHeight: 1.6,
              }}
            >
              {country.code3} · External debt data
            </p>
          </div>

          <section
            style={{
              marginTop: '32px',
              background: '#0F1C2E',
              border: '1px solid #1E3550',
              borderRadius: '20px',
              padding: '32px',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '7px 11px',
                borderRadius: '999px',
                background: '#17283D',
                color: '#F59E0B',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              DATA UNAVAILABLE
            </div>

            <h2
              style={{
                margin: '18px 0 0',
                fontSize: '25px',
              }}
            >
              No usable external debt observation was returned
            </h2>

            <p
              style={{
                marginTop: '10px',
                color: '#9FB3C8',
                lineHeight: 1.7,
                maxWidth: '760px',
              }}
            >
              The selected World Bank external-debt indicator
              does not currently provide a usable observation for
              this country. DebtScope does not invent or estimate
              missing official values.
            </p>

            <div
              style={{
                marginTop: '22px',
                color: '#71869C',
                fontSize: '13px',
              }}
            >
              Source: World Bank — External debt stocks,
              total (current US$), indicator DT.DOD.DECT.CD.
            </div>
          </section>
        </div>
      </main>
    )
  }

  const chartData = history
    .filter((item) => item.year >= 2015)
    .map((item) => ({
      year: item.year,
      [country.code3]: item.debt,
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
          width: 'min(1180px, calc(100% - 48px))',
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
            DEBTSCOPE COUNTRY
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginTop: '12px',
            }}
          >
            <img
              src={getFlagUrl(country.code2)}
              alt={`${country.name} flag`}
              width="48"
              height="36"
              style={{
                objectFit: 'cover',
                borderRadius: '5px',
                border: '1px solid #1E3550',
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: '48px',
                lineHeight: 1.1,
              }}
            >
              {country.name}
            </h1>

            <span
              style={{
                color: '#71869C',
                fontSize: '14px',
                padding: '7px 11px',
                border: '1px solid #1E3550',
                borderRadius: '999px',
              }}
            >
              {country.code3}
            </span>
          </div>

          <p
            style={{
              marginTop: '14px',
              color: '#9FB3C8',
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '760px',
            }}
          >
            External debt intelligence based on official
            World Bank data.
          </p>
        </div>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginTop: '32px',
          }}
        >
          <SummaryCard
            title="External debt"
            value={formatDebt(latest.debt)}
            description={`Latest available observation: ${latest.year}`}
          />

          <SummaryCard
            title="External debt-to-GDP"
            value={formatRatio(latest.debtToGdp)}
            description="External debt ÷ GDP"
          />

          <SummaryCard
            title="YoY change"
            value={formatPercent(latest.yoyChange)}
            description="Compared with previous available observation"
          />

          <SummaryCard
            title="Data source"
            value="World Bank"
            description="Official indicator data"
          />
        </section>

        <DebtComparisonChart
          data={chartData}
          countries={[
            {
              code: country.code3,
              name: country.name,
            },
          ]}
        />

        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '28px',
          }}
        >
          <InfoCard
            title="What is external debt?"
            text="External debt is debt owed to non-resident creditors. DebtScope keeps external debt distinct from broader public or government debt concepts."
          />

          <InfoCard
            title="About the calculation"
            text="External debt-to-GDP is calculated from total external debt and GDP for the same year. Year-over-year change uses the immediately preceding available external-debt observation."
          />
        </section>

        <section
          style={{
            marginTop: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Link
            href={`/compare?countries=${country.code3},CHN`}
            style={{
              background: '#34D6E7',
              color: '#07111F',
              textDecoration: 'none',
              padding: '13px 20px',
              borderRadius: '11px',
              fontWeight: 700,
            }}
          >
            Compare this country
          </Link>

          <Link
            href="/"
            style={{
              background: '#0F1C2E',
              border: '1px solid #1E3550',
              color: '#FFFFFF',
              textDecoration: 'none',
              padding: '13px 20px',
              borderRadius: '11px',
            }}
          >
            Explore another country
          </Link>
        </section>

        <div
          style={{
            marginTop: '24px',
            color: '#71869C',
            fontSize: '13px',
            lineHeight: 1.6,
          }}
        >
          Source: World Bank. External debt stocks, total
          (current US$), indicator DT.DOD.DECT.CD; GDP
          (current US$), indicator NY.GDP.MKTP.CD.
        </div>
      </div>
    </main>
  )
}

function SummaryCard({
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
          fontSize: '27px',
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: '7px',
          color: '#71869C',
          fontSize: '13px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  )
}

function InfoCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div
      style={{
        background: '#0F1C2E',
        border: '1px solid #1E3550',
        borderRadius: '18px',
        padding: '24px',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '21px',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: '10px 0 0',
          color: '#9FB3C8',
          lineHeight: 1.7,
          fontSize: '14px',
        }}
      >
        {text}
      </p>
    </div>
  )
}