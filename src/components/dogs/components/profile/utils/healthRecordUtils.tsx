
import React from 'react';
import { HealthRecordTypeEnum, stringToHealthRecordType } from '@/types/health';
import { Syringe, Stethoscope, Pill, Scissors, FileText } from 'lucide-react';

// Define record type options with icons and labels
export const recordTypeOptions = [
  {
    value: HealthRecordTypeEnum.EXAMINATION,
    label: 'Examination',
    icon: <Stethoscope className="h-4 w-4 mr-2" />,
    description: 'Regular check-ups and health examinations'
  },
  {
    value: HealthRecordTypeEnum.VACCINATION,
    label: 'Vaccination',
    icon: <Syringe className="h-4 w-4 mr-2" />,
    description: 'Vaccines and immunizations'
  },
  {
    value: HealthRecordTypeEnum.MEDICATION,
    label: 'Medication',
    icon: <Pill className="h-4 w-4 mr-2" />,
    description: 'Prescribed medications and treatments'
  },
  {
    value: HealthRecordTypeEnum.SURGERY,
    label: 'Surgery',
    icon: <Scissors className="h-4 w-4 mr-2" />,
    description: 'Surgical procedures'
  },
  {
    value: HealthRecordTypeEnum.OTHER,
    label: 'Other',
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: 'Other health-related records'
  }
];

// Helper function to get record type label
export const getRecordTypeLabel = (type: string | HealthRecordTypeEnum): string => {
  const typeEnum = typeof type === 'string' ? stringToHealthRecordType(type) : type;
  const option = recordTypeOptions.find(option => option.value === typeEnum);
  return option ? option.label : 'Unknown';
};

// Helper function to get record type icon
export const getRecordTypeIcon = (type: string | HealthRecordTypeEnum): React.ReactNode => {
  const typeEnum = typeof type === 'string' ? stringToHealthRecordType(type) : type;
  const option = recordTypeOptions.find(option => option.value === typeEnum);
  return option ? option.icon : <FileText className="h-4 w-4 mr-2" />;
};

// Helper function to get health record icon
export const getHealthRecordIcon = (type: string | HealthRecordTypeEnum): React.ReactNode => {
  return getRecordTypeIcon(type);
};

// Helper function to get health record color class
export const getHealthRecordColor = (type: string | HealthRecordTypeEnum): string => {
  const typeEnum = typeof type === 'string' ? stringToHealthRecordType(type) : type;
  
  switch (typeEnum) {
    case HealthRecordTypeEnum.VACCINATION:
      return 'text-blue-500';
    case HealthRecordTypeEnum.MEDICATION:
      return 'text-purple-500';
    case HealthRecordTypeEnum.SURGERY:
      return 'text-red-500';
    case HealthRecordTypeEnum.EXAMINATION:
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

// Helper function to format a date from ISO string to a readable format
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper to check if a record is due soon (within the next 30 days)
export const isDueSoon = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false;
  
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= 30;
};

// Helper to check if a record is overdue
export const isOverdue = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false;
  
  const today = new Date();
  const due = new Date(dueDate);
  
  return due < today;
};

// Re-export directly to ensure proper type exports
export { HealthRecordTypeEnum };
