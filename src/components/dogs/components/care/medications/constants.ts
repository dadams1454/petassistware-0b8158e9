
// Define constants for medication UI
export const DOSAGE_UNITS = [
  'mg', 'ml', 'g', 'tablet(s)', 'capsule(s)', 'drop(s)', 'puff(s)', 'unit(s)', 'tsp', 'tbsp', 'oz'
];

// Export as options for form components
export const DosageUnitOptions = DOSAGE_UNITS.map(unit => ({
  label: unit,
  value: unit
}));

// Define frequency options for medication
export const FREQUENCY = {
  DAILY: 'daily',
  ONCE_DAILY: 'Once daily',
  TWICE_DAILY: 'Twice daily',
  THREE_TIMES_DAILY: 'Three times daily',
  FOUR_TIMES_DAILY: 'Four times daily',
  EVERY_OTHER_DAY: 'Every other day',
  WEEKLY: 'Weekly',
  BIWEEKLY: 'Bi-weekly',
  MONTHLY: 'Monthly',
  AS_NEEDED: 'As needed (PRN)',
  CUSTOM: 'Custom'
};

// Export as options for form components
export const MedicationFrequencyOptions = Object.values(FREQUENCY).map(freq => ({
  label: freq,
  value: freq
}));

// Define duration units
export const DURATION_UNITS = [
  'day(s)', 'week(s)', 'month(s)'
];

// Export as options for form components
export const DurationUnitOptions = DURATION_UNITS.map(unit => ({
  label: unit,
  value: unit
}));

// Define routes of administration
export const ADMINISTRATION_ROUTES = [
  'Oral', 'Topical', 'Injection', 'Inhaled', 'Rectal', 'Eye drops', 'Ear drops', 'Nasal', 'Other'
];

// Export as options for form components
export const AdministrationRouteOptions = ADMINISTRATION_ROUTES.map(route => ({
  label: route,
  value: route
}));
