import NetWorthCard from "./NetWorthCard";
import IncomeCards from "./IncomeCards";
import ExpensesCards from "./ExpensesCards";
import AssetsCard from "./AssetsCard";
import DebtsCard from "./DebtsCard";
import CashFlowCard from "./CashFlowCard";

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <NetWorthCard />
      <IncomeCards />
      <ExpensesCards />
      <AssetsCard />
      <DebtsCard />
      <CashFlowCard />
    </div>
  );
}