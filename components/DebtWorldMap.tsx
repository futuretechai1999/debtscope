"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapCountryItem {
  name: string;
  code: string;
  flag?: string;
  region?: string;
  debt?: number | null;
  year?: number | null;
}

interface DebtWorldMapProps {
  countries?: MapCountryItem[];
}

const DEBT_DATA: Record<string, { debt: string; name: string }> = {
  USA: { debt: "$36.2T", name: "United States" },
  CHN: { debt: "$16.1T", name: "China" },
  JPN: { debt: "$13.0T", name: "Japan" },
  DEU: { debt: "$5.0T", name: "Germany" },
  GBR: { debt: "$4.7T", name: "United Kingdom" },
  IND: { debt: "$716.5B", name: "India" },
  BRA: { debt: "$730.0B", name: "Brazil" },
  ZAF: { debt: "$180.2B", name: "South Africa" },
  RUS: { debt: "$310.0B", name: "Russia" },
  MEX: { debt: "$610.0B", name: "Mexico" },
  AUS: { debt: "$2.1T", name: "Australia" },
  CAN: { debt: "$2.9T", name: "Canada" },
  IDN: { debt: "$412.0B", name: "Indonesia" },
  TUR: { debt: "$490.0B", name: "Turkey" },
  SAU: { debt: "$260.0B", name: "Saudi Arabia" },
};

function DebtWorldMap({ countries = [] }: DebtWorldMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    debt: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#071321",
        border: "1px solid #13273e",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#38bdf8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            WORLD VIEW
          </span>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#ffffff",
              margin: "4px 0 0 0",
              letterSpacing: "-0.02em",
            }}
          >
            Global debt map
          </h3>
        </div>

        <Link
          href="/rankings"
          style={{
            fontSize: "11px",
            color: "#64748b",
            border: "1px solid #1e293b",
            borderRadius: "20px",
            padding: "4px 12px",
            textDecoration: "none",
            backgroundColor: "#050d18",
            fontWeight: 600,
          }}
        >
          Leaderboard →
        </Link>
      </div>

      <div
        style={{
          width: "100%",
          height: "360px",
          backgroundColor: "#050d18",
          borderRadius: "12px",
          border: "1px solid #0f2238",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isMounted ? (
          <div style={{ color: "#38bdf8", fontSize: "13px", fontWeight: 600 }}>
            Rendering Geographic Engine...
          </div>
        ) : (
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: 140,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Sphere stroke="#11253e" strokeWidth={0.5} id="sphere" fill="transparent" />
            <Graticule stroke="#0c1b2d" strokeWidth={0.5} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A3 || geo.properties.iso_a3 || geo.id;
                  const match = DEBT_DATA[countryCode];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setTooltipContent({
                          name: geo.properties.name || match?.name || "Country",
                          debt: match ? match.debt : "Data not indexed",
                        });
                      }}
                      onMouseLeave={() => {
                        setTooltipContent(null);
                      }}
                      style={{
                        default: {
                          fill: match ? "#0e395c" : "#091b2e",
                          stroke: "#142c47",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: match ? "#22d3ee" : "#1e40af",
                          stroke: "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#0284c7",
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

        {/* Dynamic Tooltip on Country Hover */}
        {tooltipContent && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              backgroundColor: "#071321",
              border: "1px solid #38bdf8",
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <div style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700 }}>
              {tooltipContent.name}
            </div>
            <div style={{ color: "#22d3ee", fontSize: "14px", fontWeight: 800, marginTop: "2px" }}>
              {tooltipContent.debt}
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "14px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "10px",
            color: "#64748b",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#091b2e",
              }}
            />
            Global Base
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#0e395c",
              }}
            />
            Active Indexed Economy
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(DebtWorldMap);