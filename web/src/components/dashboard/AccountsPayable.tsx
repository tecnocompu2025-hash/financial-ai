import { useCallback, useEffect, useState } from "react";
import { getExpenses, updateExpense, deleteExpense } from "../../services/financial.service";
import type { Expense } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function AccountsPayable({ token }: { token: string }) {
  const { formatCurrency } = useCurrency();
  const [items, setItems] = useState<Expense[]>([]);

  const load = useCallback(() => getExpenses(token).then(setItems), [token]);
  useEffect(() => { void load(); }, [load]);

  const pendingExpenses = items.filter(i => !i.is_paid);

  async function payExpense(expense: Expense) {
    if (!window.confirm(`¿Confirmas el pago de ${expense.description || expense.category}?`)) return;
    
    // We only update `is_paid` to true, sending the rest of the fields as they were
    const data = {
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      date: expense.date,
      is_essential: expense.is_essential,
      is_paid: true,
    };
    
    await updateExpense(token, expense.id, data);
    alert(`¡Pago registrado! El gasto "${expense.description || expense.category}" ahora aparecerá como pagado y sumará a tus reportes.`);
    await load();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="mt-5 text-3xl font-bold">Cuentas por Pagar</h1>
      <p className="mt-2 text-slate-400">Aquí se muestran todos los gastos que registraste como pendientes de pago.</p>
      
      {pendingExpenses.length === 0 ? (
        <div className="mt-8 rounded bg-slate-900 p-6 text-center text-slate-400">
          No tienes cuentas pendientes por pagar en este momento. ¡Excelente!
        </div>
      ) : (
        <div className="mt-8 max-w-3xl space-y-3">
          {pendingExpenses.map((item) => (
            <div key={item.id} className="flex justify-between items-center rounded bg-slate-900 p-4">
              <div className="flex flex-col">
                <span>
                  <strong className="text-slate-200">{item.description || item.category}</strong> 
                  <span className="text-slate-400 text-sm ml-1">({item.category})</span>
                </span>
                <span className="text-sm text-slate-400">
                  Fecha del registro: {item.date} {item.is_essential && <em className="ml-1 text-cyan-300">· Esencial</em>}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg">
                  {formatCurrency(item.amount, false, item.currency)}
                </span>
                <button 
                  onClick={() => void payExpense(item)} 
                  className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  Pagar
                </button>
                <button 
                  onClick={async () => {
                    await deleteExpense(token, item.id);
                    await load();
                  }} 
                  className="rounded bg-rose-500/10 px-4 py-2 font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
