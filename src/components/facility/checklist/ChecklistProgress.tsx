
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ChecklistProgressProps {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
}

const ChecklistProgress: React.FC<ChecklistProgressProps> = ({
  completedTasks,
  totalTasks,
  percentage,
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Daily Progress:</span>
        <span>
          {completedTasks} of {totalTasks} tasks ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} />
    </div>
  );
};

export default ChecklistProgress;
