
/**
 * Unified Type System
 * This is the main entry point for accessing all consolidated types
 */

// Export core types
export * from './core/index';
export * from './core/health';
export * from './core/weight';
export * from './core/animals';

// Export enums for use throughout the application
export * from './enums';
export * from './health-enums';
export * from './weight-units';

// Export heat cycle and reproductive types
export * from './heat-cycles';
export * from './reproductive';

// Re-export legacy types for backward compatibility
export * from './health';
export * from './dog';
export * from './puppy';
export * from './litter';
export * from './weight';
export * from './dailyCare';
export * from './puppyTracking';

