import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMortgages } from "../../services/financial.service";
import type { Mortgage } from "../../types/financial";

export default function PaymentsHubV2({ token }: { token: string }) {
  const navigate = useNavigate(); const [credits, setCredits] = useState<Mortgage[]>([]);
  useEffect(() => { void getMortgages(token).then((items) => setCredits(items.filter((item) => item.current_balance > 0))); }, [token]);
  const ordered = [...credits].sort((a, b) => a.next_due_date.localeCompare(b.next_due_date));
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => navigate("/")} className="text-cyan-400">Dashboard</button><h1 className="mt-5 text-3xl font-bold">Pagos pendientes</h1><p className="mt-2 text-slate-400">Cuotas de créditos ordenadas por próxima fecha de pago.</p><div className="mt-8 max-w-4xl space-y-3">{ordered.length === 0 ? <p className="rounded bg-slate-900 p-4 text-slate-400">No tienes cuotas pendientes.</p> : ordered.map((credit) => <article key={credit.id} className="rounded-xl bg-slate-900 p-5"><div className="flex flex-wrap justify-between gap-3"><div><b>{credit.credit_type}: {credit.name}</b><p className="mt-2 text-slate-400">Fecha de pago: <strong className="text-white">{credit.next_due_date}</strong></p></div><div className="text-right"><p className="text-cyan-400">Cuota: S/ {credit.monthly_payment.toFixed(2)}</p><p className="mt-2 text-sm text-slate-400">Saldo: S/ {credit.current_balance.toFixed(2)}</p></div></div><div className="mt-4 flex gap-3"><button onClick={() => navigate("/credit-history")} className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Pagar cuota</button><button onClick={() => navigate("/amortization")} className="rounded bg-slate-800 px-4 py-2">Amortización</button></div></article>)}</div></main>;
}
