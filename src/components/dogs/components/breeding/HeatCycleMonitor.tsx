import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format, addDays, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RecordBreedingDialog from './RecordBreedingDialog';

interface HeatCycle {
  id: string;
  start_date: string;
  end_date: string;
  notes: string;
}

interface HeatCycleMonitorProps {
  dogId: string;
}

const HeatCycleMonitor: React.FC<HeatCycleMonitorProps> = ({ dogId }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>([]);
  const [showBreedingDialog, setShowBreedingDialog] = useState<boolean>(false);
  
  // Fetch heat cycles on component mount
  useEffect(() => {
    refetchHeatCycles();
  }, [dogId]);
  
  // Function to refetch heat cycles
  const refetchHeatCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      setHeatCycles(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to fetch heat cycles.'
      });
    }
  };
  
  // Function to save heat cycle
  const saveHeatCycle = async () => {
    if (!date?.from || !date?.to) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a date range.'
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('heat_cycles')
        .insert({
          dog_id: dogId,
          start_date: format(date.from, 'yyyy-MM-dd'),
          end_date: format(date.to, 'yyyy-MM-dd'),
          notes: notes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Heat Cycle Saved',
        description: 'The heat cycle has been successfully saved.'
      });
      
      // Clear form and refetch data
      setDate(undefined);
      setNotes('');
      refetchHeatCycles();
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save heat cycle.'
      });
    }
  };
  
  // Function to delete heat cycle
  const deleteHeatCycle = async (heatCycleId: string) => {
    try {
      const { error } = await supabase
        .from('heat_cycles')
        .delete()
        .eq('id', heatCycleId);
      
      if (error) throw error;
      
      toast({
        title: 'Heat Cycle Deleted',
        description: 'The heat cycle has been successfully deleted.'
      });
      
      // Refetch data
      refetchHeatCycles();
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete heat cycle.'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Heat Cycle Monitor</CardTitle>
          <CardDescription>Track and manage heat cycles for your dog.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dates">Select Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={format(date?.from || new Date(), 'PPP')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
                      ) : (
                        format(date.from, "PPP")
                      )
                    ) : (
                      <span>Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarUI
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter any notes about this heat cycle..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={saveHeatCycle}>Save Heat Cycle</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Past Heat Cycles</CardTitle>
          <CardDescription>View and manage previously recorded heat cycles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heatCycles.map((cycle) => (
                  <tr key={cycle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(cycle.start_date), 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(cycle.end_date), 'PPP')}
                    </td>
                    <td className="px-6 py-4">
                      {cycle.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteHeatCycle(cycle.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {heatCycles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">No heat cycles recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Breeding Actions</CardTitle>
          <CardDescription>Quick actions to record breedings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setShowBreedingDialog(true)}>
            Record Breeding
          </Button>
          
          {showBreedingDialog && (
            <RecordBreedingDialog
              open={showBreedingDialog}
              onOpenChange={(open) => setShowBreedingDialog(open)}
              damId={dogId}
              onSuccess={refetchHeatCycles}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatCycleMonitor;
