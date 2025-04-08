
import { useState, useEffect } from 'react';
import { calculateGeneticCompatibility } from '@/services/geneticCompatibilityService';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';

// Define a local CompatibilityResult type to ensure we have a proper type
export interface CompatibilityResult {
  compatibilityScore: number;
  healthSummary: {
    atRiskCount: number;
    carrierCount: number;
    clearCount: number;
    unknownCount: number;
    totalTests: number;
  };
  recommendations: string[];
  colorProbabilities: { color: string; probability: number; hex?: string }[];
  healthRisks: Record<string, { status: string; probability: number }>;
  inbreedingCoefficient: number;
}

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
        
        // Provide fallback data in case of an error
        setCompatibilityResult({
          compatibilityScore: 50,
          healthSummary: {
            atRiskCount: 0,
            carrierCount: 0,
            clearCount: 0,
            unknownCount: 1,
            totalTests: 1
          },
          recommendations: ['Could not calculate detailed compatibility.'],
          colorProbabilities: [{ color: 'Unknown', probability: 1.0 }],
          healthRisks: {},
          inbreedingCoefficient: 0
        });
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
