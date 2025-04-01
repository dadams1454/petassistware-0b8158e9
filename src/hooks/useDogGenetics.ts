
import { useState, useEffect } from 'react';
import { DogGenotype } from '@/types/genetics';
import { processGeneticData, getBreedHighRiskConditions } from '@/services/genetics/processGeneticData';

export const useDogGenetics = (dogId: string) => {
  const [dogData, setDogData] = useState<DogGenotype | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [highRiskConditions, setHighRiskConditions] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchGeneticData = async () => {
      if (!dogId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch genetic data
        const data = await processGeneticData(dogId);
        
        if (!data) {
          // Create a basic empty genotype if no data is available
          setDogData({
            dogId,
            baseColor: 'unknown',
            brownDilution: 'unknown',
            dilution: 'unknown',
            healthMarkers: {},
            healthResults: []
          });
          return;
        }
        
        setDogData(data);
        
        // Fetch breed-specific high risk conditions if breed is known
        if (data.breed) {
          const conditions = await getBreedHighRiskConditions(data.breed);
          setHighRiskConditions(conditions);
        }
      } catch (err) {
        console.error('Error fetching genetic data:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGeneticData();
  }, [dogId]);
  
  return {
    dogData,
    highRiskConditions,
    isLoading,
    error
  };
};
