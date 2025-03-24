
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Customer } from '../customers/types/customer';
import CreateFollowUpDialog from './CreateFollowUpDialog';
import { useFollowUps } from './hooks/useFollowUps';
import { FollowUpTable } from './components/FollowUpTable';

const FollowUpManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: followUps, isLoading, refetch } = useFollowUps();

  const handleMarkCompleted = (item: any) => {
    toast({
      title: "Follow-up marked as completed",
      description: `Follow-up for ${item.customer.first_name} ${item.customer.last_name} has been marked as completed.`
    });
    refetch();
  };

  const handleSendEmail = (item: any) => {
    window.location.href = `/communications?customer=${item.customer_id}`;
  };

  const handleCreateFollowUp = () => {
    setSelectedCustomer(null);
    setIsCreateDialogOpen(true);
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
            <>
              <TabsContent value="pending">
                <FollowUpTable 
                  followUps={followUps || []}
                  onSendEmail={handleSendEmail}
                  onMarkCompleted={handleMarkCompleted}
                  showOnlyPending
                />
              </TabsContent>
              
              <TabsContent value="completed">
                <FollowUpTable 
                  followUps={followUps?.filter(item => item.status === 'completed') || []}
                  onSendEmail={handleSendEmail}
                  onMarkCompleted={handleMarkCompleted}
                />
              </TabsContent>
              
              <TabsContent value="all">
                <FollowUpTable 
                  followUps={followUps || []}
                  onSendEmail={handleSendEmail}
                  onMarkCompleted={handleMarkCompleted}
                />
              </TabsContent>
            </>
          )}
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
