
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
    case HealthRecordTypeEnum.EXAMINATION:
      return <Stethoscope className={className} />;
    case HealthRecordTypeEnum.VACCINATION:
      return <Syringe className={className} />;
    case HealthRecordTypeEnum.DEWORMING:
      return <Bug className={className} />;
    case HealthRecordTypeEnum.MEDICATION:
      return <Pill className={className} />;
    case HealthRecordTypeEnum.SURGERY:
    case HealthRecordTypeEnum.PROCEDURE:
      return <Scissors className={className} />;
    case HealthRecordTypeEnum.TEST:
      return <FileText className={className} />;
    case HealthRecordTypeEnum.DENTAL:
      return <Tooth className={className} />;
    case HealthRecordTypeEnum.IMAGING:
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
    case HealthRecordTypeEnum.EXAMINATION:
      return 'text-blue-500';
    case HealthRecordTypeEnum.VACCINATION:
      return 'text-green-500';
    case HealthRecordTypeEnum.DEWORMING:
      return 'text-orange-500';
    case HealthRecordTypeEnum.MEDICATION:
      return 'text-purple-500';
    case HealthRecordTypeEnum.SURGERY:
    case HealthRecordTypeEnum.PROCEDURE:
      return 'text-red-500';
    case HealthRecordTypeEnum.TEST:
      return 'text-cyan-500';
    case HealthRecordTypeEnum.DENTAL:
      return 'text-yellow-500';
    case HealthRecordTypeEnum.IMAGING:
      return 'text-indigo-500';
    case HealthRecordTypeEnum.OBSERVATION:
    case HealthRecordTypeEnum.GROOMING:
    case HealthRecordTypeEnum.ALLERGY:
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
