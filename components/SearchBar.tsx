'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { allCountries, findCountry } from '../lib/countries'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return []
    }

    return allCountries
      .filter(
        (country) =>
          country.name.toLowerCase().includes(normalized) ||
          country.code2.toLowerCase() === normalized ||
          country.code3.toLowerCase() === normalized
      )
      .slice(0, 8)
  }, [query])

  function handleSearch(countryName?: string) {
    const searchValue = countryName ?? query

    const country = findCountry(searchValue)

    if (!country) {
      return
    }

    router.push(`/country/${country.code3}`)
    setQuery(country.name)
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '640px',
        marginTop: '32px',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          placeholder="Search any country..."
          aria-label="Search any country"
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #1E3550',
            background: '#0F1C2E',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={() => handleSearch()}
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            border: 'none',
            background: '#34D6E7',
            color: '#07111F',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            zIndex: 20,
            background: '#0F1C2E',
            border: '1px solid #1E3550',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
          }}
        >
          {suggestions.map((country) => (
            <button
              key={country.code3}
              type="button"
              onClick={() => handleSearch(country.name)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: 'none',
                borderBottom: '1px solid #1E3550',
                background: 'transparent',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '20px' }}>{country.flag}</span>

              <span style={{ flex: 1 }}>
                {country.name}
              </span>

              <span
                style={{
                  color: '#9FB3C8',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {country.code3}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}