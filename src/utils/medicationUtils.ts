
import { Medication, MedicationStatusEnum } from '@/types/health';

// Medication frequency options
export const MedicationFrequencyConstants = {
  ONCE_DAILY: 'once_daily',
  TWICE_DAILY: 'twice_daily',
  THREE_TIMES_DAILY: 'three_times_daily',
  FOUR_TIMES_DAILY: 'four_times_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as_needed'
};

// Admin route options
export const AdministrationRouteConstants = {
  ORAL: 'oral',
  TOPICAL: 'topical',
  INJECTION: 'injection',
  SUBCUTANEOUS: 'subcutaneous',
  INTRAMUSCULAR: 'intramuscular',
  INTRAVENOUS: 'intravenous',
  RECTAL: 'rectal',
  OPHTHALMIC: 'ophthalmic',
  OTIC: 'otic',
  NASAL: 'nasal',
  INHALATION: 'inhalation'
};

/**
 * Calculate medication status based on dates
 * @param startDate Medication start date
 * @param endDate Medication end date (optional)
 * @returns MedicationStatusEnum value
 */
export const calculateMedicationStatus = (
  startDate?: string | Date,
  endDate?: string | Date
): MedicationStatusEnum => {
  if (!startDate) {
    return MedicationStatusEnum.NotStarted;
  }

  const today = new Date();
  const start = new Date(startDate);
  
  // If there's no end date, medication is active
  if (!endDate) {
    if (start > today) {
      return MedicationStatusEnum.Scheduled;
    }
    return MedicationStatusEnum.Active;
  }

  const end = new Date(endDate);
  
  // If end date is in the past, medication is completed
  if (end < today) {
    return MedicationStatusEnum.Completed;
  }
  
  // If start date is in the future, medication is scheduled
  if (start > today) {
    return MedicationStatusEnum.Scheduled;
  }
  
  // If today is between start and end, medication is active
  return MedicationStatusEnum.Active;
};

/**
 * Get the full human-readable text for a medication frequency
 * @param frequency Medication frequency code
 * @returns Human-readable frequency text
 */
export const getMedicationFrequencyText = (frequency: string): string => {
  switch (frequency) {
    case MedicationFrequencyConstants.ONCE_DAILY:
      return 'Once daily';
    case MedicationFrequencyConstants.TWICE_DAILY:
      return 'Twice daily';
    case MedicationFrequencyConstants.THREE_TIMES_DAILY:
      return 'Three times daily';
    case MedicationFrequencyConstants.FOUR_TIMES_DAILY:
      return 'Four times daily';
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      return 'Every other day';
    case MedicationFrequencyConstants.WEEKLY:
      return 'Weekly';
    case MedicationFrequencyConstants.BIWEEKLY:
      return 'Every two weeks';
    case MedicationFrequencyConstants.MONTHLY:
      return 'Monthly';
    case MedicationFrequencyConstants.AS_NEEDED:
      return 'As needed (PRN)';
    default:
      return frequency;
  }
};

/**
 * Get the full human-readable text for an administration route
 * @param route Administration route code
 * @returns Human-readable route text
 */
export const getAdministrationRouteText = (route: string): string => {
  switch (route) {
    case AdministrationRouteConstants.ORAL:
      return 'Oral';
    case AdministrationRouteConstants.TOPICAL:
      return 'Topical (on skin)';
    case AdministrationRouteConstants.INJECTION:
      return 'Injection';
    case AdministrationRouteConstants.SUBCUTANEOUS:
      return 'Subcutaneous (under skin)';
    case AdministrationRouteConstants.INTRAMUSCULAR:
      return 'Intramuscular';
    case AdministrationRouteConstants.INTRAVENOUS:
      return 'Intravenous';
    case AdministrationRouteConstants.RECTAL:
      return 'Rectal';
    case AdministrationRouteConstants.OPHTHALMIC:
      return 'Ophthalmic (eye)';
    case AdministrationRouteConstants.OTIC:
      return 'Otic (ear)';
    case AdministrationRouteConstants.NASAL:
      return 'Nasal';
    case AdministrationRouteConstants.INHALATION:
      return 'Inhalation';
    default:
      return route;
  }
};

/**
 * Process medication logs for display or analysis
 * @param medications List of medications
 * @returns Processed medications with additional properties
 */
export const processMedicationLogs = (medications: Medication[]): Medication[] => {
  return medications.map(med => {
    const status = calculateMedicationStatus(med.start_date, med.end_date);
    return {
      ...med,
      status,
      active: status === MedicationStatusEnum.Active,
      is_active: status === MedicationStatusEnum.Active // For backward compatibility
    };
  });
};

/**
 * Get upcoming due medications from a list based on a date range
 * @param medications List of medications
 * @param days Number of days to look ahead
 * @returns Filtered list of medications due within the specified days
 */
export const getUpcomingDueMedications = (medications: Medication[], days: number = 30): Medication[] => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  
  return medications.filter(med => {
    if (!med.next_due_date) return false;
    
    const dueDate = new Date(med.next_due_date);
    return dueDate > today && dueDate <= futureDate;
  });
};
