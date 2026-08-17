"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const formatYAxis = (tickItem: number) => {
  if (tickItem === 0) return "0";
  if (tickItem >= 1e12) return "$" + (tickItem / 1e12).toFixed(1) + "T";
  if (tickItem >= 1e9) return "$" + (tickItem / 1e9).toFixed(1) + "B";
  return "$" + tickItem.toString();
};

export default function DebtComparisonChart({ data, countryCodes }: { data: any[], countryCodes: string[] }) {
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-center p-8 bg-gray-900/50 rounded-xl border border-gray-800">
        No historical data available for chart.
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] mt-8 bg-[#0f172a] p-6 rounded-xl border border-gray-800">
      <h3 className="text-white text-xl mb-6 font-semibold">Historical External Debt</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="year" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickMargin={10} />
          <YAxis stroke="#9ca3af" tickFormatter={formatYAxis} tick={{ fill: '#9ca3af' }} tickMargin={10} width={80} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => [`$${(value / 1e9).toFixed(2)} Billion`, 'Debt']}
            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {countryCodes.map((code, index) => (
            <Line
              key={code}
              type="monotone"
              dataKey={code}
              name={code}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#111827' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}