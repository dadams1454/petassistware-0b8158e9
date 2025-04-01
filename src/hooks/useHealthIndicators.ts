
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  addHealthIndicator,
  getHealthIndicatorsForDog,
  HealthIndicator, 
  HealthIndicatorFormValues 
} from '@/services/healthIndicatorService';
import { useAuth } from '@/contexts/AuthProvider';

export const useHealthIndicators = (dogId: string) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  
  const { 
    data: indicators,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['health-indicators', dogId],
    queryFn: async () => {
      return getHealthIndicatorsForDog(dogId);
    },
    enabled: !!dogId
  });
  
  const addIndicator = async (values: HealthIndicatorFormValues) => {
    setIsAdding(true);
    try {
      const result = await addHealthIndicator(values, user?.id);
      if (result.success) {
        await refetch();
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error adding health indicator:', error);
      return null;
    } finally {
      setIsAdding(false);
    }
  };
  
  return {
    indicators,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    addIndicator,
    refetch
  };
};
