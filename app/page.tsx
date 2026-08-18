'use client'

import { useMemo, useState } from 'react'
import DebtTellerLogo from '../components/DebtScopeLogo'

type Language = 'en' | 'hi'

const countries = [
  {
    name: 'India',
    code: 'IND',
    flag: '🇮🇳',
    debt: '$620.7B',
    change: '+5.8%',
    coverage: 'Full',
    source: 'World Bank',
    year: 2023,
  },
  {
    name: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    debt: '$36.2T',
    change: '+4.2%',
    coverage: 'Full',
    source: 'World Bank',
    year: 2024,
  },
  {
    name: 'China',
    code: 'CHN',
    flag: '🇨🇳',
    debt: '$16.1T',
    change: '+3.6%',
    coverage: 'Full',
    source: 'World Bank',
    year: 2023,
  },
  {
    name: 'Japan',
    code: 'JPN',
    flag: '🇯🇵',
    debt: '$13.0T',
    change: '+1.9%',
    coverage: 'Full',
    source: 'World Bank',
    year: 2023,
  },
  {
    name: 'Germany',
    code: 'DEU',
    flag: '🇩🇪',
    debt: '$5.0T',
    change: '+2.8%',
    coverage: 'Partial',
    source: 'World Bank + IMF',
    year: 2023,
  },
  {
    name: 'United Kingdom',
    code: 'GBR',
    flag: '🇬🇧',
    debt: '$4.7T',
    change: '+3.1%',
    coverage: 'Full',
    source: 'World Bank',
    year: 2023,
  },
  {
    name: 'France',
    code: 'FRA',
    flag: '🇫🇷',
    debt: '$3.9T',
    change: '+2.4%',
    coverage: 'Partial',
    source: 'IMF',
    year: 2023,
  },
]

const rankings = countries.slice(1, 6)

const text = {
  en: {
    countries: 'Countries',
    compare: 'Compare',
    rankings: 'Rankings',
    insights: 'Insights',
    worldMap: 'World Map',

    eyebrow: 'GLOBAL DEBT INTELLIGENCE',
    heroTitle1: "Track the world's debt.",
    heroTitle2: 'Understand what it means.',
    heroDescription:
      'Explore external debt data, compare countries, and get plain-language insights — all in one place.',
    searchPlaceholder: 'Search any country...',
    exploreCountries: 'Explore countries',
    compareCountries: 'Compare two countries',

    indiaDebt: 'India external debt',
    globalDebt: 'Global external debt',
    countriesTracked: 'Countries tracked',
    dataRefresh: 'Data refresh',
    previewData: 'Preview data',
    dashboardPreview: 'Dashboard preview',
    latestAvailable: 'Latest available',
    worldwide: 'Worldwide',
    dataSourcePlanned: 'Data source planned',
    automatic: 'Automatic',
    ready: 'Ready',
    worldBankNext: 'World Bank API next',

    indiaFirst: 'INDIA FIRST',
    indiaSnapshot: 'India debt snapshot',
    viewCountry: 'View country',
    indiaExternalOverview: 'External debt overview',
    yearOverYear: 'year over year',
    illustrativeTrend: 'Illustrative 10-year trend',
    sourceConnection: 'Source connection next',
    debtToGdp: 'Debt-to-GDP',
    latestYear: 'Latest year',
    region: 'Region',
    southAsia: 'South Asia',

    debtScopeAI: 'DebtScope AI',
    aiTitle: 'Make the numbers easy to understand.',
    aiDescription:
      'Turn complex economic datasets into short, readable explanations — starting with English and Hindi.',
    insightOfDay: 'INSIGHT OF THE DAY',
    aiInsight:
      "India's external debt moved higher year over year.",
    aiPreview:
      'This is preview copy for the interface. Verified World Bank data and source citations will replace it.',
    explainHindi: 'Explain in हिन्दी',

    dataQuality: 'DATA QUALITY',
    dataAvailability: 'Data availability',
    dataAvailabilityDescription:
      'Filter countries by how usable and current their debt data is.',
    shown: 'shown',
    allCountries: 'All countries',
    fullCoverage: 'Full coverage',
    partialCoverage: 'Partial coverage',
    data2024: '2024+ data',
    country: 'Country',
    coverage: 'Coverage',
    source: 'Source',

    globalRankings: 'GLOBAL RANKINGS',
    topCountries: 'Top countries by external debt',
    viewAllRankings: 'View all rankings',
    externalDebt: 'External debt',

    worldView: 'WORLD VIEW',
    globalDebtMap: 'Global debt map',
    preview: 'Preview',
    lowerDebt: 'Lower debt',
    higherDebt: 'Higher debt',

    compareSection: 'COMPARE',
    indiaVsChina: 'India vs China',
    compareDescription:
      'See how two economies compare across the same debt indicators.',
    startComparison: 'Start comparison',

    footerNote:
      'Global debt intelligence, designed for clarity. Data integrations and source citations are coming next.',
    home: 'Home',
  },

  hi: {
    countries: 'देश',
    compare: 'तुलना',
    rankings: 'रैंकिंग',
    insights: 'जानकारियाँ',
    worldMap: 'विश्व मानचित्र',

    eyebrow: 'वैश्विक ऋण जानकारी',
    heroTitle1: 'दुनिया के ऋण को ट्रैक करें।',
    heroTitle2: 'समझें कि इसका क्या मतलब है।',
    heroDescription:
      'बाहरी ऋण के आंकड़े देखें, देशों की तुलना करें और आसान भाषा में जानकारी प्राप्त करें — सब एक ही जगह।',
    searchPlaceholder: 'किसी भी देश को खोजें...',
    exploreCountries: 'देश देखें',
    compareCountries: 'दो देशों की तुलना करें',

    indiaDebt: 'भारत का बाहरी ऋण',
    globalDebt: 'वैश्विक बाहरी ऋण',
    countriesTracked: 'ट्रैक किए गए देश',
    dataRefresh: 'डेटा अपडेट',
    previewData: 'पूर्वावलोकन डेटा',
    dashboardPreview: 'डैशबोर्ड पूर्वावलोकन',
    latestAvailable: 'नवीनतम उपलब्ध',
    worldwide: 'दुनियाभर में',
    dataSourcePlanned: 'डेटा स्रोत जल्द',
    automatic: 'स्वचालित',
    ready: 'तैयार',
    worldBankNext: 'World Bank API अगला',

    indiaFirst: 'पहले भारत',
    indiaSnapshot: 'भारत ऋण स्थिति',
    viewCountry: 'देश देखें',
    indiaExternalOverview: 'बाहरी ऋण का अवलोकन',
    yearOverYear: 'पिछले वर्ष की तुलना में',
    illustrativeTrend: '10 साल का उदाहरणात्मक रुझान',
    sourceConnection: 'डेटा कनेक्शन जल्द',
    debtToGdp: 'ऋण-से-GDP',
    latestYear: 'नवीनतम वर्ष',
    region: 'क्षेत्र',
    southAsia: 'दक्षिण एशिया',

    debtScopeAI: 'DebtScope AI',
    aiTitle: 'आंकड़ों को आसानी से समझें।',
    aiDescription:
      'जटिल आर्थिक आंकड़ों को छोटी और आसान भाषा में समझें — शुरुआत English और Hindi से।',
    insightOfDay: 'आज की जानकारी',
    aiInsight:
      'भारत का बाहरी ऋण पिछले वर्ष की तुलना में बढ़ा।',
    aiPreview:
      'यह इंटरफेस के लिए पूर्वावलोकन टेक्स्ट है। सत्यापित World Bank डेटा और स्रोत जल्द जोड़े जाएंगे।',
    explainHindi: 'हिन्दी में समझाएँ',

    dataQuality: 'डेटा गुणवत्ता',
    dataAvailability: 'डेटा उपलब्धता',
    dataAvailabilityDescription:
      'देशों को उनके डेटा की उपयोगिता और नवीनता के आधार पर फ़िल्टर करें।',
    shown: 'दिखाए गए',
    allCountries: 'सभी देश',
    fullCoverage: 'पूर्ण कवरेज',
    partialCoverage: 'आंशिक कवरेज',
    data2024: '2024+ डेटा',
    country: 'देश',
    coverage: 'कवरेज',
    source: 'स्रोत',

    globalRankings: 'वैश्विक रैंकिंग',
    topCountries: 'बाहरी ऋण के आधार पर शीर्ष देश',
    viewAllRankings: 'सभी रैंकिंग देखें',
    externalDebt: 'बाहरी ऋण',

    worldView: 'विश्व दृश्य',
    globalDebtMap: 'वैश्विक ऋण मानचित्र',
    preview: 'पूर्वावलोकन',
    lowerDebt: 'कम ऋण',
    higherDebt: 'अधिक ऋण',

    compareSection: 'तुलना',
    indiaVsChina: 'भारत बनाम चीन',
    compareDescription:
      'समान ऋण संकेतकों के आधार पर दो अर्थव्यवस्थाओं की तुलना करें।',
    startComparison: 'तुलना शुरू करें',

    footerNote:
      'वैश्विक ऋण जानकारी, स्पष्टता के लिए बनाई गई। डेटा इंटीग्रेशन और स्रोत जल्द जोड़े जाएंगे।',
    home: 'होम',
  },
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>('en')
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState<'all' | 'full' | 'partial' | 'verified'>('all')

  const t = text[language]

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return countries.filter((country) => {
      const matchesQuery =
        !normalized ||
        country.name.toLowerCase().includes(normalized)

      const matchesAvailability =
        availability === 'all' ||
        (availability === 'full' && country.coverage === 'Full') ||
        (availability === 'partial' && country.coverage === 'Partial') ||
        (availability === 'verified' && country.year >= 2024)

      return matchesQuery && matchesAvailability
    })
  }, [query, availability])

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* Language Switch Bar */}
      <div style={{ width: 'min(1180px, calc(100% - 40px))', margin: '14px auto 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="language-btn"
          type="button"
          aria-label="Language selector"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        >
          <span
            style={{
              fontWeight: language === 'en' ? 700 : 400,
              color: language === 'en' ? 'var(--text)' : 'var(--muted)',
            }}
          >
            EN
          </span>

          <span className="language-divider">/</span>

          <span
            style={{
              fontWeight: language === 'hi' ? 700 : 400,
              color: language === 'hi' ? 'var(--text)' : 'var(--muted)',
            }}
          >
            हिन्दी
          </span>
        </button>
      </div>

      <section className="hero" id="top" style={{ paddingTop: '20px' }}>
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> {t.eyebrow}
          </div>

          <h1 style={{ color: 'var(--text)' }}>
            {t.heroTitle1}
            <br />
            <span style={{ color: 'var(--muted)' }}>{t.heroTitle2}</span>
          </h1>

          <p>{t.heroDescription}</p>

          <div className="search-wrap">
            <SearchIcon />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />

            <kbd>⌘ K</kbd>
          </div>

          {(query || availability !== 'all') && (
            <div
              className="search-results"
              role="listbox"
              aria-label="Country search results"
            >
              {filtered.length > 0 ? (
                filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    className="result-row"
                    onClick={() => {
                      window.location.href = `/country/${country.code}`
                    }}
                  >
                    <span className="result-left">
                      <span className="result-flag">{country.flag}</span>
                      <span>{country.name}</span>
                    </span>

                    <span className="result-meta">
                      <span
                        className={`availability-dot availability-${country.coverage.toLowerCase()}`}
                      />
                      {country.coverage} · {country.year}
                    </span>
                  </button>
                ))
              ) : (
                <div className="empty-search">
                  {language === 'en'
                    ? 'No country matches this availability filter.'
                    : 'इस फ़िल्टर के लिए कोई देश नहीं मिला।'}
                </div>
              )}
            </div>
          )}

          <div className="hero-actions">
            <a className="primary-btn" href="#countries">
              {t.exploreCountries} <ArrowUpRight />
            </a>

            <a className="ghost-btn" href="/compare">
              {t.compareCountries}
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="globe-ring ring-one" />
          <div className="globe-ring ring-two" />

          <div className="globe-core">
            <div className="longitude long-one" />
            <div className="longitude long-two" />
            <div className="latitude lat-one" />
            <div className="latitude lat-two" />
            <div className="globe-shine" />
          </div>

          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit-dot dot-one" />
          <div className="orbit-dot dot-two" />
        </div>
      </section>

      <section className="stats-grid" aria-label="DebtScope overview">
        <article className="stat-card stat-primary">
          <span className="card-label">{t.indiaDebt}</span>
          <strong>$620.7B</strong>
          <div className="stat-foot">
            <span className="trend-up">+5.8% YoY</span>
            <span>{t.previewData}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="card-label">{t.globalDebt}</span>
          <strong>$98.4T</strong>
          <div className="stat-foot">
            <span className="soft-pill">{t.dashboardPreview}</span>
            <span>{t.latestAvailable}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="card-label">{t.countriesTracked}</span>
          <strong>200+</strong>
          <div className="stat-foot">
            <span className="soft-pill">{t.worldwide}</span>
            <span>{t.dataSourcePlanned}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="card-label">{t.dataRefresh}</span>
          <strong className="compact-value">{t.automatic}</strong>
          <div className="stat-foot">
            <span className="live-pill">
              <span className="live-dot" /> {t.ready}
            </span>
            <span>{t.worldBankNext}</span>
          </div>
        </article>
      </section>

      <section className="content-grid" id="countries">
        <article className="panel featured-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.indiaFirst}</span>
              <h2>{t.indiaSnapshot}</h2>
            </div>

            <a href="/country/IND" className="text-link">
              {t.viewCountry} <ArrowUpRight />
            </a>
          </div>

          <div className="india-main">
            <div>
              <div className="country-title">
                <span className="big-flag">🇮🇳</span>
                <div>
                  <strong>India</strong>
                  <span>{t.indiaExternalOverview}</span>
                </div>
              </div>

              <div className="big-number">$620.7B</div>

              <div className="big-number-meta">
                <span className="trend-up">+5.8%</span>
                <span>{t.yearOverYear}</span>
              </div>
            </div>

            <div
              className="mini-chart"
              aria-label="Illustrative debt trend chart"
            >
              <div className="chart-grid" />

              <svg
                viewBox="0 0 320 130"
                preserveAspectRatio="none"
                role="img"
                aria-label="Illustrative upward debt trend"
              >
                <defs>
                  <linearGradient
                    id="chartFill"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#34d6e7"
                      stopOpacity="0.28"
                    />
                    <stop
                      offset="100%"
                      stopColor="#34d6e7"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 108 C34 100 38 94 64 98 S108 83 132 88 S178 66 202 72 S245 52 268 61 S301 33 320 38 L320 130 L0 130 Z"
                  fill="url(#chartFill)"
                />

                <path
                  d="M0 108 C34 100 38 94 64 98 S108 83 132 88 S178 66 202 72 S245 52 268 61 S301 33 320 38"
                  fill="none"
                  stroke="#44d8e8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <div className="chart-caption">
                <span>{t.illustrativeTrend}</span>
                <span>{t.sourceConnection}</span>
              </div>
            </div>
          </div>

          <div className="metric-row">
            <div>
              <span>{t.debtToGdp}</span>
              <strong>19.3%</strong>
            </div>

            <div>
              <span>{t.latestYear}</span>
              <strong>2023</strong>
            </div>

            <div>
              <span>{t.region}</span>
              <strong>{t.southAsia}</strong>
            </div>
          </div>
        </article>

        <article className="panel ai-panel" id="insights">
          <div className="ai-badge">
            <span className="spark">✦</span> {t.debtScopeAI}
          </div>

          <h2>{t.aiTitle}</h2>
          <p>{t.aiDescription}</p>

          <div className="ai-card">
            <div className="ai-card-top">
              <span>{t.insightOfDay}</span>
              <span>{language === 'en' ? 'EN' : 'HI'}</span>
            </div>

            <strong>{t.aiInsight}</strong>
            <p>{t.aiPreview}</p>

            <button type="button" className="ai-link">
              {t.explainHindi} <ArrowUpRight />
            </button>
          </div>
        </article>
      </section>

      <section className="panel availability-panel" id="availability">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.dataQuality}</span>
            <h2>{t.dataAvailability}</h2>
            <p className="panel-subtitle">
              {t.dataAvailabilityDescription}
            </p>
          </div>

          <span className="coverage-count">
            {filtered.length} of {countries.length} {t.shown}
          </span>
        </div>

        <div
          className="availability-filter"
          role="group"
          aria-label="Data availability filter"
        >
          <button
            type="button"
            className={
              availability === 'all'
                ? 'filter-chip active'
                : 'filter-chip'
            }
            onClick={() => setAvailability('all')}
          >
            {t.allCountries}
          </button>

          <button
            type="button"
            className={
              availability === 'full'
                ? 'filter-chip active'
                : 'filter-chip'
            }
            onClick={() => setAvailability('full')}
          >
            {t.fullCoverage}
          </button>

          <button
            type="button"
            className={
              availability === 'partial'
                ? 'filter-chip active'
                : 'filter-chip'
            }
            onClick={() => setAvailability('partial')}
          >
            {t.partialCoverage}
          </button>

          <button
            type="button"
            className={
              availability === 'verified'
                ? 'filter-chip active'
                : 'filter-chip'
            }
            onClick={() => setAvailability('verified')}
          >
            {t.data2024}
          </button>
        </div>

        <div className="availability-table-wrap">
          <div className="availability-head">
            <span>{t.country}</span>
            <span>{t.coverage}</span>
            <span>{t.source}</span>
            <span>{t.latestYear}</span>
          </div>

          {filtered.map((country) => (
            <div className="availability-row" key={country.code}>
              <span className="availability-country">
                <span className="result-flag">{country.flag}</span>
                <strong>{country.name}</strong>
              </span>

              <span>
                <span
                  className={`coverage-badge coverage-${country.coverage.toLowerCase()}`}
                >
                  <i /> {country.coverage}
                </span>
              </span>

              <span className="source-name">{country.source}</span>
              <strong>{country.year}</strong>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="availability-empty">
              {language === 'en'
                ? 'No countries match the selected filter.'
                : 'इस फ़िल्टर के लिए कोई देश नहीं मिला।'}
            </div>
          )}
        </div>
      </section>

      <section className="panel rankings-panel" id="rankings">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.globalRankings}</span>
            <h2>{t.topCountries}</h2>
          </div>

          <a className="filter-btn" href="/rankings">
            {t.viewAllRankings} <span>→</span>
          </a>
        </div>

        <div className="table-wrap">
          <div className="table-head">
            <span>#</span>
            <span>{t.country}</span>
            <span>{t.externalDebt}</span>
            <span>YoY</span>
            <span />
          </div>

          {rankings.map((country, index) => (
            <div className="table-row" key={country.code}>
              <span className="rank-no">0{index + 1}</span>

              <span className="table-country">
                <span className="result-flag">{country.flag}</span>
                {country.name}
              </span>

              <strong>{country.debt}</strong>

              <span className="trend-up">{country.change}</span>

              <a
                className="row-arrow"
                href={`/country/${country.code}`}
                aria-label={`Open ${country.name}`}
              >
                <ArrowUpRight />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="content-grid bottom-grid" id="map">
        <article className="panel map-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.worldView}</span>
              <h2>{t.globalDebtMap}</h2>
            </div>

            <a
              className="preview-tag"
              href="/map"
              style={{ textDecoration: 'none' }}
            >
              {t.preview} →
            </a>
          </div>

          <div className="map-stage">
            <div className="map-grid" />
            <div className="continent continent-a" />
            <div className="continent continent-b" />
            <div className="continent continent-c" />
            <div className="map-pulse pulse-a" />
            <div className="map-pulse pulse-b" />
            <div className="map-pulse pulse-c" />

            <div className="map-legend">
              <span>
                <i className="low" /> {t.lowerDebt}
              </span>
              <span>
                <i className="high" /> {t.higherDebt}
              </span>
            </div>
          </div>
        </article>

        <article className="panel compare-panel" id="compare">
          <span className="section-kicker">{t.compareSection}</span>
          <h2>{t.indiaVsChina}</h2>
          <p>{t.compareDescription}</p>

          <div className="compare-box">
            <div className="compare-country">
              <span>🇮🇳</span>
              <strong>India</strong>
              <small>$620.7B</small>
            </div>

            <div className="vs-badge">VS</div>

            <div className="compare-country">
              <span>🇨🇳</span>
              <strong>China</strong>
              <small>$16.1T</small>
            </div>
          </div>

          <a
            className="primary-btn wide"
            href="/compare?countries=IND,CHN"
          >
            {t.startComparison} <ArrowUpRight />
          </a>
        </article>
      </section>

      <footer className="footer">
        <DebtTellerLogo />

        <div className="footer-note">{t.footerNote}</div>

        <div className="footer-links">
          <a href="#top">{t.home}</a>
          <a href="#countries">{t.countries}</a>
          <a href="#insights">{t.insights}</a>
          <a href="/compare">{t.compare}</a>
          <a href="/rankings">{t.rankings}</a>
        </div>
      </footer>
    </main>
  )
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M8 7h9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16 16 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}