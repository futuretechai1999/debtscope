import Link from 'next/link'
import { getLatestExternalDebt } from '../../lib/worldbank'

type ComparePageProps = {
  searchParams: Promise<{ countries?: string }>
}

const COUNTRY_NAMES: Record<string, string> = {
  IND: 'India',
  CHN: 'China',
  USA: 'United States',
  BRA: 'Brazil',
}

function formatDebt(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }
  return `$${(value / 1_000_000_000).toFixed(2)}B`
}

export default async function ComparePage({
  searchParams,
}: ComparePageProps) {
  const params = await searchParams

  const countryCodes =
    params.countries
      ?.split(',')
      .map((code) => code.trim().toUpperCase())
      .filter(Boolean)
      .slice(0, 4) ?? ['IND', 'CHN']

  const results = await Promise.all(
    countryCodes.map(async (code) => ({
      code,
      name: COUNTRY_NAMES[code] ?? code,
      data: await getLatestExternalDebt(code),
    }))
  )

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#07111F',
        color: 'white',
        padding: '48px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Link
          href="/"
          style={{
            color: '#34D6E7',
            textDecoration: 'none',
            marginBottom: '24px',
            display: 'inline-block',
          }}
        >
          ← Back to home
        </Link>

        <h1 style={{ fontSize: '42px', marginBottom: '12px' }}>
          Compare countries
        </h1>

        <p style={{ color: '#9FB3C8', marginBottom: '32px' }}>
          Live World Bank external debt comparison
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: '#0F1C2E',
              border: '1px solid #1E3550',
              borderRadius: '18px',
              padding: '22px',
            }}
          >
            <div style={{ color: '#9FB3C8' }}>Countries compared</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>
              {countryCodes.length}
            </div>
          </div>

          <div
            style={{
              background: '#0F1C2E',
              border: '1px solid #1E3550',
              borderRadius: '18px',
              padding: '22px',
            }}
          >
            <div style={{ color: '#9FB3C8' }}>Primary country</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>
              {results[0]?.name ?? 'N/A'}
            </div>
          </div>

          <div
            style={{
              background: '#0F1C2E',
              border: '1px solid #1E3550',
              borderRadius: '18px',
              padding: '22px',
            }}
          >
            <div style={{ color: '#9FB3C8' }}>Latest year</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>
              {results[0]?.data?.year ?? 'N/A'}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#0F1C2E',
            border: '1px solid #1E3550',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#12243A' }}>
                <th style={{ textAlign: 'left', padding: '18px', color: '#9FB3C8' }}>
                  Country
                </th>
                <th style={{ textAlign: 'left', padding: '18px', color: '#9FB3C8' }}>
                  External debt
                </th>
                <th style={{ textAlign: 'left', padding: '18px', color: '#9FB3C8' }}>
                  Latest year
                </th>
              </tr>
            </thead>

            <tbody>
              {results.map(({ code, name, data }) => (
                <tr key={code} style={{ borderTop: '1px solid #1E3550' }}>
                  <td style={{ padding: '20px 18px' }}>
                    <strong>{name}</strong>
                  </td>

                  <td style={{ padding: '20px 18px' }}>
                    {data ? formatDebt(data.value) : 'Unavailable'}
                  </td>

                  <td style={{ padding: '20px 18px' }}>
                    {data?.year ?? 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: '#7E93AA', marginTop: '20px', fontSize: '14px' }}>
          Source: World Bank external debt indicator (DT.DOD.DECT.CD)
        </p>
      </div>
    </main>
  )
}