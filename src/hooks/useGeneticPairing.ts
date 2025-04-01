
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDogGenetics } from './useDogGenetics';
import { DogGenotype, HealthMarker, HealthWarning } from '@/types/genetics';

export interface PairingResults {
  coiEstimate?: number;
  coiRisk?: 'low' | 'medium' | 'high';
  healthWarnings: HealthWarning[];
  colorProbabilities?: Record<string, number>;
  breedCompatibility?: number;
  overallCompatibility?: number;
  reasons?: string[];
  evaluations?: Record<string, any>; 
}

export const useGeneticPairing = (sireDogId?: string, damDogId?: string) => {
  const [results, setResults] = useState<PairingResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { dogData: sireGenetics, isLoading: sireLoading } = useDogGenetics(sireDogId || '');
  const { dogData: damGenetics, isLoading: damLoading } = useDogGenetics(damDogId || '');

  useEffect(() => {
    const evaluatePairing = async () => {
      if (!sireDogId || !damDogId || sireLoading || damLoading) {
        return;
      }

      if (!sireGenetics || !damGenetics) {
        setError(new Error('Genetic data not available for one or both dogs'));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Calculate potential health risks
        const healthWarnings = calculateHealthRisks(sireGenetics, damGenetics);

        // Simulate COI calculation (in a real app, this would be more sophisticated)
        const coiEstimate = calculateCOI(sireGenetics, damGenetics);
        
        // Determine COI risk level
        let coiRisk: 'low' | 'medium' | 'high' = 'low';
        if (coiEstimate > 0.125) coiRisk = 'high';
        else if (coiEstimate > 0.0625) coiRisk = 'medium';

        // Calculate compatibility
        const breedCompatibility = calculateBreedCompatibility(sireGenetics, damGenetics);
        
        // Calculate overall compatibility
        const healthScore = healthWarnings.length === 0 ? 100 : Math.max(0, 100 - (healthWarnings.length * 10));
        const coiScore = Math.max(0, 100 - (coiEstimate * 100));
        const overallCompatibility = Math.round((healthScore * 0.7 + coiScore * 0.3) / 10) / 10;

        // Set results
        setResults({
          coiEstimate,
          coiRisk,
          healthWarnings,
          breedCompatibility,
          overallCompatibility,
          reasons: deriveRecommendationReasons(healthWarnings, coiEstimate, breedCompatibility)
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to evaluate genetic compatibility'));
      } finally {
        setLoading(false);
      }
    };

    evaluatePairing();
  }, [sireDogId, damDogId, sireGenetics, damGenetics, sireLoading, damLoading]);

  // Calculate potential health risks
  const calculateHealthRisks = (sire: DogGenotype, dam: DogGenotype): HealthWarning[] => {
    const warnings: HealthWarning[] = [];

    if (!sire.healthMarkers || !dam.healthMarkers) {
      warnings.push({
        condition: 'Incomplete genetic health data',
        risk: 'Unknown risks',
        description: 'One or both dogs are missing genetic health test results',
        action: 'Complete genetic health testing before breeding',
        riskLevel: 'high'
      });
      return warnings;
    }

    // Check for carrier x carrier matches (autosomal recessive diseases)
    const sireMarkers = sire.healthMarkers as Record<string, HealthMarker>;
    const damMarkers = dam.healthMarkers as Record<string, HealthMarker>;

    const allConditions = new Set([
      ...Object.keys(sireMarkers),
      ...Object.keys(damMarkers)
    ]);

    allConditions.forEach(condition => {
      const sireStatus = sireMarkers[condition]?.status;
      const damStatus = damMarkers[condition]?.status;

      // Both are carriers
      if (sireStatus === 'carrier' && damStatus === 'carrier') {
        warnings.push({
          condition,
          risk: 'High risk (25%)',
          description: `Both dogs are carriers for ${condition}. 25% of puppies may be affected.`,
          action: 'Avoid this pairing or prepare for genetic testing of puppies',
          riskLevel: 'high'
        });
      } 
      // One affected and one carrier
      else if (
        (sireStatus === 'at_risk' && damStatus === 'carrier') ||
        (sireStatus === 'carrier' && damStatus === 'at_risk')
      ) {
        warnings.push({
          condition,
          risk: 'High risk (50%)',
          description: `One dog is affected and one is a carrier for ${condition}. 50% of puppies may be affected.`,
          action: 'Strongly advise against this pairing',
          riskLevel: 'high'
        });
      }
      // Both affected
      else if (sireStatus === 'at_risk' && damStatus === 'at_risk') {
        warnings.push({
          condition,
          risk: 'Extreme risk (100%)',
          description: `Both dogs are affected with ${condition}. All puppies will be affected.`,
          action: 'Do not proceed with this pairing',
          riskLevel: 'critical'
        });
      }
      // One affected, one unknown
      else if (
        (sireStatus === 'at_risk' && (!damStatus || damStatus === 'unknown')) ||
        (damStatus === 'at_risk' && (!sireStatus || sireStatus === 'unknown'))
      ) {
        warnings.push({
          condition,
          risk: 'Unknown - high potential',
          description: `One dog is affected with ${condition} and the other's status is unknown`,
          action: 'Test the other dog before considering this pairing',
          riskLevel: 'high'
        });
      }
      // Both unknown for a significant condition
      else if ((!sireStatus || sireStatus === 'unknown') && (!damStatus || damStatus === 'unknown')) {
        warnings.push({
          condition,
          risk: 'Unknown',
          description: `Neither dog has been tested for ${condition}`,
          action: 'Test both dogs before considering this pairing',
          riskLevel: 'medium'
        });
      }
    });

    return warnings;
  };

  // Calculate COI (Coefficient of Inbreeding)
  const calculateCOI = (sire: DogGenotype, dam: DogGenotype): number => {
    // In a real app, this would use pedigree data and sophisticated algorithms
    // This is a simplified placeholder
    return Math.random() * 0.1; // Returns a random value between 0 and 0.1 (10%)
  };

  // Calculate breed compatibility
  const calculateBreedCompatibility = (sire: DogGenotype, dam: DogGenotype): number => {
    if (sire.breed === dam.breed) return 1.0;
    return 0.5; // Simple placeholder
  };

  // Derive recommendation reasons
  const deriveRecommendationReasons = (
    warnings: HealthWarning[],
    coi: number,
    breedCompatibility: number
  ): string[] => {
    const reasons = [];

    if (warnings.length > 0) {
      reasons.push(`${warnings.length} health concerns detected`);
    }

    if (coi > 0.125) {
      reasons.push('High inbreeding coefficient');
    } else if (coi < 0.03125) {
      reasons.push('Good genetic diversity');
    }

    if (breedCompatibility < 1) {
      reasons.push('Different breeds');
    }

    return reasons;
  };

  return {
    results,
    loading,
    error
  };
};

export default useGeneticPairing;
