
import React from 'react';
import { Syringe, Stethoscope, Pill, Activity, AlertCircle, FileText, Scissors } from 'lucide-react';
import { HealthRecordType } from '@/types/health';

export const getHealthRecordIcon = (recordType: HealthRecordType) => {
  switch (recordType) {
    case HealthRecordType.Vaccination:
      return <Syringe className="h-5 w-5" />;
    case HealthRecordType.Examination:
      return <Stethoscope className="h-5 w-5" />;
    case HealthRecordType.Medication:
      return <Pill className="h-5 w-5" />;
    case HealthRecordType.Surgery:
      return <Scissors className="h-5 w-5" />;
    case HealthRecordType.Observation:
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export const getHealthRecordColor = (recordType: HealthRecordType) => {
  switch (recordType) {
    case HealthRecordType.Vaccination:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case HealthRecordType.Examination:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case HealthRecordType.Medication:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case HealthRecordType.Surgery:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case HealthRecordType.Observation:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};
