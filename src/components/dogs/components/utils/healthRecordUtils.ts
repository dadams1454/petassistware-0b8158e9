
import { 
  Stethoscope, 
  Syringe, 
  Pill, 
  Scissors, 
  TestTube,
  Bug,
  RotateCcw,
  Microscope,
  Scissors as ToothIcon,  // Using Scissors as alternative for Tooth
  Scan,
  FileQuestion
} from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';

/**
 * Get the appropriate icon for a health record type
 */
export const getHealthRecordIcon = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return Stethoscope;
    case HealthRecordTypeEnum.Vaccination:
      return Syringe;
    case HealthRecordTypeEnum.Medication:
      return Pill;
    case HealthRecordTypeEnum.Surgery:
      return Scissors;
    case HealthRecordTypeEnum.Dental:
      return ToothIcon;
    case HealthRecordTypeEnum.Allergy:
      return Bug;
    case HealthRecordTypeEnum.Test:
      return TestTube;
    case HealthRecordTypeEnum.Observation:
      return Scan;
    case HealthRecordTypeEnum.Deworming:
      return Bug;
    case HealthRecordTypeEnum.Grooming:
      return Scissors;
    default:
      return FileQuestion;
  }
};

/**
 * Get the appropriate color for a health record type
 */
export const getHealthRecordColor = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'blue';
    case HealthRecordTypeEnum.Vaccination:
      return 'green';
    case HealthRecordTypeEnum.Medication:
      return 'orange';
    case HealthRecordTypeEnum.Surgery:
      return 'red';
    case HealthRecordTypeEnum.Dental:
      return 'purple';
    case HealthRecordTypeEnum.Allergy:
      return 'yellow';
    case HealthRecordTypeEnum.Test:
      return 'cyan';
    case HealthRecordTypeEnum.Observation:
      return 'slate';
    case HealthRecordTypeEnum.Deworming:
      return 'amber';
    case HealthRecordTypeEnum.Grooming:
      return 'indigo';
    default:
      return 'gray';
  }
};
