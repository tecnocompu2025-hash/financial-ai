import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLiabilities, getMortgages } from "../../services/financial.service";
import type { Liability, Mortgage } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function AllDebts({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();

  const navigate = useNavigate(); const [debts, setDebts] = useState<Liability[]>([]); const [credits, setCredits] = useState<Mortgage[]>([]);
  useEffect(() => { void Promise.all([getLiabilities(token), getMortgages(token)]).then(([general, loans]) => { setDebts(general); setCredits(loans); }); }, [token]);
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => navigate("/debts")} className="text-cyan-400">Deudas</button><h1 className="mt-5 text-3xl font-bold">Todas las deudas</h1><section className="mt-8 max-w-4xl space-y-3"><h2 className="text-xl font-semibold">Créditos con cuotas</h2>{credits.length === 0 ? <p className="text-slate-400">No hay créditos registrados.</p> : credits.map((credit) => <article key={credit.id} className="rounded-lg bg-slate-900 p-4"><div className="flex flex-wrap justify-between gap-3"><div><b>{credit.credit_type}: {credit.name}</b><p className="mt-2 text-slate-400">Saldo: {formatCurrency(credit.current_balance)} · Próxima cuota: {credit.next_due_date}</p></div><div className="flex gap-3"><button onClick={() => navigate("/credit-history")} className="text-slate-300">Historial</button><button onClick={() => navigate("/payments")} className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Pagar</button></div></div></article>)}</section><section className="mt-8 max-w-4xl space-y-3"><h2 className="text-xl font-semibold">Deudas generales</h2>{debts.length === 0 ? <p className="text-slate-400">No hay deudas generales.</p> : debts.map((debt) => <article key={debt.id} className="rounded-lg bg-slate-900 p-4"><div className="flex justify-between"><span>{debt.category}</span><b className="text-red-400">{formatCurrency(debt.balance)}</b></div></article>)}</section></main>;
}
