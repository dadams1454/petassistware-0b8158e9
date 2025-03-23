
import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Customer } from '../customers/types/customer';
import CreateFollowUpDialog from './CreateFollowUpDialog';
import { useFollowUps } from './hooks/useFollowUps';
import { FollowUpTable } from './components/FollowUpTable';
import LoadingFollowUps from './components/LoadingFollowUps';
import { CircleEllipsis } from 'lucide-react';

const FollowUpManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data: followUps, isLoading, refetch, isRefetching } = useFollowUps();

  const handleMarkCompleted = (item: any) => {
    toast({
      title: "Follow-up marked as completed",
      description: `Follow-up for ${item.customer.first_name} ${item.customer.last_name} has been marked as completed.`
    });
    
    // Use transition to prevent UI blocking during refetch
    startTransition(() => {
      // Void the promise to avoid type errors
      void refetch();
    });
  };

  const handleSendEmail = (item: any) => {
    window.location.href = `/communications?customer=${item.customer_id}`;
  };

  const handleCreateFollowUp = () => {
    setSelectedCustomer(null);
    setIsCreateDialogOpen(true);
  };

  const handleRefresh = () => {
    startTransition(() => {
      // Void the promise to avoid type errors
      void refetch();
    });
  };

  // Determine if we should show loading state
  const showLoading = isLoading && !followUps;
  const showRefreshIndicator = isRefetching || isPending;

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
          <div className="flex items-center gap-2">
            {showRefreshIndicator && (
              <CircleEllipsis className="animate-spin text-muted-foreground h-4 w-4" />
            )}
            <Button onClick={handleCreateFollowUp}>Create Follow-Up</Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          {showLoading ? (
            <FollowUpTable
              followUps={[]}
              onSendEmail={() => {}}
              onMarkCompleted={() => {}}
              showOnlyPending
              customTableBody={
                <LoadingFollowUps count={3} />
              }
            />
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
          {showLoading ? "Loading follow-ups..." : `Showing ${followUps?.length || 0} follow-ups`}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={showLoading}>
            Refresh
          </Button>
          <Button variant="outline" size="sm" disabled={showLoading}>
            Export Follow-Ups
          </Button>
        </div>
      </CardFooter>
      
      <CreateFollowUpDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        customer={selectedCustomer}
        onSuccess={() => {
          startTransition(() => {
            void refetch();
          });
        }}
      />
    </Card>
  );
};

export default FollowUpManager;
