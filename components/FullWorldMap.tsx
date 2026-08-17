"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface CountryMapData {
  code: string;
  name: string;
  flag: string;
  debt: number | null;
  year: number | null;
}

const NUMERIC_TO_ALPHA3: Record<string, string> = {
  "004": "AFG", "008": "ALB", "012": "DZA", "024": "AGO", "032": "ARG", "051": "ARM", "036": "AUS", "040": "AUT",
  "031": "AZE", "050": "BGD", "112": "BLR", "056": "BEL", "084": "BLZ", "204": "BEN", "064": "BTN", "068": "BOL",
  "070": "BIH", "072": "BWA", "076": "BRA", "100": "BGR", "854": "BFA", "108": "BDI", "116": "KHM", "120": "CMR",
  "124": "CAN", "140": "CAF", "148": "TCD", "152": "CHL", "156": "CHN", "170": "COL", "178": "COG", "180": "COD",
  "188": "CRI", "384": "CIV", "191": "HRV", "192": "CUB", "196": "CYP", "203": "CZE", "208": "DNK", "262": "DJI",
  "214": "DOM", "218": "ECU", "818": "EGY", "222": "SLV", "226": "GNQ", "232": "ERI", "233": "EST", "231": "ETH",
  "242": "FJI", "246": "FIN", "250": "FRA", "266": "GAB", "270": "GMB", "268": "GEO", "276": "DEU", "288": "GHA",
  "300": "GRC", "320": "GTM", "324": "GIN", "624": "GNB", "328": "GUY", "332": "HTI", "340": "HND", "348": "HUN",
  "352": "ISL", "356": "IND", "360": "IDN", "364": "IRN", "368": "IRQ", "372": "IRL", "376": "ISR", "380": "ITA",
  "388": "JAM", "392": "JPN", "400": "JOR", "398": "KAZ", "404": "KEN", "408": "PRK", "410": "KOR", "414": "KWT",
  "417": "KGZ", "418": "LAO", "428": "LVA", "422": "LBN", "426": "LSO", "430": "LBR", "434": "LBY", "440": "LTU",
  "442": "LUX", "807": "MKD", "450": "MDG", "454": "MWI", "458": "MYS", "466": "MLI", "478": "MRT", "480": "MUS",
  "484": "MEX", "498": "MDA", "496": "MNG", "499": "MNE", "504": "MAR", "508": "MOZ", "104": "MMR", "516": "NAM",
  "524": "NPL", "528": "NLD", "554": "NZL", "558": "NIC", "562": "NER", "566": "NGA", "578": "NOR", "512": "OMN",
  "586": "PAK", "591": "PAN", "598": "PNG", "600": "PRY", "604": "PER", "608": "PHL", "616": "POL", "620": "PRT",
  "634": "QAT", "642": "ROU", "643": "RUS", "646": "RWA", "682": "SAU", "686": "SEN", "688": "SRB", "694": "SLE",
  "702": "SGP", "703": "SVK", "705": "SVN", "090": "SLB", "706": "SOM", "710": "ZAF", "728": "SSD", "724": "ESP",
  "144": "LKA", "729": "SDN", "740": "SUR", "748": "SWZ", "752": "SWE", "756": "CHE", "760": "SYR", "762": "TJK",
  "834": "TZA", "764": "THA", "626": "TLS", "768": "TGO", "780": "TTO", "788": "TUN", "792": "TUR", "795": "TKM",
  "800": "UGA", "804": "UKR", "784": "ARE", "826": "GBR", "840": "USA", "858": "URY", "860": "UZB", "548": "VUT",
  "862": "VEN", "704": "VNM", "887": "YEM", "894": "ZMB", "716": "ZWE"
};

const formatCurrency = (val: number | null) => {
  if (val === null) return "Data unavailable";
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  return `$${val.toLocaleString()}`;
};

function FullWorldMap({ countries }: { countries: CountryMapData[] }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCountry, setHoveredCountry] = useState<CountryMapData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryMapData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const defaultCountry = countries.find((c) => c.code === "IND") || countries[0];
    if (defaultCountry) setSelectedCountry(defaultCountry);
  }, [countries]);

  const countryMap = new Map<string, CountryMapData>();
  countries.forEach((c) => {
    countryMap.set(c.code.toUpperCase(), c);
  });

  const getISO3FromGeo = (geo: any): string => {
    const rawId = String(geo.id || "").padStart(3, "0");
    if (NUMERIC_TO_ALPHA3[rawId]) return NUMERIC_TO_ALPHA3[rawId];
    const props = geo.properties || {};
    return (props.ISO_A3 || props.iso_a3 || props.ADM0_A3 || "").toUpperCase();
  };

  const getCountryColor = (country?: CountryMapData) => {
    if (!country || country.debt === null) return "#334155"; // Light Slate / White for Non-reporting
    if (country.debt >= 500e9) return "#ef4444"; // Red for High (> $500B)
    if (country.debt >= 100e9) return "#eab308"; // Yellow for Medium ($100B - $500B)
    return "#22c55e"; // Green for Low (< $100B)
  };

  const handleCountryClick = (code: string) => {
    if (code) {
      router.push(`/country/${code}`);
    }
  };

  const filteredList = searchTerm.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          backgroundColor: "#0d1527",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "16px 20px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#ffffff" }}>
            Geographic Debt Explorer
          </h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0 0" }}>
            Hover over any country to inspect debt or click to view deep profile[cite: 1].
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search country (e.g. India, CHN)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: "#070b14",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "8px 14px",
              color: "#ffffff",
              fontSize: "12px",
              outline: "none",
              width: "240px",
            }}
          />

          {filteredList.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                width: "240px",
                backgroundColor: "#0d1527",
                border: "1px solid #334155",
                borderRadius: "8px",
                zIndex: 50,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              }}
            >
              {filteredList.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setSelectedCountry(item);
                    setSearchTerm("");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: "1px solid #1e293b",
                  }}
                >
                  <span>{item.flag} {item.name}</span>
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>{item.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Canvas */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "520px",
          backgroundColor: "#050d18",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isMounted ? (
          <div style={{ color: "#38bdf8", fontSize: "14px", fontWeight: 600 }}>
            Rendering Geographic Engine...
          </div>
        ) : (
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: 165,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Sphere stroke="#10243d" strokeWidth={0.5} id="sphere-full" fill="transparent" />
            <Graticule stroke="#0a1727" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const code = getISO3FromGeo(geo);
                  const countryData = countryMap.get(code);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        const hovered = countryData || {
                          code: code || "N/A",
                          name: geo.properties.name || "Unknown Territory",
                          flag: "🌐",
                          debt: null,
                          year: null,
                        };
                        setHoveredCountry(hovered);
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => {
                        if (countryData) {
                          setSelectedCountry(countryData);
                          handleCountryClick(countryData.code);
                        } else if (code) {
                          handleCountryClick(code);
                        }
                      }}
                      style={{
                        default: {
                          fill: getCountryColor(countryData),
                          stroke: "#070e17",
                          strokeWidth: 0.6,
                          outline: "none",
                          cursor: "pointer",
                          transition: "fill 0.2s ease",
                        },
                        hover: {
                          fill: "#ffffff",
                          stroke: "#38bdf8",
                          strokeWidth: 1.5,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#94a3b8",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}

        {/* Dynamic Tooltip on Hover */}
        {hoveredCountry && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              backgroundColor: "#0d1527",
              border: "1px solid #38bdf8",
              borderRadius: "10px",
              padding: "10px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>{hoveredCountry.flag}</span>
              <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>
                {hoveredCountry.name} {hoveredCountry.code !== "N/A" ? `(${hoveredCountry.code})` : ""}
              </span>
            </div>
            <div
              style={{
                color:
                  hoveredCountry.debt === null
                    ? "#94a3b8"
                    : hoveredCountry.debt >= 500e9
                    ? "#ef4444"
                    : hoveredCountry.debt >= 100e9
                    ? "#eab308"
                    : "#22c55e",
                fontSize: "16px",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              {formatCurrency(hoveredCountry.debt)}
            </div>
            <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}>
              {hoveredCountry.debt !== null
                ? `Observation Year: ${hoveredCountry.year} (World Bank IDS)`
                : "Advanced / High-Income (Reports via IMF/OECD)"}
            </div>
          </div>
        )}

        {/* Interactive Map Legend */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            backgroundColor: "rgba(13, 21, 39, 0.9)",
            backdropFilter: "blur(6px)",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "11px",
            color: "#94a3b8",
            zIndex: 10,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#ef4444" }} />
            High (&gt; $500B)
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#eab308" }} />
            Med ($100B–$500B)
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#22c55e" }} />
            Low (&lt; $100B)
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: "#334155" }} />
            Non-reporting / Advanced
          </span>
        </div>
      </div>

      {/* Selected Country Spotlight Panel */}
      {selectedCountry && (
        <div
          style={{
            backgroundColor: "#0d1527",
            border: "1px solid #1e293b",
            borderRadius: "14px",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "36px" }}>{selectedCountry.flag}</span>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "18px" }}>
                {selectedCountry.name} ({selectedCountry.code})
              </div>
              <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                World Bank Official Indicator: `DT.DOD.DECT.CD`[cite: 1]
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div>
              <span style={{ color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: 600 }}>
                Debt Position
              </span>
              <div
                style={{
                  color:
                    selectedCountry.debt === null
                      ? "#94a3b8"
                      : selectedCountry.debt >= 500e9
                      ? "#ef4444"
                      : selectedCountry.debt >= 100e9
                      ? "#eab308"
                      : "#22c55e",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                {formatCurrency(selectedCountry.debt)}
              </div>
            </div>

            <button
              onClick={() => handleCountryClick(selectedCountry.code)}
              style={{
                backgroundColor: "#38bdf8",
                color: "#070b14",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open Deep Dive Profile →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(FullWorldMap);