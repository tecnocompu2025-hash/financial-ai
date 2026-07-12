type Props = { savingsRate: number; cashFlow: number; assetTotal: number; liabilityTotal: number };

export default function FinancialHealth({ savingsRate, cashFlow, assetTotal, liabilityTotal }: Props) {
  const savingsLabel = savingsRate >= 20 ? "En camino" : savingsRate > 0 ? "Por mejorar" : "En riesgo";
  const savingsColor = savingsRate >= 20 ? "text-green-400" : savingsRate > 0 ? "text-yellow-400" : "text-red-400";
  const debtRate = assetTotal > 0 ? liabilityTotal / assetTotal * 100 : 0;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-full">

      <h2 className="text-xl font-semibold mb-6">
        📊 Salud Financiera
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Liquidez</span>
          <span className={cashFlow >= 0 ? "text-green-400" : "text-red-400"}>{cashFlow >= 0 ? "Positiva" : "Negativa"}</span>
        </div>

        <div className="flex justify-between">
          <span>Endeudamiento</span>
          <span className={debtRate <= 30 ? "text-green-400" : debtRate <= 60 ? "text-yellow-400" : "text-red-400"}>{debtRate.toFixed(1)}% de activos</span>
        </div>

        <div className="flex justify-between">
          <span>Ahorro</span>
          <span className={savingsColor}>{savingsRate.toFixed(1)}% · {savingsLabel}</span>
        </div>

      </div>

    </div>
  );
}
