import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";

import DashboardCards from "../../components/dashboard/DashboardCards";
import AIAdvisor from "../../components/dashboard/AIAdvisor";
import GoalsCardV2 from "../../components/dashboard/GoalsCardV2";
import FinancialHealth from "../../components/dashboard/FinancialHealth";
import FinancialScore from "../../components/dashboard/FinancialScore";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

import WealthChart from "../../components/charts/WealthChart";
import { ApiError } from "../../services/api";
import { createExpense, getCurrentUser, getDashboardSummary, getExpenses, getGoals, getIncomes, getProfile } from "../../services/financial.service";
import type { DashboardSummary, Expense, Goal, Income, User, Profile } from "../../types/financial";
import { useCurrency } from "../../contexts/CurrencyContext";
import FundCard from "../../components/dashboard/FundCard";

type Props = { token: string; onLogout: () => void };

export default function Dashboard({ token, onLogout }: Props) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [payFund, setPayFund] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("PEN");
  const [payDesc, setPayDesc] = useState("");
  const [payAccount, setPayAccount] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [viewFund, setViewFund] = useState<string | null>(null);
  const [viewList, setViewList] = useState<"income" | "expense" | null>(null);

  useEffect(() => {
    Promise.all([getCurrentUser(token), getIncomes(token), getExpenses(token), getGoals(token), getDashboardSummary(token), getProfile(token)])
      .then(([userData, incomeData, expenseData, goalData, summaryData, profileData]) => {
        setUser(userData);
        setIncomes(incomeData);
        setExpenses(expenseData);
        setGoals(goalData);
        setSummary(summaryData);
        setProfile(profileData);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) onLogout();
        else setError("No fue posible cargar tus datos financieros.");
      })
      .finally(() => setLoading(false));
  }, [token, onLogout]);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payFund || !payAmount) return;
    setIsPaying(true);
    try {
      await createExpense(token, {
        amount: Number(payAmount),
        currency: payCurrency,
        category: payFund,
        description: payAccount ? `${payDesc} - ${payAccount}` : payDesc,
        date: new Date().toISOString().split("T")[0],
        is_essential: false
      });
      const [newExpenses, newSummary] = await Promise.all([getExpenses(token), getDashboardSummary(token)]);
      setExpenses(newExpenses);
      setSummary(newSummary);
      setPayFund(null);
      setPayAmount("");
      setPayDesc("");
      setPayAccount("");
    } catch (err) {
      alert("No se pudo procesar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  const { baseCurrency, exchangeRate } = useCurrency();

  const calculateTotal = (amounts: Record<string, number> | undefined) => {
    if (!amounts) return 0;
    let total = 0;
    for (const [curr, amt] of Object.entries(amounts)) {
      if (curr === baseCurrency) {
        total += amt;
      } else if (curr === "USD" && baseCurrency !== "USD") {
        total += exchangeRate > 0 ? amt * exchangeRate : amt;
      } else if (curr !== "USD" && baseCurrency === "USD") {
        total += exchangeRate > 0 ? amt / exchangeRate : amt;
      } else {
        // Fallback for unknown conversions, assume 1:1 if rate not available
        total += amt;
      }
    }
    return total;
  };

  const incomeTotal = calculateTotal(summary?.income_total);
  const expenseTotal = calculateTotal(summary?.expense_total);
  const assetTotal = calculateTotal(summary?.asset_total);
  const liabilityTotal = calculateTotal(summary?.liability_total);
  const cashFlow = incomeTotal - expenseTotal;
  const netWorth = assetTotal - liabilityTotal;
  const savingsRate = incomeTotal > 0 ? (cashFlow / incomeTotal) * 100 : 0;
  const debtRate = assetTotal > 0 ? (liabilityTotal / assetTotal) * 100 : 0;
  const transactions = [
    ...incomes.map((item) => ({ id: item.id, title: item.name, amount: item.amount, type: "income" as const })),
    ...expenses.map((item) => ({ id: item.id, title: item.description || item.category, amount: item.amount, type: "expense" as const })),
  ].slice(0, 6);

  // Calcular Gastos específicos para Fondos
  const donationSpent = expenses
    .filter(e => e.category.toLowerCase().includes("donación") || e.category.toLowerCase().includes("donacion"))
    .reduce((sum, e) => {
      if (e.currency === baseCurrency) return sum + e.amount;
      if (e.currency === "USD" && baseCurrency !== "USD") return sum + (exchangeRate > 0 ? e.amount * exchangeRate : e.amount);
      if (e.currency !== "USD" && baseCurrency === "USD") return sum + (exchangeRate > 0 ? e.amount / exchangeRate : e.amount);
      return sum + e.amount;
    }, 0);
    
  const qolSpent = expenses
    .filter(e => e.category.toLowerCase().includes("calidad de vida"))
    .reduce((sum, e) => {
      if (e.currency === baseCurrency) return sum + e.amount;
      if (e.currency === "USD" && baseCurrency !== "USD") return sum + (exchangeRate > 0 ? e.amount * exchangeRate : e.amount);
      if (e.currency !== "USD" && baseCurrency === "USD") return sum + (exchangeRate > 0 ? e.amount / exchangeRate : e.amount);
      return sum + e.amount;
    }, 0);

  const hasFunds = profile && ((profile.donation_percentage ?? 0) > 0 || (profile.quality_of_life_percentage ?? 0) > 0);

  return (
    <Layout userName={user?.name ?? "Cargando..."} onLogout={onLogout}>
      {/* Header and Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Hola, {user?.name?.split(" ")[0] ?? "Miembro"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Aquí está el resumen de tu estado financiero actual.
        </p>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/40">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-400 animate-pulse">Cargando datos financieros...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-400 backdrop-blur-sm">
          <p className="flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8 fade-in">
          {/* Tarjetas principales */}
          <DashboardCards 
            incomeTotal={incomeTotal} 
            incomeCount={incomes.length} 
            expenseTotal={expenseTotal} 
            expenseCount={expenses.length} 
            assetTotal={assetTotal} 
            liabilityTotal={liabilityTotal} 
            onViewIncome={() => setViewList("income")}
            onViewExpense={() => setViewList("expense")}
          />

          {/* Fondos Virtuales */}
          {hasFunds && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FundCard 
                title="Donaciones" 
                icon="🕊️" 
                percentage={profile?.donation_percentage ?? 0} 
                totalIncome={incomeTotal} 
                spentAmount={donationSpent} 
                colorClass="text-emerald-400" 
                onPay={setPayFund}
                onView={setViewFund}
              />
              <FundCard 
                title="Calidad de Vida" 
                icon="🥂" 
                percentage={profile?.quality_of_life_percentage ?? 0} 
                totalIncome={incomeTotal} 
                spentAmount={qolSpent} 
                colorClass="text-fuchsia-400" 
                onPay={setPayFund}
                onView={setViewFund}
              />
            </div>
          )}

          {/* Gráfico + IA */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <WealthChart netWorth={netWorth} />
            </div>
            <div className="h-[400px] xl:h-auto">
              <AIAdvisor savingsRate={savingsRate} cashFlow={cashFlow} debtRate={debtRate} />
            </div>
          </div>

          {/* Metas + Salud Financiera */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2 h-[450px]">
              <GoalsCardV2 goals={goals} />
            </div>
            <div className="flex flex-col gap-8">
              <FinancialScore savingsRate={savingsRate} debtRate={debtRate} />
              <FinancialHealth savingsRate={savingsRate} cashFlow={cashFlow} assetTotal={assetTotal} liabilityTotal={liabilityTotal} />
            </div>
          </div>

          {/* Últimos movimientos */}
          <div>
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      )}

      {/* Modal de Pago de Fondo */}
      {payFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleProcessPayment} className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-white">Pago: {payFund}</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm text-slate-400">Monto</label>
                  <input type="number" step="0.01" min="0.01" required value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="w-full rounded bg-slate-800 p-2.5 text-white" placeholder="Ej. 50" />
                </div>
                <div className="w-1/3">
                  <label className="mb-1 block text-sm text-slate-400">Moneda</label>
                  <select value={payCurrency} onChange={(e) => setPayCurrency(e.target.value)} className="w-full rounded bg-slate-800 p-2.5 text-white">
                    <option value="PEN">PEN (S/)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">Motivo (Opcional)</label>
                <input type="text" value={payDesc} onChange={(e) => setPayDesc(e.target.value)} className="w-full rounded bg-slate-800 p-2.5 text-white" placeholder="Ej. Donación Iglesia" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-400">¿De dónde se paga? (Opcional)</label>
                <input type="text" value={payAccount} onChange={(e) => setPayAccount(e.target.value)} className="w-full rounded bg-slate-800 p-2.5 text-white" placeholder="Ej. BCP Soles, Efectivo..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPayFund(null)} className="rounded px-4 py-2 font-medium text-slate-300 hover:bg-slate-800" disabled={isPaying}>Cancelar</button>
              <button type="submit" disabled={isPaying} className="rounded bg-cyan-500 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
                {isPaying ? "Procesando..." : "Confirmar Pago"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Historial de Fondo */}
      {viewFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Historial: {viewFund}</h2>
              <button onClick={() => setViewFund(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const fundExpenses = expenses.filter(e => 
                  viewFund === "Donaciones" 
                    ? (e.category.toLowerCase().includes("donación") || e.category.toLowerCase().includes("donacion")) 
                    : e.category.toLowerCase().includes("calidad de vida")
                );
                
                if (fundExpenses.length === 0) {
                  return <p className="text-slate-400 text-center py-6">No hay pagos registrados aún en este fondo.</p>;
                }

                return fundExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
                  <div key={exp.id} className="flex justify-between items-center bg-slate-800 p-3 rounded">
                    <div>
                      <p className="font-semibold text-sm text-slate-200">{exp.description || exp.category}</p>
                      <p className="text-xs text-slate-400">{exp.date}</p>
                    </div>
                    <p className="font-bold text-rose-400">-{exp.currency} {exp.amount.toFixed(2)}</p>
                  </div>
                ));
              })()}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setViewFund(null)} className="rounded bg-slate-800 px-4 py-2 font-medium text-slate-300 hover:bg-slate-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial General (Ingresos/Gastos) */}
      {viewList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Historial: {viewList === "income" ? "Ingresos" : "Gastos"}</h2>
              <button onClick={() => setViewList(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            
            <div className="space-y-3">
              {(() => {
                const list = viewList === "income" 
                  ? incomes.slice().sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                  : expenses.slice().sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
                
                if (list.length === 0) {
                  return <p className="text-slate-400 text-center py-6">No hay registros aún.</p>;
                }

                return list.map(item => {
                  const isIncome = viewList === "income";
                  const date = isIncome ? (item as Income).created_at : (item as Expense).date;
                  const title = isIncome ? (item as Income).name : ((item as Expense).description || (item as Expense).category);
                  return (
                    <div key={item.id} className="flex justify-between items-center bg-slate-800 p-3 rounded">
                      <div>
                        <p className="font-semibold text-sm text-slate-200">{title}</p>
                        <p className="text-xs text-slate-400">{date ? date.split("T")[0] : ""}</p>
                      </div>
                      <p className={`font-bold ${isIncome ? "text-emerald-400" : "text-rose-400"}`}>
                        {isIncome ? "+" : "-"}{item.currency} {item.amount.toFixed(2)}
                      </p>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setViewList(null)} className="rounded bg-slate-800 px-4 py-2 font-medium text-slate-300 hover:bg-slate-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
