
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDailyCare } from '@/contexts/dailyCare';
import { useToast } from '@/hooks/use-toast';

export const useDailyCareData = (currentDate = new Date()) => {
  const { toast } = useToast();
  const { fetchAllDogsWithCareStatus } = useDailyCare();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch all dogs for care dashboard
  const { 
    data: dogs, 
    isLoading: isDogsLoading, 
    error: dogsError,
    refetch: refetchDogs 
  } = useQuery({
    queryKey: ['dashboardDogs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name, photo_url, breed, color, gender, weight, birthdate, registration_number, microchip_number')
          .order('name');
        
        if (error) {
          console.error('Error fetching dogs:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log('No dogs found in the database');
        } else {
          console.log(`Successfully fetched ${data.length} dogs`);
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in dog fetch query:', err);
        throw err;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  // Fetch dogs with care status for the time table
  const { 
    data: dogStatuses, 
    isLoading: isStatusesLoading,
    error: statusesError,
    refetch: refetchStatuses
  } = useQuery({
    queryKey: ['dogCareStatuses', currentDate.toISOString().split('T')[0]],
    queryFn: async () => {
      try {
        console.log('Fetching dog care statuses for date:', currentDate.toISOString().split('T')[0]);
        const result = await fetchAllDogsWithCareStatus(currentDate, true);
        if (result.length === 0) {
          console.log('No dog care statuses returned');
        } else {
          console.log(`Successfully fetched ${result.length} dog care statuses`);
        }
        return result;
      } catch (err) {
        console.error('Error fetching dog care statuses:', err);
        throw err;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });

  // Log any errors that occur
  useEffect(() => {
    if (dogsError) {
      console.error('Dogs query error:', dogsError);
      toast({
        title: 'Error fetching dogs',
        description: 'Failed to load dog data. Please try again.',
        variant: 'destructive',
      });
    }

    if (statusesError) {
      console.error('Dog statuses query error:', statusesError);
      toast({
        title: 'Error fetching care data',
        description: 'Failed to load dog care data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [dogsError, statusesError, toast]);

  const handleRefresh = async (showToast = true) => {
    try {
      setIsRefreshing(true);
      
      await Promise.all([
        refetchDogs(),
        refetchStatuses()
      ]);
      
      if (showToast) {
        toast({
          title: 'Refreshed',
          description: 'Dog data has been refreshed.',
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    dogs,
    dogStatuses,
    isLoading: isDogsLoading,
    isStatusesLoading,
    isRefreshing,
    dogsError,
    statusesError,
    refetch: refetchDogs,
    handleRefresh
  };
};
