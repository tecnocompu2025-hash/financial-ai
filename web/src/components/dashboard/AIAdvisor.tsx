import { IconBrain, IconTrendingUp, IconAlertTriangle, IconSparkles } from "@tabler/icons-react";

export default function AIAdvisor({ savingsRate, cashFlow, debtRate }: { savingsRate: number; cashFlow: number; debtRate: number }) {
  const recommendation = cashFlow <= 0
    ? "Tus gastos superan tus ingresos: reduce gastos no esenciales antes de invertir."
    : debtRate > 50
      ? "Prioriza reducir deudas de alto interés para fortalecer tu patrimonio."
      : savingsRate >= 20
        ? "Mantén tu ahorro e incrementa activos que generen ingresos."
        : "Tu siguiente objetivo es ahorrar al menos el 20% de tus ingresos.";

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-6 backdrop-blur-xl">
      {/* Glow Effects */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
      
      {/* Header */}
      <div className="relative z-10 mb-8 flex items-center gap-4 border-b border-slate-800/60 pb-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <IconBrain size={24} className="text-white" />
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900">
            <IconSparkles size={10} className="text-amber-400" />
          </div>
        </div>
        <div>
          <h2 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
            AI Advisor
          </h2>
          <p className="text-xs text-slate-400">Tu copiloto financiero</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center space-y-6">
        
        {/* Status Bubble */}
        <div className="group flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
            <IconTrendingUp size={16} />
          </div>
          <div className="flex-1 rounded-2xl rounded-tl-none bg-slate-800/40 p-4 text-sm text-slate-300">
            <p className="mb-1 font-semibold text-emerald-400">Estado financiero</p>
            {cashFlow >= 0 ? "Tu flujo de caja actual es positivo y saludable." : "Tu flujo de caja actual necesita atención urgente."}
          </div>
        </div>

        {/* Recommendation Bubble */}
        <div className="group flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
            <IconAlertTriangle size={16} />
          </div>
          <div className="flex-1 rounded-2xl rounded-tl-none bg-indigo-900/20 border border-indigo-500/10 p-4 text-sm text-slate-300">
            <p className="mb-1 font-semibold text-indigo-400">Recomendación prioritaria</p>
            {recommendation}
          </div>
        </div>

      </div>
    </div>
  );
}
