
import { useMemo } from 'react';

export const useChartData = (litterDetails: any[] | undefined) => {
  // Generate comparison data for puppies per litter
  const puppiesPerLitterData = useMemo(() => {
    if (!litterDetails) return [];
    
    return litterDetails.map(litter => ({
      name: litter.litter_name || `Litter (${new Date(litter.birth_date).toLocaleDateString()})`,
      count: litter.puppies.length,
      male: litter.puppies.filter(puppy => puppy.gender?.toLowerCase() === 'male').length,
      female: litter.puppies.filter(puppy => puppy.gender?.toLowerCase() === 'female').length,
      sire: litter.sire?.name || 'Unknown'
    }));
  }, [litterDetails]);

  // Generate comparison data for weight averages per litter
  const weightComparisonData = useMemo(() => {
    if (!litterDetails) return [];
    
    return litterDetails.map(litter => {
      const birthWeights = litter.puppies
        .filter(puppy => puppy.birth_weight)
        .map(puppy => parseFloat(puppy.birth_weight));
      
      const currentWeights = litter.puppies
        .filter(puppy => puppy.current_weight)
        .map(puppy => parseFloat(puppy.current_weight));
      
      const avgBirthWeight = birthWeights.length 
        ? birthWeights.reduce((sum, weight) => sum + weight, 0) / birthWeights.length
        : 0;
      
      const avgCurrentWeight = currentWeights.length 
        ? currentWeights.reduce((sum, weight) => sum + weight, 0) / currentWeights.length
        : 0;
      
      return {
        name: litter.litter_name || `Litter (${new Date(litter.birth_date).toLocaleDateString()})`,
        birthWeight: avgBirthWeight,
        currentWeight: avgCurrentWeight,
        sire: litter.sire?.name || 'Unknown',
        puppyCount: litter.puppies.length
      };
    });
  }, [litterDetails]);

  // Generate comparison data for color distribution across all litters
  const colorDistributionData = useMemo(() => {
    if (!litterDetails) return [];

    const colorCounts: { [key: string]: number } = {};
    let totalPuppies = 0;

    litterDetails.forEach(litter => {
      litter.puppies.forEach(puppy => {
        if (puppy.color) {
          colorCounts[puppy.color] = (colorCounts[puppy.color] || 0) + 1;
          totalPuppies++;
        }
      });
    });

    return Object.keys(colorCounts).map(color => ({
      name: color,
      count: colorCounts[color],
      percentage: Math.round((colorCounts[color] / totalPuppies) * 100)
    }));
  }, [litterDetails]);

  // Chart colors
  const COLORS = ['#2563eb', '#db2777', '#16a34a', '#ea580c', '#9333ea', '#ca8a04', '#0891b2', '#4f46e5'];
  
  return {
    puppiesPerLitterData,
    weightComparisonData,
    colorDistributionData,
    COLORS
  };
};
