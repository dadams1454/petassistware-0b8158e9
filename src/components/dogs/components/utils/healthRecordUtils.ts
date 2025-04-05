
import { HealthRecordTypeEnum, stringToHealthRecordType } from '@/types/health';
import { FileText, Syringe, Stethoscope, Pill, Scissors, Eye, Droplet, Activity, AlertCircle, Flask, Image, ShieldCheck, Tooth } from 'lucide-react';

// Get icon component for health record type
export const getHealthRecordIcon = (recordType: HealthRecordTypeEnum | string) => {
  // Convert string to enum if needed
  const type = typeof recordType === 'string' ? stringToHealthRecordType(recordType) : recordType;
  
  // Return appropriate icon based on record type
  switch (type) {
    case HealthRecordTypeEnum.EXAMINATION:
      return Stethoscope;
    case HealthRecordTypeEnum.PROCEDURE:
      return Scissors;
    case HealthRecordTypeEnum.VACCINATION:
      return Syringe;
    case HealthRecordTypeEnum.MEDICATION:
      return Pill;
    case HealthRecordTypeEnum.TEST:
      return Activity;
    case HealthRecordTypeEnum.LABORATORY:
      return Flask;
    case HealthRecordTypeEnum.IMAGING:
      return Image;
    case HealthRecordTypeEnum.PREVENTIVE:
      return ShieldCheck;
    case HealthRecordTypeEnum.OTHER:
      return FileText;
    case HealthRecordTypeEnum.SURGERY:
      return Scissors;
    case HealthRecordTypeEnum.OBSERVATION:
      return Eye;
    case HealthRecordTypeEnum.DEWORMING:
      return Droplet;
    case HealthRecordTypeEnum.GROOMING:
      return Scissors;
    case HealthRecordTypeEnum.DENTAL:
      return Tooth;
    case HealthRecordTypeEnum.ALLERGY:
      return AlertCircle;
    default:
      return FileText;
  }
};

// Get color class for health record type
export const getHealthRecordColor = (recordType: HealthRecordTypeEnum | string) => {
  // Convert string to enum if needed
  const type = typeof recordType === 'string' ? stringToHealthRecordType(recordType) : recordType;
  
  switch (type) {
    case HealthRecordTypeEnum.EXAMINATION:
      return 'text-blue-500';
    case HealthRecordTypeEnum.PROCEDURE:
      return 'text-purple-500';
    case HealthRecordTypeEnum.VACCINATION:
      return 'text-green-500';
    case HealthRecordTypeEnum.MEDICATION:
      return 'text-purple-500';
    case HealthRecordTypeEnum.TEST:
      return 'text-amber-500';
    case HealthRecordTypeEnum.LABORATORY:
      return 'text-cyan-500';
    case HealthRecordTypeEnum.IMAGING:
      return 'text-indigo-500';
    case HealthRecordTypeEnum.PREVENTIVE:
      return 'text-teal-500';
    case HealthRecordTypeEnum.OTHER:
      return 'text-gray-500';
    case HealthRecordTypeEnum.SURGERY:
      return 'text-red-500';
    case HealthRecordTypeEnum.OBSERVATION:
      return 'text-yellow-500';
    case HealthRecordTypeEnum.DEWORMING:
      return 'text-lime-500';
    case HealthRecordTypeEnum.GROOMING:
      return 'text-rose-500';
    case HealthRecordTypeEnum.DENTAL:
      return 'text-sky-500';
    case HealthRecordTypeEnum.ALLERGY:
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

// Get display name for health record type
export const getHealthRecordTypeName = (recordType: HealthRecordTypeEnum | string) => {
  // Convert string to enum if needed
  const type = typeof recordType === 'string' ? stringToHealthRecordType(recordType) : recordType;
  
  switch (type) {
    case HealthRecordTypeEnum.EXAMINATION:
      return 'Examination';
    case HealthRecordTypeEnum.PROCEDURE:
      return 'Procedure';
    case HealthRecordTypeEnum.VACCINATION:
      return 'Vaccination';
    case HealthRecordTypeEnum.MEDICATION:
      return 'Medication';
    case HealthRecordTypeEnum.TEST:
      return 'Test';
    case HealthRecordTypeEnum.LABORATORY:
      return 'Laboratory';
    case HealthRecordTypeEnum.IMAGING:
      return 'Imaging';
    case HealthRecordTypeEnum.PREVENTIVE:
      return 'Preventive Care';
    case HealthRecordTypeEnum.OTHER:
      return 'Other';
    case HealthRecordTypeEnum.SURGERY:
      return 'Surgery';
    case HealthRecordTypeEnum.OBSERVATION:
      return 'Observation';
    case HealthRecordTypeEnum.DEWORMING:
      return 'Deworming';
    case HealthRecordTypeEnum.GROOMING:
      return 'Grooming';
    case HealthRecordTypeEnum.DENTAL:
      return 'Dental';
    case HealthRecordTypeEnum.ALLERGY:
      return 'Allergy';
    default:
      return 'Unknown';
  }
};

// Export directly from health.ts to ensure consistent usage
export { HealthRecordTypeEnum } from '@/types/health';
