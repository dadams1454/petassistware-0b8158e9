
import React from 'react';
import { PuppyStatistics } from './types';

interface WeightMetricsProps {
  stats: PuppyStatistics;
}

const WeightMetrics: React.FC<WeightMetricsProps> = ({ stats }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Weight Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">Average Birth Weight</p>
          <p className="text-lg font-semibold">{stats.avgBirthWeight} oz</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">Average Current Weight</p>
          <p className="text-lg font-semibold">{stats.avgCurrentWeight} oz</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">Average Weight Gain</p>
          <p className="text-lg font-semibold">{stats.avgWeightGain} oz</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
          <p className="text-sm text-muted-foreground">Weight Gain %</p>
          <p className="text-lg font-semibold">{stats.avgWeightGainPercent}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeightMetrics;
