import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createMortgage, deleteMortgage, getMortgages } from "../../services/financial.service";
import type { Mortgage } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function MortgageManager({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();

  const [items, setItems] = useState<Mortgage[]>([]);
  const [name, setName] = useState("Crédito hipotecario");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("240");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const load = () => getMortgages(token).then(setItems);
  useEffect(() => { void load(); }, [token]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createMortgage(token, { name, credit_type: "Hipotecario", credit_limit: null, principal: Number(principal), annual_interest_rate: Number(rate), term_months: Number(months), start_date: startDate });
    setPrincipal(""); setRate(""); await load();
  }
  async function remove(item: Mortgage) {
    if (!window.confirm(`¿Eliminar el plan \"${item.name}\"?`)) return;
    await deleteMortgage(token, item.id); await load();
  }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.history.back()} className="text-cyan-400">Volver</button><h1 className="mt-5 text-3xl font-bold">Crédito hipotecario</h1><p className="mt-2 text-slate-400">Registra el crédito para ver la cuota estimada y cómo se divide el próximo pago.</p><form onSubmit={submit} className="mt-6 grid max-w-4xl gap-3 md:grid-cols-3"><input className="rounded bg-slate-800 p-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required /><input className="rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Saldo o capital" required /><input className="rounded bg-slate-800 p-3" type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Interés anual (%)" required /><input className="rounded bg-slate-800 p-3" type="number" min="1" max="600" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="Plazo en meses" required /><input className="rounded bg-slate-800 p-3" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">Calcular y guardar</button></form><div className="mt-8 max-w-4xl space-y-4">{items.map((item) => <section key={item.id} className="rounded-lg bg-slate-900 p-5"><div className="flex justify-between gap-4"><h2 className="font-semibold">{item.name}</h2><button onClick={() => void remove(item)} className="text-red-400">Eliminar</button></div><p className="mt-2 text-slate-400">{formatCurrency(item.principal)} · {item.annual_interest_rate}% anual · {item.term_months} meses</p><div className="mt-4 grid gap-3 text-sm md:grid-cols-3"><p>Cuota mensual: <strong className="text-cyan-400">{formatCurrency(item.monthly_payment)}</strong></p><p>Próximo interés: <strong>{formatCurrency(item.next_interest)}</strong></p><p>Próximo abono a capital: <strong>{formatCurrency(item.next_principal)}</strong></p></div><p className="mt-3 text-slate-400">Intereses estimados del plazo: {formatCurrency(item.total_interest)}</p></section>)}</div></main>;
}
