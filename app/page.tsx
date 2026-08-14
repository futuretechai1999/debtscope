'use client'

import { useMemo, useState } from 'react'

const countries = [
  { name: 'India', code: 'IN', flag: '🇮🇳', debt: '$620.7B', change: '+5.8%', coverage: 'Full', source: 'World Bank', year: 2023 },
  { name: 'United States', code: 'US', flag: '🇺🇸', debt: '$36.2T', change: '+4.2%', coverage: 'Full', source: 'World Bank', year: 2024 },
  { name: 'China', code: 'CN', flag: '🇨🇳', debt: '$16.1T', change: '+3.6%', coverage: 'Full', source: 'World Bank', year: 2023 },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', debt: '$13.0T', change: '+1.9%', coverage: 'Full', source: 'World Bank', year: 2023 },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', debt: '$5.0T', change: '+2.8%', coverage: 'Partial', source: 'World Bank + IMF', year: 2023 },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', debt: '$4.7T', change: '+3.1%', coverage: 'Full', source: 'World Bank', year: 2023 },
  { name: 'France', code: 'FR', flag: '🇫🇷', debt: '$3.9T', change: '+2.4%', coverage: 'Partial', source: 'IMF', year: 2023 },
]

const rankings = countries.slice(1, 6)

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState<'all' | 'full' | 'partial' | 'verified'>('all')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return countries.filter((country) => {
      const matchesQuery = !normalized || country.name.toLowerCase().includes(normalized)
      const matchesAvailability = availability === 'all'
        || (availability === 'full' && country.coverage === 'Full')
        || (availability === 'partial' && country.coverage === 'Partial')
        || (availability === 'verified' && country.year >= 2024)
      return matchesQuery && matchesAvailability
    })
  }, [query, availability])

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="nav-wrap">
        <a href="#top" className="brand" aria-label="DebtScope home">
          <span className="brand-mark"><span /></span>
          <span>Debt<span>Scope</span></span>
        </a>

        <div className="nav-links">
          <a href="#countries">Countries</a>
          <a href="#compare">Compare</a>
          <a href="#rankings">Rankings</a>
          <a href="#insights">Insights</a>
          <a href="#map">World Map</a>
        </div>

        <button className="language-btn" type="button" aria-label="Language selector">
          <span>EN</span>
          <span className="language-divider">/</span>
          <span>हिन्दी</span>
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> GLOBAL DEBT INTELLIGENCE</div>
          <h1>Track the world&apos;s debt.<br /><span>Understand what it means.</span></h1>
          <p>
            Explore external debt data, compare countries, and get plain-language insights — all in one place.
          </p>

          <div className="search-wrap">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search any country..."
              aria-label="Search any country"
            />
            <kbd>⌘ K</kbd>
          </div>

          {(query || availability !== 'all') && (
            <div className="search-results" role="listbox" aria-label="Country search results">
              {filtered.length > 0 ? filtered.map((country) => (
                <button key={country.code} type="button" className="result-row">
                  <span className="result-left"><span className="result-flag">{country.flag}</span><span>{country.name}</span></span>
                  <span className="result-meta"><span className={`availability-dot availability-${country.coverage.toLowerCase()}`} />{country.coverage} · {country.year}</span>
                </button>
              )) : <div className="empty-search">No country matches this availability filter.</div>}
            </div>
          )}

          <div className="hero-actions">
            <a className="primary-btn" href="#countries">Explore countries <ArrowUpRight /></a>
            <a className="ghost-btn" href="#compare">Compare two countries</a>
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
          <span className="card-label">India external debt</span>
          <strong>$620.7B</strong>
          <div className="stat-foot"><span className="trend-up">+5.8% YoY</span><span>Preview data</span></div>
        </article>
        <article className="stat-card">
          <span className="card-label">Global external debt</span>
          <strong>$98.4T</strong>
          <div className="stat-foot"><span className="soft-pill">Dashboard preview</span><span>Latest available</span></div>
        </article>
        <article className="stat-card">
          <span className="card-label">Countries tracked</span>
          <strong>200+</strong>
          <div className="stat-foot"><span className="soft-pill">Worldwide</span><span>Data source planned</span></div>
        </article>
        <article className="stat-card">
          <span className="card-label">Data refresh</span>
          <strong className="compact-value">Automatic</strong>
          <div className="stat-foot"><span className="live-pill"><span className="live-dot" /> Ready</span><span>World Bank API next</span></div>
        </article>
      </section>

      <section className="content-grid" id="countries">
        <article className="panel featured-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">INDIA FIRST</span>
              <h2>India debt snapshot</h2>
            </div>
            <a href="#compare" className="text-link">View country <ArrowUpRight /></a>
          </div>

          <div className="india-main">
            <div>
              <div className="country-title"><span className="big-flag">🇮🇳</span><div><strong>India</strong><span>External debt overview</span></div></div>
              <div className="big-number">$620.7B</div>
              <div className="big-number-meta"><span className="trend-up">+5.8%</span><span>year over year</span></div>
            </div>
            <div className="mini-chart" aria-label="Illustrative debt trend chart">
              <div className="chart-grid" />
              <svg viewBox="0 0 320 130" preserveAspectRatio="none" role="img" aria-label="Illustrative upward debt trend">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#34d6e7" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#34d6e7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 108 C34 100 38 94 64 98 S108 83 132 88 S178 66 202 72 S245 52 268 61 S301 33 320 38 L320 130 L0 130 Z" fill="url(#chartFill)" />
                <path d="M0 108 C34 100 38 94 64 98 S108 83 132 88 S178 66 202 72 S245 52 268 61 S301 33 320 38" fill="none" stroke="#44d8e8" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="chart-caption"><span>Illustrative 10-year trend</span><span>Source connection next</span></div>
            </div>
          </div>

          <div className="metric-row">
            <div><span>Debt-to-GDP</span><strong>19.3%</strong></div>
            <div><span>Latest year</span><strong>2023</strong></div>
            <div><span>Region</span><strong>South Asia</strong></div>
          </div>
        </article>

        <article className="panel ai-panel" id="insights">
          <div className="ai-badge"><span className="spark">✦</span> DebtScope AI</div>
          <h2>Make the numbers easy to understand.</h2>
          <p>
            Turn complex economic datasets into short, readable explanations — starting with English and Hindi.
          </p>
          <div className="ai-card">
            <div className="ai-card-top"><span>INSIGHT OF THE DAY</span><span>EN</span></div>
            <strong>India&apos;s external debt moved higher year over year.</strong>
            <p>This is preview copy for the interface. Verified World Bank data and source citations will replace it.</p>
            <button type="button" className="ai-link">Explain in हिन्दी <ArrowUpRight /></button>
          </div>
        </article>
      </section>

      <section className="panel availability-panel" id="availability">
        <div className="section-heading">
          <div>
            <span className="section-kicker">DATA QUALITY</span>
            <h2>Data availability</h2>
            <p className="panel-subtitle">Filter countries by how usable and current their debt data is.</p>
          </div>
          <span className="coverage-count">{filtered.length} of {countries.length} shown</span>
        </div>

        <div className="availability-filter" role="group" aria-label="Data availability filter">
          <button type="button" className={availability === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => setAvailability('all')}>All countries</button>
          <button type="button" className={availability === 'full' ? 'filter-chip active' : 'filter-chip'} onClick={() => setAvailability('full')}>Full coverage</button>
          <button type="button" className={availability === 'partial' ? 'filter-chip active' : 'filter-chip'} onClick={() => setAvailability('partial')}>Partial coverage</button>
          <button type="button" className={availability === 'verified' ? 'filter-chip active' : 'filter-chip'} onClick={() => setAvailability('verified')}>2024+ data</button>
        </div>

        <div className="availability-table-wrap">
          <div className="availability-head"><span>Country</span><span>Coverage</span><span>Source</span><span>Latest year</span></div>
          {filtered.map((country) => (
            <div className="availability-row" key={country.code}>
              <span className="availability-country"><span className="result-flag">{country.flag}</span><strong>{country.name}</strong></span>
              <span><span className={`coverage-badge coverage-${country.coverage.toLowerCase()}`}><i />{country.coverage}</span></span>
              <span className="source-name">{country.source}</span>
              <strong>{country.year}</strong>
            </div>
          ))}
          {filtered.length === 0 && <div className="availability-empty">No countries match the selected filter.</div>}
        </div>
      </section>

      <section className="panel rankings-panel" id="rankings">
        <div className="section-heading">
          <div>
            <span className="section-kicker">GLOBAL RANKINGS</span>
            <h2>Top countries by external debt</h2>
          </div>
          <button className="filter-btn" type="button">External debt <span>⌄</span></button>
        </div>
        <div className="table-wrap">
          <div className="table-head"><span>#</span><span>Country</span><span>External debt</span><span>YoY</span><span /></div>
          {rankings.map((country, index) => (
            <div className="table-row" key={country.code}>
              <span className="rank-no">0{index + 1}</span>
              <span className="table-country"><span className="result-flag">{country.flag}</span>{country.name}</span>
              <strong>{country.debt}</strong>
              <span className="trend-up">{country.change}</span>
              <button className="row-arrow" type="button" aria-label={`Open ${country.name}`}><ArrowUpRight /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="content-grid bottom-grid" id="map">
        <article className="panel map-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WORLD VIEW</span>
              <h2>Global debt map</h2>
            </div>
            <span className="preview-tag">Preview</span>
          </div>
          <div className="map-stage">
            <div className="map-grid" />
            <div className="continent continent-a" />
            <div className="continent continent-b" />
            <div className="continent continent-c" />
            <div className="map-pulse pulse-a" />
            <div className="map-pulse pulse-b" />
            <div className="map-pulse pulse-c" />
            <div className="map-legend"><span><i className="low" /> Lower debt</span><span><i className="high" /> Higher debt</span></div>
          </div>
        </article>

        <article className="panel compare-panel" id="compare">
          <span className="section-kicker">COMPARE</span>
          <h2>India vs China</h2>
          <p>See how two economies compare across the same debt indicators.</p>
          <div className="compare-box">
            <div className="compare-country"><span>🇮🇳</span><strong>India</strong><small>$620.7B</small></div>
            <div className="vs-badge">VS</div>
            <div className="compare-country"><span>🇨🇳</span><strong>China</strong><small>$16.1T</small></div>
          </div>
          <button className="primary-btn wide" type="button">Start comparison <ArrowUpRight /></button>
        </article>
      </section>

      <footer className="footer">
        <div className="brand footer-brand"><span className="brand-mark"><span /></span><span>Debt<span>Scope</span></span></div>
        <div className="footer-note">Global debt intelligence, designed for clarity. Data integrations and source citations are coming next.</div>
        <div className="footer-links"><a href="#top">Home</a><a href="#countries">Countries</a><a href="#insights">Insights</a><a href="#compare">Compare</a></div>
      </footer>
    </main>
  )
}
