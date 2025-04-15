
import { supabase } from '@/integrations/supabase/client';
import { DogProfile } from '../types/dog';

/**
 * Fetch all dogs with optional filtering
 */
export async function fetchDogs({
  includeArchived = false,
  filterByStatus = [],
  filterByGender = [],
  searchTerm = '',
}: {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  searchTerm?: string;
} = {}) {
  let query = supabase
    .from('dogs')
    .select('*');
  
  // Apply filters
  if (!includeArchived) {
    query = query.eq('archived', false);
  }
  
  if (filterByStatus.length > 0) {
    query = query.in('status', filterByStatus);
  }
  
  if (filterByGender.length > 0) {
    query = query.in('gender', filterByGender);
  }
  
  if (searchTerm) {
    query = query.ilike('name', `%${searchTerm}%`);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) throw error;
  
  return data as DogProfile[];
}

/**
 * Fetch a single dog by ID
 */
export async function fetchDogById(dogId: string) {
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', dogId)
    .single();
    
  if (error) throw error;
  
  return data as DogProfile;
}

/**
 * Create a new dog
 */
export async function createDog(dogData: Partial<DogProfile>) {
  const { data, error } = await supabase
    .from('dogs')
    .insert(dogData)
    .select()
    .single();
    
  if (error) throw error;
  
  return data as DogProfile;
}

/**
 * Update an existing dog
 */
export async function updateDog(dogId: string, dogData: Partial<DogProfile>) {
  const { data, error } = await supabase
    .from('dogs')
    .update(dogData)
    .eq('id', dogId)
    .select()
    .single();
    
  if (error) throw error;
  
  return data as DogProfile;
}

/**
 * Delete a dog
 */
export async function deleteDog(dogId: string) {
  const { error } = await supabase
    .from('dogs')
    .delete()
    .eq('id', dogId);
    
  if (error) throw error;
  
  return dogId;
}
