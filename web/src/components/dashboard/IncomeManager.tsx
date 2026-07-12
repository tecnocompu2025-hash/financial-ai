import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createIncome, getIncomes } from "../../services/financial.service";
import type { Income } from "../../types/financial";

export default function IncomeManager({ token }: { token: string }) {
  const [items, setItems] = useState<Income[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const load = () => getIncomes(token).then(setItems);
  useEffect(() => { void load(); }, [token]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    try { await createIncome(token, { name, amount: Number(amount), category: "General", frequency: "Mensual", is_passive: false }); setName(""); setAmount(""); await load(); }
    finally { setSaving(false); }
  }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.location.assign("/")} className="text-cyan-400">← Dashboard</button><h1 className="mt-5 text-3xl font-bold">Ingresos</h1><form onSubmit={submit} className="mt-6 flex max-w-xl gap-3"><input className="flex-1 rounded bg-slate-800 p-3" placeholder="Nombre del ingreso" value={name} onChange={(e) => setName(e.target.value)} required /><input className="w-32 rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} required /><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950" disabled={saving}>{saving ? "Guardando" : "Agregar"}</button></form><div className="mt-8 max-w-xl space-y-3">{items.length === 0 ? <p className="text-slate-400">Aún no tienes ingresos.</p> : items.map((item) => <div key={item.id} className="flex justify-between rounded-lg bg-slate-900 p-4"><span>{item.name}</span><span className="text-green-400">S/ {item.amount.toFixed(2)}</span></div>)}</div></main>;
}
