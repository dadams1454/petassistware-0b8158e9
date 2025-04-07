
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
      
      const typedData = (data || []).map(cycle => ({
        ...cycle,
        intensity: (cycle.intensity || 'moderate') as HeatIntensityType
      }));
      
      setHeatCycles(typedData);
    } catch (error) {
      console.error('Error fetching heat cycles:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch heat cycles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddHeatCycle = () => {
    setSelectedCycle(null);
    setDialogOpen(true);
  };
  
  const handleViewHeatCycle = (cycle: HeatCycle) => {
    setSelectedCycle(cycle);
    setDialogOpen(true);
  };
  
  const handleSaveHeatCycle = async (cycle: HeatCycle) => {
    try {
      if (cycle.id) {
        // Update existing cycle
        const { error } = await supabase
          .from('heat_cycles')
          .update({
            start_date: cycle.start_date,
            end_date: cycle.end_date,
            intensity: cycle.intensity,
            symptoms: cycle.symptoms,
            notes: cycle.notes,
          })
          .eq('id', cycle.id);
          
        if (error) throw error;
        
        toast({
          title: 'Heat cycle updated',
          description: 'The heat cycle has been updated successfully.',
        });
      } else {
        // Add new cycle
        const { error } = await supabase
          .from('heat_cycles')
          .insert({
            dog_id: dogId,
            start_date: cycle.start_date,
            end_date: cycle.end_date,
            intensity: cycle.intensity,
            symptoms: cycle.symptoms,
            notes: cycle.notes,
          });
          
        if (error) throw error;
        
        toast({
          title: 'Heat cycle added',
          description: 'The new heat cycle has been added successfully.',
        });
      }
      
      fetchHeatCycles();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving heat cycle:', error);
      toast({
        title: 'Error',
        description: 'Could not save heat cycle',
        variant: 'destructive',
      });
    }
  };
  
  const getIntensityLabel = (intensity: HeatIntensityType) => {
    return intensity.charAt(0).toUpperCase() + intensity.slice(1);
  };
  
  const getIntensityColor = (intensity: HeatIntensityType) => {
    switch(intensity) {
      case 'none':
        return 'bg-gray-100 text-gray-800';
      case 'mild':
        return 'bg-blue-100 text-blue-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'strong':
        return 'bg-orange-100 text-orange-800';
      case 'very_strong':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Heat Cycles</CardTitle>
        <Button onClick={handleAddHeatCycle} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Heat Cycle
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : heatCycles.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
            <p>No heat cycles recorded yet.</p>
            <p className="text-sm">Add a heat cycle to start tracking the dog's reproductive cycle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {heatCycles.map((cycle) => (
              <div 
                key={cycle.id} 
                className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
                onClick={() => handleViewHeatCycle(cycle)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <div className="font-medium">
                    {format(new Date(cycle.start_date), 'MMMM d, yyyy')}
                  </div>
                  <div className={`rounded-full px-2 py-0.5 text-xs ${getIntensityColor(cycle.intensity)}`}>
                    {getIntensityLabel(cycle.intensity)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {cycle.end_date ? (
                    <span>
                      Duration: {differenceInDays(new Date(cycle.end_date), new Date(cycle.start_date))} days 
                      (Ended: {format(new Date(cycle.end_date), 'MMM d, yyyy')})
                    </span>
                  ) : (
                    <span className="text-primary">In progress</span>
                  )}
                </div>
                {cycle.notes && <p className="text-sm mt-2">{cycle.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Heat cycles typically occur every 6-8 months for most breeds. Tracking these cycles helps predict future heats.
        </p>
      </CardFooter>
      
      <HeatCycleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cycle={selectedCycle}
        onSave={handleSaveHeatCycle}
      />
    </Card>
  );
};

export default HeatCycleManagement;
