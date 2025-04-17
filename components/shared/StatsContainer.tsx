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
    shared: {
      currency: string;
    };
  };
  data: InvoiceSummary;
  loading: boolean;
}

const StatsContainer = ({
  translation,
  data,
  loading,
}: StatsContainerProps) => {
  const stats = [
    {
      title: translation.StatsContainer.receivables_balance,
      value:
        Number(data?.factures_partial.total) -
        Number(data?.factures_partial.paid_amount),
      icon: DollarSign,
      variant: "orange",
      unit: translation.shared.currency,
    },
    {
      title: translation.StatsContainer.waste_stock,
      value: Number(data?.total_stock),
      icon: Box,
      variant: "blue",
      unit: "Kg",
    },
    {
      title: translation.StatsContainer.profitability_rate,
      value:
        data?.revenue && Number(data?.revenue) !== 0
          ? (Number(data?.profit) / Number(data?.revenue)) * 100
          : 0,
      icon: TrendingUp,
      variant: "red",
      unit: "%",
    },
  ] as const;

  return (
    <>
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
          unit={stat.unit}
          loading={loading}
        />
      ))}
    </>
  );
};

export default StatsContainer;
