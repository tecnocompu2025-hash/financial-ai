import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createExpense, deleteExpense, getExpenses } from "../../services/financial.service";
import type { Expense } from "../../types/financial";

export default function ExpenseManager({ token }: { token: string }) {
  const [items, setItems] = useState<Expense[]>([]); const [description, setDescription] = useState(""); const [amount, setAmount] = useState("");
  const load = () => getExpenses(token).then(setItems); useEffect(() => { void load(); }, [token]);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await createExpense(token, { category: "General", description, amount: Number(amount), date: new Date().toISOString().slice(0, 10) }); setDescription(""); setAmount(""); await load(); }
  async function remove(id: number) { if (window.confirm("Eliminar este gasto?")) { await deleteExpense(token, id); await load(); } }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.location.assign("/")} className="text-cyan-400">Dashboard</button><h1 className="mt-5 text-3xl font-bold">Gastos</h1><form onSubmit={submit} className="mt-6 flex max-w-xl gap-3"><input className="flex-1 rounded bg-slate-800 p-3" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required /><input className="w-32 rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} required /><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">Agregar</button></form><div className="mt-8 max-w-xl space-y-3">{items.map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-900 p-4"><span>{item.description}</span><div className="flex gap-4"><span className="text-red-400">S/ {item.amount.toFixed(2)}</span><button onClick={() => void remove(item.id)} className="text-red-400">Eliminar</button></div></div>)}</div></main>;
}
