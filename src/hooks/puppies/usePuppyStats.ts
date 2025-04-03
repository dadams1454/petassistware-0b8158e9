
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PuppyManagementStats } from '@/types/puppyTracking';

export const usePuppyStats = () => {
  const { 
    data: stats, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['puppyStats'],
    queryFn: async (): Promise<PuppyManagementStats> => {
      try {
        // Get counts by status
        const { data: statusCounts, error: statusError } = await supabase
          .from('puppies')
          .select('status')
          .not('status', 'is', null);
          
        if (statusError) {
          console.error('Error fetching puppy status counts:', statusError);
          return getDefaultStats();
        }
        
        // Get gender counts
        const { data: genderCounts, error: genderError } = await supabase
          .from('puppies')
          .select('gender')
          .not('gender', 'is', null);
          
        if (genderError) {
          console.error('Error fetching puppy gender counts:', genderError);
          return getDefaultStats();
        }

        // Calculate stats
        const totalPuppies = statusCounts.length;
        const availablePuppies = statusCounts.filter(p => p.status === 'Available').length;
        const reservedPuppies = statusCounts.filter(p => p.status === 'Reserved').length;
        const soldPuppies = statusCounts.filter(p => p.status === 'Sold').length;
        
        const maleCount = genderCounts.filter(p => p.gender === 'Male').length;
        const femaleCount = genderCounts.filter(p => p.gender === 'Female').length;
        
        return {
          totalPuppies,
          availablePuppies,
          reservedPuppies,
          soldPuppies,
          maleCount,
          femaleCount,
          weightUnit: 'oz' // Default unit
        };
      } catch (err) {
        console.error('Exception in usePuppyStats:', err);
        return getDefaultStats();
      }
    }
  });
  
  // Provide default stats if query fails
  const getDefaultStats = (): PuppyManagementStats => ({
    totalPuppies: 0,
    availablePuppies: 0,
    reservedPuppies: 0,
    soldPuppies: 0,
    maleCount: 0,
    femaleCount: 0,
    weightUnit: 'oz'
  });
  
  return {
    stats: stats || getDefaultStats(),
    isLoading,
    error
  };
};
