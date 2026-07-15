import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLiabilities, getMortgages } from "../../services/financial.service";
import type { Liability, Mortgage } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function PaymentsHubV3({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();

  const navigate = useNavigate(); const [credits, setCredits] = useState<Mortgage[]>([]); const [debts, setDebts] = useState<Liability[]>([]);
  useEffect(() => { void Promise.all([getMortgages(token), getLiabilities(token)]).then(([loans, general]) => { setCredits(loans.filter((item) => item.current_balance > 0)); setDebts(general); }); }, [token]);
  const groups = useMemo(() => credits.reduce<Record<string, Mortgage[]>>((all, credit) => { (all[credit.credit_type] ??= []).push(credit); return all; }, {}), [credits]);
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => navigate("/")} className="text-cyan-400">Dashboard</button><h1 className="mt-5 text-3xl font-bold">Pagos pendientes</h1><p className="mt-2 text-slate-400">Todas tus deudas clasificadas por tipo.</p><div className="mt-8 max-w-4xl space-y-8">{Object.entries(groups).map(([type, items]) => <section key={type}><h2 className="mb-3 text-xl font-semibold">Créditos: {type}</h2><div className="space-y-3">{items.sort((a, b) => a.next_due_date.localeCompare(b.next_due_date)).map((credit) => <article key={credit.id} className="rounded-xl bg-slate-900 p-5"><div className="flex flex-wrap justify-between gap-3"><div><b>{credit.name}</b><p className="mt-2 text-slate-400">Próxima cuota: {credit.next_due_date} · Saldo: {formatCurrency(credit.current_balance)}</p></div><div className="text-right"><p className="text-cyan-400">{formatCurrency(credit.monthly_payment)}</p><button onClick={() => navigate("/credit-history")} className="mt-2 rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Pagar cuota</button></div></div></article>)}</div></section>)}<section><h2 className="mb-3 text-xl font-semibold">Deudas generales</h2>{debts.length === 0 ? <p className="text-slate-400">No hay deudas generales.</p> : <div className="space-y-3">{debts.map((debt) => <article key={debt.id} className="flex justify-between rounded-xl bg-slate-900 p-5"><div><b>{debt.category}</b><p className="mt-2 text-sm text-slate-400">Deuda sin cuota programada.</p></div><span className="text-red-400">{formatCurrency(debt.balance)}</span></article>)}</div>}</section></div></main>;
}
