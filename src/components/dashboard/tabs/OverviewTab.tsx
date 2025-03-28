
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, DollarSign, Users } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivities from '@/components/dashboard/RecentActivities';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';

interface OverviewTabProps {
  stats: any[];
  activities: any[];
  events: any[];
  isLoading: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  activities,
  events,
  isLoading
}) => {
  // Default stats if none provided
  const defaultStats = [
    {
      title: 'Dogs',
      value: '0',
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: 'Active dogs in your kennel'
    },
    {
      title: 'Litters',
      value: '0',
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: 'Current litters'
    },
    {
      title: 'Revenue',
      value: '$0',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: 'This month'
    },
    {
      title: 'Events',
      value: '0',
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: 'Upcoming'
    }
  ];

  const statsToDisplay = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsToDisplay.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl truncate">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <RecentActivities activities={activities} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl truncate">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <UpcomingEvents events={events} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
