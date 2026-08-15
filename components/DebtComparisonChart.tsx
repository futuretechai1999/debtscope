'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ChartRow = {
  year: number
  [key: string]: number | null
}

type CountrySeries = {
  code: string
  name: string
}

type DebtComparisonChartProps = {
  data: ChartRow[]
  countries: CountrySeries[]
}

const lineColors = ['#34D6E7', '#FFD54D', '#FF8A00', '#A78BFA']

function formatValue(value: number) {
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

export default function DebtComparisonChart({
  data,
  countries,
}: DebtComparisonChartProps) {
  if (data.length === 0) {
    return (
      <div
        style={{
          background: '#0F1C2E',
          border: '1px solid #1E3550',
          borderRadius: '18px',
          padding: '32px',
          color: '#9FB3C8',
        }}
      >
        Historical data is not available for the selected countries.
      </div>
    )
  }

  return (
    <section
      style={{
        background: '#0F1C2E',
        border: '1px solid #1E3550',
        borderRadius: '20px',
        padding: '28px',
        marginTop: '28px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '24px',
            color: '#FFFFFF',
          }}
        >
          Historical external debt
        </h2>

        <p
          style={{
            margin: '8px 0 0',
            color: '#9FB3C8',
            lineHeight: 1.5,
          }}
        >
          Compare how external debt has changed over time.
        </p>
      </div>

      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              stroke="#1E3550"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="year"
              stroke="#9FB3C8"
              tick={{ fill: '#9FB3C8', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#1E3550' }}
            />

            <YAxis
              stroke="#9FB3C8"
              tick={{ fill: '#9FB3C8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1_000_000_000_000) {
                  return `$${(value / 1_000_000_000_000).toFixed(1)}T`
                }

                return `$${(value / 1_000_000_000).toFixed(0)}B`
              }}
            />

            <Tooltip
              contentStyle={{
                background: '#07111F',
                border: '1px solid #1E3550',
                borderRadius: '12px',
                color: '#FFFFFF',
              }}
              labelStyle={{
                color: '#9FB3C8',
                marginBottom: '6px',
              }}
              formatter={(value, name) => {
                const numericValue =
                  typeof value === 'number' ? value : Number(value)

                return [
                  Number.isFinite(numericValue)
                    ? formatValue(numericValue)
                    : 'Unavailable',
                  String(name),
                ]
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: '18px',
                color: '#FFFFFF',
              }}
            />

            {countries.map((country, index) => (
              <Line
                key={country.code}
                type="monotone"
                dataKey={country.code}
                name={country.name}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={3}
                dot={false}
                connectNulls
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}