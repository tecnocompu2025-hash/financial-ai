import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { mes: "Ene", patrimonio: 1000 },
  { mes: "Feb", patrimonio: 1800 },
  { mes: "Mar", patrimonio: 2500 },
  { mes: "Abr", patrimonio: 3400 },
  { mes: "May", patrimonio: 4700 },
  { mes: "Jun", patrimonio: 6200 },
];

export default function WealthChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-6">
        Patrimonio Neto
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