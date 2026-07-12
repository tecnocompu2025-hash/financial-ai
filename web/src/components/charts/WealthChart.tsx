import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function WealthChart({ netWorth }: { netWorth: number }) {
  const data = [{ mes: "Actual", patrimonio: netWorth }];
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-6">
        Patrimonio Neto Actual
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis
              dataKey="mes"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="patrimonio"
              stroke="#22c55e"
              fill="#22c55e33"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
