
/**
 * Utility functions for health records
 */
import { format, parseISO } from 'date-fns';
import { 
  HealthRecordType, 
  HealthRecordTypeEnum 
} from '@/types/health-enums';

/**
 * Get appropriate icon name for a health record type
 * @param recordType The health record type
 * @returns Icon component
 */
export const getHealthRecordIcon = (recordType: HealthRecordType) => {
  switch (recordType) {
    case HealthRecordTypeEnum.VACCINATION:
      return 'Syringe';
    case HealthRecordTypeEnum.EXAMINATION:
      return 'Stethoscope';
    case HealthRecordTypeEnum.MEDICATION:
      return 'Pill';
    case HealthRecordTypeEnum.SURGERY:
      return 'Scissors';
    case HealthRecordTypeEnum.LABORATORY:
      return 'TestTube';
    case HealthRecordTypeEnum.TEST:
      return 'ClipboardCheck';
    case HealthRecordTypeEnum.IMAGING:
      return 'FileImage';
    case HealthRecordTypeEnum.PREVENTIVE:
      return 'Shield';
    case HealthRecordTypeEnum.DEWORMING:
      return 'Bug';
    case HealthRecordTypeEnum.DENTAL:
      return 'Tooth';
    default:
      return 'FileText';
  }
};

/**
 * Format a date string for display
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDateForDisplay = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }
  
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Get a default title for a health record based on its type
 * @param recordType The health record type
 * @returns Default title
 */
export const getDefaultTitle = (recordType: HealthRecordType): string => {
  switch (recordType) {
    case HealthRecordTypeEnum.VACCINATION:
      return 'Vaccination';
    case HealthRecordTypeEnum.EXAMINATION:
      return 'Veterinary Examination';
    case HealthRecordTypeEnum.MEDICATION:
      return 'Medication';
    case HealthRecordTypeEnum.SURGERY:
      return 'Surgical Procedure';
    case HealthRecordTypeEnum.LABORATORY:
      return 'Laboratory Test';
    case HealthRecordTypeEnum.TEST:
      return 'Medical Test';
    case HealthRecordTypeEnum.IMAGING:
      return 'Imaging';
    case HealthRecordTypeEnum.PREVENTIVE:
      return 'Preventive Care';
    case HealthRecordTypeEnum.DEWORMING:
      return 'Deworming';
    case HealthRecordTypeEnum.DENTAL:
      return 'Dental Procedure';
    default:
      return 'Health Record';
  }
};

// Re-export necessary types and enums for compatibility
export { HealthRecordTypeEnum };
