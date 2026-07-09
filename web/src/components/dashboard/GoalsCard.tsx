export default function GoalsCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-full">

      <h2 className="text-xl font-semibold mb-6">
        🎯 Metas Financieras
      </h2>

      <div className="space-y-5">

        <div>
          <div className="flex justify-between mb-2">
            <span>Fondo de emergencia</span>
            <span>35%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-cyan-500 h-2 rounded-full w-[35%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>Comprar vivienda</span>
            <span>12%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-[12%]" />
          </div>
        </div>

      </div>

    </div>
  );
}