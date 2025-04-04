
import { HealthRecordTypeEnum } from '@/types/health';
import {
  Stethoscope,
  Syringe,
  Pill,
  FileText,
  Activity,
  Image,
  Flask,
  Shield,
  HelpCircle
} from 'lucide-react';

/**
 * Get the appropriate icon for a health record type
 */
export const getHealthRecordIcon = (recordType: HealthRecordTypeEnum | string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return Stethoscope;
    case HealthRecordTypeEnum.Procedure:
      return Activity;
    case HealthRecordTypeEnum.Vaccination:
      return Syringe;
    case HealthRecordTypeEnum.Medication:
      return Pill;
    case HealthRecordTypeEnum.Test:
      return FileText;
    case HealthRecordTypeEnum.Laboratory:
      return Flask;
    case HealthRecordTypeEnum.Imaging:
      return Image;
    case HealthRecordTypeEnum.Preventive:
      return Shield;
    default:
      return HelpCircle;
  }
};

/**
 * Get the color for a health record type
 */
export const getHealthRecordColor = (recordType: HealthRecordTypeEnum | string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case HealthRecordTypeEnum.Procedure:
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case HealthRecordTypeEnum.Vaccination:
      return 'bg-green-50 text-green-700 border-green-200';
    case HealthRecordTypeEnum.Medication:
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case HealthRecordTypeEnum.Test:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case HealthRecordTypeEnum.Laboratory:
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case HealthRecordTypeEnum.Imaging:
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case HealthRecordTypeEnum.Preventive:
      return 'bg-teal-50 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

/**
 * Get a human-readable label for a health record type
 */
export const getHealthRecordTypeLabel = (recordType: HealthRecordTypeEnum | string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'Examination';
    case HealthRecordTypeEnum.Procedure:
      return 'Procedure';
    case HealthRecordTypeEnum.Vaccination:
      return 'Vaccination';
    case HealthRecordTypeEnum.Medication:
      return 'Medication';
    case HealthRecordTypeEnum.Test:
      return 'Test';
    case HealthRecordTypeEnum.Laboratory:
      return 'Laboratory';
    case HealthRecordTypeEnum.Imaging:
      return 'Imaging';
    case HealthRecordTypeEnum.Preventive:
      return 'Preventive Care';
    default:
      return 'Other';
  }
};
