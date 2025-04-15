
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '../types';
import { calculateAgeInDays } from '../utils/puppyAgeCalculator';

/**
 * Fetch puppies with optional filtering
 */
export async function fetchPuppies({
  includeArchived = false,
  filterByStatus = [],
  filterByGender = [],
}: {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
}) {
  let query = supabase
    .from('puppies')
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
  
  const { data, error } = await query.order('birth_date', { ascending: false });
  
  if (error) throw error;
  
  // Calculate age for each puppy
  return data.map(calculatePuppyAge);
}

/**
 * Fetch a single puppy by ID
 */
export async function fetchPuppyById(puppyId: string) {
  const { data, error } = await supabase
    .from('puppies')
    .select('*')
    .eq('id', puppyId)
    .single();
    
  if (error) throw error;
  
  if (!data) {
    throw new Error('Puppy not found');
  }
  
  return calculatePuppyAge(data);
}

/**
 * Calculate age information for a puppy
 */
function calculatePuppyAge(puppy: any): PuppyWithAge {
  const birthDate = puppy.birth_date;
  
  // Skip if no birth date
  if (!birthDate) {
    return {
      ...puppy,
      ageInDays: 0,
      ageInWeeks: 0,
      ageDescription: 'Unknown'
    };
  }
  
  // Calculate age in days
  const ageInDays = calculateAgeInDays(birthDate) || 0;
  const ageInWeeks = Math.floor(ageInDays / 7);
  
  // Determine age description
  let ageDescription = '';
  if (ageInDays < 7) {
    ageDescription = `${ageInDays} days`;
  } else if (ageInDays < 14) {
    ageDescription = `1 week, ${ageInDays % 7} days`;
  } else {
    ageDescription = `${ageInWeeks} weeks`;
    const remainingDays = ageInDays % 7;
    if (remainingDays > 0) {
      ageDescription += `, ${remainingDays} days`;
    }
  }
  
  return {
    ...puppy,
    ageInDays,
    ageInWeeks,
    ageDescription
  };
}

/**
 * Create a new puppy
 */
export async function createPuppy(puppyData: Partial<PuppyWithAge>) {
  const { data, error } = await supabase
    .from('puppies')
    .insert(puppyData)
    .select()
    .single();
    
  if (error) throw error;
  
  return calculatePuppyAge(data);
}

/**
 * Update an existing puppy
 */
export async function updatePuppy(puppyId: string, puppyData: Partial<PuppyWithAge>) {
  const { data, error } = await supabase
    .from('puppies')
    .update(puppyData)
    .eq('id', puppyId)
    .select()
    .single();
    
  if (error) throw error;
  
  return calculatePuppyAge(data);
}

/**
 * Delete a puppy
 */
export async function deletePuppy(puppyId: string) {
  const { error } = await supabase
    .from('puppies')
    .delete()
    .eq('id', puppyId);
    
  if (error) throw error;
  
  return puppyId;
}
