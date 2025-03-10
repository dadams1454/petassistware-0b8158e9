
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { renderGenderIcon } from '../litters/puppies/utils/puppyUtils';
import WaitlistEntryDialog from './WaitlistEntryDialog';
import { Customer } from '../customers/types/customer';

interface WaitlistEntry {
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
        .order('position', { ascending: true, nullsLast: true })
        .order('requested_at', { ascending: true });
      
      if (error) throw error;
      return data as WaitlistEntry[];
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

  const handleEditNotes = (entry: WaitlistEntry) => {
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
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Preferences</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlistEntries?.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          {entry.position || index + 1}
                          <div className="flex flex-col gap-1 ml-1">
                            <Button
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5"
                              onClick={() => handleUpdatePosition(entry, 'up')}
                              disabled={index === 0}
                            >
                              ▲
                            </Button>
                            <Button
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5"
                              onClick={() => handleUpdatePosition(entry, 'down')}
                              disabled={index === (waitlistEntries?.length || 0) - 1}
                            >
                              ▼
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {entry.customers?.first_name} {entry.customers?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.customers?.email || "No email"} | {entry.customers?.phone || "No phone"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {entry.preferences?.gender_preference && (
                            <div className="flex items-center text-sm">
                              {renderGenderIcon(entry.preferences.gender_preference)}
                              Prefers {entry.preferences.gender_preference}
                            </div>
                          )}
                          {entry.preferences?.color_preference && (
                            <div className="text-sm">
                              Color: {entry.preferences.color_preference}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(entry.requested_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`
                            inline-flex h-2 w-2 rounded-full mr-2
                            ${entry.status === 'pending' ? 'bg-yellow-500' : ''}
                            ${entry.status === 'contacted' ? 'bg-blue-500' : ''}
                            ${entry.status === 'approved' ? 'bg-green-500' : ''}
                            ${entry.status === 'declined' ? 'bg-red-500' : ''}
                          `}></span>
                          <span className="capitalize">{entry.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(entry, 'contacted')}
                            disabled={entry.status === 'contacted'}
                          >
                            Contact
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(entry, 'approved')} 
                            disabled={entry.status === 'approved'}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditNotes(entry)}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}
          
          <TabsContent value="pending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistEntries?.filter(entry => entry.status === 'pending').map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.position || index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {entry.customers?.first_name} {entry.customers?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.customers?.email || "No email"} | {entry.customers?.phone || "No phone"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {entry.preferences?.gender_preference && (
                          <div className="flex items-center text-sm">
                            {renderGenderIcon(entry.preferences.gender_preference)}
                            Prefers {entry.preferences.gender_preference}
                          </div>
                        )}
                        {entry.preferences?.color_preference && (
                          <div className="text-sm">
                            Color: {entry.preferences.color_preference}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(entry.requested_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(entry, 'contacted')}
                        >
                          Contact
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditNotes(entry)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {waitlistEntries?.filter(entry => entry.status === 'pending').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No pending waitlist entries
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="contacted">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Contacted On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistEntries?.filter(entry => entry.status === 'contacted').map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.position || index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {entry.customers?.first_name} {entry.customers?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.customers?.email || "No email"} | {entry.customers?.phone || "No phone"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {entry.preferences?.gender_preference && (
                          <div className="flex items-center text-sm">
                            {renderGenderIcon(entry.preferences.gender_preference)}
                            Prefers {entry.preferences.gender_preference}
                          </div>
                        )}
                        {entry.preferences?.color_preference && (
                          <div className="text-sm">
                            Color: {entry.preferences.color_preference}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.contacted_at ? format(new Date(entry.contacted_at), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(entry, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateStatus(entry, 'declined')}
                        >
                          Decline
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditNotes(entry)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {waitlistEntries?.filter(entry => entry.status === 'contacted').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No contacted waitlist entries
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="approved">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistEntries?.filter(entry => entry.status === 'approved').map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.position || index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {entry.customers?.first_name} {entry.customers?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.customers?.email || "No email"} | {entry.customers?.phone || "No phone"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {entry.preferences?.gender_preference && (
                          <div className="flex items-center text-sm">
                            {renderGenderIcon(entry.preferences.gender_preference)}
                            Prefers {entry.preferences.gender_preference}
                          </div>
                        )}
                        {entry.preferences?.color_preference && (
                          <div className="text-sm">
                            Color: {entry.preferences.color_preference}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.contacted_at ? format(new Date(entry.contacted_at), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditNotes(entry)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {waitlistEntries?.filter(entry => entry.status === 'approved').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No approved waitlist entries
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
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
