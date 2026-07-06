export default function Welcome() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

      <div className="text-center max-w-3xl">

        <h1 className="text-6xl font-bold text-cyan-400">
          Financial AI
        </h1>

        <h2 className="mt-8 text-3xl font-semibold">
          Tu libertad financiera comienza hoy.
        </h2>

        <p className="mt-6 text-xl text-slate-400">
          No estás aquí para registrar gastos.
        </p>

        <p className="text-xl text-slate-400">
          Estás aquí para construir patrimonio.
        </p>

        <button
          className="mt-10 px-10 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition text-xl font-semibold"
        >
          Comenzar
        </button>

      </div>

    </div>
  );
}