
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  addHealthIndicator,
  deleteHealthIndicator,
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

  const deleteIndicator = async (indicatorId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteHealthIndicator(indicatorId);
      if (result.success) {
        await refetch();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting health indicator:', error);
      return false;
    } finally {
      setIsDeleting(false);
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
    deleteIndicator,
    refetch
  };
};
