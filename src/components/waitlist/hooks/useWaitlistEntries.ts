
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { WaitlistEntry } from '../types';

export const useWaitlistEntries = (litterId: string) => {
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: waitlistEntries, isLoading, refetch } = useQuery({
    queryKey: ['waitlist', litterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*, customers(*)')
        .eq('litter_id', litterId)
        .order('position', { ascending: true })
        .order('requested_at', { ascending: true });
      
      if (error) throw error;
      return data as unknown as WaitlistEntry[];
    }
  });

  const handleUpdateStatus = async (entry: WaitlistEntry, newStatus: WaitlistEntry['status']) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({ 
          status: newStatus,
          contacted_at: newStatus === 'contacted' ? new Date().toISOString() : entry.contacted_at
        })
        .eq('id', entry.id);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `${entry.customers.first_name} ${entry.customers.last_name}'s status has been updated to ${newStatus}.`
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating waitlist status:", error);
      toast({
        title: "Error updating status",
        description: "There was a problem updating the waitlist entry status.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePosition = async (entry: WaitlistEntry, direction: 'up' | 'down') => {
    // Find the current position and the adjacent entry
    const entries = waitlistEntries || [];
    const currentIndex = entries.findIndex(e => e.id === entry.id);
    
    if (currentIndex === -1) return;
    
    // Cannot move up if already at the top
    if (direction === 'up' && currentIndex === 0) return;
    
    // Cannot move down if already at the bottom
    if (direction === 'down' && currentIndex === entries.length - 1) return;
    
    // Get the adjacent entry
    const adjacentIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const adjacentEntry = entries[adjacentIndex];
    
    // Swap positions
    const currentPosition = entry.position || currentIndex + 1;
    const adjacentPosition = adjacentEntry.position || adjacentIndex + 1;
    
    try {
      // Update the current entry
      await supabase
        .from('waitlist')
        .update({ position: adjacentPosition })
        .eq('id', entry.id);
      
      // Update the adjacent entry
      await supabase
        .from('waitlist')
        .update({ position: currentPosition })
        .eq('id', adjacentEntry.id);
      
      toast({
        title: "Position updated",
        description: `${entry.customers.first_name} ${entry.customers.last_name}'s position has been updated.`
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating waitlist position:", error);
      toast({
        title: "Error updating position",
        description: "There was a problem updating the waitlist entry position.",
        variant: "destructive"
      });
    }
  };

  const handleEditEntry = (entry: WaitlistEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleAddCustomer = () => {
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSuccess = () => {
    refetch();
    setIsDialogOpen(false);
  };

  return {
    waitlistEntries,
    isLoading,
    selectedEntry,
    isDialogOpen,
    handleUpdateStatus,
    handleUpdatePosition,
    handleEditEntry,
    handleAddCustomer,
    handleDialogClose,
    handleSuccess,
    refetch
  };
};
