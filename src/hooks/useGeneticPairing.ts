import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DogGenotype, ColorProbability, GeneticHealthStatus, HealthMarker } from '@/types/genetics';
import { calculateColorProbabilities, calculateHealthRisks, calculateInbreedingCoefficient } from '@/components/genetics/utils/geneticCalculations';

export const useGeneticPairing = (sireId?: string, damId?: string) => {
  const [sireGenotype, setSireGenotype] = useState<DogGenotype | null>(null);
  const [damGenotype, setDamGenotype] = useState<DogGenotype | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [colorProbabilities, setColorProbabilities] = useState<ColorProbability[]>([]);
  const [healthRisks, setHealthRisks] = useState<Record<string, { status: string; probability: number }>>({});
  const [inbreedingCoefficient, setInbreedingCoefficient] = useState<number | null>(null);
  
  // Fetch genetic data for both dogs
  useEffect(() => {
    const fetchGeneticData = async () => {
      if (!sireId && !damId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch sire genotype if ID provided
        if (sireId) {
          const { data: sireData, error: sireError } = await supabase
            .from('genetic_data')
            .select('*')
            .eq('dog_id', sireId)
            .single();
            
          if (sireError) throw sireError;
          
          // Convert health results to the expected format
          const healthMarkers: Record<string, HealthMarker> = {};
          if (sireData?.health_results) {
            Object.entries(sireData.health_results).forEach(([key, value]: [string, any]) => {
              healthMarkers[key] = {
                name: key,
                status: value.status || 'unknown',
                testDate: value.test_date || new Date().toISOString().slice(0, 10)
              };
            });
          }
          
          // Get primary breed from breed composition if available
          const breedComp = sireData?.breed_composition as Record<string, any> || {};
          const breedName = breedComp.primary?.breed || 'Unknown Breed';
          
          setSireGenotype({
            dog_id: sireId,
            baseColor: 'Black', // Placeholder for testing
            brownDilution: 'Unknown',
            dilution: 'Unknown',
            healthMarkers,
            breed: breedName,
            ...sireData
          });
        }
        
        // Fetch dam genotype if ID provided
        if (damId) {
          const { data: damData, error: damError } = await supabase
            .from('genetic_data')
            .select('*')
            .eq('dog_id', damId)
            .single();
            
          if (damError) throw damError;
          
          // Convert health results to the expected format
          const healthMarkers: Record<string, HealthMarker> = {};
          if (damData?.health_results) {
            Object.entries(damData.health_results).forEach(([key, value]: [string, any]) => {
              healthMarkers[key] = {
                name: key,
                status: value.status || 'unknown',
                testDate: value.test_date || new Date().toISOString().slice(0, 10)
              };
            });
          }
          
          // Get primary breed from breed composition if available
          const breedComp = damData?.breed_composition as Record<string, any> || {};
          const breedName = breedComp.primary?.breed || 'Unknown Breed';
          
          setDamGenotype({
            dog_id: damId,
            baseColor: 'Brown', // Placeholder for testing
            brownDilution: 'Unknown',
            dilution: 'Unknown',
            healthMarkers,
            breed: breedName,
            ...damData
          });
        }
      } catch (err) {
        console.error('Error fetching genetic data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch genetic data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGeneticData();
  }, [sireId, damId]);
  
  // Calculate genetic predictions when both genotypes are available
  useEffect(() => {
    if (sireGenotype && damGenotype) {
      // Calculate color probabilities
      const colors = calculateColorProbabilities(sireGenotype, damGenotype);
      setColorProbabilities(colors);
      
      // Calculate health risks
      const risks = calculateHealthRisks(sireGenotype, damGenotype);
      setHealthRisks(risks);
      
      // Calculate inbreeding coefficient
      const coefficient = calculateInbreedingCoefficient(sireGenotype, damGenotype);
      setInbreedingCoefficient(coefficient);
    }
  }, [sireGenotype, damGenotype]);
  
  // Get the count of health concerns
  const getHealthConcernCounts = () => {
    if (!healthRisks) return { atRisk: 0, carrier: 0, clear: 0 };
    
    let atRisk = 0;
    let carrier = 0;
    let clear = 0;
    
    Object.values(healthRisks).forEach(risk => {
      if (risk.status === 'at_risk' || risk.status === 'at risk') {
        atRisk++;
      } else if (risk.status === 'carrier') {
        carrier++;
      } else if (risk.status === 'clear') {
        clear++;
      }
    });
    
    return { atRisk, carrier, clear };
  };
  
  // Calculate overall compatibility score (0-100)
  const calculateCompatibilityScore = () => {
    if (!sireGenotype || !damGenotype) return null;
    
    const { atRisk, carrier } = getHealthConcernCounts();
    
    // Base score
    let score = 100;
    
    // Deduct for health risks
    score -= atRisk * 15; // Major deduction for at-risk conditions
    score -= carrier * 5;  // Minor deduction for carrier status
    
    // Deduct for inbreeding
    if (inbreedingCoefficient) {
      score -= inbreedingCoefficient * 100; // e.g., 0.0625 COI = -6.25 points
    }
    
    return Math.max(0, Math.min(100, score));
  };
  
  return {
    sireGenotype,
    damGenotype,
    isLoading,
    error,
    colorProbabilities,
    healthRisks,
    inbreedingCoefficient,
    healthConcernCounts: { atRisk: 0, carrier: 0, clear: 0 },
    compatibilityScore: 85, // Placeholder value
    hasData: Boolean(sireGenotype && damGenotype)
  };
};

export default useGeneticPairing;
