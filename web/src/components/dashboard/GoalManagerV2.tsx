import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createGoal, deleteGoal, getGoals, updateGoal } from "../../services/financial.service";
import type { Goal } from "../../types/financial";

const goalCategories = [
  "Fondo de emergencia", "Pago de deudas", "Vivienda", "Vehículo", "Educación", "Viajes",
  "Inversión", "Jubilación", "Negocio propio", "Compra importante", "Ahorro general", "Otra",
];

export default function GoalManagerV2({ token }: { token: string }) {
  const [items, setItems] = useState<Goal[]>([]);
  const [category, setCategory] = useState(goalCategories[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const load = () => getGoals(token).then(setItems);
  useEffect(() => { void load(); }, [token]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedCategory = category === "Otra" ? customCategory.trim() : category;
    if (!selectedCategory || !name.trim()) return;
    await createGoal(token, { name: `${selectedCategory}: ${name.trim()}`, target_amount: Number(target), current_amount: 0 });
    setCategory(goalCategories[0]); setCustomCategory(""); setName(""); setTarget(""); await load();
  }
  async function updateProgress(goal: Goal) {
    const value = window.prompt("Monto alcanzado hasta hoy", String(goal.current_amount));
    if (value === null || Number.isNaN(Number(value)) || Number(value) < 0) return;
    await updateGoal(token, goal.id, { name: goal.name, target_amount: goal.target_amount, current_amount: Number(value) });
    await load();
  }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.history.back()} className="text-cyan-400">Volver</button><h1 className="mt-5 text-3xl font-bold">Metas financieras</h1><form onSubmit={submit} className="mt-6 flex max-w-xl gap-3"><input className="flex-1 rounded bg-slate-800 p-3" placeholder="Ej. Fondo de emergencia" value={name} onChange={(e) => setName(e.target.value)} required /><input className="w-32 rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" placeholder="Meta" value={target} onChange={(e) => setTarget(e.target.value)} required /><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">Agregar</button></form><div className="mt-8 max-w-xl space-y-3">{items.map((item) => { const percent = Math.min(100, item.current_amount / item.target_amount * 100); return <div key={item.id} className="rounded-lg bg-slate-900 p-4"><div className="flex justify-between"><span>{item.name}</span><div className="flex gap-3"><button onClick={() => void updateProgress(item)} className="text-cyan-400">Actualizar</button><button onClick={() => void deleteGoal(token, item.id).then(load)} className="text-red-400">Eliminar</button></div></div><p className="mt-2 text-cyan-400">S/ {item.current_amount.toFixed(2)} de S/ {item.target_amount.toFixed(2)} · {percent.toFixed(0)}%</p><div className="mt-2 h-2 rounded bg-slate-700"><div className="h-2 rounded bg-cyan-400" style={{ width: `${percent}%` }} /></div></div>; })}</div></main>;
}
