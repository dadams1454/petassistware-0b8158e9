
import { useState, useEffect } from 'react';
import { DogGenotype } from '@/types/genetics';
import { getDogGenetics } from '@/services/geneticsService';

export const useDogGenetics = (dogId: string) => {
  const [geneticData, setGeneticData] = useState<DogGenotype | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchGeneticData() {
      if (!dogId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await getDogGenetics(dogId);
        
        // If no data is returned, create a default object
        if (!data) {
          setGeneticData({
            dog_id: dogId,
            baseColor: 'Unknown',
            brownDilution: 'Unknown',
            dilution: 'Unknown',
            agouti: 'Unknown', // Added missing required property
            healthMarkers: {},
            updated_at: new Date().toISOString()
          });
        } else {
          setGeneticData(data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dog genetics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch genetics data'));
        
        // Set default data even on error
        setGeneticData({
          dog_id: dogId,
          baseColor: 'Unknown',
          brownDilution: 'Unknown',
          dilution: 'Unknown',
          agouti: 'Unknown', // Added missing required property
          healthMarkers: {},
          updated_at: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchGeneticData();
  }, [dogId]);
  
  const updateGeneticData = (updatedData: Partial<DogGenotype>) => {
    setGeneticData(prevData => {
      if (!prevData) return null;
      
      return {
        ...prevData,
        ...updatedData,
        updated_at: new Date().toISOString()
      };
    });
  };
  
  return {
    geneticData,
    loading,
    error,
    updateGeneticData
  };
};
