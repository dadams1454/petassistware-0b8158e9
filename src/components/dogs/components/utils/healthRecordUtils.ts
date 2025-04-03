
import { HealthRecordTypeEnum } from '@/types/health';
import { 
  Stethoscope, 
  Syringe, 
  Pill, 
  Scissors, 
  Tooth, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Bug, 
  Scissors as Grooming, 
  FileQuestion,
  CalendarDays
} from 'lucide-react';

/**
 * Get an icon component for a health record type
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
      return Tooth;
    case HealthRecordTypeEnum.Allergy:
      return AlertTriangle;
    case HealthRecordTypeEnum.Test:
      return FileText;
    case HealthRecordTypeEnum.Observation:
      return Eye;
    case HealthRecordTypeEnum.Deworming:
      return Bug;
    case HealthRecordTypeEnum.Grooming:
      return Grooming;
    default:
      return FileQuestion;
  }
};

/**
 * Get a color for a health record type
 */
export const getHealthRecordColor = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'text-blue-500';
    case HealthRecordTypeEnum.Vaccination:
      return 'text-green-500';
    case HealthRecordTypeEnum.Medication:
      return 'text-amber-500';
    case HealthRecordTypeEnum.Surgery:
      return 'text-red-500';
    case HealthRecordTypeEnum.Dental:
      return 'text-cyan-500';
    case HealthRecordTypeEnum.Allergy:
      return 'text-rose-500';
    case HealthRecordTypeEnum.Test:
      return 'text-purple-500';
    case HealthRecordTypeEnum.Observation:
      return 'text-indigo-500';
    case HealthRecordTypeEnum.Deworming:
      return 'text-lime-500';
    case HealthRecordTypeEnum.Grooming:
      return 'text-emerald-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Get a background color for a health record type
 */
export const getHealthRecordBgColor = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'bg-blue-50';
    case HealthRecordTypeEnum.Vaccination:
      return 'bg-green-50';
    case HealthRecordTypeEnum.Medication:
      return 'bg-amber-50';
    case HealthRecordTypeEnum.Surgery:
      return 'bg-red-50';
    case HealthRecordTypeEnum.Dental:
      return 'bg-cyan-50';
    case HealthRecordTypeEnum.Allergy:
      return 'bg-rose-50';
    case HealthRecordTypeEnum.Test:
      return 'bg-purple-50';
    case HealthRecordTypeEnum.Observation:
      return 'bg-indigo-50';
    case HealthRecordTypeEnum.Deworming:
      return 'bg-lime-50';
    case HealthRecordTypeEnum.Grooming:
      return 'bg-emerald-50';
    default:
      return 'bg-gray-50';
  }
};

/**
 * Get a border color for a health record type
 */
export const getHealthRecordBorderColor = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'border-blue-200';
    case HealthRecordTypeEnum.Vaccination:
      return 'border-green-200';
    case HealthRecordTypeEnum.Medication:
      return 'border-amber-200';
    case HealthRecordTypeEnum.Surgery:
      return 'border-red-200';
    case HealthRecordTypeEnum.Dental:
      return 'border-cyan-200';
    case HealthRecordTypeEnum.Allergy:
      return 'border-rose-200';
    case HealthRecordTypeEnum.Test:
      return 'border-purple-200';
    case HealthRecordTypeEnum.Observation:
      return 'border-indigo-200';
    case HealthRecordTypeEnum.Deworming:
      return 'border-lime-200';
    case HealthRecordTypeEnum.Grooming:
      return 'border-emerald-200';
    default:
      return 'border-gray-200';
  }
};

/**
 * Format a next due date for a health record
 */
export const formatNextDueDate = (date: string | null | undefined) => {
  if (!date) return null;
  
  try {
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} days`,
        color: 'text-red-500',
        icon: CalendarDays
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due today',
        color: 'text-amber-500',
        icon: CalendarDays
      };
    } else if (diffDays <= 7) {
      return {
        text: `Due in ${diffDays} days`,
        color: 'text-amber-500',
        icon: CalendarDays
      };
    } else if (diffDays <= 30) {
      return {
        text: `Due in ${Math.floor(diffDays / 7)} weeks`,
        color: 'text-green-500',
        icon: CalendarDays
      };
    } else {
      return {
        text: `Due in ${Math.floor(diffDays / 30)} months`,
        color: 'text-green-500',
        icon: CalendarDays
      };
    }
  } catch (error) {
    console.error('Error formatting next due date:', error);
    return null;
  }
};
