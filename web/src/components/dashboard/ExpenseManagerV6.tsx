import { useCallback, useEffect, useState } from "react";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "../../services/financial.service";
import type { Expense } from "../../types/financial";

export default function ExpenseManagerV6({ token }: { token: string }) {
  const [items, setItems] = useState<Expense[]>([]);
  const [edit, setEdit] = useState<Expense | null>(null);
  const load = useCallback(() => getExpenses(token).then(setItems), [token]);
  useEffect(() => { void load(); }, [load]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = { category: String(form.get("category")), description: String(form.get("description")), amount: Number(form.get("amount")), date: String(form.get("date")), is_essential: form.get("is_essential") === "on" };
    if (edit) { await updateExpense(token, edit.id, data); setEdit(null); } else await createExpense(token, data);
    event.currentTarget.reset(); await load();
  }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.history.back()} className="text-cyan-400">Volver</button><h1 className="mt-5 text-3xl font-bold">Gastos</h1><form key={edit?.id ?? "new"} onSubmit={save} className="mt-6 flex max-w-3xl flex-wrap gap-3"><input name="category" defaultValue={edit?.category} placeholder="Categoría" className="flex-1 rounded bg-slate-800 p-3" required /><input name="description" defaultValue={edit?.description} placeholder="Descripción" className="flex-1 rounded bg-slate-800 p-3" required /><input name="amount" type="number" min="0.01" step="0.01" defaultValue={edit?.amount} placeholder="Monto" className="w-32 rounded bg-slate-800 p-3" required /><input name="date" type="date" defaultValue={edit?.date ?? new Date().toISOString().slice(0, 10)} className="rounded bg-slate-800 p-3" required /><label className="flex items-center gap-2 rounded bg-slate-800 px-3 text-sm"><input name="is_essential" type="checkbox" defaultChecked={edit?.is_essential} /> Esencial</label><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">{edit ? "Guardar" : "Agregar"}</button>{edit && <button type="button" onClick={() => setEdit(null)}>Cancelar</button>}</form><p className="mt-2 text-sm text-slate-400">Marca los gastos esenciales para calcular correctamente tu fondo de emergencia.</p><div className="mt-8 max-w-3xl space-y-3">{items.map((item) => <div key={item.id} className="flex justify-between rounded bg-slate-900 p-4"><span>{item.category}{item.is_essential && <em className="text-cyan-300"> · Esencial</em>} · {item.date}</span><span>S/ {item.amount.toFixed(2)} <button onClick={() => setEdit(item)} className="ml-3 text-cyan-400">Editar</button><button onClick={() => void deleteExpense(token, item.id).then(load)} className="ml-3 text-red-400">Eliminar</button></span></div>)}</div></main>;
}
