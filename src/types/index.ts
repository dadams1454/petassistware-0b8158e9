
// Export all types from the project for easier imports
export * from './weight';
export * from './weight-units';
export * from './heat-cycles';
export * from './health';
export * from './health-enums';
export * from './enums';
export * from './common';
export * from './dog';
export * from './puppy';
export * from './litter';
export * from './dailyCare';

// Add any additional type exports here

// Re-export weight utilities
export { 
  convertWeightToGrams, 
  convertWeight, 
  formatWeight, 
  getAppropriateWeightUnit 
} from '../utils/weightConversion';
