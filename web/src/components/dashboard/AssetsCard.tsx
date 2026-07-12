export default function AssetsCard({ total }: { total: number }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <p className="text-slate-400 text-sm">
        Activos
      </p>

      <h2 className="text-4xl font-bold mt-2">
        S/ {total.toFixed(2)}
      </h2>
    </div>
  );
}
