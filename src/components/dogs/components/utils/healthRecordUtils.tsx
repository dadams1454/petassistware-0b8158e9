
import React from 'react';
import { 
  Syringe, Stethoscope, PillIcon, ScalpelIcon, 
  FlaskConical, ScanIcon, Tooth, DropletIcon, HeartPulseIcon, 
  BadgeCheck, EyeIcon, BugIcon, ScissorsIcon, TestTubeIcon, HelpCircle
} from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';

// Helper function to get icon based on record type
export const getHealthRecordIcon = (type: HealthRecordTypeEnum | string) => {
  const recordType = typeof type === 'string' 
    ? stringToHealthRecordType(type) 
    : type;
  
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return Syringe;
    case HealthRecordTypeEnum.Examination:
      return Stethoscope;
    case HealthRecordTypeEnum.Medication:
      return PillIcon;
    case HealthRecordTypeEnum.Surgery:
      return ScalpelIcon;
    case HealthRecordTypeEnum.Laboratory:
      return FlaskConical;
    case HealthRecordTypeEnum.Imaging:
      return ScanIcon;
    case HealthRecordTypeEnum.Dental:
      return Tooth;
    case HealthRecordTypeEnum.Allergy:
      return DropletIcon;
    case HealthRecordTypeEnum.Emergency:
      return HeartPulseIcon;
    case HealthRecordTypeEnum.Preventive:
      return BadgeCheck;
    case HealthRecordTypeEnum.Observation:
      return EyeIcon;
    case HealthRecordTypeEnum.Deworming:
      return BugIcon;
    case HealthRecordTypeEnum.Grooming:
      return ScissorsIcon;
    case HealthRecordTypeEnum.Test:
      return TestTubeIcon;
    case HealthRecordTypeEnum.Other:
      return HelpCircle;
    default:
      return Stethoscope;
  }
};

// Helper function to get color based on record type
export const getHealthRecordColor = (type: HealthRecordTypeEnum | string) => {
  const recordType = typeof type === 'string' 
    ? stringToHealthRecordType(type) 
    : type;
  
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return "text-green-500";
    case HealthRecordTypeEnum.Examination:
      return "text-blue-500";
    case HealthRecordTypeEnum.Medication:
      return "text-purple-500";
    case HealthRecordTypeEnum.Surgery:
      return "text-red-500";
    case HealthRecordTypeEnum.Laboratory:
      return "text-indigo-500";
    case HealthRecordTypeEnum.Imaging:
      return "text-cyan-500";
    case HealthRecordTypeEnum.Dental:
      return "text-sky-500";
    case HealthRecordTypeEnum.Allergy:
      return "text-rose-500";
    case HealthRecordTypeEnum.Emergency:
      return "text-red-600";
    case HealthRecordTypeEnum.Preventive:
      return "text-green-600";
    case HealthRecordTypeEnum.Observation:
      return "text-amber-500";
    case HealthRecordTypeEnum.Deworming:
      return "text-lime-500";
    case HealthRecordTypeEnum.Grooming:
      return "text-teal-500";
    case HealthRecordTypeEnum.Test:
      return "text-violet-500";
    case HealthRecordTypeEnum.Other:
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
};

// Ensure types are properly converted
export function stringToHealthRecordType(recordType: string): HealthRecordTypeEnum {
  if (Object.values(HealthRecordTypeEnum).includes(recordType as HealthRecordTypeEnum)) {
    return recordType as HealthRecordTypeEnum;
  }
  return HealthRecordTypeEnum.Other;
}
