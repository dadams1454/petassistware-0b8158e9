
import { apiClient } from '@/api/core/apiClient';
import { DogProfile } from '../types/dog';
import { errorHandlers } from '@/api/core/errors';
import { mockDogs, getMockDogById, getAllMockDogs, filterMockDogsByStatus } from '@/mockData/dogs';

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
    // Use mock data
    console.log('Using mock data for dogs');
    let filteredDogs = [...mockDogs];
    
    // Apply filters
    if (!includeArchived) {
      filteredDogs = filteredDogs.filter(dog => dog.status !== 'archived');
    }
    
    if (filterByStatus.length > 0) {
      filteredDogs = filteredDogs.filter(dog => filterByStatus.includes(dog.status as string));
    }
    
    if (filterByGender.length > 0) {
      filteredDogs = filteredDogs.filter(dog => filterByGender.includes(dog.gender as string));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredDogs = filteredDogs.filter(dog => 
        dog.name.toLowerCase().includes(term) || 
        (dog.breed && dog.breed.toLowerCase().includes(term))
      );
    }
    
    // Sort by name
    filteredDogs.sort((a, b) => a.name.localeCompare(b.name));
    
    return filteredDogs as DogProfile[];
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchDogs');
  }
}

/**
 * Fetch a single dog by ID
 */
export async function fetchDogById(dogId: string): Promise<DogProfile> {
  try {
    // Use mock data
    console.log(`Using mock data to fetch dog with ID: ${dogId}`);
    const dog = getMockDogById(dogId);
    
    if (!dog) {
      throw new Error(`Dog with ID ${dogId} not found`);
    }
    
    return dog as DogProfile;
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchDogById');
  }
}

/**
 * Create a new dog
 */
export async function createDog(dogData: Partial<DogProfile>): Promise<DogProfile> {
  try {
    console.log('Create dog called with mock data:', dogData);
    // In mock mode, just log and return the data with a fake ID
    const newDog = {
      ...dogData,
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    return newDog as DogProfile;
  } catch (error) {
    throw errorHandlers.handleError(error, 'createDog');
  }
}

/**
 * Update an existing dog
 */
export async function updateDog(dogId: string, dogData: Partial<DogProfile>): Promise<DogProfile> {
  try {
    console.log(`Update dog called with mock data for ID: ${dogId}`, dogData);
    // In mock mode, just log and return the combined data
    const dog = getMockDogById(dogId);
    
    if (!dog) {
      throw new Error(`Dog with ID ${dogId} not found`);
    }
    
    const updatedDog = {
      ...dog,
      ...dogData,
      id: dogId
    };
    
    return updatedDog as DogProfile;
  } catch (error) {
    throw errorHandlers.handleError(error, 'updateDog');
  }
}

/**
 * Delete a dog
 */
export async function deleteDog(dogId: string): Promise<string> {
  try {
    console.log(`Delete dog called with ID: ${dogId}`);
    // In mock mode, just log and return the ID
    return dogId;
  } catch (error) {
    throw errorHandlers.handleError(error, 'deleteDog');
  }
}
