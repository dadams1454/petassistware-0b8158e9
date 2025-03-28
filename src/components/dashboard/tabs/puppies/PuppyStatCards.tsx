
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PuppyManagementStats } from '@/types/puppyTracking';
import { Baby, Calendar, Syringe, Weight } from 'lucide-react';

interface PuppyStatCardsProps {
  stats: PuppyManagementStats;
}

const PuppyStatCards: React.FC<PuppyStatCardsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Puppies',
      value: stats.totalPuppies,
      icon: <Baby className="h-5 w-5 text-primary" />,
      description: 'All puppies currently tracked'
    },
    {
      title: 'Active Litters',
      value: stats.activeLitters,
      icon: <Calendar className="h-5 w-5 text-indigo-500" />,
      description: 'Litters with active puppies'
    },
    {
      title: 'Upcoming Vaccinations',
      value: stats.upcomingVaccinations,
      icon: <Syringe className="h-5 w-5 text-amber-500" />,
      description: 'Due in the next 7 days'
    },
    {
      title: 'Recent Weight Checks',
      value: stats.recentWeightChecks,
      icon: <Weight className="h-5 w-5 text-emerald-500" />,
      description: 'Recorded in the last 48 hours'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
              <div className="bg-primary/10 p-2 rounded-full">{item.icon}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{item.value}</span>
              <span className="text-xs text-muted-foreground mt-1">{item.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PuppyStatCards;
