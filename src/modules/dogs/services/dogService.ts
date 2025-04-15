
import { apiClient } from '@/api/core/apiClient';
import { DogProfile } from '../types/dog';
import { errorHandlers } from '@/api/core/errors';

interface DogFilterOptions {
  includeArchived?: boolean;
  filterByStatus?: string[];
  filterByGender?: string[];
  searchTerm?: string;
}

/**
 * Fetch all dogs with optional filtering
 */
export async function fetchDogs({
  includeArchived = false,
  filterByStatus = [],
  filterByGender = [],
  searchTerm = '',
}: DogFilterOptions = {}): Promise<DogProfile[]> {
  try {
    // Use raw client for complex queries
    let query = apiClient.raw.supabase
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
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchDogs');
  }
}

/**
 * Fetch a single dog by ID
 */
export async function fetchDogById(dogId: string): Promise<DogProfile> {
  try {
    const dog = await apiClient.select<DogProfile>('dogs', {
      eq: [['id', dogId]],
      single: true
    });
    
    return dog;
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchDogById');
  }
}

/**
 * Create a new dog
 */
export async function createDog(dogData: Partial<DogProfile>): Promise<DogProfile> {
  try {
    const newDog = await apiClient.insert<Partial<DogProfile>, DogProfile>(
      'dogs',
      dogData,
      { returnData: true, single: true }
    );
    
    return newDog;
  } catch (error) {
    throw errorHandlers.handleError(error, 'createDog');
  }
}

/**
 * Update an existing dog
 */
export async function updateDog(dogId: string, dogData: Partial<DogProfile>): Promise<DogProfile> {
  try {
    const updatedDog = await apiClient.update<Partial<DogProfile>, DogProfile>(
      'dogs',
      dogData,
      { 
        eq: [['id', dogId]],
        returnData: true,
        single: true
      }
    );
    
    return updatedDog;
  } catch (error) {
    throw errorHandlers.handleError(error, 'updateDog');
  }
}

/**
 * Delete a dog
 */
export async function deleteDog(dogId: string): Promise<string> {
  try {
    await apiClient.delete('dogs', {
      eq: [['id', dogId]]
    });
    
    return dogId;
  } catch (error) {
    throw errorHandlers.handleError(error, 'deleteDog');
  }
}
