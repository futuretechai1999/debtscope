import Link from 'next/link'
import { getExternalDebtRankings } from '../../lib/worldbank'
import { allCountries } from '../../lib/countries'
import LanguageToggle from '../../components/LanguageToggle'
import T from '../../components/LocalizedText'

function formatDebt(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }

  return `$${value.toLocaleString()}`
}

function getCountryMeta(code3: string) {
  return allCountries.find(
    (country) =>
      country.code3.toUpperCase() === code3.toUpperCase()
  )
}

function getFlagUrl(code3: string) {
  const country = getCountryMeta(code3)

  if (!country) {
    return null
  }

  return `https://flagcdn.com/32x24/${country.code2.toLowerCase()}.png`
}

export default async function RankingsPage() {
  const rankings = await getExternalDebtRankings(25)

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#34D6E7', textDecoration: 'none', fontSize: '15px' }}>
            ← <T en="Back to home" hi="होम पर वापस जाएँ" />
          </Link>
          <LanguageToggle style={languageToggleStyle} />
        </div>

        <div style={{ marginTop: '38px' }}>
          <div
            style={{
              color: '#34D6E7',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1.5px',
            }}
          >
            DEBTSCOPE RANKINGS
          </div>

          <h1
            style={{
              margin: '12px 0 0',
              fontSize: '48px',
              lineHeight: 1.1,
            }}
          >
            <T en="Countries by external debt" hi="बाहरी ऋण के आधार पर देश" />
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
            <T en="Countries ranked by their latest available total external debt reported by the World Bank." hi="World Bank द्वारा रिपोर्ट किए गए नवीनतम कुल बाहरी ऋण के आधार पर देशों की रैंकिंग।" />
          </p>
        </div>

        <section
          style={{
            marginTop: '32px',
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
            <div
              style={{
                color: '#9FB3C8',
                fontSize: '14px',
              }}
            >
              <T en="Latest available World Bank observation" hi="World Bank का नवीनतम उपलब्ध रिकॉर्ड" />
            </div>

            <div
              style={{
                marginTop: '6px',
                color: '#71869C',
                fontSize: '13px',
              }}
            >
              <T en="Ranking is recalculated from source data." hi="रैंकिंग स्रोत डेटा से फिर से गणना की जाती है।" />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '720px',
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}><T en="Rank" hi="रैंक" /></th>
                  <th style={headerStyle}><T en="Country" hi="देश" /></th>
                  <th style={headerStyle}><T en="External debt" hi="बाहरी ऋण" /></th>
                  <th style={headerStyle}><T en="Latest year" hi="नवीनतम वर्ष" /></th>
                </tr>
              </thead>

              <tbody>
                {rankings.map((country, index) => {
                  const flagUrl = getFlagUrl(
                    country.countryCode
                  )

                  const countryMeta = getCountryMeta(
                    country.countryCode
                  )

                  return (
                    <tr key={country.countryCode}>
                      <td style={cellStyle}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: '#17283D',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color:
                              index < 3
                                ? '#FFD54D'
                                : '#9FB3C8',
                          }}
                        >
                          {index + 1}
                        </div>
                      </td>

                      <td style={cellStyle}>
                        <Link
                          href={`/country/${country.countryCode}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontWeight: 700,
                          }}
                        >
                          {flagUrl ? (
                            <img
                              src={flagUrl}
                              alt={`${country.countryName} flag`}
                              width="32"
                              height="24"
                              style={{
                                width: '32px',
                                height: '24px',
                                objectFit: 'cover',
                                borderRadius: '3px',
                                border:
                                  '1px solid #1E3550',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '32px',
                                height: '24px',
                                borderRadius: '3px',
                                background: '#17283D',
                                border:
                                  '1px solid #1E3550',
                                flexShrink: 0,
                              }}
                            />
                          )}

                          <div>
                            <div>
                              {countryMeta?.name ??
                                country.countryName}
                            </div>

                            <div
                              style={{
                                marginTop: '3px',
                                color: '#71869C',
                                fontSize: '12px',
                                fontWeight: 400,
                              }}
                            >
                              {country.countryCode}
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          fontSize: '18px',
                          fontWeight: 700,
                        }}
                      >
                        {formatDebt(country.value)}
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          color: '#9FB3C8',
                        }}
                      >
                        {country.year}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
          Source: World Bank — External debt stocks,
          total (current US$), indicator DT.DOD.DECT.CD.
        </div>
      </div>
    </main>
  )
}

const headerStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '16px 24px',
  color: '#9FB3C8',
  fontSize: '14px',
  borderBottom: '1px solid #1E3550',
  whiteSpace: 'nowrap',
}

const cellStyle: React.CSSProperties = {
  padding: '18px 24px',
  borderBottom: '1px solid #1E3550',
}

const languageToggleStyle: React.CSSProperties = {
  color: '#9FB3C8', background: 'transparent', border: '1px solid #1E3550', borderRadius: '999px', padding: '8px 12px', cursor: 'pointer',
}
