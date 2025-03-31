import React from 'react';
import { Syringe, Stethoscope, Pill, Activity, AlertCircle, FileText, Scissors } from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';
import { DogGenotype, GeneticHealthStatus } from '@/types/genetics';

export const getHealthRecordIcon = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return <Syringe className="h-5 w-5" />;
    case HealthRecordTypeEnum.Examination:
      return <Stethoscope className="h-5 w-5" />;
    case HealthRecordTypeEnum.Medication:
      return <Pill className="h-5 w-5" />;
    case HealthRecordTypeEnum.Surgery:
      return <Scissors className="h-5 w-5" />;
    case HealthRecordTypeEnum.Observation:
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export const getHealthRecordColor = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case HealthRecordTypeEnum.Examination:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case HealthRecordTypeEnum.Medication:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case HealthRecordTypeEnum.Surgery:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case HealthRecordTypeEnum.Observation:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

/**
 * Get the status color for a genetic health marker
 */
export function getStatusColor(status: GeneticHealthStatus | string): string {
  // Handle string value
  const statusStr = typeof status === 'string' ? status.toLowerCase() : status;
  
  switch (statusStr) {
    case 'clear':
      return 'bg-green-500';
    case 'carrier':
      return 'bg-yellow-500';
    case 'affected':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}

/**
 * Get the display text for a dog's genotype
 */
export function getGenotypeDisplayText(genotype: DogGenotype): string {
  switch (genotype) {
    case DogGenotype.Clear:
      return 'Clear';
    case DogGenotype.Carrier:
      return 'Carrier';
    case DogGenotype.Affected:
      return 'Affected';
    default:
      return 'Unknown';
  }
}

/**
 * Get the status text for a genetic health marker
 */
export function getStatusText(status: GeneticHealthStatus): string {
  switch (status) {
    case GeneticHealthStatus.Clear:
      return 'Clear';
    case GeneticHealthStatus.Carrier:
      return 'Carrier';
    case GeneticHealthStatus.Affected:
      return 'Affected';
    default:
      return 'Unknown';
  }
}
