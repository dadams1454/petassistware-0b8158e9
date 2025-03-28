
import React from 'react';

interface ChecklistProgressProps {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
}

const ChecklistProgress: React.FC<ChecklistProgressProps> = ({
  completedTasks,
  totalTasks,
  percentage
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Daily Progress:</span>
        <span>{completedTasks} of {totalTasks} tasks ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className="bg-green-500 h-4 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ChecklistProgress;
