import Layout from "../../components/layout/Layout";

import DashboardCards from "../../components/dashboard/DashboardCards";
import AIAdvisor from "../../components/dashboard/AIAdvisor";
import GoalsCard from "../../components/dashboard/GoalsCard";
import FinancialHealth from "../../components/dashboard/FinancialHealth";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

import WealthChart from "../../components/charts/WealthChart";

export default function Dashboard() {
  return (
    <Layout>

      {/* Tarjetas principales */}
      <DashboardCards />

      {/* Gráfico + IA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">

        <div className="xl:col-span-2">
          <WealthChart />
        </div>

        <AIAdvisor />

      </div>

      {/* Metas + Salud Financiera */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        <GoalsCard />

        <FinancialHealth />

      </div>

      {/* Últimos movimientos */}
      <div className="mt-8">

        <RecentTransactions />

      </div>

    </Layout>
  );
}