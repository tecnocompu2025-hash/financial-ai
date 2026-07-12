import {
  IconBrain,
  IconTrendingUp,
  IconAlertTriangle,
} from "@tabler/icons-react";

export default function AIAdvisor({ savingsRate, cashFlow, debtRate }: { savingsRate: number; cashFlow: number; debtRate: number }) {
  const recommendation = cashFlow <= 0
    ? "Tus gastos superan tus ingresos: reduce gastos no esenciales antes de invertir."
    : debtRate > 50
      ? "Prioriza reducir deudas de alto interés para fortalecer tu patrimonio."
      : savingsRate >= 20
        ? "Mantén tu ahorro e incrementa activos que generen ingresos."
        : "Tu siguiente objetivo es ahorrar al menos el 20% de tus ingresos.";
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-full">

      <div className="flex items-center gap-3 mb-6">

        <div className="bg-cyan-500/20 p-2 rounded-lg">
          <IconBrain size={24} className="text-cyan-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            IA Advisor
          </h2>

          <p className="text-slate-400 text-sm">
            Tu asesor financiero inteligente
          </p>
        </div>

      </div>

      <div className="space-y-5">

        <div className="flex gap-3">

          <IconTrendingUp className="text-green-400 mt-1" />

          <div>

            <p className="font-semibold">
              Estado financiero
            </p>

            <p className="text-slate-400 text-sm">
              {cashFlow >= 0 ? "Tu flujo de caja actual es positivo." : "Tu flujo de caja actual necesita atención."}
            </p>

          </div>

        </div>

        <div className="flex gap-3">

          <IconAlertTriangle className="text-yellow-400 mt-1" />

          <div>

            <p className="font-semibold">
              Recomendación
            </p>

            <p className="text-slate-400 text-sm">
              {recommendation}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
