"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { allCountries } from "../lib/countries";

// Verified countries with active World Bank external debt records
const POPULAR_REPORTING_CODES = [
  'IND', 'CHN', 'BRA', 'MEX', 'ZAF', 'IDN', 'TUR', 'ARG', 'NGA', 'EGY', 'BGD', 'PAK'
];

export default function CountrySelector({
  selectedCodes,
}: {
  selectedCodes: string[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(selectedCodes);
  const [search, setSearch] = useState("");

  const toggleCountry = (code: string) => {
    let updated: string[];
    if (selected.includes(code)) {
      if (selected.length <= 2) {
        alert("At least 2 countries are required for comparison.");
        return;
      }
      updated = selected.filter((c) => c !== code);
    } else {
      if (selected.length >= 4) {
        alert("You can compare a maximum of 4 countries at a time.");
        return;
      }
      updated = [...selected, code];
    }

    setSelected(updated);
    router.push(`/compare?countries=${updated.join(",")}`);
  };

  const filteredCountries = search.trim()
    ? allCountries
        .filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code3.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 16)
    : allCountries.filter((c) => POPULAR_REPORTING_CODES.includes(c.code3));

  return (
    <div
      style={{
        backgroundColor: "#0d1527",
        border: "1px solid #1e293b",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600, margin: 0 }}>
            Select Countries to Compare
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: "4px 0 0 0" }}>
            Choose 2 to 4 countries with World Bank reporting (Selected: {selected.length}/4)
          </p>
        </div>

        <input
          type="text"
          placeholder="Search all 200+ countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            backgroundColor: "#070b14",
            border: "1px solid #334155",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#ffffff",
            fontSize: "12px",
            outline: "none",
            width: "220px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {filteredCountries.map((country) => {
          const isSelected = selected.includes(country.code3);
          return (
            <button
              key={country.code3}
              type="button"
              onClick={() => toggleCountry(country.code3)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor: isSelected ? "rgba(59, 130, 246, 0.2)" : "#1e293b",
                border: isSelected ? "1px solid #3b82f6" : "1px solid #334155",
                color: isSelected ? "#93c5fd" : "#cbd5e1",
              }}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  backgroundColor: isSelected ? "rgba(59, 130, 246, 0.4)" : "#0f172a",
                  color: isSelected ? "#bfdbfe" : "#94a3b8",
                }}
              >
                {country.code3}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}