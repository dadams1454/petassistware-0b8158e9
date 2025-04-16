
/**
 * Mock data generators
 * Utility functions to create mock data for testing
 */
import { v4 as uuidv4 } from 'uuid';
import { 
  Dog, 
  Puppy, 
  Litter, 
  WeightRecord, 
  HealthRecord,
  AnimalGender,
  DogStatus,
  PuppyStatus
} from '@/types/unified';

/**
 * Generate a mock dog
 */
export function createMockDog(overrides: Partial<Dog> = {}): Dog {
  return {
    id: uuidv4(),
    name: `Dog ${Math.floor(Math.random() * 100)}`,
    breed: 'Newfoundland',
    gender: Math.random() > 0.5 ? AnimalGender.MALE : AnimalGender.FEMALE,
    color: 'Black',
    birth_date: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    photo_url: `https://placedog.net/500/500?id=${Math.floor(Math.random() * 100)}`,
    status: DogStatus.ACTIVE,
    created_at: new Date().toISOString(),
    weight: 100 + Math.floor(Math.random() * 50),
    weight_unit: 'lb',
    ...overrides
  };
}

/**
 * Generate a mock puppy
 */
export function createMockPuppy(litterId: string, overrides: Partial<Puppy> = {}): Puppy {
  return {
    id: uuidv4(),
    name: `Puppy ${Math.floor(Math.random() * 100)}`,
    litter_id: litterId,
    gender: Math.random() > 0.5 ? AnimalGender.MALE : AnimalGender.FEMALE,
    color: 'Black',
    birth_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    photo_url: `https://placedog.net/400/400?id=${Math.floor(Math.random() * 100)}`,
    status: PuppyStatus.AVAILABLE,
    birth_weight: 1 + Math.random() * 0.5,
    birth_weight_unit: 'lb',
    weight: 5 + Math.random() * 20,
    weight_unit: 'lb',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate a mock litter
 */
export function createMockLitter(damId: string, sireId?: string, overrides: Partial<Litter> = {}): Litter {
  return {
    id: uuidv4(),
    litter_name: `Litter ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    dam_id: damId,
    sire_id: sireId,
    birth_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expected_go_home_date: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    male_count: Math.floor(Math.random() * 6),
    female_count: Math.floor(Math.random() * 6),
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate a mock weight record
 */
export function createMockWeightRecord(animalId: string, isPuppy: boolean = false, overrides: Partial<WeightRecord> = {}): WeightRecord {
  return {
    id: uuidv4(),
    ...(isPuppy ? { puppy_id: animalId } : { dog_id: animalId }),
    weight: 10 + Math.random() * 100,
    weight_unit: 'lb',
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate a mock health record
 */
export function createMockHealthRecord(animalId: string, isPuppy: boolean = false, overrides: Partial<HealthRecord> = {}): HealthRecord {
  const recordTypes = ['vaccination', 'examination', 'medication', 'surgery'];
  const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
  
  return {
    id: uuidv4(),
    ...(isPuppy ? { puppy_id: animalId } : { dog_id: animalId }),
    record_type: recordType,
    title: `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`,
    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vet_name: 'Dr. Smith',
    record_notes: 'Regular checkup',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate an array of mock data
 */
export function generateMockArray<T>(
  generator: (...args: any[]) => T,
  count: number,
  ...args: any[]
): T[] {
  return Array.from({ length: count }, () => generator(...args));
}
