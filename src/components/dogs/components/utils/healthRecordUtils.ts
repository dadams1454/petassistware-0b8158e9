
import { HealthRecord, HealthRecordTypeEnum, stringToHealthRecordType } from '@/types';

/**
 * Get icon name for a health record type
 */
export const getHealthRecordIcon = (
  recordType: HealthRecordTypeEnum | string
): string => {
  // Convert string to enum if needed
  const type = typeof recordType === 'string' 
    ? stringToHealthRecordType(recordType)
    : recordType;
    
  switch (type) {
    case HealthRecordTypeEnum.Examination:
      return 'Stethoscope';
    case HealthRecordTypeEnum.Vaccination:
      return 'Syringe';
    case HealthRecordTypeEnum.Medication:
      return 'Pill';
    case HealthRecordTypeEnum.Surgery:
      return 'Scissors';
    case HealthRecordTypeEnum.Laboratory:
      return 'FlaskRound';
    case HealthRecordTypeEnum.Imaging:
      return 'SquareRadio';
    case HealthRecordTypeEnum.Dental:
      return 'BoneSquare';
    case HealthRecordTypeEnum.Allergy:
      return 'AlertCircle';
    case HealthRecordTypeEnum.Emergency:
      return 'Alarm';
    case HealthRecordTypeEnum.Preventive:
      return 'Shield';
    default:
      return 'Clipboard';
  }
};

/**
 * Get display name for a health record type
 */
export const getHealthRecordTypeName = (
  recordType: HealthRecordTypeEnum | string
): string => {
  // Convert string to enum if needed
  const type = typeof recordType === 'string' 
    ? stringToHealthRecordType(recordType) 
    : recordType;
    
  switch (type) {
    case HealthRecordTypeEnum.Examination:
      return 'Exam';
    case HealthRecordTypeEnum.Vaccination:
      return 'Vaccination';
    case HealthRecordTypeEnum.Medication:
      return 'Medication';
    case HealthRecordTypeEnum.Surgery:
      return 'Surgery';
    case HealthRecordTypeEnum.Laboratory:
      return 'Lab Test';
    case HealthRecordTypeEnum.Imaging:
      return 'Imaging';
    case HealthRecordTypeEnum.Dental:
      return 'Dental';
    case HealthRecordTypeEnum.Allergy:
      return 'Allergy';
    case HealthRecordTypeEnum.Emergency:
      return 'Emergency';
    case HealthRecordTypeEnum.Preventive:
      return 'Preventive Care';
    default:
      return 'Other';
  }
};
