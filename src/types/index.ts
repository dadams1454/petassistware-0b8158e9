
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

// Handle health exports to include WeightUnit explicitly
import { WeightUnit } from './health';
import * as HealthTypes from './health';
export { HealthTypes };
// Export the WeightUnit from health explicitly to avoid conflicts
export type { WeightUnit as HealthWeightUnit };

// Export specific types from puppyTracking to avoid conflicts
export * from './puppyTracking';

// To fix the WeightUnit conflict, explicitly export specific types from litter
// Using 'export type' for type-only exports to comply with isolatedModules
import { 
  Puppy,
  SimpleDog, 
  Litter,
  Dog,
  // WeightUnit, // Exclude this to avoid conflicts
  WeightUnitValue
} from './litter';

// Re-export using 'export type' to comply with isolatedModules
export type { Puppy };
export type { SimpleDog };
export type { Litter };
export type { Dog };
// WeightUnit excluded to avoid ambiguity
export type { WeightUnitValue };

// Not exporting organization, notification, subscription and adoption as they're missing
