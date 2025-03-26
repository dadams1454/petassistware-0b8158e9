
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/hooks/use-toast';

export const useDailyCareData = (currentDate = new Date()) => {
  const { toast } = useToast();
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  
  // Fetch all dogs for care dashboard
  const { 
    data: dogs, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['dashboardDogs'],
    queryFn: async () => {
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
  
  // Fetch dogs with care status for the time table
  const { 
    data: dogStatuses, 
    isLoading: isStatusesLoading 
  } = useQuery({
    queryKey: ['dogCareStatuses', currentDate],
    queryFn: async () => {
      return await fetchAllDogsWithCareStatus(currentDate, true);
    },
  });

  const handleRefresh = async () => {
    try {
      await refetch();
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

  return {
    dogs,
    dogStatuses,
    isLoading,
    isStatusesLoading,
    refetch,
    handleRefresh
  };
};
