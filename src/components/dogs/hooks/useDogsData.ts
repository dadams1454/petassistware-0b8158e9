
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDogsData = () => {
  const { toast } = useToast();
  
  const { 
    data: dogs, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching dogs:', error);
        toast({
          title: 'Failed to load dogs',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No dogs found in the database');
      } else {
        console.log(`Fetched ${data.length} dogs`);
      }
      
      return data || [];
    },
  });

  return {
    dogs,
    isLoading,
    error,
    refetch,
  };
};
