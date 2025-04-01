
import { useState, useEffect } from 'react';
import { DogGenotype } from '@/types/genetics';
import { fetchDogGeneticData } from '@/services/genetics/fetchGeneticData';
import { processGeneticData } from '@/services/genetics/processGeneticData';

// Define return type for the hook
interface UseDogGeneticsReturn {
  geneticData: DogGenotype | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
  breedRisks: string[];
  lastUpdated: string | null;
}

/**
 * Custom hook to fetch and manage a dog's genetic data
 */
export function useDogGenetics(dogId: string): UseDogGeneticsReturn {
  const [geneticData, setGeneticData] = useState<DogGenotype | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [breedRisks, setBreedRisks] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Function to trigger a refresh of the data
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    // Reset state when dog ID changes
    setLoading(true);
    setError(null);
    setGeneticData(null);
    
    // Skip if no dog ID is provided
    if (!dogId) {
      setLoading(false);
      return;
    }
    
    async function fetchGeneticData() {
      try {
        // Fetch the raw genetic data
        const response = await fetchDogGeneticData(dogId);
        
        // Process raw data into the format we need
        const processedData = processGeneticData(response);
        
        setGeneticData(processedData);
        setLastUpdated(new Date().toISOString());
        
        // Get breed-specific risks
        if (response.dog && response.dog.breed) {
          const { getBreedHighRiskConditions } = await import('@/services/genetics/processGeneticData');
          const risks = getBreedHighRiskConditions(response.dog.breed);
          setBreedRisks(risks);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching genetic data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setGeneticData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGeneticData();
  }, [dogId, refreshTrigger]);
  
  return { 
    geneticData, 
    loading, 
    error, 
    refresh, 
    breedRisks,
    lastUpdated
  };
}

export default useDogGenetics;
