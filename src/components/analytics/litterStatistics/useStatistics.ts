
import { useMemo } from 'react';
import { PuppyStatistics } from './types';

export const useStatistics = (puppies: Puppy[]) => {
  const stats = useMemo(() => {
    // Filter puppies with weight data
    const puppiesWithWeight = puppies.filter(p => p.current_weight && p.birth_weight);
    
    // Calculate average weights
    const avgBirthWeight = puppiesWithWeight.length > 0 
      ? puppiesWithWeight.reduce((sum, p) => {
          const weight = typeof p.birth_weight === 'string' 
            ? parseFloat(p.birth_weight || '0') 
            : p.birth_weight || 0;
          return sum + weight;
        }, 0) / puppiesWithWeight.length
      : 0;
    
    const avgCurrentWeight = puppiesWithWeight.length > 0 
      ? puppiesWithWeight.reduce((sum, p) => {
          const weight = typeof p.current_weight === 'string' 
            ? parseFloat(p.current_weight || '0') 
            : p.current_weight || 0;
          return sum + weight;
        }, 0) / puppiesWithWeight.length
      : 0;
    
    // Calculate weight gain
    const avgWeightGain = avgCurrentWeight - avgBirthWeight;
    const avgWeightGainPercent = avgBirthWeight > 0 
      ? (avgWeightGain / avgBirthWeight) * 100 
      : 0;

    // Health records
    const puppiesWithVaccinations = puppies.filter(p => p.vaccination_dates).length;
    const puppiesWithDeworming = puppies.filter(p => p.deworming_dates).length;
    const puppiesWithVetChecks = puppies.filter(p => p.vet_check_dates).length;

    // Calculate percentages
    const vaccinationPercentage = (puppiesWithVaccinations / puppies.length) * 100;
    const dewormingPercentage = (puppiesWithDeworming / puppies.length) * 100;
    const vetChecksPercentage = (puppiesWithVetChecks / puppies.length) * 100;
    
    return {
      totalPuppies: puppies.length,
      puppiesWithWeightData: puppiesWithWeight.length,
      avgBirthWeight: avgBirthWeight.toFixed(1),
      avgCurrentWeight: avgCurrentWeight.toFixed(1),
      avgWeightGain: avgWeightGain.toFixed(1),
      avgWeightGainPercent: avgWeightGainPercent.toFixed(0),
      puppiesWithVaccinations,
      puppiesWithDeworming,
      puppiesWithVetChecks,
      vaccinationPercentage,
      dewormingPercentage,
      vetChecksPercentage
    } as PuppyStatistics;
  }, [puppies]);

  return {
    stats,
    hasData: puppies.length > 0
  };
};
