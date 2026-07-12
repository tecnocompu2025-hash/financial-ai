export default function FinancialScore({ savingsRate, debtRate }: { savingsRate: number; debtRate: number }) {
  const score = Math.max(0, Math.min(100, 50 + Math.min(30, savingsRate) - Math.min(40, debtRate)));
  const color = score >= 70 ? "text-green-400" : score >= 40 ? "text-yellow-400" : "text-red-400";
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"><p className="text-sm text-slate-400">Financial Score</p><h2 className={`mt-3 text-3xl font-bold ${color}`}>{score.toFixed(0)}/100</h2><p className="mt-3 text-sm text-slate-500">Basado en ahorro y endeudamiento.</p></div>;
}
