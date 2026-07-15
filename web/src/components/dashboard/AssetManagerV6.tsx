import { useCallback, useEffect, useState } from "react";
import { createAsset, deleteAsset, getAssets, updateAsset } from "../../services/financial.service";
import type { Asset } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function AssetManagerV6({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();

  const [items, setItems] = useState<Asset[]>([]); const [edit, setEdit] = useState<Asset | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(() => getAssets(token).then(setItems), [token]); useEffect(() => { void load(); }, [load]);
  async function save(event: React.FormEvent<HTMLFormElement>) { 
    event.preventDefault(); 
    const form = new FormData(event.currentTarget); 
    const category = String(form.get("category")); 
    const data = { 
      name: category, 
      category, 
      value: Number(form.get("value")), 
      currency: String(form.get("currency")),
      classification: String(form.get("classification")) as Asset["classification"] 
    }; 
    try {
      if (edit) { await updateAsset(token, edit.id, data); setEdit(null); } 
      else await createAsset(token, data); 
      event.currentTarget.reset(); 
      setError("");
      await load(); 
    } catch (e: any) {
      setError(e.message || "Error al guardar el activo.");
    }
  }
  
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <button onClick={() => window.history.back()} className="text-cyan-400">Volver</button>
      <h1 className="mt-5 text-3xl font-bold">Patrimonio (Activos y Cuentas)</h1>
      <p className="mt-2 text-slate-400">Registra tus inversiones, propiedades y mantén tus cuentas bancarias ordenadas.</p>
      {error && <p className="mt-3 text-red-400">{error}</p>}
      
      <datalist id="asset-categories">
        <option value="Cuenta Bancaria (Ahorros)" />
        <option value="Cuenta Bancaria (Corriente)" />
        <option value="Inversión / Acciones" />
        <option value="Bienes Raíces" />
        <option value="Efectivo" />
      </datalist>

      <form key={edit?.id ?? "new"} onSubmit={save} className="mt-6 flex max-w-4xl flex-wrap gap-3">
        <input name="category" list="asset-categories" defaultValue={edit?.category} className="flex-1 rounded bg-slate-800 p-3" placeholder="Ej: Cuenta BCP Soles" required />
        <select name="currency" defaultValue={edit?.currency || "PEN"} className="rounded bg-slate-800 p-3" required>
          <option value="PEN">S/ (PEN)</option>
          <option value="USD">$ (USD)</option>
        </select>
        <input name="value" type="number" min="0.01" step="0.01" defaultValue={edit?.value} className="w-32 rounded bg-slate-800 p-3" placeholder="Saldo/Valor" required />
        <select name="classification" defaultValue={edit?.classification ?? "non_productive"} className="rounded bg-slate-800 p-3">
          <option value="productive">Productivo (Genera ingresos)</option>
          <option value="non_productive">No productivo (Ej. Cuenta sueldo)</option>
        </select>
        <button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">{edit ? "Guardar" : "Agregar"}</button>
        {edit && <button type="button" onClick={() => setEdit(null)}>Cancelar</button>}
      </form>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 max-w-6xl">
        {/* Cuentas y Liquidez */}
        <div>
          <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-800 pb-2 mb-4">Liquidez y Cuentas</h2>
          <div className="space-y-3">
            {items.filter(i => i.category.toLowerCase().includes("cuenta") || i.category.toLowerCase().includes("efectivo") || i.category.toLowerCase().includes("banco")).length === 0 && (
              <p className="text-slate-500 text-sm">No tienes cuentas bancarias ni efectivo registrado.</p>
            )}
            {items.filter(i => i.category.toLowerCase().includes("cuenta") || i.category.toLowerCase().includes("efectivo") || i.category.toLowerCase().includes("banco")).map((item) => (
              <div key={item.id} className="flex flex-col justify-between rounded bg-slate-900 p-4 border border-slate-800 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-200">{item.name || item.category}</span>
                  <span className="font-bold text-lg text-emerald-400">{formatCurrency(item.value, false, item.currency)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <em className="text-cyan-500">{item.classification === "productive" ? "Genera Intereses" : "Uso Diario"}</em>
                  <div>
                    <button onClick={() => setEdit(item)} className="text-slate-400 hover:text-cyan-400 mr-3">Editar</button>
                    <button onClick={() => void deleteAsset(token, item.id).then(load)} className="text-slate-400 hover:text-red-400">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inversiones y Propiedades */}
        <div>
          <h2 className="text-xl font-bold text-purple-400 border-b border-slate-800 pb-2 mb-4">Inversiones y Propiedades</h2>
          <div className="space-y-3">
            {items.filter(i => !(i.category.toLowerCase().includes("cuenta") || i.category.toLowerCase().includes("efectivo") || i.category.toLowerCase().includes("banco"))).length === 0 && (
              <p className="text-slate-500 text-sm">No tienes inversiones ni propiedades registradas.</p>
            )}
            {items.filter(i => !(i.category.toLowerCase().includes("cuenta") || i.category.toLowerCase().includes("efectivo") || i.category.toLowerCase().includes("banco"))).map((item) => (
              <div key={item.id} className="flex flex-col justify-between rounded bg-slate-900 p-4 border border-slate-800 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-200">{item.name || item.category}</span>
                  <span className="font-bold text-lg text-emerald-400">{formatCurrency(item.value, false, item.currency)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <em className="text-purple-400">{item.classification === "productive" ? "Rentable" : "Fijo"}</em>
                  <div>
                    <button onClick={() => setEdit(item)} className="text-slate-400 hover:text-cyan-400 mr-3">Editar</button>
                    <button onClick={() => void deleteAsset(token, item.id).then(load)} className="text-slate-400 hover:text-red-400">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
