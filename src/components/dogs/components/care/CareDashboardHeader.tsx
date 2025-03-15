
import React from 'react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface CareDashboardHeaderProps {
  date: Date;
  careCompletionPercentage: number;
  totalDogs: number;
  caredDogs: number;
}

const CareDashboardHeader: React.FC<CareDashboardHeaderProps> = ({
  date,
  careCompletionPercentage,
  totalDogs,
  caredDogs,
}) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center">
      <div>
        <h2 className="text-2xl font-bold">Daily Care Dashboard</h2>
        <p className="text-muted-foreground">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-sm text-muted-foreground">
          {caredDogs} of {totalDogs} dogs cared for
        </div>
        <Progress value={careCompletionPercentage} className="w-24" />
      </div>
    </div>
  );
};

export default CareDashboardHeader;
