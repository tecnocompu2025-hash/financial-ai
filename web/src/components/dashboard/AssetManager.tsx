import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createAsset, deleteAsset, getAssets } from "../../services/financial.service";
import type { Asset } from "../../types/financial";
export default function AssetManager({ token }: { token: string }) {
  const [items, setItems] = useState<Asset[]>([]); const [name, setName] = useState(""); const [value, setValue] = useState("");
  const load = () => getAssets(token).then(setItems); useEffect(() => { void load(); }, [token]);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); await createAsset(token, { name, category: "Ahorro", value: Number(value) }); setName(""); setValue(""); await load(); }
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><button onClick={() => window.location.assign("/")} className="text-cyan-400">Dashboard</button><h1 className="mt-5 text-3xl font-bold">Activos</h1><form onSubmit={submit} className="mt-6 flex max-w-xl gap-3"><input className="flex-1 rounded bg-slate-800 p-3" placeholder="Activo: ahorro, inversión, propiedad" value={name} onChange={(e) => setName(e.target.value)} required /><input className="w-32 rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} required /><button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">Agregar</button></form><div className="mt-8 max-w-xl space-y-3">{items.map((item) => <div key={item.id} className="flex justify-between rounded-lg bg-slate-900 p-4"><span>{item.name}</span><div className="flex gap-4"><span className="text-green-400">S/ {item.value.toFixed(2)}</span><button onClick={() => void deleteAsset(token, item.id).then(load)} className="text-red-400">Eliminar</button></div></div>)}</div></main>;
}
