import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createLiability, deleteLiability, getLiabilities } from "../../services/financial.service";
import type { Liability } from "../../types/financial";

const categories = ["Tarjeta de crédito", "Préstamo personal", "Crédito hipotecario", "Crédito vehicular", "Otras deudas"];

export default function LiabilityManagerV2({ token }: { token: string }) {
  const [items, setItems] = useState<Liability[]>([]); const [category, setCategory] = useState(categories[0]); const [balance, setBalance] = useState("");
  const load = () => getLiabilities(token).then(setItems); useEffect(() => { void load(); }, [token]);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); await createLiability(token, { name: category, category, balance: Number(balance) }); setBalance(""); await load(); }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.location.assign("/")} className="text-cyan-400">Dashboard</button><h1 className="mt-5 text-3xl font-bold">Deudas</h1><form onSubmit={submit} className="mt-6 flex max-w-xl gap-3"><select className="flex-1 rounded bg-slate-800 p-3" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((x) => <option key={x}>{x}</option>)}</select><input className="w-32 rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" placeholder="Saldo" value={balance} onChange={(e) => setBalance(e.target.value)} required /><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">Agregar</button></form><div className="mt-8 max-w-xl space-y-3">{items.map((item) => <div key={item.id} className="flex justify-between rounded-lg bg-slate-900 p-4"><span>{item.category}</span><div className="flex gap-4"><span className="text-red-400">S/ {item.balance.toFixed(2)}</span><button onClick={() => void deleteLiability(token, item.id).then(load)} className="text-red-400">Eliminar</button></div></div>)}</div></main>;
}
