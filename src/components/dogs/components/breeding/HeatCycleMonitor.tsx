
import React, { useState, useEffect } from 'react';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Define the HeatCycle type
export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
}

export interface HeatCycleMonitorProps {
  dogId: string;
  onAddCycle?: () => void;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({ dogId, onAddCycle }) => {
  const [cycles, setCycles] = useState<HeatCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextEstimatedDate, setNextEstimatedDate] = useState<string | null>(null);
  
  useEffect(() => {
    fetchHeatCycles();
  }, [dogId]);
  
  const fetchHeatCycles = async () => {
    try {
      setLoading(true);
      
      // Attempt to directly fetch heat cycle data
      // If the table doesn't exist, this will fail gracefully
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });
      
      if (!error) {
        // If successful, process the data
        setCycles(data as HeatCycle[]);
        calculateNextHeatDate(data as HeatCycle[]);
      } else {
        console.error('Error fetching heat cycles:', error);
        toast.error('Failed to load heat cycle data');
        setCycles([]);
      }
    } catch (error) {
      console.error('Error in heat cycle fetch operation:', error);
      toast.error('An error occurred while loading heat cycle data');
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateNextHeatDate = (heatCycles: HeatCycle[]) => {
    if (!heatCycles || heatCycles.length < 1) {
      setNextEstimatedDate(null);
      return;
    }
    
    // Get the most recent heat cycle
    const latestCycle = heatCycles[0];
    
    // If we have at least 2 cycles, calculate the average cycle length
    if (heatCycles.length >= 2) {
      let totalDays = 0;
      let intervals = 0;
      
      for (let i = 0; i < heatCycles.length - 1; i++) {
        const currentCycleStart = parseISO(heatCycles[i].start_date);
        const prevCycleStart = parseISO(heatCycles[i + 1].start_date);
        
        const daysBetween = differenceInDays(currentCycleStart, prevCycleStart);
        
        if (daysBetween > 0) {
          totalDays += daysBetween;
          intervals++;
        }
      }
      
      if (intervals > 0) {
        const averageDays = Math.round(totalDays / intervals);
        const lastStartDate = parseISO(latestCycle.start_date);
        const nextDate = addDays(lastStartDate, averageDays);
        
        setNextEstimatedDate(format(nextDate, 'yyyy-MM-dd'));
      }
    } else {
      // With only one cycle, estimate based on typical canine heat cycle (6 months)
      const lastStartDate = parseISO(latestCycle.start_date);
      const nextDate = addDays(lastStartDate, 180); // Approx 6 months
      
      setNextEstimatedDate(format(nextDate, 'yyyy-MM-dd'));
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Heat Cycle History</span>
          {onAddCycle && (
            <Button onClick={onAddCycle} size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" /> Record Heat
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cycles.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No heat cycles recorded yet</p>
            {onAddCycle && (
              <Button 
                onClick={onAddCycle} 
                variant="outline" 
                className="mt-4"
              >
                Record First Heat Cycle
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {nextEstimatedDate && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Next estimated heat: {formatDate(nextEstimatedDate)}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {cycles.map((cycle, index) => (
                <div key={cycle.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {index === 0 ? "Latest Heat" : `Heat Cycle ${cycles.length - index}`}
                    </Badge>
                    {cycle.end_date && (
                      <div className="text-xs text-muted-foreground">
                        {differenceInDays(parseISO(cycle.end_date), parseISO(cycle.start_date))} days
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm mt-2">
                    <span>{formatDate(cycle.start_date)}</span>
                    {cycle.end_date && (
                      <>
                        <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground" />
                        <span>{formatDate(cycle.end_date)}</span>
                      </>
                    )}
                  </div>
                  
                  {cycle.notes && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {cycle.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatCycleMonitor;
