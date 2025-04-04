
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import HeatCycleMonitor from './breeding/HeatCycleMonitor';
import { format } from 'date-fns';
import { HeatCycle, HeatIntensityType, HeatIntensityValues } from '@/types/reproductive';

export interface HeatCycleManagementProps {
  dogId: string;
  onHeatCycleAdded?: (data: Partial<HeatCycle>) => Promise<void>;
}

interface HeatCycleInput {
  dog_id: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  intensity?: HeatIntensityType;
}

const HeatCycleManagement: React.FC<HeatCycleManagementProps> = ({ dogId, onHeatCycleAdded }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const handleAddCycle = () => {
    setShowDialog(true);
  };
  
  const handleRecordHeatCycle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const startDate = formData.get('start_date') as string;
    const endDate = formData.get('end_date') as string || null;
    const notes = formData.get('notes') as string || null;
    const intensity = formData.get('intensity') as HeatIntensityType || HeatIntensityValues.moderate;
    
    try {
      setLoading(true);
      
      // Create heat cycle data object
      const heatCycleData: HeatCycleInput = {
        dog_id: dogId,
        start_date: startDate,
        end_date: endDate || null,
        notes: notes || null,
        intensity
      };
      
      if (onHeatCycleAdded) {
        // Use the provided handler if available
        await onHeatCycleAdded(heatCycleData);
        toast.success('Heat cycle recorded successfully');
        setShowDialog(false);
        setRefreshCounter(prev => prev + 1);
        return;
      }
      
      // Default behavior using supabase directly
      const { error } = await supabase
        .from('heat_cycles')
        .insert(heatCycleData);
      
      if (error) throw error;
      
      toast.success('Heat cycle recorded successfully');
      setShowDialog(false);
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error('Error recording heat cycle:', error);
      toast.error('Failed to record heat cycle');
    } finally {
      setLoading(false);
    }
  };
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return (
    <div>
      <Button variant="outline" onClick={handleAddCycle}>
        Record Heat Cycle
      </Button>
      
      <HeatCycleMonitor 
        dogId={dogId} 
        key={`heat-cycle-${refreshCounter}`}
      />
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Heat Cycle</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleRecordHeatCycle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input 
                type="date" 
                name="start_date"
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
              <input 
                type="date" 
                name="end_date"
                min={format(new Date(), 'yyyy-MM-dd')}
                defaultValue={format(tomorrow, 'yyyy-MM-dd')}
                className="w-full p-2 border rounded" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank if cycle is ongoing
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Intensity</label>
              <select 
                name="intensity"
                className="w-full p-2 border rounded"
                defaultValue={HeatIntensityValues.moderate}
              >
                <option value={HeatIntensityValues.low}>Low</option>
                <option value={HeatIntensityValues.mild}>Mild</option>
                <option value={HeatIntensityValues.moderate}>Moderate</option>
                <option value={HeatIntensityValues.medium}>Medium</option>
                <option value={HeatIntensityValues.high}>High</option>
                <option value={HeatIntensityValues.strong}>Strong</option>
                <option value={HeatIntensityValues.peak}>Peak</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                name="notes"
                className="w-full p-2 border rounded h-24" 
                placeholder="Any observations or details about this heat cycle"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Record Heat Cycle'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeatCycleManagement;
