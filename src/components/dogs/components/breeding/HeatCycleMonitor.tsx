
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { HeatCycle } from '@/types/reproductive';

interface HeatCycleMonitorProps {
  dogId: string;
  onAddCycle?: () => void;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({ dogId, onAddCycle }) => {
  const [cycles, setCycles] = useState<HeatCycle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This would be replaced with a real API call in production
    const fetchHeatCycles = async () => {
      try {
        setIsLoading(true);
        // Mock data for now, would be replaced with actual API call
        const mockData: HeatCycle[] = [
          {
            id: '1',
            dog_id: dogId,
            start_date: '2023-09-05',
            end_date: '2023-09-19',
            notes: 'Normal cycle, no complications',
            created_at: '2023-09-05T12:00:00Z'
          },
          {
            id: '2',
            dog_id: dogId,
            start_date: '2023-12-01',
            end_date: '2023-12-15',
            notes: null,
            created_at: '2023-12-01T12:00:00Z'
          }
        ];
        
        // Simulate delay for loading state
        setTimeout(() => {
          setCycles(mockData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching heat cycles:', error);
        setError('Failed to load heat cycle data');
        setIsLoading(false);
      }
    };

    fetchHeatCycles();
  }, [dogId]);

  const calculateNextHeat = (): string => {
    if (cycles.length === 0) return 'No previous cycles to predict from';
    
    // Sort cycles by start date, newest first
    const sortedCycles = [...cycles].sort((a, b) => 
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
    
    const lastCycle = sortedCycles[0];
    const lastCycleDate = new Date(lastCycle.start_date);
    
    // Typically, dogs come into heat every 6 months
    const nextHeatDate = new Date(lastCycleDate);
    nextHeatDate.setMonth(nextHeatDate.getMonth() + 6);
    
    const today = new Date();
    const daysUntilNextHeat = differenceInDays(nextHeatDate, today);
    
    if (daysUntilNextHeat < 0) {
      return `Expected ${Math.abs(daysUntilNextHeat)} days ago (${format(nextHeatDate, 'MMM d, yyyy')})`;
    } else {
      return `In approximately ${daysUntilNextHeat} days (${format(nextHeatDate, 'MMM d, yyyy')})`;
    }
  };
  
  const handleAddClick = () => {
    if (onAddCycle) {
      onAddCycle();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Heat Cycle Tracking</CardTitle>
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-1" />
          Record Cycle
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : cycles.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-2" />
            <p>No heat cycles recorded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Record your dog's first heat cycle to begin tracking
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Last Heat</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(cycles[0].start_date), 'MMM d, yyyy')}
                {cycles[0].end_date && ` to ${format(new Date(cycles[0].end_date), 'MMM d, yyyy')}`}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Next Heat (Estimated)</h3>
              <p className="text-sm text-muted-foreground">{calculateNextHeat()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Heat History</h3>
              <ul className="mt-2 space-y-2">
                {cycles.map(cycle => (
                  <li key={cycle.id} className="text-sm border-l-2 border-pink-300 pl-3 py-1">
                    <span className="font-medium">
                      {format(new Date(cycle.start_date), 'MMM d, yyyy')}
                    </span>
                    {cycle.end_date && (
                      <> to {format(new Date(cycle.end_date), 'MMM d, yyyy')}</>
                    )}
                    {cycle.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{cycle.notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatCycleMonitor;
