import NetWorthCard from "./NetWorthCard";
import IncomeCards from "./IncomeCards";
import ExpensesCards from "./ExpensesCards";
import AssetsCard from "./AssetsCard";
import DebtsCard from "./DebtsCard";
import CashFlowCard from "./CashFlowCard";

type Props = { 
  incomeTotal: number; 
  incomeCount: number; 
  expenseTotal: number; 
  expenseCount: number; 
  assetTotal: number; 
  liabilityTotal: number;
  onViewIncome?: () => void;
  onViewExpense?: () => void;
};

export default function DashboardCards({ incomeTotal, incomeCount, expenseTotal, expenseCount, assetTotal, liabilityTotal, onViewIncome, onViewExpense }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <NetWorthCard total={assetTotal - liabilityTotal} />
      <IncomeCards total={incomeTotal} count={incomeCount} onView={onViewIncome} />
      <ExpensesCards total={expenseTotal} count={expenseCount} onView={onViewExpense} />
      <AssetsCard total={assetTotal} />
      <DebtsCard total={liabilityTotal} />
      <CashFlowCard total={incomeTotal - expenseTotal} />
    </div>
  );
}
