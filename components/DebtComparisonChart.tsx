'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type Point = {
  year: number
  IND?: number
  CHN?: number
}

function formatBillions(value: number) {
  return `$${(value / 1_000_000_000).toFixed(0)}B`
}

export default function DebtComparisonChart({
  data,
}: {
  data: Point[]
}) {
  return (
    <div
      style={{
        background: '#0F1C2E',
        border: '1px solid #1E3550',
        borderRadius: '20px',
        padding: '24px',
        marginTop: '32px',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
        Historical external debt trend
      </h2>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#1E3550" strokeDasharray="3 3" />

            <XAxis dataKey="year" stroke="#9FB3C8" />

            <YAxis
              stroke="#9FB3C8"
              tickFormatter={(v) => `${Math.round(v / 1e9)}B`}
            />

            <Tooltip
              formatter={(value: number) => formatBillions(value)}
              contentStyle={{
                background: '#12243A',
                border: '1px solid #28415F',
                borderRadius: '12px',
                color: 'white',
              }}
            />

            <Line
              type="monotone"
              dataKey="IND"
              stroke="#34D6E7"
              strokeWidth={3}
              dot={false}
              name="India"
            />

            <Line
              type="monotone"
              dataKey="CHN"
              stroke="#FFD54D"
              strokeWidth={3}
              dot={false}
              name="China"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}