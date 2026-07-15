import { Landmark } from "lucide-react";
import FinancialCard from "./FinancialCard";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function DebtsCard({ total }: { total: number }) {
  const { formatCurrency } = useCurrency();
  return (
    <FinancialCard 
      title="Pasivos (Deudas)" 
      value={formatCurrency(total)} 
      color="text-rose-400"
      icon={<Landmark size={20} className="text-rose-400" />}
      trend="down"
      subtitle="Recursos que sacan dinero de tu bolsillo"
    />
  );
}

