import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  onView?: () => void;
};

export default function FinancialCard({
  title,
  value,
  subtitle,
  color = "text-white",
  icon,
  trend,
  trendValue,
  onView,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl transition-all duration-300 group-hover:bg-indigo-500/20" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h2 className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>
            {value}
          </h2>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-300 shadow-inner">
            {icon}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {subtitle && (
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          )}
          {onView && (
            <button 
              onClick={onView} 
              className="text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Historial
            </button>
          )}
        </div>
        
        {trendValue && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
            trend === "down" ? "bg-rose-500/10 text-rose-400" :
            "bg-slate-500/10 text-slate-400"
          }`}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "−"}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}