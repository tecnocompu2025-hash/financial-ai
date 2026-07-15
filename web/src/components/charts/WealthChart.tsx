import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function WealthChart({ netWorth }: { netWorth: number }) {
  const { formatCurrency } = useCurrency();
  // Datos mock para mostrar el gráfico animado (hasta que el backend provea la serie histórica)
  const data = [
    { mes: "Ene", patrimonio: netWorth * 0.7 },
    { mes: "Feb", patrimonio: netWorth * 0.75 },
    { mes: "Mar", patrimonio: netWorth * 0.8 },
    { mes: "Abr", patrimonio: netWorth * 0.82 },
    { mes: "May", patrimonio: netWorth * 0.9 },
    { mes: "Jun", patrimonio: netWorth * 0.95 },
    { mes: "Actual", patrimonio: netWorth },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Evolución Patrimonial
          </h2>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(netWorth)}
          </p>
        </div>
        <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
          Últimos 6 meses
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="mes"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Area
              type="monotone"
              dataKey="patrimonio"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorPatrimonio)"
              strokeWidth={3}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#1e1b4b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
