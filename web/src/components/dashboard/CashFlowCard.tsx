import { Activity } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function CashFlowCard({ total }: { total: number }) {
  const { formatCurrency } = useCurrency();
  const isPositive = total >= 0;
  return (
    <FinancialCard 
      title="Flujo de caja" 
      value={formatCurrency(total)} 
      color={isPositive ? "text-cyan-400" : "text-rose-400"}
      icon={<Activity size={20} className={isPositive ? "text-cyan-400" : "text-rose-400"} />}
      trend={isPositive ? "up" : "down"}
      trendValue="Ingresos - Gastos"
    />
  );
}

