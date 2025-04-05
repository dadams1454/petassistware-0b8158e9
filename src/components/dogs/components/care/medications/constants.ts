
import { MedicationFrequencyConstants } from '@/utils/medicationUtils';

// Medication frequency options
export const MedicationFrequencyOptions: {
  value: string;
  label: string;
}[] = [
  { value: MedicationFrequencyConstants.DAILY, label: 'Once daily' },
  { value: MedicationFrequencyConstants.TWICE_DAILY, label: 'Twice daily' },
  { value: MedicationFrequencyConstants.WEEKLY, label: 'Weekly' },
  { value: MedicationFrequencyConstants.BIWEEKLY, label: 'Every two weeks' },
  { value: MedicationFrequencyConstants.MONTHLY, label: 'Monthly' },
  { value: MedicationFrequencyConstants.AS_NEEDED, label: 'As needed' }
];

// Administration route options
export const AdministrationRouteOptions = [
  { value: 'oral', label: 'Oral' },
  { value: 'topical', label: 'Topical' },
  { value: 'injection', label: 'Injection' },
  { value: 'drops', label: 'Drops' },
  { value: 'inhaled', label: 'Inhaled' },
  { value: 'other', label: 'Other' }
];

// Dosage unit options
export const DosageUnitOptions = [
  { value: 'mg', label: 'mg' },
  { value: 'ml', label: 'ml' },
  { value: 'pill', label: 'pill(s)' },
  { value: 'tablet', label: 'tablet(s)' },
  { value: 'capsule', label: 'capsule(s)' },
  { value: 'application', label: 'application(s)' },
  { value: 'unit', label: 'unit(s)' }
];

// Duration unit options
export const DurationUnitOptions = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
];
