
/**
 * Utility functions for health records
 */
import { 
  HealthRecord, 
  HealthRecordType,
  VaccinationRecord,
  ExaminationRecord,
  MedicationRecord,
  SurgeryRecord
} from '../types';

/**
 * Format a health record date for display
 * 
 * @param {string} dateString The date string to format
 * @returns {string} The formatted date string
 */
export const formatHealthRecordDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Get the status of a health record
 * 
 * @param {HealthRecord} record The health record
 * @returns {string} The status of the health record
 */
export const getHealthRecordStatus = (record: HealthRecord): 'current' | 'upcoming' | 'overdue' | 'unknown' => {
  if (!record.next_due_date) {
    return 'unknown';
  }
  
  const now = new Date();
  const nextDueDate = new Date(record.next_due_date);
  const diffTime = nextDueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'overdue';
  } else if (diffDays <= 14) {
    return 'upcoming';
  } else {
    return 'current';
  }
};

/**
 * Type guard for vaccination records
 */
export const isVaccinationRecord = (record: HealthRecord): record is VaccinationRecord => {
  return record.record_type === 'vaccination';
};

/**
 * Type guard for examination records
 */
export const isExaminationRecord = (record: HealthRecord): record is ExaminationRecord => {
  return record.record_type === 'examination';
};

/**
 * Type guard for medication records
 */
export const isMedicationRecord = (record: HealthRecord): record is MedicationRecord => {
  return record.record_type === 'medication';
};

/**
 * Type guard for surgery records
 */
export const isSurgeryRecord = (record: HealthRecord): record is SurgeryRecord => {
  return record.record_type === 'surgery';
};

/**
 * Format a medication dosage for display
 */
export const formatMedicationDosage = (record: MedicationRecord): string => {
  if (!record.dosage) return 'N/A';
  
  let result = `${record.dosage}`;
  
  if (record.dosage_unit) {
    result += ` ${record.dosage_unit}`;
  }
  
  if (record.frequency) {
    result += `, ${record.frequency}`;
  }
  
  return result;
};

/**
 * Get the appropriate icon name for a health record type
 */
export const getHealthRecordTypeIcon = (recordType: HealthRecordType): string => {
  switch (recordType) {
    case 'vaccination':
      return 'syringe';
    case 'examination':
      return 'stethoscope';
    case 'medication':
      return 'pill';
    case 'surgery':
      return 'scissors';
    case 'test':
      return 'flask';
    case 'imaging':
      return 'image';
    case 'laboratory':
      return 'test-tube';
    case 'deworming':
      return 'bug';
    default:
      return 'clipboard';
  }
};
