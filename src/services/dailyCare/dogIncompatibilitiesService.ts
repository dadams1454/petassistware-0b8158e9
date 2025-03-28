
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if two dogs are incompatible with each other
 * @param dogId1 First dog ID
 * @param dogId2 Second dog ID
 * @returns Boolean indicating if dogs are incompatible
 */
export const checkDogsIncompatibility = async (dogId1: string, dogId2: string): Promise<boolean> => {
  try {
    // Check if there's an incompatibility record in either direction
    const { data, error } = await supabase
      .from('dog_incompatibilities')
      .select('*')
      .or(`and(dog_id.eq.${dogId1},incompatible_with.eq.${dogId2}),and(dog_id.eq.${dogId2},incompatible_with.eq.${dogId1})`)
      .eq('active', true);
    
    if (error) {
      console.error('Error checking dog incompatibilities:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Exception checking dog incompatibilities:', error);
    return false;
  }
};
