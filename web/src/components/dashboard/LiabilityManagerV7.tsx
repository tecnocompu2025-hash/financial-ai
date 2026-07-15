import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLiability, deleteLiability, getLiabilities, updateLiability } from "../../services/financial.service";
import type { Liability } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";
const suggestions = ["Préstamo familiar", "Tarjeta de crédito", "Tarjeta de tienda", "Servicios pendientes", "Impuestos pendientes", "Deuda médica", "Préstamo estudiantil", "Deuda de negocio", "Alquiler pendiente", "Otra deuda"];
export default function LiabilityManagerV7({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const [items, setItems] = useState<Liability[]>([]);
  const [edit, setEdit] = useState<Liability | null>(null);
  
  const load = useCallback(() => getLiabilities(token).then(setItems), [token]);
  
  useEffect(() => { void load(); }, [load]);
  
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const category = String(form.get("category"));
    const data = {
      name: category,
      category,
      balance: Number(form.get("balance")),
      currency: String(form.get("currency")),
      classification: String(form.get("classification")) as Liability["classification"],
      annual_interest_rate: Number(form.get("annual_interest_rate"))
    };
    if (edit) {
      await updateLiability(token, edit.id, data);
      setEdit(null);
    } else {
      await createLiability(token, data);
    }
    event.currentTarget.reset();
    await load();
  }
  
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="flex justify-between items-center">
        <button onClick={() => window.history.back()} className="text-cyan-400">Volver</button>
        <button onClick={() => navigate("/credit-history")} className="rounded bg-cyan-900 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-800">
          Ver Historial
        </button>
      </div>
      <h1 className="mt-5 text-3xl font-bold">Registrar deuda</h1>
      <p className="mt-2 text-slate-400">Registra el costo para identificar qué deuda conviene priorizar.</p>
      
      <datalist id="debt-categories">
        {suggestions.map((item) => <option key={item}>{item}</option>)}
      </datalist>

      <form key={edit?.id ?? "new"} onSubmit={save} className="mt-6 flex max-w-4xl flex-wrap gap-3">
        <input name="category" list="debt-categories" defaultValue={edit?.category} className="flex-1 rounded bg-slate-800 p-3" placeholder="Tipo de deuda" required />
        <select name="currency" defaultValue={edit?.currency || "PEN"} className="rounded bg-slate-800 p-3" required>
          <option value="PEN">S/ (PEN)</option>
          <option value="USD">$ (USD)</option>
        </select>
        <input name="balance" type="number" min="0.01" step="0.01" defaultValue={edit?.balance} className="w-32 rounded bg-slate-800 p-3" placeholder="Saldo" required />
        <input name="annual_interest_rate" type="number" min="0" max="1000" step="0.01" defaultValue={edit?.annual_interest_rate ?? 0} className="w-28 rounded bg-slate-800 p-3" placeholder="Interés %" required />
        <select name="classification" defaultValue={edit?.classification ?? "bad"} className="rounded bg-slate-800 p-3">
          <option value="good">Buena (Ej. Hipoteca)</option>
          <option value="bad">Mala (Ej. Tarjeta)</option>
        </select>
        <button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">{edit ? "Guardar" : "Agregar"}</button>
        {edit && <button type="button" onClick={() => setEdit(null)}>Cancelar</button>}
      </form>
      
      <div className="mt-8 max-w-4xl space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between rounded bg-slate-900 p-4">
            <span>{item.category} <em className="text-cyan-300">· {item.classification === "good" ? "Buena" : "Mala"} · {item.annual_interest_rate}%</em></span>
            <span>
              {formatCurrency(item.balance, false, item.currency)} 
              <button onClick={() => setEdit(item)} className="ml-3 text-cyan-400">Editar</button>
              <button onClick={() => void deleteLiability(token, item.id).then(load)} className="ml-3 text-red-400">Eliminar</button>
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
