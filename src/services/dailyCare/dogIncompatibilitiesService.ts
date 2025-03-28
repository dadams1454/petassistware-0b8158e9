
import { supabase } from '@/integrations/supabase/client';

// Check if two dogs are incompatible
export const checkDogsIncompatibility = async (dogId1: string, dogId2: string): Promise<boolean> => {
  try {
    // Check incompatibility in either direction
    const { data, error } = await supabase
      .from('dog_incompatibilities')
      .select('*')
      .or(`dog_id.eq.${dogId1},dog_id.eq.${dogId2}`)
      .or(`incompatible_with.eq.${dogId1},incompatible_with.eq.${dogId2}`)
      .eq('active', true);
    
    if (error) {
      console.error('Error checking dog incompatibilities:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return false; // No incompatibility found
    }
    
    // Check if any record indicates these two dogs are incompatible
    return data.some(record => 
      (record.dog_id === dogId1 && record.incompatible_with === dogId2) ||
      (record.dog_id === dogId2 && record.incompatible_with === dogId1)
    );
  } catch (error) {
    console.error('Error in checkDogsIncompatibility:', error);
    return false; // Default to no incompatibility on error
  }
};

// Get all incompatible dogs for a specific dog
export const getIncompatibleDogs = async (dogId: string): Promise<string[]> => {
  try {
    // First get all incompatibilities where this dog is the source
    const { data: sourceData, error: sourceError } = await supabase
      .from('dog_incompatibilities')
      .select('incompatible_with')
      .eq('dog_id', dogId)
      .eq('active', true);
    
    if (sourceError) throw sourceError;
    
    // Then get all incompatibilities where this dog is the target
    const { data: targetData, error: targetError } = await supabase
      .from('dog_incompatibilities')
      .select('dog_id')
      .eq('incompatible_with', dogId)
      .eq('active', true);
    
    if (targetError) throw targetError;
    
    // Combine both sets of incompatible dogs
    const incompatibleDogIds = [
      ...(sourceData || []).map(item => item.incompatible_with),
      ...(targetData || []).map(item => item.dog_id)
    ];
    
    // Remove duplicates
    return [...new Set(incompatibleDogIds)];
  } catch (error) {
    console.error('Error in getIncompatibleDogs:', error);
    return [];
  }
};

// Add an incompatibility between two dogs
export const addDogIncompatibility = async (
  dogId: string, 
  incompatibleWithId: string, 
  reason?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('dog_incompatibilities')
      .insert({
        dog_id: dogId,
        incompatible_with: incompatibleWithId,
        active: true,
        reason
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error adding dog incompatibility:', error);
    throw error;
  }
};

// Remove an incompatibility between two dogs
export const removeDogIncompatibility = async (
  dogId: string, 
  incompatibleWithId: string
): Promise<void> => {
  try {
    // We mark as inactive rather than deleting
    const { error } = await supabase
      .from('dog_incompatibilities')
      .update({ active: false })
      .or(`and(dog_id.eq.${dogId},incompatible_with.eq.${incompatibleWithId}),and(dog_id.eq.${incompatibleWithId},incompatible_with.eq.${dogId})`);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing dog incompatibility:', error);
    throw error;
  }
};
