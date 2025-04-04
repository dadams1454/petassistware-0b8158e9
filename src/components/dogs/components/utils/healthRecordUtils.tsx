
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
import { HealthRecordTypeEnum } from '@/types/health';

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

export const getHealthRecordColor = (recordType: HealthRecordTypeEnum): string => {
  switch (recordType) {
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

export const HealthRecordIcon: React.FC<{ recordType: HealthRecordTypeEnum }> = ({ recordType }) => {
  const Icon = getHealthRecordIcon(recordType);
  const colorClass = getHealthRecordColor(recordType);
  
  return <Icon className={`h-5 w-5 ${colorClass}`} />;
};
