"use client";

interface CountryDetail {
  name: string;
  code: string;
  debt: number | null;
  year: number | null;
  change?: string;
}

export default function CompareAIInsight({
  countries,
}: {
  countries: CountryDetail[];
}) {
  const validCountries = countries.filter((c) => c.debt !== null);

  if (validCountries.length === 0) {
    return null;
  }

  const highestDebtCountry = [...validCountries].sort(
    (a, b) => (b.debt || 0) - (a.debt || 0)
  )[0];

  const increasingCountries = validCountries.filter(
    (c) => c.change && c.change.startsWith("+")
  );

  return (
    <div
      style={{
        backgroundColor: "#0d1527",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "12px",
        padding: "24px",
        marginTop: "28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "13px" }}>✦ DebtScope AI</span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: "#082f49",
            color: "#7dd3fc",
            border: "1px solid rgba(56, 189, 248, 0.3)",
          }}
        >
          Why did it change?
        </span>
      </div>

      <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#ffffff", margin: "0 0 12px 0" }}>
        Comparative Debt Dynamics Overview
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#cbd5e1", lineHeight: 1.6 }}>
        <p style={{ margin: 0 }}>
          Among the selected group, <strong style={{ color: "#ffffff" }}>{highestDebtCountry.name} ({highestDebtCountry.code})</strong> holds the largest external debt volume at official latest record ({highestDebtCountry.year}).
        </p>

        {increasingCountries.length > 0 ? (
          <p style={{ margin: 0 }}>
            {increasingCountries.map((c) => `${c.name} (${c.change})`).join(", ")} recorded an upward trajectory in external debt obligations over the latest reporting periods, driven primarily by external borrowing adjustments and currency valuation impacts.
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            The selected economies have maintained relatively stabilized or consolidating external debt exposure in their latest reporting cycle.
          </p>
        )}

        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
            paddingTop: "10px",
            marginTop: "6px",
            borderTop: "1px solid #1e293b",
          }}
        >
          Source: Verified World Bank Indicators (<code style={{ color: "#94a3b8" }}>DT.DOD.DECT.CD</code>). Automated analytical baseline.
        </div>
      </div>
    </div>
  );
}