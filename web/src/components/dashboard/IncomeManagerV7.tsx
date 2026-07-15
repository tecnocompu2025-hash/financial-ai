import { useCallback, useEffect, useState } from "react";
import { createIncome, deleteIncome, getIncomes, updateIncome, getProfile } from "../../services/financial.service";
import type { Income, Profile } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";
import { HelpCircle } from "lucide-react";

const DEFAULT_INCOME_CATEGORIES = [
  "Salario", "Honorarios", "Inversiones", 
  "Venta de bienes", "Regalos", "Otros"
];

const BANKS_BY_COUNTRY: Record<string, string[]> = {
  "Perú": [
    "BCP", "Interbank", "BBVA", "Scotiabank", 
    "BanBif", "Banco Pichincha", "Banco de la Nación", 
    "Caja Arequipa", "Caja Huancayo", "Efectivo"
  ],
  "Colombia": ["Bancolombia", "Davivienda", "Banco de Bogotá", "Nequi", "Daviplata", "Efectivo"],
  "México": ["BBVA", "Santander", "Banamex", "Banorte", "HSBC", "Efectivo"],
  "Chile": ["BancoEstado", "Banco de Chile", "Bci", "Santander", "Efectivo"],
  "Argentina": ["Banco Nación", "Galicia", "Santander", "BBVA", "Mercado Pago", "Efectivo"]
};

export default function IncomeManagerV7({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();
 
  const [items, setItems] = useState<Income[]>([]); 
  const [profile, setProfile] = useState<Profile | null>(null);
  const [category, setCategory] = useState(""); 
  const [amount, setAmount] = useState(""); 
  const [currency, setCurrency] = useState("PEN"); 
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [bankName, setBankName] = useState<string>("");
  const [edit, setEdit] = useState<Income | null>(null); 
  const [error, setError] = useState(""); 
  const load = useCallback(() => {
    getIncomes(token).then(setItems);
    getProfile(token).then(setProfile);
  }, [token]); 
  useEffect(() => { void load(); }, [load]); 

  // Extraer categorías y bancos personalizados únicos del historial del usuario
  const uniqueCategories = Array.from(new Set(items.map(i => i.category))).filter(c => !DEFAULT_INCOME_CATEGORIES.includes(c));
  
  const pastBanks = Array.from(new Set(items.map(i => {
    const match = i.name.match(/\(Depositado en (.+)\)/);
    return match ? match[1] : null;
  }).filter(Boolean))) as string[];

  async function save(e: React.FormEvent) { 
    e.preventDefault(); 
    if (!category.trim() || Number(amount) <= 0) { setError("Indica una categoría y un monto mayor que cero."); return; } 
    
    let finalName = category.trim();

    if (bankName.trim()) {
      finalName = `${finalName} (Depositado en ${bankName.trim()})`;
    }

    await createIncome(token, { name: finalName, category: category.trim(), amount: Number(amount), currency, frequency: "Mensual", is_passive: false, created_at: new Date(date).toISOString() }); 
    
    setCategory(""); setAmount(""); setCurrency("PEN"); setBankName(""); setDate(new Date().toISOString().split("T")[0]); setError(""); await load(); 
  }  
  
  async function saveEdit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault(); 
    if (!edit) return; 
    const form = new FormData(e.currentTarget); 
    const nextCategory = String(form.get("category")).trim(); 
    const nextAmount = Number(form.get("amount")); 
    const nextCurrency = String(form.get("currency"));
    if (!nextCategory || nextAmount <= 0) { setError("Indica datos válidos."); return; } 
    await updateIncome(token, edit.id, { name: nextCategory, category: nextCategory, amount: nextAmount, currency: nextCurrency, frequency: edit.frequency, is_passive: edit.is_passive }); 
    setEdit(null); setError(""); await load(); 
  } 
  
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <button onClick={() => window.history.back()} className="text-cyan-400">Volver</button>
      <h1 className="mt-5 text-3xl font-bold">Ingresos</h1>
      {error && <p className="mt-3 text-red-400">{error}</p>}
      
      <datalist id="income-categories">
        {DEFAULT_INCOME_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
        {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
      </datalist>

      <datalist id="country-banks">
        {(profile?.country && BANKS_BY_COUNTRY[profile.country] ? BANKS_BY_COUNTRY[profile.country] : BANKS_BY_COUNTRY["Perú"]).map(bank => <option key={bank} value={bank} />)}
        {pastBanks.filter(b => {
          const defaultList = profile?.country && BANKS_BY_COUNTRY[profile.country] ? BANKS_BY_COUNTRY[profile.country] : BANKS_BY_COUNTRY["Perú"];
          return !defaultList.includes(b);
        }).map(b => <option key={b} value={b} />)}
      </datalist>

      <form onSubmit={save} className="mt-6 flex flex-col gap-3 max-w-xl">
        <div className="flex gap-3 flex-wrap">
          <input list="income-categories" className="flex-1 rounded bg-slate-800 p-3" placeholder="Tipo de ingreso (Elige o escribe)" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <input type="date" className="rounded bg-slate-800 p-3 w-40 text-slate-300" value={date} onChange={(e) => setDate(e.target.value)} required />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded bg-slate-800 p-3" required>
            <option value="PEN">S/ (PEN)</option>
            <option value="USD">$ (USD)</option>
          </select>
          <input className="w-32 rounded bg-slate-800 p-3" type="number" min="0.01" step="0.01" placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative group">
            <HelpCircle className="w-5 h-5 text-slate-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 rounded bg-slate-800 p-2 text-xs text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-10 border border-slate-700 shadow-xl">
              Escribe o elige un banco de la lista. El banco ingresado se guardará en tu historial de ingresos para que puedas seleccionarlo rápidamente la próxima vez.
            </div>
          </div>
          <input 
            list="country-banks" 
            value={bankName} 
            onChange={(e) => setBankName(e.target.value)} 
            placeholder="¿A qué cuenta/banco ingresa? (Opcional)"
            className="flex-1 rounded bg-slate-800 p-3 text-slate-300"
          />
          <button className="rounded bg-cyan-500 px-5 font-semibold text-slate-950">Agregar Ingreso</button>
        </div>
      </form>
      
      {edit && (
        <form onSubmit={saveEdit} className="mt-5 flex max-w-xl gap-3 rounded bg-slate-900 p-4 flex-wrap">
          <input list="income-categories" name="category" defaultValue={edit.category} placeholder="Tipo de ingreso" className="flex-1 rounded bg-slate-800 p-3" required />
          <select name="currency" defaultValue={edit.currency} className="rounded bg-slate-800 p-3" required>
            <option value="PEN">S/ (PEN)</option>
            <option value="USD">$ (USD)</option>
          </select>
          <input name="amount" type="number" min="0.01" step="0.01" defaultValue={edit.amount} className="w-32 rounded bg-slate-800 p-3" required />
          <button className="text-cyan-400">Guardar</button>
          <button type="button" onClick={() => setEdit(null)}>Cancelar</button>
        </form>
      )}
      
      <div className="mt-8 max-w-xl space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between rounded bg-slate-900 p-4">
            <span>{item.category}</span>
            <span>
              {formatCurrency(item.amount, false, item.currency)} 
              <button onClick={() => setEdit(item)} className="ml-3 text-cyan-400">Editar</button>
              <button onClick={() => void deleteIncome(token, item.id).then(load)} className="ml-3 text-red-400">Eliminar</button>
            </span>
          </div>
        ))}
      </div>
    </main>
  ); 
}
