
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/components/ui/use-toast';
import { DogCareStatus } from '@/types/dailyCare';

export const useDogCareDashboard = (
  onRefreshDogs: () => void,
  providedDogStatuses?: DogCareStatus[],
  currentDate = new Date()
) => {
  const { toast } = useToast();
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const [viewMode, setViewMode] = useState<string>('table');
  
  // Fetch all dogs for care dashboard if not provided
  const { data: dogs, isLoading, refetch } = useQuery({
    queryKey: ['dashboardDogs'],
    queryFn: async () => {
      if (providedDogStatuses && providedDogStatuses.length > 0) return providedDogStatuses;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url, breed, color')
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
  
  // Fetch dogs with care status for the time table if not provided
  const { data: loadedDogStatuses, isLoading: isStatusesLoading } = useQuery({
    queryKey: ['dogCareStatuses', currentDate],
    queryFn: async () => {
      if (providedDogStatuses && providedDogStatuses.length > 0) return providedDogStatuses;
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      onRefreshDogs();
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
  
  // Get the effective dog statuses - either from props or from the query
  const effectiveDogStatuses = providedDogStatuses && providedDogStatuses.length > 0 
    ? providedDogStatuses 
    : loadedDogStatuses || [];
    
  const showLoading = isLoading || isStatusesLoading;
  const noDogs = (!effectiveDogStatuses || effectiveDogStatuses.length === 0) && !showLoading;
  
  return {
    dogs,
    effectiveDogStatuses,
    showLoading,
    noDogs,
    viewMode,
    setViewMode,
    handleRefresh
  };
};
