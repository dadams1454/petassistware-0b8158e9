
import React from 'react';
import { HealthRecordTypeEnum } from '@/types/health';
import { Syringe, Stethoscope, Pill, Scissors, FileText } from 'lucide-react';

// Define record type options with icons and labels
export const recordTypeOptions = [
  {
    value: HealthRecordTypeEnum.Examination,
    label: 'Examination',
    icon: <Stethoscope className="h-4 w-4 mr-2" />,
    description: 'Regular check-ups and health examinations'
  },
  {
    value: HealthRecordTypeEnum.Vaccination,
    label: 'Vaccination',
    icon: <Syringe className="h-4 w-4 mr-2" />,
    description: 'Vaccines and immunizations'
  },
  {
    value: HealthRecordTypeEnum.Medication,
    label: 'Medication',
    icon: <Pill className="h-4 w-4 mr-2" />,
    description: 'Prescribed medications and treatments'
  },
  {
    value: HealthRecordTypeEnum.Surgery,
    label: 'Surgery',
    icon: <Scissors className="h-4 w-4 mr-2" />,
    description: 'Surgical procedures'
  },
  {
    value: HealthRecordTypeEnum.Other,
    label: 'Other',
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: 'Other health-related records'
  }
];

// Helper function to get record type label
export const getRecordTypeLabel = (type: string): string => {
  const option = recordTypeOptions.find(option => option.value === type);
  return option ? option.label : 'Unknown';
};

// Helper function to get record type icon
export const getRecordTypeIcon = (type: string): React.ReactNode => {
  const option = recordTypeOptions.find(option => option.value === type);
  return option ? option.icon : <FileText className="h-4 w-4 mr-2" />;
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
