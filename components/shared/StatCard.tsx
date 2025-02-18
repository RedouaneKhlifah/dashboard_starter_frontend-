import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "orange" | "green" | "blue" | "red";
}

const StatCard = ({ title, value, icon: Icon, variant }: StatCardProps) => {
  const variantStyles = {
    orange: "bg-orange-400 dark:bg-orange-600",
    green: "bg-green-500 dark:bg-green-600",
    blue: "bg-blue-500 dark:bg-blue-600",
    red: "bg-red-500 dark:bg-red-600",
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-[var(--radius)] border shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`${variantStyles[variant]} p-3 rounded-full`}>
          <Icon className="text-white w-5 h-5" />
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
