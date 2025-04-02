
// Re-export types from various files
export * from './customer';
export * from './task';

// Re-export from litter with explicit renaming to avoid ambiguity
export { 
  SimpleDog, 
  Dog, 
  Puppy, 
  // Rename PuppyWithAge to avoid ambiguity with puppyTracking.ts
  PuppyWithAge as LitterPuppyWithAge,
  Litter, 
  LitterWithDogs,
  WeightUnitValue
} from './litter';

// Export puppy tracking types
export {
  PuppyWithAge,
  AgeGroup,
  PuppyAgeGroupData,
  PuppyManagementStats,
  PuppyMilestone,
  PuppyWeightRecord,
  WeightUnit,
  WeightRecord,
  PuppyHealthRecord,
  PuppyVaccinationRecord,
  VaccinationRecord,
  PuppyVaccinationSchedule,
  VaccinationScheduleItem,
  SocializationCategory,
  SocializationReaction,
  SocializationReactionObject,
  SocializationExperience,
  SocializationProgress
} from './puppyTracking';
