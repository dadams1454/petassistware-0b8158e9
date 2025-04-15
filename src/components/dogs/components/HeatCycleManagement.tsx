
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Plus } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { HeatCycle, HeatIntensityType } from '@/types';
import HeatCycleDialog from './breeding/HeatCycleDialog';

interface HeatCycleManagementProps {
  dogId: string;
}

const HeatCycleManagement: React.FC<HeatCycleManagementProps> = ({ dogId }) => {
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<HeatCycle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch heat cycles when component mounts
  useEffect(() => {
    fetchHeatCycles();
  }, [dogId]);
  
  const fetchHeatCycles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });
        
      if (error) throw error;
      
      // Process heat cycles data
      const formattedCycles = data.map(cycle => ({
        ...cycle,
        intensity: cycle.intensity as HeatIntensityType
      }));
      
      setHeatCycles(formattedCycles);
    } catch (error) {
      console.error('Error fetching heat cycles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load heat cycles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddHeatCycle = () => {
    setSelectedCycle(null);
    setDialogOpen(true);
  };
  
  const handleEditHeatCycle = (cycle: HeatCycle) => {
    setSelectedCycle(cycle);
    setDialogOpen(true);
  };
  
  const handleSaveHeatCycle = async (cycleData: any) => {
    try {
      if (cycleData.id) {
        // Update existing heat cycle
        const { error } = await supabase
          .from('heat_cycles')
          .update({
            start_date: cycleData.start_date,
            end_date: cycleData.end_date,
            intensity: cycleData.intensity,
            symptoms: cycleData.symptoms,
            notes: cycleData.notes
          })
          .eq('id', cycleData.id);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Heat cycle updated successfully'
        });
      } else {
        // Add new heat cycle
        const { error } = await supabase
          .from('heat_cycles')
          .insert([{
            dog_id: dogId,
            start_date: cycleData.start_date,
            end_date: cycleData.end_date,
            intensity: cycleData.intensity,
            symptoms: cycleData.symptoms,
            notes: cycleData.notes,
            cycle_number: heatCycles.length + 1
          }]);
          
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Heat cycle added successfully'
        });
        
        // Update the dog's last heat date
        await supabase
          .from('dogs')
          .update({ last_heat_date: cycleData.start_date })
          .eq('id', dogId);
      }
      
      // Refresh the heat cycles list
      fetchHeatCycles();
    } catch (error) {
      console.error('Error saving heat cycle:', error);
      toast({
        title: 'Error',
        description: 'Failed to save heat cycle',
        variant: 'destructive'
      });
    }
  };
  
  const renderHeatCycles = () => {
    if (loading) {
      return <div className="p-4 text-center">Loading heat cycles...</div>;
    }
    
    if (heatCycles.length === 0) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground mb-2">No heat cycles recorded yet</p>
          <Button onClick={handleAddHeatCycle}>Record Heat Cycle</Button>
        </div>
      );
    }
    
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heatCycles.map(cycle => (
            <Card key={cycle.id} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between">
                  Heat Cycle #{cycle.cycle_number}
                  <span className="text-sm font-normal text-muted-foreground">
                    {format(new Date(cycle.start_date), 'MMM d, yyyy')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {cycle.end_date ? 
                        `${differenceInDays(new Date(cycle.end_date), new Date(cycle.start_date))} days` : 
                        'Ongoing'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Intensity:</span>
                    <span className="font-medium capitalize">{cycle.intensity}</span>
                  </div>
                  {cycle.symptoms && cycle.symptoms.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Symptoms:</span>
                      <span className="font-medium">{cycle.symptoms.join(', ')}</span>
                    </div>
                  )}
                  {cycle.notes && (
                    <div className="text-sm mt-2">
                      <span className="text-muted-foreground">Notes:</span>
                      <p className="mt-1">{cycle.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => handleEditHeatCycle(cycle)}>
                  Edit Cycle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    } else {
      // List view implementation
      return (
        <div className="space-y-2">
          {heatCycles.map(cycle => (
            <div key={cycle.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <span className="font-medium">Cycle #{cycle.cycle_number}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {format(new Date(cycle.start_date), 'MMM d, yyyy')}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleEditHeatCycle(cycle)}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold">Heat Cycles</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button size="sm" onClick={handleAddHeatCycle}>
            <Plus className="h-4 w-4 mr-1" />
            Add Cycle
          </Button>
        </div>
      </div>
      
      {renderHeatCycles()}
      
      <HeatCycleDialog 
        open={dialogOpen} 
        setOpen={setDialogOpen}
        onOpenChange={setDialogOpen}
        dogId={dogId}
        cycle={selectedCycle}
        onSave={handleSaveHeatCycle}
      />
    </div>
  );
};

export default HeatCycleManagement;
