export default function FinancialScore({ savingsRate, debtRate }: { savingsRate: number; debtRate: number }) {
  const score = Math.max(0, Math.min(100, 50 + Math.min(30, savingsRate) - Math.min(40, debtRate)));
  const colorClass = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-rose-400";
  const strokeColor = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#fb7185";
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 text-center backdrop-blur-md transition-all hover:border-indigo-500/50">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl" />
      
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400">Financial Score</h3>
      
      <div className="relative flex items-center justify-center">
        {/* Background Circle */}
        <svg className="h-32 w-32 -rotate-90 transform">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>{score.toFixed(0)}</span>
          <span className="text-[10px] uppercase text-slate-500">/ 100</span>
        </div>
      </div>
      
      <p className="mt-6 text-xs text-slate-500">Basado en tu tasa de ahorro y nivel de endeudamiento.</p>
    </div>
  );
}
