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
import { getCurrentUser, getDashboardSummary, getExpenses, getGoals, getIncomes } from "../../services/financial.service";
import type { DashboardSummary, Expense, Goal, Income, User } from "../../types/financial";

type Props = { token: string; onLogout: () => void };

export default function Dashboard({ token, onLogout }: Props) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentUser(token), getIncomes(token), getExpenses(token), getGoals(token), getDashboardSummary(token)])
      .then(([userData, incomeData, expenseData, goalData, summaryData]) => {
        setUser(userData);
        setIncomes(incomeData);
        setExpenses(expenseData);
        setGoals(goalData);
        setSummary(summaryData);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) onLogout();
        else setError("No fue posible cargar tus datos financieros.");
      })
      .finally(() => setLoading(false));
  }, [token, onLogout]);

  const incomeTotal = summary?.income_total ?? 0;
  const expenseTotal = summary?.expense_total ?? 0;
  const assetTotal = summary?.asset_total ?? 0;
  const liabilityTotal = summary?.liability_total ?? 0;
  const netWorth = summary?.net_worth ?? 0;
  const debtRate = summary?.debt_ratio ?? 0;
  const cashFlow = summary?.cash_flow ?? 0;
  const savingsRate = summary?.savings_rate ?? 0;
  const transactions = [
    ...incomes.map((item) => ({ id: item.id, title: item.name, amount: item.amount, type: "income" as const })),
    ...expenses.map((item) => ({ id: item.id, title: item.description || item.category, amount: item.amount, type: "expense" as const })),
  ].slice(0, 6);

  return (
    <Layout userName={user?.name ?? "Cargando..."} onLogout={onLogout}>
      {loading && <p className="text-slate-400">Cargando datos financieros...</p>}
      {error && <p className="mb-6 rounded-lg border border-red-900 bg-red-950 p-4 text-red-300">{error}</p>}

      {/* Tarjetas principales */}
      {!loading && <DashboardCards incomeTotal={incomeTotal} incomeCount={incomes.length} expenseTotal={expenseTotal} expenseCount={expenses.length} assetTotal={assetTotal} liabilityTotal={liabilityTotal} />}

      {/* Gráfico + IA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">

        <div className="xl:col-span-2">
          <WealthChart netWorth={netWorth} />
        </div>

        <AIAdvisor savingsRate={savingsRate} cashFlow={cashFlow} debtRate={debtRate} />

      </div>

      {/* Metas + Salud Financiera */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        <GoalsCardV2 goals={goals} />

        <FinancialHealth savingsRate={savingsRate} cashFlow={cashFlow} assetTotal={assetTotal} liabilityTotal={liabilityTotal} />

        <FinancialScore savingsRate={savingsRate} debtRate={debtRate} />

      </div>

      {/* Últimos movimientos */}
      <div className="mt-8">

        <RecentTransactions transactions={transactions} />

      </div>

    </Layout>
  );
}
