
import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Scale, TrendingUp, Calendar } from 'lucide-react';

interface WeightStatsProps {
  stats: {
    currentWeight: number;
    averageGrowth: number;
    weightUnit: string;
    growthRate: number;
    lastWeekGrowth: number;
    projectedWeight: number;
  };
}

const WeightStats: React.FC<WeightStatsProps> = ({ stats }) => {
  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">Current Weight</p>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">
                {formatNumber(stats.currentWeight)} {stats.weightUnit}
              </div>
              <p className="text-xs text-muted-foreground">
                Latest recorded weight
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">Average Growth</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">
                {formatNumber(stats.averageGrowth)} {stats.weightUnit}
              </div>
              <p className="text-xs text-muted-foreground">
                Daily average gain
              </p>
            </div>
            <div className="text-sm flex items-center">
              <span className={stats.growthRate >= 0 ? "text-green-600" : "text-red-600"}>
                {stats.growthRate >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1 inline" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1 inline" />
                )}
                {Math.abs(stats.growthRate).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">Last 7 Days</p>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">
                {formatNumber(stats.lastWeekGrowth)} {stats.weightUnit}
              </div>
              <p className="text-xs text-muted-foreground">
                Weight gain in past week
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted-foreground">Projected (4 Weeks)</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">
                {formatNumber(stats.projectedWeight)} {stats.weightUnit}
              </div>
              <p className="text-xs text-muted-foreground">
                Projected weight in 4 weeks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightStats;
