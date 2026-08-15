import { getLatestExternalDebt } from '../../../lib/worldbank'

function formatBillions(value: number) {
  return `$${(value / 1_000_000_000).toFixed(2)}B`
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  const countryCode = code.toUpperCase()
  const debt = await getLatestExternalDebt(countryCode)

  return (
    <main style={{
      background: '#07111F',
      color: 'white',
      minHeight: '100vh',
      padding: '48px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <a
        href="/"
        style={{
          color: '#34D6E7',
          textDecoration: 'none'
        }}
      >
        ← Back to DebtScope
      </a>

      <h1 style={{
        fontSize: '56px',
        marginTop: '24px',
        marginBottom: '32px'
      }}>
        {countryCode}
      </h1>

      <div style={{
        background: '#0F1C2E',
        border: '1px solid #1E3550',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '520px'
      }}>
        <div style={{ color: '#9FB3C8' }}>
          External debt
        </div>

        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginTop: '12px'
        }}>
          {debt ? formatBillions(debt.value) : 'Unavailable'}
        </div>

        <div style={{
          marginTop: '12px',
          color: '#34D399'
        }}>
          Latest available year: {debt?.year ?? 'N/A'}
        </div>

        <div style={{
          marginTop: '20px',
          color: '#9FB3C8'
        }}>
          Source: World Bank
        </div>
      </div>
    </main>
  )
}