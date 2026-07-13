import { useNavigate } from "react-router-dom";

export default function DebtHub() {
  const navigate = useNavigate();
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => navigate("/")} className="text-cyan-400">Dashboard</button><h1 className="mt-5 text-3xl font-bold">Deudas</h1><p className="mt-2 text-slate-400">Registra una deuda simple o un crédito con interés, plazo y fecha de cuota.</p><div className="mt-8 grid max-w-2xl gap-4 md:grid-cols-2"><button onClick={() => navigate("/liabilities")} className="rounded-xl bg-slate-900 p-6 text-left hover:bg-slate-800"><b>Deuda general</b><p className="mt-2 text-sm text-slate-400">Préstamos o saldos sin calendario de cuotas.</p></button><button onClick={() => navigate("/mortgages")} className="rounded-xl bg-slate-900 p-6 text-left hover:bg-slate-800"><b>Registrar crédito</b><p className="mt-2 text-sm text-slate-400">Monto, interés, meses y fecha de primera cuota.</p></button></div></main>;
}
