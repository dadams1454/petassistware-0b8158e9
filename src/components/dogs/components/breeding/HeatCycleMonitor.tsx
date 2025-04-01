
import React, { useState, useEffect } from 'react';
import { useBreedingPreparation } from '@/hooks/breeding/useBreedingPreparation';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { Trash2, Edit, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecordHeatCycleDialog from './RecordHeatCycleDialog';
import { Badge } from '@/components/ui/badge';

// Define an interface for the heat cycle rows
interface HeatCycleRow {
  id: string;
  dog_id: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

const HeatCycleMonitor = ({ dogId }: { dogId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [heatCycles, setHeatCycles] = useState<HeatCycleRow[]>([]);
  const [editingCycle, setEditingCycle] = useState<HeatCycleRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchBreedingData } = useBreedingPreparation();

  const fetchHeatCycles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setHeatCycles(data || []);
    } catch (error) {
      console.error('Error fetching heat cycles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dogId) {
      fetchHeatCycles();
    }
  }, [dogId]);

  const handleDelete = async (cycleId: string) => {
    if (!confirm('Are you sure you want to delete this heat cycle record?')) return;

    try {
      const { error } = await supabase
        .from('heat_cycles')
        .delete()
        .eq('id', cycleId);

      if (error) throw error;
      
      await fetchHeatCycles();
      await fetchBreedingData(dogId);
    } catch (error) {
      console.error('Error deleting heat cycle:', error);
    }
  };

  const handleEdit = (cycle: HeatCycleRow) => {
    setEditingCycle(cycle);
    setIsDialogOpen(true);
  };

  const onDialogClose = async (refreshData: boolean) => {
    setIsDialogOpen(false);
    setEditingCycle(null);
    
    if (refreshData) {
      await fetchHeatCycles();
      await fetchBreedingData(dogId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading heat cycle data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Heat Cycle Records</h3>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Record Heat Cycle</span>
        </Button>
      </div>

      {heatCycles.length === 0 ? (
        <div className="text-center py-6 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No heat cycle records found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Start Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium">End Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Duration</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Notes</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {heatCycles.map((cycle) => (
                <tr key={cycle.id} className="bg-card hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    {format(new Date(cycle.start_date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {cycle.end_date 
                      ? format(new Date(cycle.end_date), 'MMM d, yyyy')
                      : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      )
                    }
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {cycle.end_date 
                      ? `${differenceInDays(new Date(cycle.end_date), new Date(cycle.start_date))} days`
                      : `${differenceInDays(new Date(), new Date(cycle.start_date))} days and counting`
                    }
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {cycle.notes || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(cycle)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(cycle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RecordHeatCycleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dogId={dogId}
        editData={editingCycle}
      />
    </div>
  );
};

export default HeatCycleMonitor;
