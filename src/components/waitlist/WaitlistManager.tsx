
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import WaitlistEntryDialog from './WaitlistEntryDialog';
import WaitlistTable from './WaitlistTable';
import { Customer } from '../customers/types/customer';

export interface WaitlistEntry {
  id: string;
  customer_id: string;
  litter_id: string;
  requested_at: string;
  status: 'pending' | 'contacted' | 'approved' | 'declined';
  notes: string | null;
  preferences: {
    gender_preference?: 'Male' | 'Female' | null;
    color_preference?: string | null;
  };
  position: number | null;
  contacted_at: string | null;
  customers: Customer;
}

interface WaitlistManagerProps {
  litterId: string;
  litterName: string;
}

const WaitlistManager: React.FC<WaitlistManagerProps> = ({ litterId, litterName }) => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Waitlist for {litterName}</CardTitle>
        <Button onClick={handleAddCustomer}>Add Customer to Waitlist</Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="contacted">Contacted</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center p-4">Loading waitlist...</div>
          ) : waitlistEntries?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No customers on the waitlist yet. Add a customer to get started.
            </div>
          ) : (
            <>
              <TabsContent value="all">
                <WaitlistTable 
                  entries={waitlistEntries || []}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePosition={handleUpdatePosition}
                  onEditEntry={handleEditEntry}
                />
              </TabsContent>
              
              <TabsContent value="pending">
                <WaitlistTable 
                  entries={(waitlistEntries || []).filter(entry => entry.status === 'pending')}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePosition={handleUpdatePosition}
                  onEditEntry={handleEditEntry}
                  showPositionControls={false}
                />
              </TabsContent>
              
              <TabsContent value="contacted">
                <WaitlistTable 
                  entries={(waitlistEntries || []).filter(entry => entry.status === 'contacted')}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePosition={handleUpdatePosition}
                  onEditEntry={handleEditEntry}
                  showPositionControls={false}
                />
              </TabsContent>
              
              <TabsContent value="approved">
                <WaitlistTable 
                  entries={(waitlistEntries || []).filter(entry => entry.status === 'approved')}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePosition={handleUpdatePosition}
                  onEditEntry={handleEditEntry}
                  showPositionControls={false}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      
      <WaitlistEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        litterId={litterId}
        entry={selectedEntry}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </Card>
  );
};

export default WaitlistManager;
