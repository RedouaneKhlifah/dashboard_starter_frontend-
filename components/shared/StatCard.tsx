import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | null;
  icon: LucideIcon;
  variant: "orange" | "green" | "blue" | "red";
  loading?: boolean;
  unit: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  variant,
  loading = false,
  unit,
}: StatCardProps) => {
  const variantStyles = {
    orange: "bg-orange-400 dark:bg-orange-600",
    green: "bg-green-500 dark:bg-green-600",
    blue: "bg-blue-500 dark:bg-blue-600",
    red: "bg-red-500 dark:bg-red-600",
  };

  if (loading) {
    return (
      <div className="!w-full bg-card text-card-foreground p-4 rounded-[var(--radius)] border shadow-sm">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full animate-pulse">
            <div className="w-5 h-5" />
          </div>
          <div className="w-full">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card text-card-foreground p-4 rounded-[var(--radius)] border shadow-sm">
      <div className="flex items-center gap-3 w-full">
        <div className={`${variantStyles[variant]} p-3 rounded-full`}>
          <Icon className="text-white w-5 h-5" />
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm">{title}</h3>
          <div className="flex gap-2 items-center">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-sm text-gray-600">{unit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
