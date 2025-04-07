
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
import { HealthRecordType } from '@/types/health-enums';

/**
 * Get the appropriate icon for a health record type
 * @param recordType - Type of health record
 * @returns React component with the appropriate icon
 */
export const getHealthRecordIcon = (recordType: HealthRecordType | string, className?: string) => {
  switch (recordType) {
    case HealthRecordType.EXAMINATION:
      return <Stethoscope className={className} />;
    case HealthRecordType.VACCINATION:
      return <Syringe className={className} />;
    case HealthRecordType.DEWORMING:
      return <Bug className={className} />;
    case HealthRecordType.MEDICATION:
      return <Pill className={className} />;
    case HealthRecordType.SURGERY:
    case HealthRecordType.PROCEDURE:
      return <Scissors className={className} />;
    case HealthRecordType.TEST:
      return <FileText className={className} />;
    case HealthRecordType.DENTAL:
      return <Tooth className={className} />;
    case HealthRecordType.IMAGING:
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
export const getHealthRecordColor = (recordType: HealthRecordType | string) => {
  switch (recordType) {
    case HealthRecordType.EXAMINATION:
      return 'text-blue-500';
    case HealthRecordType.VACCINATION:
      return 'text-green-500';
    case HealthRecordType.DEWORMING:
      return 'text-orange-500';
    case HealthRecordType.MEDICATION:
      return 'text-purple-500';
    case HealthRecordType.SURGERY:
    case HealthRecordType.PROCEDURE:
      return 'text-red-500';
    case HealthRecordType.TEST:
      return 'text-cyan-500';
    case HealthRecordType.DENTAL:
      return 'text-yellow-500';
    case HealthRecordType.IMAGING:
      return 'text-indigo-500';
    case HealthRecordType.OBSERVATION:
    case HealthRecordType.GROOMING:
    case HealthRecordType.ALLERGY:
      return 'text-teal-500';
    default:
      return 'text-gray-500';
  }
};

export const HealthRecordIcon: React.FC<{ type: HealthRecordType | string, className?: string }> = ({ 
  type, 
  className 
}) => {
  return (
    <div className={`${getHealthRecordColor(type)}`}>
      {getHealthRecordIcon(type, className)}
    </div>
  );
};
