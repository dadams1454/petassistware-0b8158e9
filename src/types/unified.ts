
/**
 * Unified Type System
 * This is the main entry point for accessing all consolidated types
 */

// Export core types
export * from './core/index';
export * from './core/health';
export * from './core/weight';

// Explicit export from core/animals to avoid conflicts
export { 
  AnimalGender,
  PuppyStatus,
  // Export the core DogStatus as the primary version
  DogStatus as DogStatus,
  type AnimalBase,
  type Dog,
  type Puppy,
  type Litter,
  type LitterWithDogs,
  type SimpleDog 
} from './core/animals';

// Export enums for use throughout the application
export * from './enums';
export * from './health-enums';
export * from './weight-units';

// Export heat cycle and reproductive types
export * from './heat-cycles';
export * from './reproductive';

// Re-export legacy types for backward compatibility
// But prevent DogStatus from being re-exported from here
export * from './health';
export { 
  DogGender, 
  // Do not re-export DogStatus from here
  isValidDogGender, 
  normalizeDogGender, 
  isValidDogStatus, 
  normalizeDogStatus, 
  createMinimalDog,
  type Dog as LegacyDog,
  type DogProfile,
  type DogCareStatus,
  type Vaccination
} from './dog';

export * from './puppy';
export * from './litter';
export * from './weight';
export * from './dailyCare';
export * from './puppyTracking';
