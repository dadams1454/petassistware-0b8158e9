
import React, { useState } from 'react';
import { customSupabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import HeatCycleMonitor, { HeatCycle } from './breeding/HeatCycleMonitor';
import { format } from 'date-fns';

export interface HeatCycleManagementProps {
  dogId: string;
}

const HeatCycleManagement: React.FC<HeatCycleManagementProps> = ({ dogId }) => {
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
    
    try {
      setLoading(true);
      
      // Insert the heat cycle record using customSupabase
      const { error } = await customSupabase
        .from<HeatCycle>('heat_cycles')
        .insert({
          dog_id: dogId,
          start_date: startDate,
          end_date: endDate || null,
          notes: notes || null,
          created_at: new Date().toISOString()
        });
      
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
  
  return (
    <div>
      <HeatCycleMonitor 
        dogId={dogId} 
        onAddCycle={handleAddCycle} 
      />
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Heat Cycle</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleRecordHeatCycle} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date" className="text-sm font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="end_date" className="text-sm font-medium">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeatCycleManagement;
