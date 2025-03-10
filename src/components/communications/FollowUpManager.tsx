
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MailIcon, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Customer } from '../customers/types/customer';
import { WaitlistEntry } from '../waitlist/WaitlistManager';
import CreateFollowUpDialog from './CreateFollowUpDialog';

interface FollowUpItem {
  id: string;
  type: 'waitlist' | 'customer' | 'manual';
  customer_id: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  notes: string | null;
  reference_id?: string; // could be a waitlist entry id or other reference
  created_at: string;
  customer: Customer;
}

const FollowUpManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch follow-ups
  const { data: followUps, isLoading, refetch } = useQuery({
    queryKey: ['follow-ups'],
    queryFn: async () => {
      // This is a placeholder - in a real implementation, you would fetch from a follow_ups table
      // For now, we'll generate some mock data from waitlist entries
      const { data: waitlistEntries, error } = await supabase
        .from('waitlist')
        .select('*, customers(*)')
        .eq('status', 'contacted')
        .order('contacted_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert waitlist entries to follow-up items
      const followUps = (waitlistEntries as unknown as WaitlistEntry[]).map(entry => ({
        id: `followup-${entry.id}`,
        type: 'waitlist' as const,
        customer_id: entry.customer_id,
        due_date: entry.contacted_at ? new Date(new Date(entry.contacted_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(),
        status: 'pending' as const,
        notes: `Follow up on waitlist request for ${entry.customers.first_name} ${entry.customers.last_name}`,
        reference_id: entry.id,
        created_at: entry.contacted_at || entry.requested_at,
        customer: entry.customers
      }));
      
      return followUps as FollowUpItem[];
    }
  });

  const handleMarkCompleted = (item: FollowUpItem) => {
    // In a real implementation, you would update the follow_up in your database
    toast({
      title: "Follow-up marked as completed",
      description: `Follow-up for ${item.customer.first_name} ${item.customer.last_name} has been marked as completed.`
    });
    
    // For demonstration purposes, we'll just refetch
    refetch();
  };

  const handleSendEmail = (item: FollowUpItem) => {
    // Redirect to communications page
    window.location.href = `/communications?customer=${item.customer_id}`;
  };

  const handleCreateFollowUp = () => {
    setSelectedCustomer(null);
    setIsCreateDialogOpen(true);
  };

  const getStatusIcon = (status: FollowUpItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Follow-Up Manager</CardTitle>
            <CardDescription>
              Track and manage customer follow-ups and communications
            </CardDescription>
          </div>
          <Button onClick={handleCreateFollowUp}>Create Follow-Up</Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="text-center py-6">Loading follow-ups...</div>
          ) : (followUps?.length || 0) === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No follow-ups to display
            </div>
          ) : (
            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUps?.filter(item => item.status === 'pending').map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.customer.first_name} {item.customer.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.customer.email}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{item.type}</TableCell>
                      <TableCell>{format(new Date(item.due_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSendEmail(item)}
                          >
                            <MailIcon className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMarkCompleted(item)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}
          
          <TabsContent value="completed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No completed follow-ups yet
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {followUps?.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {item.customer.first_name} {item.customer.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.customer.email}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{item.type}</TableCell>
                    <TableCell>{format(new Date(item.due_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSendEmail(item)}
                        >
                          <MailIcon className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        {item.status !== 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMarkCompleted(item)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-6 flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {followUps?.length || 0} follow-ups
        </p>
        <Button variant="outline" size="sm">
          Export Follow-Ups
        </Button>
      </CardFooter>
      
      <CreateFollowUpDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        customer={selectedCustomer}
        onSuccess={() => refetch()}
      />
    </Card>
  );
};

export default FollowUpManager;
