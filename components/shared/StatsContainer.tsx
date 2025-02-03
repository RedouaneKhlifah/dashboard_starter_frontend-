import { FileText, ShoppingCart, Truck, Receipt } from 'lucide-react';
import StatCard from './StatCard';

const StatsContainer = () => {
  const stats = [
    {
      title: 'Devis',
      value: 0,
      icon: FileText,
      variant: 'orange',
    },
    {
      title: 'Bons de commandes',
      value: 0,
      icon: ShoppingCart,
      variant: 'green',
    },
    {
      title: 'Bons de livraison',
      value: 0,
      icon: Truck,
      variant: 'blue',
    },
    {
      title: 'Factures',
      value: 0,
      icon: Receipt,
      variant: 'red',
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