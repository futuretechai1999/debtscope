'use client'

import { useMemo, useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import worldCountries from 'world-countries'

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type CountryMapData = {
  code: string
  name: string
  value: number | null
  year: number | null
}

type DebtWorldMapProps = {
  countries: CountryMapData[]
}

type TooltipState = {
  visible: boolean
  x: number
  y: number
  name: string
  code: string
  value: number | null
  year: number | null
  hasData: boolean
}

type GeoProperties = {
  name?: string
  NAME?: string
  NAME_LONG?: string
  ISO_A3?: string
  ADM0_A3?: string
  ISO_A3_EH?: string
}

function formatDebt(value: number | null) {
  if (value === null) {
    return 'Data unavailable'
  }

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

function getDebtIntensity(value: number | null) {
  if (value === null) return 0

  if (value >= 1_000_000_000_000) return 4
  if (value >= 250_000_000_000) return 3
  if (value >= 50_000_000_000) return 2
  if (value >= 10_000_000_000) return 1

  return 0
}

function getFill(value: number | null) {
  const intensity = getDebtIntensity(value)

  if (intensity === 4) return '#FF8A00'
  if (intensity === 3) return '#FFB000'
  if (intensity === 2) return '#FFD54D'
  if (intensity === 1) return '#34D6E7'

  // Country exists, but selected data is unavailable.
  return '#24384F'
}

function normalizeNumericCode(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return ''
  }

  return String(value).padStart(3, '0')
}

function normalizeIso3(value: unknown) {
  if (!value) return ''

  const code = String(value).toUpperCase()

  if (code.length !== 3) return ''

  return code
}

function getCountryByIso3(iso3: string) {
  if (!iso3) return null

  return (
    worldCountries.find(
      (country) =>
        country.cca3?.toUpperCase() === iso3
    ) ?? null
  )
}

function getCountryByNumericCode(code: string) {
  if (!code) return null

  return (
    worldCountries.find(
      (country) =>
        normalizeNumericCode(country.ccn3) === code
    ) ?? null
  )
}

function getCountryFromGeo(
  properties: GeoProperties,
  geoId: unknown
) {
  // 1. Try ISO-3 values supplied by the map geometry.
  const isoCandidates = [
    properties.ISO_A3,
    properties.ADM0_A3,
    properties.ISO_A3_EH,
  ]

  for (const candidate of isoCandidates) {
    const iso3 = normalizeIso3(candidate)

    if (!iso3 || iso3 === '-99') {
      continue
    }

    const country = getCountryByIso3(iso3)

    if (country) {
      return country
    }
  }

  // 2. Fallback to the numeric country ID.
  const numericCode = normalizeNumericCode(geoId)

  return getCountryByNumericCode(numericCode)
}

function buildDataLookup(
  countries: CountryMapData[]
) {
  const byIso3 = new Map<
    string,
    CountryMapData
  >()

  const byNumeric = new Map<
    string,
    CountryMapData
  >()

  for (const country of countries) {
    const iso3 = normalizeIso3(country.code)

    if (iso3) {
      byIso3.set(iso3, country)
    }

    const worldCountry =
      getCountryByIso3(iso3)

    if (worldCountry?.ccn3) {
      byNumeric.set(
        normalizeNumericCode(worldCountry.ccn3),
        country
      )
    }
  }

  return {
    byIso3,
    byNumeric,
  }
}

export default function DebtWorldMap({
  countries,
}: DebtWorldMapProps) {
  const dataLookup = useMemo(
    () => buildDataLookup(countries),
    [countries]
  )

  const [tooltip, setTooltip] =
    useState<TooltipState>({
      visible: false,
      x: 0,
      y: 0,
      name: '',
      code: '',
      value: null,
      year: null,
      hasData: false,
    })

  function findDataForGeo(
    properties: GeoProperties,
    geoId: unknown
  ) {
    // First: match via map's ISO-3 property.
    const isoCandidates = [
      properties.ISO_A3,
      properties.ADM0_A3,
      properties.ISO_A3_EH,
    ]

    for (const candidate of isoCandidates) {
      const iso3 = normalizeIso3(candidate)

      if (!iso3 || iso3 === '-99') {
        continue
      }

      const data = dataLookup.byIso3.get(iso3)

      if (data) {
        return data
      }
    }

    // Second: numeric ID.
    const numericCode =
      normalizeNumericCode(geoId)

    return dataLookup.byNumeric.get(numericCode)
  }

  function getCountryIdentity(
    properties: GeoProperties,
    geoId: unknown
  ) {
    const country =
      getCountryFromGeo(properties, geoId)

    return {
      country,
      name:
        country?.name?.common ??
        properties.name ??
        properties.NAME ??
        properties.NAME_LONG ??
        'Unknown country',
      code:
        country?.cca3?.toUpperCase() ??
        normalizeIso3(properties.ISO_A3) ??
        normalizeIso3(properties.ADM0_A3) ??
        '',
    }
  }

  function showTooltip(
    event: React.MouseEvent<SVGPathElement>,
    properties: GeoProperties,
    geoId: unknown
  ) {
    const data = findDataForGeo(
      properties,
      geoId
    )

    const identity = getCountryIdentity(
      properties,
      geoId
    )

    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      name: identity.name,
      code: identity.code,
      value: data?.value ?? null,
      year: data?.year ?? null,
      hasData: Boolean(data),
    })
  }

  function moveTooltip(
    event: React.MouseEvent<SVGPathElement>
  ) {
    setTooltip((current) => ({
      ...current,
      x: event.clientX,
      y: event.clientY,
    }))
  }

  function hideTooltip() {
    setTooltip((current) => ({
      ...current,
      visible: false,
    }))
  }

  function handleCountryClick(
    properties: GeoProperties,
    geoId: unknown
  ) {
    const identity = getCountryIdentity(
      properties,
      geoId
    )

    if (!identity.code) {
      return
    }

    window.location.href =
      `/country/${identity.code}`
  }

  return (
    <div
      style={{
        width: '100%',
        height: '620px',
        background: '#0B1727',
        border: '1px solid #1E3550',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 145,
          center: [10, 15],
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ZoomableGroup
          minZoom={1}
          maxZoom={4}
          zoom={1}
          center={[10, 15]}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const properties =
                  (geo.properties ??
                    {}) as GeoProperties

                const data =
                  findDataForGeo(
                    properties,
                    geo.id
                  )

                const identity =
                  getCountryIdentity(
                    properties,
                    geo.id
                  )

                const recognizedCountry =
                  Boolean(
                    identity.code ||
                      identity.name !==
                        'Unknown country'
                  )

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: recognizedCountry
                          ? getFill(
                              data?.value ??
                                null
                            )
                          : '#17283D',
                        stroke: '#07111F',
                        strokeWidth: 0.6,
                        outline: 'none',
                      },

                      hover: {
                        fill: recognizedCountry
                          ? '#FFFFFF'
                          : '#253A53',
                        stroke: '#34D6E7',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor:
                          recognizedCountry
                            ? 'pointer'
                            : 'default',
                      },

                      pressed: {
                        fill: '#FFFFFF',
                        stroke: '#34D6E7',
                        strokeWidth: 1,
                        outline: 'none',
                      },
                    }}
                    onMouseEnter={(event) =>
                      showTooltip(
                        event,
                        properties,
                        geo.id
                      )
                    }
                    onMouseMove={(event) =>
                      moveTooltip(event)
                    }
                    onMouseLeave={() =>
                      hideTooltip()
                    }
                    onClick={() =>
                      handleCountryClick(
                        properties,
                        geo.id
                      )
                    }
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          background: 'rgba(7, 17, 31, 0.96)',
          border: '1px solid #1E3550',
          borderRadius: '14px',
          padding: '14px 16px',
          minWidth: '220px',
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '10px',
          }}
        >
          External debt
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            color: '#9FB3C8',
            fontSize: '12px',
          }}
        >
          <LegendItem
            color="#34D6E7"
            label="Lower"
          />

          <LegendItem
            color="#FFD54D"
            label="Medium"
          />

          <LegendItem
            color="#FFB000"
            label="High"
          />

          <LegendItem
            color="#FF8A00"
            label="Very high"
          />

          <LegendItem
            color="#24384F"
            label="Data unavailable"
          />
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(
              tooltip.x + 16,
              window.innerWidth - 270
            ),
            top: Math.min(
              tooltip.y + 16,
              window.innerHeight - 220
            ),
            zIndex: 1000,
            width: '235px',
            background: '#07111F',
            border: '1px solid #2A4969',
            borderRadius: '14px',
            padding: '16px',
            boxShadow:
              '0 18px 45px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            {tooltip.name}
          </div>

          {tooltip.code && (
            <div
              style={{
                marginTop: '4px',
                color: '#71869C',
                fontSize: '11px',
              }}
            >
              {tooltip.code}
            </div>
          )}

          <div
            style={{
              height: '1px',
              background: '#1E3550',
              margin: '12px 0',
            }}
          />

          <div
            style={{
              color: '#9FB3C8',
              fontSize: '12px',
            }}
          >
            External debt
          </div>

          <div
            style={{
              marginTop: '4px',
              color: tooltip.hasData
                ? '#34D6E7'
                : '#F59E0B',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            {formatDebt(
              tooltip.value
            )}
          </div>

          <div
            style={{
              marginTop: '6px',
              color: '#9FB3C8',
              fontSize: '12px',
            }}
          >
            Latest year:{' '}
            {tooltip.year ?? 'N/A'}
          </div>

          <div
            style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid #1E3550',
              color: tooltip.hasData
                ? '#34D399'
                : '#F59E0B',
              fontSize: '11px',
              lineHeight: 1.4,
            }}
          >
            {tooltip.hasData
              ? 'Click to open country details'
              : 'Official data unavailable for this metric — click to view the country page'}
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          background: 'rgba(7, 17, 31, 0.96)',
          border: '1px solid #1E3550',
          borderRadius: '14px',
          padding: '12px 14px',
          color: '#9FB3C8',
          fontSize: '12px',
        }}
      >
        Hover for data · Click for country details
      </div>
    </div>
  )
}

function LegendItem({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />

      {label}
    </span>
  )
}