
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WeightRecord } from '../../types/dog';

interface WeightStatCardsProps {
  weightHistory: WeightRecord[];
  growthStats: any;
}

const WeightStatCards: React.FC<WeightStatCardsProps> = ({ weightHistory, growthStats }) => {
  if (!weightHistory || weightHistory.length === 0) {
    return null;
  }

  const currentWeight = weightHistory[0];
  const firstWeight = weightHistory[weightHistory.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold mb-1">
            {currentWeight.weight} {currentWeight.weight_unit}
          </div>
          <p className="text-muted-foreground text-sm">Current Weight</p>
        </CardContent>
      </Card>
      
      {growthStats.totalGrowth !== null && (
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold mb-1">
              {growthStats.totalGrowth.toFixed(2)} lbs
            </div>
            <p className="text-muted-foreground text-sm">Total Growth</p>
          </CardContent>
        </Card>
      )}
      
      {growthStats.averageGrowthRate !== null && (
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold mb-1">
              {growthStats.averageGrowthRate.toFixed(2)} lbs/day
            </div>
            <p className="text-muted-foreground text-sm">Average Growth Rate</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeightStatCards;
