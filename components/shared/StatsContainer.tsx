import { DollarSign, TrendingUp, Box, CircleDollarSign } from "lucide-react";
import StatCard from "./StatCard";

interface StatsContainerProps {
  translation: {
    StatsContainer: {
      receivables_balance: string;
      collected_revenue: string;
      waste_stock: string;
      profitability_rate: string;
    };
  };
}

const StatsContainer = ({ translation }: StatsContainerProps) => {
  const stats = [
    {
      title: translation.StatsContainer.receivables_balance,
      value: "0.00",
      icon: DollarSign,
      variant: "orange",
    },
    {
      title: translation.StatsContainer.collected_revenue,
      value: "136,254.00",
      icon: CircleDollarSign,
      variant: "green",
    },
    {
      title: translation.StatsContainer.waste_stock,
      value: "3,000,000 KG",
      icon: Box,
      variant: "blue",
    },
    {
      title: translation.StatsContainer.profitability_rate,
      value: "78.17%",
      icon: TrendingUp,
      variant: "red",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  );
};

export default StatsContainer;