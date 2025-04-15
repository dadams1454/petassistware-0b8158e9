
import { apiClient } from '@/api/core/apiClient';
import { PuppyWithAge } from '../types';
import { calculateAgeInDays } from '../utils/puppyAgeCalculator';
import { errorHandlers } from '@/api/core/errors';

interface PuppyFilterOptions {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  searchTerm?: string;
}

/**
 * Fetch puppies with optional filtering
 */
export async function fetchPuppies({
  includeArchived = false,
  filterByStatus = [],
  filterByGender = [],
  searchTerm = '',
}: PuppyFilterOptions = {}): Promise<PuppyWithAge[]> {
  try {
    // Build complex query using raw client for now
    // In the future, this could be refactored to use the abstracted client
    let query = apiClient.raw.supabase
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
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order('birth_date', { ascending: false });
    
    if (error) throw error;
    
    // Calculate age for each puppy
    return data.map(calculatePuppyAge);
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchPuppies');
  }
}

/**
 * Fetch a single puppy by ID
 */
export async function fetchPuppyById(puppyId: string): Promise<PuppyWithAge> {
  try {
    const puppy = await apiClient.select<any>('puppies', {
      eq: [['id', puppyId]],
      single: true
    });
    
    if (!puppy) {
      throw new Error('Puppy not found');
    }
    
    return calculatePuppyAge(puppy);
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchPuppyById');
  }
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
export async function createPuppy(puppyData: Partial<PuppyWithAge>): Promise<PuppyWithAge> {
  try {
    const newPuppy = await apiClient.insert<Partial<PuppyWithAge>, any>(
      'puppies',
      puppyData,
      { returnData: true, single: true }
    );
    
    return calculatePuppyAge(newPuppy);
  } catch (error) {
    throw errorHandlers.handleError(error, 'createPuppy');
  }
}

/**
 * Update an existing puppy
 */
export async function updatePuppy(puppyId: string, puppyData: Partial<PuppyWithAge>): Promise<PuppyWithAge> {
  try {
    const updatedPuppy = await apiClient.update<Partial<PuppyWithAge>, any>(
      'puppies',
      puppyData,
      { 
        eq: [['id', puppyId]],
        returnData: true,
        single: true
      }
    );
    
    return calculatePuppyAge(updatedPuppy);
  } catch (error) {
    throw errorHandlers.handleError(error, 'updatePuppy');
  }
}

/**
 * Delete a puppy
 */
export async function deletePuppy(puppyId: string): Promise<string> {
  try {
    await apiClient.delete('puppies', {
      eq: [['id', puppyId]]
    });
    
    return puppyId;
  } catch (error) {
    throw errorHandlers.handleError(error, 'deletePuppy');
  }
}
