import { ArrowDownRight } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function ExpensesCards({ total, count, onView }: { total: number; count: number; onView?: () => void }) {
  const { formatCurrency } = useCurrency();
  return (
    <FinancialCard 
      title="Gastos registrados" 
      value={formatCurrency(total)} 
      subtitle={`${count} ${count === 1 ? "registro" : "registros"}`} 
      color="text-rose-400"
      icon={<ArrowDownRight size={20} className="text-rose-400" />}
      trend="down"
      onView={onView}
    />
  );
}
