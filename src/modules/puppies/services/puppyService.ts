
import { PuppyWithAge } from '../types';
import { errorHandlers } from '@/api/core/errors';
import { mockPuppies, getMockPuppyById, getUpdatedPuppies } from '@/mockData/puppies';

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
    // Use mock data
    console.log('Using mock data for puppies');
    let filteredPuppies = getUpdatedPuppies();
    
    // Apply filters
    if (filterByStatus.length > 0) {
      filteredPuppies = filteredPuppies.filter(puppy => 
        filterByStatus.includes(puppy.status || 'Available')
      );
    }
    
    if (filterByGender.length > 0) {
      filteredPuppies = filteredPuppies.filter(puppy => 
        filterByGender.includes(puppy.gender)
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredPuppies = filteredPuppies.filter(puppy => 
        puppy.name.toLowerCase().includes(term) || 
        (puppy.color && puppy.color.toLowerCase().includes(term))
      );
    }
    
    // Sort by birth_date descending (newest first)
    filteredPuppies.sort((a, b) => 
      new Date(b.birth_date).getTime() - new Date(a.birth_date).getTime()
    );
    
    return filteredPuppies;
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchPuppies');
  }
}

/**
 * Fetch a single puppy by ID
 */
export async function fetchPuppyById(puppyId: string): Promise<PuppyWithAge> {
  try {
    // Use mock data
    console.log(`Using mock data to fetch puppy with ID: ${puppyId}`);
    const puppy = getMockPuppyById(puppyId);
    
    if (!puppy) {
      throw new Error(`Puppy with ID ${puppyId} not found`);
    }
    
    return puppy;
  } catch (error) {
    throw errorHandlers.handleError(error, 'fetchPuppyById');
  }
}

/**
 * Create a new puppy
 */
export async function createPuppy(puppyData: Partial<PuppyWithAge>): Promise<PuppyWithAge> {
  try {
    console.log('Create puppy called with mock data:', puppyData);
    
    // Create a new mock puppy with required fields
    const birthDate = puppyData.birth_date || new Date().toISOString();
    const ageInDays = Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24));
    const ageInWeeks = Math.floor(ageInDays / 7);
    
    const newPuppy: PuppyWithAge = {
      id: `mock-puppy-${Date.now()}`,
      name: puppyData.name || 'Unnamed Puppy',
      gender: puppyData.gender || 'Male',
      birth_date: birthDate,
      litter_id: puppyData.litter_id || 'mock-litter',
      color: puppyData.color || '',
      status: puppyData.status || 'Available',
      birth_weight: puppyData.birth_weight,
      weight_unit: puppyData.weight_unit || 'g',
      current_weight: puppyData.current_weight || puppyData.birth_weight,
      created_at: new Date().toISOString(),
      ageInDays,
      ageInWeeks,
      ageDescription: `${ageInWeeks} weeks, ${ageInDays % 7} days`,
      ...puppyData
    };
    
    return newPuppy;
  } catch (error) {
    throw errorHandlers.handleError(error, 'createPuppy');
  }
}

/**
 * Update an existing puppy
 */
export async function updatePuppy(puppyId: string, puppyData: Partial<PuppyWithAge>): Promise<PuppyWithAge> {
  try {
    console.log(`Update puppy called with mock data for ID: ${puppyId}`, puppyData);
    
    // Get existing puppy
    const puppy = getMockPuppyById(puppyId);
    
    if (!puppy) {
      throw new Error(`Puppy with ID ${puppyId} not found`);
    }
    
    // Update the puppy
    const updatedPuppy = {
      ...puppy,
      ...puppyData,
      id: puppyId
    };
    
    return updatedPuppy;
  } catch (error) {
    throw errorHandlers.handleError(error, 'updatePuppy');
  }
}

/**
 * Delete a puppy
 */
export async function deletePuppy(puppyId: string): Promise<string> {
  try {
    console.log(`Delete puppy called with ID: ${puppyId}`);
    // In mock mode, just log and return the ID
    return puppyId;
  } catch (error) {
    throw errorHandlers.handleError(error, 'deletePuppy');
  }
}
