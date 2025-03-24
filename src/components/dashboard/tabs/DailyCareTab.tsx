
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DogCareCard } from '@/components/dashboard/DogCareCard';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ onRefreshDogs }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all dogs for care dashboard
  const { data: dogs, isLoading, refetch } = useQuery({
    queryKey: ['dashboardDogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url, breed, color, status')
        .order('name');
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dogs.',
          variant: 'destructive',
        });
        throw error;
      }
      
      return data || [];
    },
  });
  
  const handleRefresh = async () => {
    try {
      await refetch();
      // Also invalidate care activities
      queryClient.invalidateQueries({ queryKey: ['careActivities'] });
      queryClient.invalidateQueries({ queryKey: ['lastCareActivity'] });
      toast({
        title: 'Refreshed',
        description: 'Dog data has been refreshed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh data.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daily Care</h2>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : dogs && dogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dogs.map((dog) => (
            <DogCareCard key={dog.id} dog={dog} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Dogs Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Add dogs to start tracking their care activities.</p>
            <Button onClick={onRefreshDogs} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyCareTab;
