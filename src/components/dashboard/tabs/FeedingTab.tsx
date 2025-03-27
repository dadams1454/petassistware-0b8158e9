
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { EmptyState, SkeletonLoader } from '@/components/ui/standardized';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FeedingTabProps {
  dogStatuses: DogCareStatus[];
  onRefreshDogs: () => void;
}

const FeedingTab: React.FC<FeedingTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add a small delay to create a nicer loading transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch recent feeding logs
  const { data: feedingLogs, isLoading } = useQuery({
    queryKey: ['feedingLogs'],
    queryFn: async () => {
      if (!dogStatuses || dogStatuses.length === 0) return [];
      
      const dogIds = dogStatuses.map(dog => dog.dog_id);
      const { data, error } = await supabase
        .from('daily_care_logs')
        .select('*')
        .in('dog_id', dogIds)
        .eq('category', 'feeding')
        .order('timestamp', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      return data || [];
    },
    enabled: Array.isArray(dogStatuses) && dogStatuses.length > 0
  });

  // Check if dogStatuses is actually an array
  const hasDogs = Array.isArray(dogStatuses) && dogStatuses.length > 0;
  const hasLogs = Array.isArray(feedingLogs) && feedingLogs.length > 0;
  
  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Feeding Schedule</h2>
        <p className="text-muted-foreground mb-4">Track and manage feeding for your dogs</p>
      </div>
      
      {isLoading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : !hasDogs ? (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-amber-100 dark:bg-amber-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Utensils className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Dogs Found</h3>
              <p className="text-muted-foreground mb-4">Add dogs to start tracking feeding</p>
              <Button onClick={onRefreshDogs} variant="outline">Refresh Dogs</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Feeding logs cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Utensils className="mr-2 h-5 w-5 text-amber-500" />
                  <span>Recent Feeding Logs</span>
                </div>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Log Feeding
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasLogs ? (
                <EmptyState
                  title="No Feeding Logs"
                  description="Record feeding activities to see them here"
                  action={{
                    label: "Record Feeding",
                    onClick: () => {}
                  }}
                />
              ) : (
                <div className="divide-y">
                  {feedingLogs.slice(0, 10).map((log: any) => {
                    const dogName = dogStatuses.find(d => d.dog_id === log.dog_id)?.dog_name || 'Unknown';
                    return (
                      <div key={log.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{dogName}</p>
                          <p className="text-sm text-muted-foreground">{log.task_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                          {log.notes && <p className="text-xs text-muted-foreground">{log.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Feeding schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="mr-2 h-5 w-5 text-amber-500" />
                <span>Today's Feeding Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Morning</h3>
                  <p className="text-sm text-muted-foreground mb-1">7:00 AM - 8:00 AM</p>
                  <p className="text-sm">{dogStatuses.length} dogs to feed</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Afternoon</h3>
                  <p className="text-sm text-muted-foreground mb-1">12:00 PM - 1:00 PM</p>
                  <p className="text-sm">{dogStatuses.length} dogs to feed</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Evening</h3>
                  <p className="text-sm text-muted-foreground mb-1">5:00 PM - 6:00 PM</p>
                  <p className="text-sm">{dogStatuses.length} dogs to feed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FeedingTab;
