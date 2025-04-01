
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface HeatCycle {
  id: string;
  dog_id: string;
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
  created_at: string;
}

interface HeatCycleMonitorProps {
  dogId: string;
  onAddCycle?: () => void;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({ dogId, onAddCycle }) => {
  const [cycles, setCycles] = useState<HeatCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchHeatCycles();
  }, [dogId]);
  
  const fetchHeatCycles = async () => {
    try {
      setLoading(true);
      
      // Try using a RPC (database function) or a direct query with explicit typing
      const { data, error: supabaseError } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false }) as { data: HeatCycle[] | null, error: any };
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      // First check if we have data and it's an array
      if (data && Array.isArray(data)) {
        // Then validate that each item has the required fields to be a HeatCycle
        const isValidHeatCycle = (item: any): item is HeatCycle => {
          return item && 
                 typeof item.id === 'string' && 
                 typeof item.dog_id === 'string' && 
                 typeof item.start_date === 'string' &&
                 typeof item.created_at === 'string';
        };
        
        // Filter only valid heat cycles
        const validHeatCycles = data.filter(isValidHeatCycle);
        setCycles(validHeatCycles);
      } else {
        // If data is not an array, set cycles to empty array
        setCycles([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching heat cycles:', err);
      setError('Failed to load heat cycle data');
      // Important: In case of error, we set cycles to empty array instead of error objects
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };
  
  const displayedCycles = showAll ? cycles : cycles.slice(0, 3);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Heat Cycle History</CardTitle>
        {onAddCycle && (
          <Button onClick={onAddCycle} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Record Heat
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center text-muted-foreground">
            <p>Loading heat cycle data...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-destructive">
            <p>{error}</p>
          </div>
        ) : cycles.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No heat cycles recorded yet.</p>
            {onAddCycle && (
              <Button onClick={onAddCycle} className="mt-4" variant="default" size="sm">
                Record First Heat Cycle
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedCycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {format(parseISO(cycle.start_date), 'MMM d, yyyy')}
                      </p>
                      {cycle.end_date && (
                        <p className="text-sm text-muted-foreground">
                          Ended: {format(parseISO(cycle.end_date), 'MMM d, yyyy')}
                          <span className="ml-2">
                            ({differenceInDays(parseISO(cycle.end_date), parseISO(cycle.start_date))} days)
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {!cycle.end_date && 'Ongoing'}
                      </div>
                    </div>
                  </div>
                  {cycle.notes && (
                    <p className="text-sm mt-1 text-muted-foreground">{cycle.notes}</p>
                  )}
                </div>
              ))}
            </div>

            {cycles.length > 3 && (
              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm"
                >
                  {showAll ? (
                    <>
                      Show Less <ArrowUp className="h-3 w-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Show All ({cycles.length}) <ArrowDown className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatCycleMonitor;
