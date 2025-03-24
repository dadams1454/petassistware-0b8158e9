
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import { RefreshCw } from 'lucide-react';

interface GroomingTabProps {
  dogStatuses: DogCareStatus[];
  onRefreshDogs: () => void;
}

const GroomingTab: React.FC<GroomingTabProps> = ({ 
  dogStatuses, 
  onRefreshDogs
}) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    
    // Call the refresh function from props
    onRefreshDogs();
    
    // Reset refreshing state after a delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [onRefreshDogs]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Grooming Schedule</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {dogStatuses.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Grooming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No upcoming grooming sessions scheduled. 
                  Use the Care Dashboard to schedule grooming appointments.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No dogs found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Grooming History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No grooming history available. 
                Previous grooming sessions will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroomingTab;
