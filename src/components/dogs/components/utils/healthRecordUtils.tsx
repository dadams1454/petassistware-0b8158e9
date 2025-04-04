
import React from 'react';
import { 
  Clipboard, 
  Syringe, 
  Pills, 
  Scalpel, 
  FileText, 
  Activity, 
  Thermometer,
  Search,
  Stethoscope,
  AlertTriangle,
  Shield,
  Eye,
  Scissors,
  FlaskConical,
  Droplets,
  Bug
} from 'lucide-react';
import { HealthRecordTypeEnum, stringToHealthRecordType } from '@/types/health';

export const getHealthRecordIcon = (recordType: HealthRecordTypeEnum) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return Stethoscope;
    case HealthRecordTypeEnum.Vaccination:
      return Syringe;
    case HealthRecordTypeEnum.Medication:
      return Pills;
    case HealthRecordTypeEnum.Surgery:
      return Scalpel;
    case HealthRecordTypeEnum.Laboratory:
      return FlaskConical;
    case HealthRecordTypeEnum.Imaging:
      return Search;
    case HealthRecordTypeEnum.Dental:
      return Eye;
    case HealthRecordTypeEnum.Allergy:
      return AlertTriangle;
    case HealthRecordTypeEnum.Emergency:
      return Activity;
    case HealthRecordTypeEnum.Preventive:
      return Shield;
    case HealthRecordTypeEnum.Observation:
      return Eye;
    case HealthRecordTypeEnum.Deworming:
      return Bug;
    case HealthRecordTypeEnum.Grooming:
      return Scissors;
    case HealthRecordTypeEnum.Test:
      return Thermometer;
    case HealthRecordTypeEnum.Procedure:
      return Droplets;
    case HealthRecordTypeEnum.Other:
    default:
      return FileText;
  }
};

export const getHealthRecordColor = (recordType: string | HealthRecordTypeEnum): string => {
  const typeEnum = typeof recordType === 'string' ? stringToHealthRecordType(recordType) : recordType;
  
  switch (typeEnum) {
    case HealthRecordTypeEnum.Examination:
      return 'text-blue-500';
    case HealthRecordTypeEnum.Vaccination:
      return 'text-green-500';
    case HealthRecordTypeEnum.Medication:
      return 'text-purple-500';
    case HealthRecordTypeEnum.Surgery:
      return 'text-red-500';
    case HealthRecordTypeEnum.Laboratory:
      return 'text-amber-500';
    case HealthRecordTypeEnum.Imaging:
      return 'text-indigo-500';
    case HealthRecordTypeEnum.Dental:
      return 'text-cyan-500';
    case HealthRecordTypeEnum.Allergy:
      return 'text-orange-500';
    case HealthRecordTypeEnum.Emergency:
      return 'text-rose-500';
    case HealthRecordTypeEnum.Preventive:
      return 'text-teal-500';
    case HealthRecordTypeEnum.Observation:
      return 'text-amber-500';
    case HealthRecordTypeEnum.Deworming:
      return 'text-lime-500';
    case HealthRecordTypeEnum.Grooming:
      return 'text-blue-400';
    case HealthRecordTypeEnum.Test:
      return 'text-violet-500';
    case HealthRecordTypeEnum.Procedure:
      return 'text-sky-500';
    case HealthRecordTypeEnum.Other:
    default:
      return 'text-gray-500';
  }
};

interface HealthRecordIconProps {
  recordType: HealthRecordTypeEnum;
  className?: string;
}

export const HealthRecordIcon: React.FC<HealthRecordIconProps> = ({ recordType, className }) => {
  const Icon = getHealthRecordIcon(recordType);
  const colorClass = getHealthRecordColor(recordType);
  
  return <Icon className={`h-5 w-5 ${colorClass} ${className || ''}`} />;
};

// Helper function to get record type label
export const getRecordTypeLabel = (type: string | HealthRecordTypeEnum): string => {
  const typeEnum = typeof type === 'string' ? stringToHealthRecordType(type) : type;
  
  switch (typeEnum) {
    case HealthRecordTypeEnum.Examination:
      return 'Examination';
    case HealthRecordTypeEnum.Vaccination:
      return 'Vaccination';
    case HealthRecordTypeEnum.Medication:
      return 'Medication';
    case HealthRecordTypeEnum.Surgery:
      return 'Surgery';
    case HealthRecordTypeEnum.Laboratory:
      return 'Laboratory';
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
    case HealthRecordTypeEnum.Observation:
      return 'Observation';
    case HealthRecordTypeEnum.Deworming:
      return 'Deworming';
    case HealthRecordTypeEnum.Grooming:
      return 'Grooming';
    case HealthRecordTypeEnum.Test:
      return 'Test';
    case HealthRecordTypeEnum.Procedure:
      return 'Procedure';
    case HealthRecordTypeEnum.Other:
      return 'Other';
    default:
      return 'Unknown';
  }
};

// Re-export directly to ensure proper type exports
export { HealthRecordTypeEnum };
