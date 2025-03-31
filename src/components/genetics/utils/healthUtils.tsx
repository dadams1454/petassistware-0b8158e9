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
  switch (typeof status === 'string' ? status : status.status) {
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
 * Format a date string for display
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (err) {
    return 'Invalid date';
  }
}

/**
 * Get result with color properties for UI display
 */
export function getResultWithColorProps(status: string) {
  const statusMap: Record<string, { color: string, bgColor: string, label: string }> = {
    'clear': { 
      color: 'text-green-700', 
      bgColor: 'bg-green-100', 
      label: 'Clear' 
    },
    'carrier': { 
      color: 'text-yellow-700', 
      bgColor: 'bg-yellow-100', 
      label: 'Carrier' 
    },
    'affected': { 
      color: 'text-red-700', 
      bgColor: 'bg-red-100', 
      label: 'Affected' 
    },
    'unknown': { 
      color: 'text-gray-700', 
      bgColor: 'bg-gray-100', 
      label: 'Unknown' 
    }
  };
  
  return statusMap[status.toLowerCase()] || statusMap.unknown;
}

/**
 * Helper function to format condition names for display
 */
export function formatConditionName(condition: string): string {
  const abbreviations: Record<string, string> = {
    'DM': 'Degenerative Myelopathy',
    'DCM': 'Dilated Cardiomyopathy',
    'vWD': 'von Willebrand Disease',
    'PRA': 'Progressive Retinal Atrophy',
    'Hip Dysplasia': 'Hip Dysplasia (HD)',
    'Elbow Dysplasia': 'Elbow Dysplasia (ED)'
  };
  
  if (abbreviations[condition]) {
    return abbreviations[condition];
  }
  
  return condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper function to extract health test summary from genetic data
 */
export function getHealthSummaryData(healthMarkers: Record<string, any> = {}) {
  const clear: string[] = [];
  const carriers: string[] = [];
  const affected: string[] = [];
  const hasTests = Object.keys(healthMarkers).length > 0;
  
  // Categorize each health marker
  for (const [condition, marker] of Object.entries(healthMarkers)) {
    const displayName = formatConditionName(condition);
    
    if (marker.status === 'clear') {
      clear.push(displayName);
    } else if (marker.status === 'carrier') {
      carriers.push(displayName);
    } else if (marker.status === 'affected') {
      affected.push(displayName);
    }
  }
  
  return { 
    clear, 
    carriers, 
    affected,
    hasTests
  };
}

/**
 * Helper function to calculate risk level based on test status
 */
export function calculateRiskLevel(test: any): 'high' | 'medium' | 'low' {
  if (test.status === 'affected') {
    return 'high';
  } else if (test.status === 'carrier') {
    return 'medium';
  }
  return 'low';
}
