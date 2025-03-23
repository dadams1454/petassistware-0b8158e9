
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LitterStatisticsProps } from './types';
import { useStatistics } from './useStatistics';
import EmptyState from './EmptyState';
import WeightMetrics from './WeightMetrics';
import HealthStatus from './HealthStatus';

const LitterStatistics: React.FC<LitterStatisticsProps> = ({ 
  puppies,
  title = "Litter Statistics"
}) => {
  const { stats, hasData } = useStatistics(puppies);

  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <WeightMetrics stats={stats} />
        <HealthStatus stats={stats} />
      </CardContent>
    </Card>
  );
};

export default LitterStatistics;
