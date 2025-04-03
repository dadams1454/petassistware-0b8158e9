
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SocializationProgress } from '@/types/puppyTracking';

interface SocializationProgressTrackerProps {
  progressData: SocializationProgress[];
  overallProgress: number;
}

const SocializationProgressTracker: React.FC<SocializationProgressTrackerProps> = ({
  progressData,
  overallProgress
}) => {
  const getCategoryColorClass = (category: string): string => {
    const colorMap: Record<string, string> = {
      'people': 'bg-blue-500',
      'animals': 'bg-green-500',
      'environments': 'bg-amber-500',
      'sounds': 'bg-purple-500',
      'handling': 'bg-pink-500',
      'surfaces': 'bg-red-500',
      'objects': 'bg-indigo-500',
      'travel': 'bg-cyan-500'
    };

    return colorMap[category] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {progressData.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No category data available yet
          </p>
        ) : (
          <div className="space-y-4">
            {progressData.map((item) => {
              const colorClass = getCategoryColorClass(item.category);
              
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span>{item.categoryName}</span>
                    <span className="font-medium">{item.count}/{item.target}</span>
                  </div>
                  <Progress value={item.completion_percentage} className={`h-1.5 ${colorClass}`} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocializationProgressTracker;
