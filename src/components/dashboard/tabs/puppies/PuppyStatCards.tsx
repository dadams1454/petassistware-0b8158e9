
import React from 'react';
import { PuppyManagementStats } from '@/types/puppyTracking';
import { Baby, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface PuppyStatCardsProps {
  stats: PuppyManagementStats;
}

const PuppyStatCards: React.FC<PuppyStatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Puppies',
      value: stats.totalPuppies,
      icon: <Baby className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      title: 'Available',
      value: stats.availableCount || stats.availablePuppies || 0,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      color: 'bg-green-50 text-green-700 border-green-100'
    },
    {
      title: 'Reserved',
      value: stats.reservedCount || stats.reservedPuppies || 0,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      title: 'Sold',
      value: stats.soldCount || stats.soldPuppies || 0,
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-50 text-purple-700 border-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex items-center p-4 rounded-lg border ${card.color}`}
        >
          <div className="mr-4">{card.icon}</div>
          <div>
            <p className="text-sm font-medium">{card.title}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PuppyStatCards;
