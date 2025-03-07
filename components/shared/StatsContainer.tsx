import { DollarSign, TrendingUp, Box, CircleDollarSign } from "lucide-react";
import StatCard from "./StatCard";
import { InvoiceSummary } from "@/components/dashboard/types";

interface StatsContainerProps {
  translation: {
    StatsContainer: {
      receivables_balance: string;
      collected_revenue: string;
      waste_stock: string;
      profitability_rate: string;
    };
  };
  data: InvoiceSummary;
}

const StatsContainer = ({ translation, data }: StatsContainerProps) => {
  const stats = [
    {
      title: translation.StatsContainer.receivables_balance,
      value: data?.factures_partial.total - data?.factures_partial.paid_amount,
      icon: DollarSign,
      variant: "orange",
    },
    {
      title: translation.StatsContainer.collected_revenue,
      value: data?.paid_amount_partial_complete,
      icon: CircleDollarSign,
      variant: "green",
    },
    {
      title: translation.StatsContainer.waste_stock,
      value: Number(data?.ticket_net.entry) - Number(data?.ticket_net.exit),
      icon: Box,
      variant: "blue",
    },
    {
      title: translation.StatsContainer.profitability_rate,
      value: (data?.profit / data?.revenue) * 100,
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
          // Format the value to 2 decimal places
          value={
            typeof stat.value === "number" ? stat.value.toFixed(2) : "0.00"
          }
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  );
};

export default StatsContainer;
