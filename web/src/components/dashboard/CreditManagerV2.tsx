import { useEffect, useState } from "react";
import { getMortgagePayments, getMortgages, payMortgage } from "../../services/financial.service";
import type { CreditPayment, Mortgage } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function CreditManagerV2({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();

  const [credits, setCredits] = useState<Mortgage[]>([]); const [history, setHistory] = useState<Record<number, CreditPayment[]>>({});
  const load = () => getMortgages(token).then(setCredits); useEffect(() => { void load(); }, [token]);
  async function payment(credit: Mortgage) { const amount = window.prompt("Monto pagado", String(credit.monthly_payment)); if (!amount || Number(amount) <= 0) return; await payMortgage(token, credit.id, Number(amount), new Date().toISOString().slice(0, 10)); await load(); await showHistory(credit.id); }
  async function showHistory(id: number) { const payments = await getMortgagePayments(token, id); setHistory((old) => ({ ...old, [id]: payments })); }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.history.back()} className="text-cyan-400">Volver</button><h1 className="mt-5 text-3xl font-bold">Cuotas e historial</h1><p className="mt-2 text-slate-400">Cada pago separa el interés del abono a capital y reduce el saldo de Deudas.</p><div className="mt-8 max-w-4xl space-y-4">{credits.map((credit) => <section key={credit.id} className="rounded-lg bg-slate-900 p-5"><div className="flex flex-wrap justify-between gap-3"><b>{credit.credit_type}: {credit.name}</b><div className="flex gap-3"><button className="text-cyan-400" onClick={() => void payment(credit)}>Registrar cuota</button><button className="text-slate-300" onClick={() => void showHistory(credit.id)}>Ver historial</button></div></div><p className="mt-2">Saldo actual: {formatCurrency(credit.current_balance)} · Cuota: {formatCurrency(credit.monthly_payment)}</p>{history[credit.id] && <div className="mt-4 border-t border-slate-700 pt-3"><b>Historial de cuotas</b>{history[credit.id].length === 0 ? <p className="mt-2 text-slate-400">Aún no hay pagos registrados.</p> : history[credit.id].map((item) => <p key={item.id} className="mt-2 text-sm text-slate-300">{item.paid_date}: pagaste {formatCurrency(item.amount)} — interés {formatCurrency(item.interest_amount)}, capital {formatCurrency(item.principal_amount)}</p>)}</div>}</section>)}</div></main>;
}
