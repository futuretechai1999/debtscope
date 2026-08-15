import Link from 'next/link'
import {
  getCompareData,
  type CompareObservation,
} from '../../lib/worldbank'
import { allCountries } from '../../lib/countries'
import DebtComparisonChart from '../../components/DebtComparisonChart'

function formatDebt(value: number | null) {
  if (value === null) return 'Unavailable'

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }

  return `$${(value / 1_000_000_000).toFixed(2)}B`
}

function formatPercent(value: number | null) {
  if (value === null) return 'Unavailable'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatRatio(value: number | null) {
  if (value === null) return 'Unavailable'
  return `${value.toFixed(2)}%`
}

function getCountryName(code: string) {
  const country = allCountries.find(
    (item) => item.code3.toUpperCase() === code.toUpperCase()
  )

  return country?.name ?? code
}

type ComparePageProps = {
  searchParams: Promise<{
    countries?: string
  }>
}

type CountryResult = {
  code: string
  name: string
  history: CompareObservation[]
  latest: CompareObservation | null
}

export default async function ComparePage({
  searchParams,
}: ComparePageProps) {
  const params = await searchParams

  const requestedCodes = params.countries
    ? params.countries
        .split(',')
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean)
    : ['IND', 'CHN']

  const countryCodes = Array.from(new Set(requestedCodes)).slice(0, 4)

  if (countryCodes.length < 2) {
    countryCodes.push('CHN')
  }

  const results: CountryResult[] = await Promise.all(
    countryCodes.map(async (code) => {
      const history = await getCompareData(code)

      const latest =
        history.length > 0
          ? history.reduce((latestItem, currentItem) =>
              currentItem.year > latestItem.year
                ? currentItem
                : latestItem
            )
          : null

      return {
        code,
        name: getCountryName(code),
        history,
        latest,
      }
    })
  )

  const validResults = results.filter(
    (country) => country.latest !== null
  )

  const sortedByDebt = [...validResults].sort(
    (a, b) =>
      (b.latest?.debt ?? 0) - (a.latest?.debt ?? 0)
  )

  const highestDebt = sortedByDebt[0] ?? null
  const lowestDebt =
    sortedByDebt[sortedByDebt.length - 1] ?? null

  const latestYears = validResults
    .map((country) => country.latest?.year ?? 0)
    .filter((year) => year > 0)

  const latestYear =
    latestYears.length > 0
      ? Math.max(...latestYears)
      : null

  const chartYears = Array.from(
    new Set(
      results.flatMap((country) =>
        country.history
          .map((item) => item.year)
          .filter((year) => year >= 2015)
      )
    )
  ).sort((a, b) => a - b)

  const chartData = chartYears.map((year) => {
    const row: {
      year: number
      [key: string]: number | null
    } = { year }

    for (const country of results) {
      const observation = country.history.find(
        (item) => item.year === year
      )

      row[country.code] = observation?.debt ?? null
    }

    return row
  })

  const chartCountries = results.map((country) => ({
    code: country.code,
    name: country.name,
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
              fontWeight: '700',
              letterSpacing: '1.5px',
              marginBottom: '12px',
            }}
          >
            DEBTSCOPE COMPARE
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '48px',
              lineHeight: 1.1,
            }}
          >
            Compare countries
          </h1>

          <p
            style={{
              marginTop: '14px',
              color: '#9FB3C8',
              fontSize: '18px',
              lineHeight: 1.6,
              maxWidth: '760px',
            }}
          >
            Compare external debt, debt-to-GDP, and
            year-over-year movement using official
            World Bank data.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '28px',
          }}
        >
          <Link
            href="/compare?countries=IND,CHN"
            style={pillStyle}
          >
            India vs China
          </Link>

          <Link
            href="/compare?countries=IND,CHN,BRA"
            style={pillStyle}
          >
            India vs China vs Brazil
          </Link>

          <Link
            href="/compare?countries=IND,CHN,USA"
            style={pillStyle}
          >
            India vs China vs USA
          </Link>

          <Link
            href="/compare?countries=IND,CHN,BRA,USA"
            style={pillStyle}
          >
            Four countries
          </Link>
        </div>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(215px, 1fr))',
            gap: '16px',
            marginTop: '32px',
          }}
        >
          <SummaryCard
            title="Countries compared"
            value={String(results.length)}
            description="Maximum four countries"
          />

          <SummaryCard
            title="Highest external debt"
            value={
              highestDebt
                ? highestDebt.name
                : 'Unavailable'
            }
            description={
              highestDebt?.latest
                ? formatDebt(highestDebt.latest.debt)
                : 'No usable data'
            }
          />

          <SummaryCard
            title="Latest data year"
            value={
              latestYear ? String(latestYear) : 'N/A'
            }
            description="Latest available observation"
          />

          <SummaryCard
            title="Data source"
            value="World Bank"
            description="Official indicator data"
          />
        </section>

        <section
          style={{
            marginTop: '28px',
            background: '#0F1C2E',
            border: '1px solid #1E3550',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '22px 24px',
              borderBottom: '1px solid #1E3550',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '23px' }}>
              Debt comparison
            </h2>

            <p
              style={{
                margin: '7px 0 0',
                color: '#9FB3C8',
              }}
            >
              Latest available observation for each
              selected country.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '900px',
              }}
            >
              <thead>
                <tr>
                  <TableHeader>Country</TableHeader>
                  <TableHeader>External debt</TableHeader>
                  <TableHeader>Debt-to-GDP</TableHeader>
                  <TableHeader>YoY change</TableHeader>
                  <TableHeader>Latest year</TableHeader>
                </tr>
              </thead>

              <tbody>
                {results.map((country) => {
                  const latest = country.latest

                  return (
                    <tr key={country.code}>
                      <td style={cellStyle}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '17px',
                          }}
                        >
                          {country.name}
                        </div>

                        <div
                          style={{
                            marginTop: '4px',
                            color: '#71869C',
                            fontSize: '12px',
                          }}
                        >
                          {country.code}
                        </div>
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          fontSize: '18px',
                          fontWeight: 700,
                        }}
                      >
                        {latest
                          ? formatDebt(latest.debt)
                          : 'Unavailable'}
                      </td>

                      <td style={cellStyle}>
                        {latest
                          ? formatRatio(
                              latest.debtToGdp
                            )
                          : 'Unavailable'}
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          color:
                            latest?.yoyChange !== null &&
                            latest?.yoyChange !== undefined
                              ? latest.yoyChange > 0
                                ? '#F59E0B'
                                : '#34D399'
                              : '#9FB3C8',
                        }}
                      >
                        {latest
                          ? formatPercent(
                              latest.yoyChange
                            )
                          : 'Unavailable'}
                      </td>

                      <td style={cellStyle}>
                        {latest?.year ?? 'N/A'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <DebtComparisonChart
          data={chartData}
          countries={chartCountries}
        />

        <section
          style={{
            marginTop: '28px',
            background: '#0F1C2E',
            border: '1px solid #1E3550',
            borderRadius: '20px',
            padding: '24px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
            }}
          >
            What the numbers show
          </h2>

          <p
            style={{
              margin: '12px 0 0',
              color: '#9FB3C8',
              lineHeight: 1.7,
            }}
          >
            {highestDebt && lowestDebt
              ? `${highestDebt.name} has the highest reported external debt among the selected countries, while ${lowestDebt.name} has the lowest. This comparison uses the latest available observations from the World Bank.`
              : 'There is not enough available data to generate a comparison summary.'}
          </p>

          <div
            style={{
              marginTop: '16px',
              color: '#71869C',
              fontSize: '13px',
              lineHeight: 1.6,
            }}
          >
            Debt-to-GDP is calculated by dividing total
            external debt by GDP for the same year.
            YoY change compares the latest external-debt
            observation with the immediately preceding
            available observation.
          </div>
        </section>

        <div
          style={{
            marginTop: '18px',
            color: '#71869C',
            fontSize: '13px',
            lineHeight: 1.6,
          }}
        >
          Source: World Bank. External debt stocks,
          total (DOD, current US$), indicator
          DT.DOD.DECT.CD; GDP (current US$), indicator
          NY.GDP.MKTP.CD.
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

function TableHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '16px 24px',
        color: '#9FB3C8',
        fontSize: '14px',
        borderBottom: '1px solid #1E3550',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  )
}
const pillStyle: React.CSSProperties = {
  background: '#0F1C2E',
  border: '1px solid #1E3550',
  color: '#FFFFFF',
  textDecoration: 'none',
  padding: '10px 16px',
  borderRadius: '999px',
  fontSize: '14px',
}
const cellStyle: React.CSSProperties = {
  padding: '18px 24px',
  borderBottom: '1px solid #1E3550',
  color: '#FFFFFF',
}