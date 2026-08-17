import Link from 'next/link'
import { getExternalDebtRankings } from '../../lib/worldbank'
import DebtWorldMap from '../../components/DebtWorldMap'
import LanguageToggle from '../../components/LanguageToggle'
import T from '../../components/LocalizedText'

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
            DEBTSCOPE WORLD MAP
          </div>

          <h1
            style={{
              margin: '12px 0 0',
              fontSize: '48px',
              lineHeight: 1.1,
            }}
          >
            <T en="Global external debt" hi="वैश्विक बाहरी ऋण" />
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
            <T en="Explore the latest available external debt data across countries. Hover over a country and click to open its detailed DebtScope page." hi="देशों में नवीनतम उपलब्ध बाहरी ऋण डेटा देखें। किसी देश पर होवर करें और उसका विस्तृत DebtScope पेज खोलने के लिए क्लिक करें।" />
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
            title={<T en="Data source" hi="डेटा स्रोत" />}
            value="World Bank"
            description={<T en="External debt stocks, total" hi="कुल बाहरी ऋण स्टॉक" />}
          />

          <InfoCard
            title={<T en="Countries" hi="देश" />}
            value={String(mapCountries.length)}
            description={<T en="Countries with usable observations" hi="उपयोगी रिकॉर्ड वाले देश" />}
          />

          <InfoCard
            title={<T en="Metric" hi="मापदंड" />}
            value={<T en="External debt" hi="बाहरी ऋण" />}
            description={<T en="Current US dollars" hi="वर्तमान अमेरिकी डॉलर" />}
          />

          <InfoCard
            title={<T en="Update" hi="अपडेट" />}
            value={<T en="Automatic" hi="स्वचालित" />}
            description={<T en="Source data revalidated periodically" hi="स्रोत डेटा का समय-समय पर सत्यापन होता है" />}
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
  title: React.ReactNode
  value: React.ReactNode
  description: React.ReactNode
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

const languageToggleStyle: React.CSSProperties = {
  color: '#9FB3C8', background: 'transparent', border: '1px solid #1E3550', borderRadius: '999px', padding: '8px 12px', cursor: 'pointer',
}
