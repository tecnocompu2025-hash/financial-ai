import { TrendingUp } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function AssetsCard({ total }: { total: number }) {
  const { formatCurrency } = useCurrency();
  return (
    <FinancialCard 
      title="Activos Totales" 
      value={formatCurrency(total)} 
      color="text-emerald-400"
      icon={<TrendingUp size={20} className="text-emerald-400" />}
      trend="up"
      subtitle="Recursos que ponen dinero en tu bolsillo"
    />
  );
}

