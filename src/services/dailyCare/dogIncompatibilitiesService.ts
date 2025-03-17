
import { supabase } from '@/integrations/supabase/client';

export interface DogIncompatibility {
  id: string;
  dog_id: string;
  incompatible_with: string;
  reason: string | null;
  active: boolean;
  created_at: string;
  incompatible_dog?: {
    name: string;
    photo_url?: string;
  };
}

// Fetch incompatibilities for a specific dog
export const fetchDogIncompatibilities = async (dogId: string): Promise<DogIncompatibility[]> => {
  const { data, error } = await supabase
    .from('dog_incompatibilities')
    .select(`
      *,
      incompatible_dog:incompatible_with (
        name,
        photo_url
      )
    `)
    .eq('dog_id', dogId)
    .eq('active', true);

  if (error) {
    console.error('Error fetching dog incompatibilities:', error);
    throw error;
  }

  return data || [];
};

// Create a new incompatibility
export const createIncompatibility = async (
  dogId: string, 
  incompatibleWithId: string, 
  reason?: string
): Promise<DogIncompatibility> => {
  const { data, error } = await supabase
    .from('dog_incompatibilities')
    .insert([{ 
      dog_id: dogId, 
      incompatible_with: incompatibleWithId, 
      reason: reason || null
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating incompatibility:', error);
    throw error;
  }

  return data;
};

// Update incompatibility status
export const updateIncompatibility = async (
  id: string, 
  updates: Partial<DogIncompatibility>
): Promise<DogIncompatibility> => {
  const { data, error } = await supabase
    .from('dog_incompatibilities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating incompatibility:', error);
    throw error;
  }

  return data;
};

// Delete incompatibility (or deactivate it)
export const removeIncompatibility = async (id: string, softDelete = true): Promise<void> => {
  if (softDelete) {
    const { error } = await supabase
      .from('dog_incompatibilities')
      .update({ active: false })
      .eq('id', id);
      
    if (error) {
      console.error('Error deactivating incompatibility:', error);
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('dog_incompatibilities')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting incompatibility:', error);
      throw error;
    }
  }
};

// Check if two dogs are incompatible
export const checkDogsIncompatibility = async (dogId1: string, dogId2: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('dog_incompatibilities')
    .select('*')
    .or(`dog_id.eq.${dogId1},dog_id.eq.${dogId2}`)
    .or(`incompatible_with.eq.${dogId1},incompatible_with.eq.${dogId2}`)
    .eq('active', true);

  if (error) {
    console.error('Error checking dog incompatibility:', error);
    throw error;
  }

  return data?.length > 0;
};
