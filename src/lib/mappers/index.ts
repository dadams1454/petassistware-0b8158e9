
// Export all mappers for easier importing
export * from './weightMapper';
export * from './puppyMapper';
export * from './dogMapper';
export * from './healthMapper';
export * from './typeMapper';

// Export the individual mappers for direct import
export { 
  mapToCoreDog,
  mapToCorePuppy,
  mapToWeightRecord,
  mapToModuleDog,
  mapToHealthRecord,
  mapToHeatCycle
} from './typeMapper';
