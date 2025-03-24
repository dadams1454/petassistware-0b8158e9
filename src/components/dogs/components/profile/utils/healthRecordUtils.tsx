
import React from 'react';
import { Syringe, Stethoscope, Pill, Activity, AlertCircle, FileText } from 'lucide-react';
import { HealthRecordType } from '@/types/dog';

export const getHealthRecordIcon = (recordType: HealthRecordType) => {
  switch (recordType) {
    case 'vaccination':
      return <Syringe className="h-5 w-5" />;
    case 'examination':
      return <Stethoscope className="h-5 w-5" />;
    case 'medication':
      return <Pill className="h-5 w-5" />;
    case 'surgery':
      return <Activity className="h-5 w-5" />;
    case 'observation':
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export const getHealthRecordColor = (recordType: HealthRecordType) => {
  switch (recordType) {
    case 'vaccination':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'examination':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'medication':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'surgery':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'observation':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};
