
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  Droplets,
  Plus,
  CalendarDays,
  History,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import StatusIndicator from '@/components/ui/status-indicator';
import ReproductiveStatusBadge from '../common/ReproductiveStatusBadge';
import HeatCycleVisualizer from '../components/HeatCycleVisualizer';
import HeatCycleHistoryTable from '../components/HeatCycleHistoryTable';
import HeatCycleDialog from '@/components/dogs/components/breeding/HeatCycleDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HintCard } from '@/components/ui/hint-card';
import { supabase } from '@/integrations/supabase/client';
import { HeatCycle, HeatIntensityType, mapHeatIntensityToType } from '@/types/unified';
import type { Dog } from '@/types/unified';
import type { Json } from '@/integrations/supabase/types';

interface ReproductiveCycleDashboardProps {
  dog: Dog;
  reproStatus?: string;
  statusDate?: string;
  onAddHeatCycle?: () => void;
}

const ReproductiveCycleDashboard: React.FC<ReproductiveCycleDashboardProps> = ({
  dog,
  reproStatus = 'unknown',
  statusDate,
  onAddHeatCycle,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isHeatDialogOpen, setIsHeatDialogOpen] = useState(false);
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  // Fetch heat cycle data
  useEffect(() => {
    const fetchHeatCycles = async () => {
      try {
        setLoading(true);
        if (!dog?.id) return;

        const { data, error } = await supabase
          .from('heat_cycles')
          .select('*')
          .eq('dog_id', dog.id)
          .order('start_date', { ascending: false });

        if (error) throw error;

        // Map the data to HeatCycle[] type
        const mappedData: HeatCycle[] = data.map(cycle => ({
          ...cycle,
          intensity: mapHeatIntensityToType(cycle.intensity)
        }));

        setHeatCycles(mappedData);
      } catch (error) {
        console.error('Error fetching heat cycles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatCycles();
  }, [dog?.id]);

  const handleAddHeatCycle = async (cycleData: Partial<HeatCycle>) => {
    try {
      const { data, error } = await supabase
        .from('heat_cycles')
        .insert(cycleData)
        .select()
        .single();

      if (error) throw error;

      // Add the new cycle to the state
      const newCycle: HeatCycle = {
        ...data,
        intensity: mapHeatIntensityToType(data.intensity)
      };
      
      setHeatCycles(prev => [newCycle, ...prev]);

      if (onAddHeatCycle) {
        onAddHeatCycle();
      }
    } catch (error) {
      console.error('Error adding heat cycle:', error);
      throw error;
    }
  };

  // Get the next cycle number
  const nextCycleNumber = heatCycles.length > 0 ? Math.max(...heatCycles.map(c => c.cycle_number)) + 1 : 1;

  // Calculate fertility and in-heat status
  const isInHeat = reproStatus === 'in_heat';
  const isFertile = isInHeat; // Simplified - in a real app would be more complex
  const lastHeatDate = heatCycles[0]?.start_date ? format(parseISO(heatCycles[0].start_date), 'MMM d, yyyy') : 'Unknown';
  
  // Get current heat cycle
  const currentHeatCycle = heatCycles.find(cycle => !cycle.end_date);

  const infoContent = (
    <div className="space-y-4">
      <p>
        The reproductive cycle dashboard helps track a female dog's heat cycles, 
        fertility windows, and reproductive status.
      </p>
      <div>
        <h4 className="font-medium">Reproductive Status:</h4>
        <ul className="list-disc list-inside pl-4 mt-2">
          <li><span className="font-medium">In Heat</span> - Currently in estrus cycle</li>
          <li><span className="font-medium">Not In Heat</span> - Between cycles</li>
          <li><span className="font-medium">Pregnant</span> - Confirmed pregnancy</li>
          <li><span className="font-medium">Nursing</span> - Caring for puppies</li>
        </ul>
      </div>
      <p>
        Track heat cycles to predict future cycles and optimize breeding windows.
      </p>
    </div>
  );

  // Function to get the total count of heat cycles
  const getTotalCyclesCount = () => heatCycles.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            Reproductive Cycle
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInfoDialogOpen(true)}
              className="ml-2"
            >
              <Info className="h-4 w-4" />
            </Button>
          </h2>
          <p className="text-muted-foreground">Track heat cycles and reproductive status</p>
        </div>
        <Button onClick={() => setIsHeatDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Record Heat Cycle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <ReproductiveStatusBadge status={reproStatus as any} showIcon className="text-lg px-3 py-1" />
              {statusDate && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(parseISO(statusDate), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fertility Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <StatusIndicator 
                status={isFertile ? 'active' : 'inactive'} 
                labels={{active: 'Fertile', inactive: 'Not Fertile'}}
                showIcon
                className="text-lg"
              />
              {currentHeatCycle && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Started {format(parseISO(currentHeatCycle.start_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Heat Cycle History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-3xl font-bold">{getTotalCyclesCount()}</div>
              <div className="text-muted-foreground text-sm">Recorded Cycles</div>
              {heatCycles.length > 0 && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  Last heat: {lastHeatDate}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cycles">Heat Cycles</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {heatCycles.length === 0 ? (
            <HintCard 
              icon={<Droplets className="h-5 w-5" />}
              title="No Heat Cycles Recorded"
              description="Record heat cycles to track reproductive history and predict future cycles."
              action={
                <Button size="sm" onClick={() => setIsHeatDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record First Cycle
                </Button>
              }
            />
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Heat Cycle Timeline</CardTitle>
                  <CardDescription>Visual representation of recorded heat cycles</CardDescription>
                </CardHeader>
                <CardContent>
                  <HeatCycleVisualizer cycles={heatCycles} />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        <TabsContent value="cycles">
          <Card>
            <CardHeader>
              <CardTitle>Heat Cycle History</CardTitle>
              <CardDescription>Record of all heat cycles</CardDescription>
            </CardHeader>
            <CardContent>
              {heatCycles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No heat cycles have been recorded yet.</p>
                  <Button className="mt-4" size="sm" onClick={() => setIsHeatDialogOpen(true)}>
                    Record First Cycle
                  </Button>
                </div>
              ) : (
                <HeatCycleHistoryTable cycles={heatCycles} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Reproductive Statistics</CardTitle>
              <CardDescription>Analysis of heat cycle patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Not enough data to show statistics.</p>
                <p className="text-sm mt-2">Record more heat cycles to see pattern analysis.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Heat Cycle Dialog */}
      <HeatCycleDialog
        open={isHeatDialogOpen}
        onOpenChange={setIsHeatDialogOpen}
        dogId={dog.id}
        cycleNumber={nextCycleNumber}
        onSave={handleAddHeatCycle}
      />

      {/* Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Reproductive Tracking</DialogTitle>
          </DialogHeader>
          {infoContent}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReproductiveCycleDashboard;
