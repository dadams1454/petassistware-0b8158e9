
/**
 * Common types used throughout the application
 */

// Re-export everything from weight-units 
export * from './weight-units';

// Re-export HeatIntensity and HeatIntensityType from heat-cycles
export { HeatIntensity, HeatIntensityType } from './heat-cycles';

// Frequency types for medications and other scheduled events
export enum FrequencyTypes {
  DAILY = 'daily',
  TWICE_DAILY = 'twice daily',
  THREE_TIMES_DAILY = 'three times daily',
  EVERY_OTHER_DAY = 'every other day',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  AS_NEEDED = 'as needed',
  ONCE_DAILY = 'once daily'
}

// Re-export the weight calculation utility functions
export { 
  calculatePercentChange 
} from '../components/litters/puppies/weight/weightUnits';

// Re-export weightUnitInfos for backward compatibility
export { weightUnitInfos } from './weight-units';
