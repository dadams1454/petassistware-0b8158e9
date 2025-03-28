
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Calendar, Activity, Scale } from 'lucide-react';
import { PuppyManagementStats } from '@/types/puppyTracking';

interface PuppyStatCardsProps {
  stats: PuppyManagementStats;
}

const PuppyStatCards: React.FC<PuppyStatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Baby className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Puppies</p>
              <h4 className="text-2xl font-bold text-purple-800 dark:text-purple-300">{stats.totalPuppies}</h4>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Litters</p>
              <h4 className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.activeLitters}</h4>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Upcoming Vaccines</p>
              <h4 className="text-2xl font-bold text-amber-800 dark:text-amber-300">{stats.upcomingVaccinations}</h4>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <Scale className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Recent Weight Checks</p>
              <h4 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{stats.recentWeightChecks}</h4>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyStatCards;
