
import { useState, useEffect } from 'react';
import { DogGenotype } from '@/types/genetics';

// Mock function to replace the imported one that doesn't exist
const getBreedHighRiskConditions = async (breed: string): Promise<any[]> => {
  // This would normally fetch from a database or API
  return [
    { condition: 'Hip Dysplasia', risk: 'medium' },
    { condition: 'Elbow Dysplasia', risk: 'medium' },
    { condition: 'Cardiac Issues', risk: 'low' }
  ];
};

// Mock function to replace the imported one that doesn't exist
const processGeneticData = async (dogId: string): Promise<DogGenotype | null> => {
  // This would normally fetch from a database or API
  return {
    id: dogId,
    dog_id: dogId,
    breed: 'Newfoundland',
    baseColor: 'Black',
    brownDilution: 'No dilution',
    dilution: 'No dilution',
    updated_at: new Date().toISOString(),
    healthMarkers: {
      hip_dysplasia: { status: 'clear', testDate: '2023-01-15' },
      elbow_dysplasia: { status: 'carrier', testDate: '2023-01-15' }
    }
  };
};

export const useDogGenetics = (dogId: string) => {
  const [dogData, setDogData] = useState<DogGenotype | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [highRiskConditions, setHighRiskConditions] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [breedRisks, setBreedRisks] = useState<string[]>([]);
  
  const refresh = async () => {
    if (!dogId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch genetic data
      const data = await processGeneticData(dogId);
      
      if (data) {
        setDogData(data);
        setLastUpdated(data.updated_at || new Date().toISOString());
        
        // Fetch breed-specific high risk conditions if breed is known
        if (data.breed) {
          const conditions = await getBreedHighRiskConditions(data.breed);
          setHighRiskConditions(conditions);
          
          // Extract condition names for easier display
          const risks = conditions.map(c => c.condition || c.description || '').filter(Boolean);
          setBreedRisks(risks);
        }
      } else {
        // Create a basic empty genotype if no data is available
        setDogData({
          dog_id: dogId,
          baseColor: 'unknown',
          brownDilution: 'unknown',
          dilution: 'unknown',
          healthMarkers: {},
          healthResults: [],
          updated_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error fetching genetic data:', err);
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refresh();
  }, [dogId]);
  
  // Return the properties that match what the components expect
  return {
    dogData,
    highRiskConditions,
    isLoading,
    error,
    refresh,
    geneticData: dogData, // Alias for backward compatibility
    loading: isLoading, // Alias for backward compatibility
    breedRisks,
    lastUpdated
  };
};
