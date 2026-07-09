export default function FinancialHealth() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-full">

      <h2 className="text-xl font-semibold mb-6">
        📊 Salud Financiera
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Liquidez</span>
          <span className="text-green-400">Excelente</span>
        </div>

        <div className="flex justify-between">
          <span>Endeudamiento</span>
          <span className="text-yellow-400">Bajo</span>
        </div>

        <div className="flex justify-between">
          <span>Ahorro</span>
          <span className="text-cyan-400">20%</span>
        </div>

      </div>

    </div>
  );
}