
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Calendar, Syringe, Weight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PuppyStatisticsProps {
  stats: {
    totalPuppies: number;
    activeLitters: number;
    upcomingVaccinations: number;
    recentWeightChecks: number;
  };
}

const PuppyStatCards: React.FC<PuppyStatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Puppies</p>
              <p className="text-2xl font-bold">{stats.totalPuppies}</p>
            </div>
            <Baby className="h-8 w-8 text-green-500 opacity-70" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Litters</p>
              <p className="text-2xl font-bold">{stats.activeLitters}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500 opacity-70" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 dark:bg-purple-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Vaccines</p>
              <p className="text-2xl font-bold">{stats.upcomingVaccinations}</p>
            </div>
            <div className="flex items-center">
              <Syringe className="h-8 w-8 text-purple-500 opacity-70 mr-2" />
              <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                Next 7 days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent Weight Checks</p>
              <p className="text-2xl font-bold">{stats.recentWeightChecks}</p>
            </div>
            <div className="flex items-center">
              <Weight className="h-8 w-8 text-amber-500 opacity-70 mr-2" />
              <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                Last 48 hours
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyStatCards;
