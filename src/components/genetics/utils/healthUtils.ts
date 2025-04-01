
import { ReactNode } from 'react';
import { Syringe, Stethoscope, Pill, Activity, AlertCircle, FileText, Scissors } from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';
import { DogGenotype, HealthMarker, GeneticHealthStatus } from '@/types/genetics';

export const getHealthRecordIcon = (recordType: string): ReactNode => {
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return { type: Syringe, props: { className: "h-5 w-5" } };
    case HealthRecordTypeEnum.Examination:
      return { type: Stethoscope, props: { className: "h-5 w-5" } };
    case HealthRecordTypeEnum.Medication:
      return { type: Pill, props: { className: "h-5 w-5" } };
    case HealthRecordTypeEnum.Surgery:
      return { type: Scissors, props: { className: "h-5 w-5" } };
    case HealthRecordTypeEnum.Observation:
      return { type: AlertCircle, props: { className: "h-5 w-5" } };
    default:
      return { type: FileText, props: { className: "h-5 w-5" } };
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
export function getGenotypeDisplayText(genotype: string): string {
  if (genotype === 'clear') {
    return 'Clear';
  } else if (genotype === 'carrier') {
    return 'Carrier';
  } else if (genotype === 'affected') {
    return 'Affected';
  } else {
    return 'Unknown';
  }
}

/**
 * Get the status text for a genetic health marker
 */
export function getStatusText(status: GeneticHealthStatus): string {
  if (status === 'clear') {
    return 'Clear';
  } else if (status === 'carrier') {
    return 'Carrier';
  } else if (status === 'affected') {
    return 'Affected';
  } else {
    return 'Unknown';
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

/**
 * Generate risk assessment based on breed and health markers
 */
export function generateRiskAssessment(breed: string, healthMarkers: Record<string, HealthMarker>) {
  const breedLower = breed.toLowerCase();
  
  // Define breed-specific high-risk conditions
  const breedConditions: Record<string, string[]> = {
    'newfoundland': [
      'Dilated Cardiomyopathy (DCM)',
      'Subvalvular Aortic Stenosis (SAS)',
      'Cystinuria',
      'Degenerative Myelopathy (DM)',
      'Hip Dysplasia'
    ],
    'golden_retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Progressive Retinal Atrophy (PRA)',
      'Subvalvular Aortic Stenosis (SAS)',
      'Hemangiosarcoma'
    ],
    'labrador_retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Exercise-Induced Collapse (EIC)',
      'Progressive Retinal Atrophy (PRA)',
      'Centronuclear Myopathy (CNM)'
    ],
    'german_shepherd': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Degenerative Myelopathy (DM)',
      'Exocrine Pancreatic Insufficiency (EPI)',
      'Hemophilia A'
    ]
  };
  
  const breedHighRiskConditions = breedConditions[breedLower] || ['No breed-specific conditions recorded'];
  
  const affectedConditions: string[] = [];
  const carrierConditions: string[] = [];
  const missingTests: string[] = [];
  
  // Find affected and carrier conditions
  Object.entries(healthMarkers).forEach(([condition, marker]) => {
    if (marker.status === 'affected') {
      affectedConditions.push(formatConditionName(condition));
    } else if (marker.status === 'carrier') {
      carrierConditions.push(formatConditionName(condition));
    }
  });
  
  // Check for missing high-risk tests
  breedHighRiskConditions.forEach(condition => {
    const conditionNormalized = condition.toLowerCase().replace(/[()]/g, '');
    const hasTest = Object.keys(healthMarkers).some(testName => 
      testName.toLowerCase().includes(conditionNormalized)
    );
    
    if (!hasTest) {
      missingTests.push(condition);
    }
  });
  
  return {
    hasIssues: affectedConditions.length > 0 || carrierConditions.length > 0 || missingTests.length > 0,
    affectedConditions,
    carrierConditions,
    missingTests,
    breedHighRiskConditions
  };
}
