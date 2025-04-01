
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePuppyBreedAverages = (puppyId: string) => {
  // Fetch breed averages for puppy's breed
  const { data: breedAverages, isLoading, error } = useQuery({
    queryKey: ['breedAverages', puppyId],
    queryFn: async () => {
      if (!puppyId) return [];
      
      // First get the puppy to find breed
      const { data: puppy, error: puppyError } = await supabase
        .from('puppies')
        .select('litter:litter_id(dam:dam_id(breed))')
        .eq('id', puppyId)
        .single();
      
      if (puppyError) throw puppyError;
      
      // Get breed
      const breed = puppy?.litter?.dam?.breed;
      
      if (!breed) {
        // If breed is not found, return some generic values for Newfoundlands
        return generateGenericGrowthCurve('Newfoundland');
      }
      
      // TODO: In a real application, fetch actual breed averages from a database
      // For now, return generic values based on breed
      return generateGenericGrowthCurve(breed);
    },
    enabled: !!puppyId
  });
  
  return {
    breedAverages,
    isLoading,
    error
  };
};

// Helper function to generate a generic growth curve for a breed
const generateGenericGrowthCurve = (breed: string) => {
  // Default is for medium dogs
  let weightFactor = 1;
  let maxWeight = 50;
  
  // Adjust based on breed
  if (breed.toLowerCase().includes('newfoundland')) {
    weightFactor = 2.2;
    maxWeight = 150;
  } else if (['great dane', 'mastiff', 'st. bernard', 'saint bernard'].some(b => breed.toLowerCase().includes(b))) {
    weightFactor = 2.5;
    maxWeight = 170;
  } else if (['labrador', 'golden retriever', 'german shepherd'].some(b => breed.toLowerCase().includes(b))) {
    weightFactor = 1.5;
    maxWeight = 75;
  } else if (['border collie', 'beagle', 'cocker spaniel'].some(b => breed.toLowerCase().includes(b))) {
    weightFactor = 0.8;
    maxWeight = 40;
  } else if (['chihuahua', 'yorkie', 'maltese', 'pomeranian'].some(b => breed.toLowerCase().includes(b))) {
    weightFactor = 0.2;
    maxWeight = 10;
  }
  
  // Generate curves for typical ages (days)
  const growthCurve = [];
  
  // Birth weight (approximately 1-5% of adult weight)
  growthCurve.push({ dayAge: 0, weight: maxWeight * 0.02 * weightFactor });
  
  // 1 week
  growthCurve.push({ dayAge: 7, weight: maxWeight * 0.04 * weightFactor });
  
  // 2 weeks
  growthCurve.push({ dayAge: 14, weight: maxWeight * 0.07 * weightFactor });
  
  // 3 weeks
  growthCurve.push({ dayAge: 21, weight: maxWeight * 0.1 * weightFactor });
  
  // 4 weeks
  growthCurve.push({ dayAge: 28, weight: maxWeight * 0.13 * weightFactor });
  
  // 6 weeks
  growthCurve.push({ dayAge: 42, weight: maxWeight * 0.18 * weightFactor });
  
  // 8 weeks
  growthCurve.push({ dayAge: 56, weight: maxWeight * 0.25 * weightFactor });
  
  // 12 weeks
  growthCurve.push({ dayAge: 84, weight: maxWeight * 0.38 * weightFactor });
  
  // 16 weeks
  growthCurve.push({ dayAge: 112, weight: maxWeight * 0.5 * weightFactor });
  
  // 6 months
  growthCurve.push({ dayAge: 180, weight: maxWeight * 0.7 * weightFactor });
  
  // 9 months
  growthCurve.push({ dayAge: 270, weight: maxWeight * 0.85 * weightFactor });
  
  // 12 months
  growthCurve.push({ dayAge: 365, weight: maxWeight * 0.95 * weightFactor });
  
  // 18 months (adult weight)
  growthCurve.push({ dayAge: 540, weight: maxWeight * weightFactor });
  
  return growthCurve;
};
