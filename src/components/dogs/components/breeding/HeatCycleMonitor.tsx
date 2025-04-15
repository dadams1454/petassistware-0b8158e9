
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHeatCycles } from '@/hooks/useHeatCycles';
import { format, parseISO, addDays } from 'date-fns';
import { CalendarDays, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface HeatCycleMonitorProps {
  dogId: string;
  refreshKey?: number;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({ dogId, refreshKey }) => {
  const { heatCycles, averageCycleLength, isLoading, error } = useHeatCycles(dogId);
  
  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Heat Cycle Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="mt-4 border-red-200 bg-red-50">
        <CardContent className="text-red-700 p-4">
          Error loading heat cycle data: {(error as Error).message}
        </CardContent>
      </Card>
    );
  }
  
  const lastHeatCycle = heatCycles && heatCycles.length > 0 ? heatCycles[0] : null;
  
  const calculateNextHeatDate = () => {
    if (!lastHeatCycle || !averageCycleLength) return null;
    
    const lastStartDate = typeof lastHeatCycle.start_date === 'string' 
      ? parseISO(lastHeatCycle.start_date) 
      : lastHeatCycle.start_date;
      
    return addDays(lastStartDate, averageCycleLength);
  };
  
  const nextHeatDate = calculateNextHeatDate();
  
  // Helper function to safely format dates
  const formatDateValue = (dateValue: string | Date | undefined) => {
    if (!dateValue) return '';
    
    const dateObj = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
    return format(dateObj, 'MMM d, yyyy');
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Heat Cycle Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lastHeatCycle && (
            <div className="text-sm grid grid-cols-2">
              <span className="text-muted-foreground">Last Heat Started:</span>
              <span className="font-medium">{formatDateValue(lastHeatCycle.start_date)}</span>
            </div>
          )}
          
          {lastHeatCycle?.end_date && (
            <div className="text-sm grid grid-cols-2">
              <span className="text-muted-foreground">Last Heat Ended:</span>
              <span className="font-medium">{formatDateValue(lastHeatCycle.end_date)}</span>
            </div>
          )}
          
          {averageCycleLength && (
            <div className="text-sm grid grid-cols-2">
              <span className="text-muted-foreground">Average Cycle Length:</span>
              <span className="font-medium">{averageCycleLength} days</span>
            </div>
          )}
          
          {lastHeatCycle && averageCycleLength && nextHeatDate && (
            <div className="text-sm grid grid-cols-2">
              <span className="text-muted-foreground">Next Heat Expected:</span>
              <span className="font-medium">{format(nextHeatDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {heatCycles?.length === 0 && (
            <div className="text-center py-2">
              <Clock className="h-5 w-5 mx-auto text-gray-400 mb-2" />
              <p className="text-muted-foreground">No heat cycles recorded yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatCycleMonitor;
