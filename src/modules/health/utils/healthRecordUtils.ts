
import { 
  HealthRecordType, 
  HealthRecord,
  VaccinationRecord,
  ExaminationRecord,
  MedicationRecord,
  SurgeryRecord
} from '../types';
import { 
  Syringe, 
  Stethoscope, 
  Pill, 
  Scissors, 
  AlertTriangle, 
  FileText,
  Eye,
  Thermometer,
  Heart,
  Activity
} from 'lucide-react';
import { IconType } from 'react-icons';

/**
 * Get an appropriate icon for a health record type
 */
export function getHealthRecordIcon(recordType: HealthRecordType): IconType {
  switch (recordType) {
    case 'vaccination':
      return Syringe;
    case 'examination':
      return Stethoscope;
    case 'medication':
      return Pill;
    case 'surgery':
      return Scissors;
    case 'injury':
      return AlertTriangle;
    case 'allergy':
      return Eye;
    case 'test':
      return Thermometer;
    case 'observation':
      return Activity;
    default:
      return FileText;
  }
}

/**
 * Get a display-friendly name for a health record type
 */
export function getHealthRecordTypeDisplay(type: HealthRecordType): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return capitalize(type);
}

/**
 * Type guard to check if a health record is a vaccination record
 */
export function isVaccinationRecord(record: HealthRecord): record is VaccinationRecord {
  return record.record_type === 'vaccination';
}

/**
 * Type guard to check if a health record is an examination record
 */
export function isExaminationRecord(record: HealthRecord): record is ExaminationRecord {
  return record.record_type === 'examination';
}

/**
 * Type guard to check if a health record is a medication record
 */
export function isMedicationRecord(record: HealthRecord): record is MedicationRecord {
  return record.record_type === 'medication';
}

/**
 * Type guard to check if a health record is a surgery record
 */
export function isSurgeryRecord(record: HealthRecord): record is SurgeryRecord {
  return record.record_type === 'surgery';
}

/**
 * Get all available health record types
 */
export function getHealthRecordTypes(): HealthRecordType[] {
  return [
    'vaccination',
    'examination',
    'medication',
    'surgery',
    'injury',
    'allergy',
    'test',
    'other'
  ];
}

// Export the health record types for use in components
export const healthRecordTypes: HealthRecordType[] = getHealthRecordTypes();
