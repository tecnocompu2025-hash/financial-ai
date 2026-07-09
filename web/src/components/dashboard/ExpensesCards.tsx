export default function ExpensesCards() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <p className="text-slate-400 text-sm">
        Gastos Mensuales
      </p>

      <h2 className="text-4xl font-bold mt-2">
        S/ 0.00
      </h2>

      <p className="text-red-400 mt-4">
        Sin registros
      </p>
    </div>
  );
}