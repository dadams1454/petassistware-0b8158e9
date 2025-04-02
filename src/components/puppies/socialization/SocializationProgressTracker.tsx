
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SocializationProgress } from '@/types/puppyTracking';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SocializationProgressTrackerProps {
  progressData: SocializationProgress[];
  overallProgress: number;
}

const SocializationProgressTracker: React.FC<SocializationProgressTrackerProps> = ({ 
  progressData,
  overallProgress
}) => {
  // Sort categories by completion percentage (descending)
  const sortedProgress = [...progressData].sort((a, b) => 
    (b.completion_percentage || 0) - (a.completion_percentage || 0)
  );
  
  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-blue-500';
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Socialization Progress</span>
          <span className="text-lg">{overallProgress}%</span>
        </CardTitle>
        <CardDescription>
          Overall socialization progress across all categories
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Progress
          value={overallProgress}
          className={`h-2 mb-6 ${getProgressBarColor(overallProgress)}`}
        />
        
        <div className="space-y-4">
          {sortedProgress.map((progress) => (
            <div key={progress.category_id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5">
                  {(progress.completion_percentage || 0) >= 100 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (progress.completion_percentage || 0) < 30 ? (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  ) : null}
                  <span>{progress.categoryName}</span>
                </div>
                <span className="font-medium">
                  {progress.count}/{progress.target}
                </span>
              </div>
              <Progress
                value={progress.completion_percentage}
                className={`h-1.5 ${getProgressBarColor(progress.completion_percentage || 0)}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocializationProgressTracker;
