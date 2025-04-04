
import React from 'react';
import { 
  Activity, 
  Syringe, 
  Pill, 
  Scissors, 
  AlertTriangle, 
  FileText, 
  Tooth, 
  Image, 
  Stethoscope,
  Bug
} from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';

/**
 * Get the appropriate icon for a health record type
 * @param recordType - Type of health record
 * @returns React component with the appropriate icon
 */
export const getHealthRecordIcon = (recordType: HealthRecordTypeEnum | string, className?: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Exam:
    case HealthRecordTypeEnum.Examination:
      return <Stethoscope className={className} />;
    case HealthRecordTypeEnum.Vaccination:
      return <Syringe className={className} />;
    case HealthRecordTypeEnum.Parasite:
    case HealthRecordTypeEnum.Deworming:
      return <Bug className={className} />;
    case HealthRecordTypeEnum.Medication:
      return <Pill className={className} />;
    case HealthRecordTypeEnum.Surgery:
    case HealthRecordTypeEnum.Procedure:
      return <Scissors className={className} />;
    case HealthRecordTypeEnum.Emergency:
      return <AlertTriangle className={className} />;
    case HealthRecordTypeEnum.Lab:
    case HealthRecordTypeEnum.Test:
      return <FileText className={className} />;
    case HealthRecordTypeEnum.Dental:
      return <Tooth className={className} />;
    case HealthRecordTypeEnum.Xray:
    case HealthRecordTypeEnum.Ultrasound:
      return <Image className={className} />;
    default:
      return <Activity className={className} />;
  }
};

/**
 * Get the color for a health record type
 * @param recordType - Type of health record
 * @returns CSS color class
 */
export const getHealthRecordColor = (recordType: HealthRecordTypeEnum | string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Exam:
    case HealthRecordTypeEnum.Examination:
      return 'text-blue-500';
    case HealthRecordTypeEnum.Vaccination:
      return 'text-green-500';
    case HealthRecordTypeEnum.Parasite:
    case HealthRecordTypeEnum.Deworming:
      return 'text-orange-500';
    case HealthRecordTypeEnum.Medication:
      return 'text-purple-500';
    case HealthRecordTypeEnum.Surgery:
    case HealthRecordTypeEnum.Procedure:
      return 'text-red-500';
    case HealthRecordTypeEnum.Emergency:
      return 'text-red-600';
    case HealthRecordTypeEnum.Lab:
    case HealthRecordTypeEnum.Test:
      return 'text-cyan-500';
    case HealthRecordTypeEnum.Dental:
      return 'text-yellow-500';
    case HealthRecordTypeEnum.Xray:
    case HealthRecordTypeEnum.Ultrasound:
      return 'text-indigo-500';
    case HealthRecordTypeEnum.Observation:
    case HealthRecordTypeEnum.Grooming:
    case HealthRecordTypeEnum.Allergy:
      return 'text-teal-500';
    default:
      return 'text-gray-500';
  }
};

export const HealthRecordIcon: React.FC<{ type: HealthRecordTypeEnum | string, className?: string }> = ({ 
  type, 
  className 
}) => {
  return (
    <div className={`${getHealthRecordColor(type)}`}>
      {getHealthRecordIcon(type, className)}
    </div>
  );
};
