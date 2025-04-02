
// Re-export all types from individual domain files

// Use named exports to avoid ambiguity
export * from './user';
// Not exporting auth types as the import is missing

// Handle potential duplicate exports from dog module
import * as DogTypes from './dog';
export { DogTypes };

// Not exporting puppy types as the import is missing
export * from './litter';
export * from './genetics';

// Handle health exports to avoid WeightUnit conflict
import * as HealthTypes from './health';
export { HealthTypes };

// Export specific types from puppyTracking to avoid conflicts
export * from './puppyTracking';

// To fix the WeightUnit conflict, explicitly export from litter without WeightUnit
import { 
  Puppy,
  SimpleDog, 
  Litter,
  Dog,
  // Exclude WeightUnit to avoid conflict
  // WeightUnit, 
  WeightUnitValue
} from './litter';

export {
  Puppy,
  SimpleDog,
  Litter,
  Dog,
  // WeightUnit, // Excluded to avoid conflict
  WeightUnitValue
};

// Not exporting organization, notification, subscription and adoption as they're missing
