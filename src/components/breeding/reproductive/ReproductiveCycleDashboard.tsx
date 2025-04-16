
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, FilePlus, ListFilter } from 'lucide-react';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { ReproductiveStatusBadge } from '../common/ReproductiveStatusBadge';
import HeatCycleVisualizer from '../components/HeatCycleVisualizer';
import HeatCycleHistoryTable from '../components/HeatCycleHistoryTable';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { HintCard } from '@/components/ui/hint-card';
import { HeatCycle, HeatIntensityType, stringToHeatIntensityType } from '@/types/heat-cycles';

interface ReproductiveCycleDashboardProps {
  dogId: string;
  dogName?: string;
  onAddHeatCycle?: () => void;
}

const ReproductiveCycleDashboard: React.FC<ReproductiveCycleDashboardProps> = ({
  dogId,
  dogName = 'Dog',
  onAddHeatCycle
}) => {
  const [loading, setLoading] = useState(true);
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>([]);
  const [activeTab, setActiveTab] = useState('visualization');
  const [dogStatus, setDogStatus] = useState<string>('unknown');
  const [lastHeatDate, setLastHeatDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatCycles = async () => {
      if (!dogId) return;
      
      try {
        setLoading(true);
        
        // Fetch heat cycles
        const { data: cyclesData, error: cyclesError } = await supabase
          .from('heat_cycles')
          .select('*')
          .eq('dog_id', dogId)
          .order('start_date', { ascending: false });
          
        if (cyclesError) throw cyclesError;
        
        // Convert string intensity to HeatIntensityType
        const formattedCycles = (cyclesData || []).map(cycle => ({
          ...cycle,
          intensity: stringToHeatIntensityType(cycle.intensity)
        })) as HeatCycle[];
        
        setHeatCycles(formattedCycles);
        
        // Determine if dog is currently in heat
        const today = new Date();
        const currentCycle = formattedCycles.find(cycle => {
          const startDate = new Date(cycle.start_date);
          const endDate = cycle.end_date ? new Date(cycle.end_date) : null;
          
          return startDate <= today && (!endDate || endDate >= today);
        });
        
        if (currentCycle) {
          setDogStatus('in_heat');
          setLastHeatDate(currentCycle.start_date);
        } else if (formattedCycles && formattedCycles.length > 0) {
          setDogStatus('normal');
          setLastHeatDate(formattedCycles[0].start_date);
        }
      } catch (err) {
        console.error('Error fetching heat cycles:', err);
        setError('Failed to load heat cycle data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeatCycles();
  }, [dogId]);
  
  const handleRecordHeatCycle = async () => {
    if (onAddHeatCycle) {
      onAddHeatCycle();
      return;
    }
    
    // Default implementation if no handler provided
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const newCycle = {
        dog_id: dogId,
        start_date: today,
        intensity: 'medium' as HeatIntensityType,
        symptoms: [] as string[]
      };
      
      const { error } = await supabase
        .from('heat_cycles')
        .insert(newCycle);
        
      if (error) throw error;
      
      // Refresh the data
      window.location.reload();
      
    } catch (err) {
      console.error('Error recording heat cycle:', err);
      setError('Failed to record new heat cycle');
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reproductive Cycle Management</CardTitle>
        <Button onClick={handleRecordHeatCycle}>
          <FilePlus className="mr-2 h-4 w-4" />
          Record Heat Cycle
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <HintCard 
            type="error" 
            title="Error Loading Data"
            className="mb-4"
          >
            {error}
          </HintCard>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Status</p>
            <div className="flex items-center">
              <StatusIndicator status={dogStatus} />
              <span className="ml-2">
                <ReproductiveStatusBadge status={dogStatus} />
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Last Heat Cycle</p>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formatDate(lastHeatDate)}</span>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="history">Heat History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization">
            <HeatCycleVisualizer cycles={heatCycles} />
          </TabsContent>
          
          <TabsContent value="history">
            <HeatCycleHistoryTable cycles={heatCycles} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReproductiveCycleDashboard;
