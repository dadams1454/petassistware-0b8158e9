
import { useState, useEffect } from 'react';
import { calculateGeneticCompatibility, CompatibilityResult } from '@/services/geneticCompatibilityService';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';

export const useBreedingCompatibility = (sireId?: string, damId?: string) => {
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch dog details
  const { dog: sire, isLoading: isLoadingSire } = useDogDetail(sireId || '');
  const { dog: dam, isLoading: isLoadingDam } = useDogDetail(damId || '');
  
  useEffect(() => {
    const fetchCompatibility = async () => {
      // Only proceed if we have both dog IDs
      if (!sireId || !damId) {
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await calculateGeneticCompatibility(sireId, damId);
        setCompatibilityResult(result);
      } catch (err) {
        console.error('Error calculating breeding compatibility:', err);
        setError(err instanceof Error ? err : new Error('Failed to calculate compatibility'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompatibility();
  }, [sireId, damId]);
  
  return {
    compatibilityResult,
    isLoading: isLoading || isLoadingSire || isLoadingDam,
    error,
    sire,
    dam
  };
};
