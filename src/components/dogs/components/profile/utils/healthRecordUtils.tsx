
import React from 'react';
import { HealthRecordType } from '@/types/health-enums';
import { Syringe, Stethoscope, Pill, Scissors, FileText, Eye } from 'lucide-react';

// Define record type options with icons and labels
export const recordTypeOptions = [
  {
    value: HealthRecordType.EXAMINATION,
    label: 'Examination',
    icon: <Stethoscope className="h-4 w-4 mr-2" />,
    description: 'Regular check-ups and health examinations'
  },
  {
    value: HealthRecordType.VACCINATION,
    label: 'Vaccination',
    icon: <Syringe className="h-4 w-4 mr-2" />,
    description: 'Vaccines and immunizations'
  },
  {
    value: HealthRecordType.MEDICATION,
    label: 'Medication',
    icon: <Pill className="h-4 w-4 mr-2" />,
    description: 'Prescribed medications and treatments'
  },
  {
    value: HealthRecordType.SURGERY,
    label: 'Surgery',
    icon: <Scissors className="h-4 w-4 mr-2" />,
    description: 'Surgical procedures'
  },
  {
    value: HealthRecordType.OBSERVATION,
    label: 'Observation',
    icon: <Eye className="h-4 w-4 mr-2" />,
    description: 'General health observations'
  },
  {
    value: HealthRecordType.OTHER,
    label: 'Other',
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: 'Other health-related records'
  }
];

// Helper function to get record type label
export const getRecordTypeLabel = (type: string | HealthRecordType): string => {
  // Normalize the record type to uppercase for comparison
  const normalizedType = typeof type === 'string' ? type.toUpperCase() as HealthRecordType : type;
  const option = recordTypeOptions.find(option => option.value === normalizedType);
  return option ? option.label : 'Unknown';
};

// Helper function to get record type icon
export const getRecordTypeIcon = (type: string | HealthRecordType): React.ComponentType => {
  // Normalize the record type to uppercase for comparison
  const normalizedType = typeof type === 'string' ? type.toUpperCase() as HealthRecordType : type;
  const option = recordTypeOptions.find(option => option.value === normalizedType);
  
  if (option) {
    // Extract icon component from JSX element
    const iconElement = option.icon as React.ReactElement;
    return iconElement.type as React.ComponentType;
  }
  
  return FileText; // Default fallback
};

// Helper function to get health record icon
export const getHealthRecordIcon = (type: string | HealthRecordType): React.ComponentType => {
  return getRecordTypeIcon(type);
};

// Helper function to get health record color class
export const getHealthRecordColor = (type: string | HealthRecordType): string => {
  // Normalize the record type to uppercase for comparison
  const normalizedType = typeof type === 'string' ? type.toUpperCase() as HealthRecordType : type;
  
  switch (normalizedType) {
    case HealthRecordType.VACCINATION:
      return 'text-blue-500';
    case HealthRecordType.MEDICATION:
      return 'text-purple-500';
    case HealthRecordType.SURGERY:
      return 'text-red-500';
    case HealthRecordType.EXAMINATION:
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
export { HealthRecordType };
