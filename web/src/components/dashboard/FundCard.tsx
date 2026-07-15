import { useCurrency } from "../../contexts/CurrencyContext";

export default function FundCard({ title, icon, percentage, totalIncome, spentAmount, colorClass, onPay, onView }: { title: string, icon: string, percentage: number, totalIncome: number, spentAmount: number, colorClass: string, onPay?: (fundName: string) => void, onView?: (fundName: string) => void }) {
  const { formatCurrency } = useCurrency();
  
  if (percentage <= 0) return null;

  const totalFund = totalIncome * (percentage / 100);
  const available = totalFund - spentAmount;
  const progress = totalFund > 0 ? (spentAmount / totalFund) * 100 : 0;
  const progressClamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <span>{icon}</span> {title}
          {title === "Calidad de Vida" && (
            <div className="group relative flex items-center justify-center">
              <div className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white hover:bg-slate-500">?</div>
              <div className="absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded bg-slate-800 p-2 text-xs font-normal text-white shadow-lg group-hover:block z-10 text-center border border-slate-700 pointer-events-none">
                Este es un fondo o ahorro diseñado para mejorar tu estilo de vida en el futuro, o puede usarse estratégicamente para pagar deudas e invertir.
              </div>
            </div>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded-full text-slate-400">
            {percentage}% Ingresos
          </span>
          {onView && (
            <button 
              onClick={() => onView(title)}
              className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors font-medium border border-slate-700"
            >
              Historial
            </button>
          )}
          {onPay && (
            <button 
              onClick={() => onPay(title)}
              className="text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded hover:bg-cyan-500/20 transition-colors font-medium border border-cyan-500/30"
            >
              Pagar
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-slate-400">Fondo Disponible</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{formatCurrency(available)}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Gastado: {formatCurrency(spentAmount)}</span>
          <span>Fondo Acumulado: {formatCurrency(totalFund)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div 
            className={`h-full ${colorClass.replace('text-', 'bg-')}`} 
            style={{ width: `${progressClamped}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 text-right mt-1">
          {progressClamped.toFixed(1)}% utilizado
        </p>
      </div>
    </div>
  );
}
