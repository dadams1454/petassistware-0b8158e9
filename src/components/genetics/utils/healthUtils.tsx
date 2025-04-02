
import React from 'react';
import { Syringe, Stethoscope, Pill, Activity, AlertCircle, FileText, Scissors } from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';
import { DogGenotype, GeneticHealthStatus, HealthMarker, HealthWarning } from '@/types/genetics';

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
  const statusLower = status.toLowerCase();
  
  // Match status to appropriate styling
  switch (statusLower) {
    case 'clear':
    case 'normal':
    case 'negative':
      return { 
        color: 'text-green-700', 
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        label: 'Clear'
      };
      
    case 'carrier':
    case 'abnormal':
    case 'suspicious':
      return { 
        color: 'text-yellow-700', 
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        label: 'Carrier'
      };
      
    case 'at_risk':
    case 'at risk':
    case 'affected':
    case 'positive':
      return { 
        color: 'text-red-700', 
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        label: 'Affected'
      };
      
    case 'likely_clear':
    case 'likely clear':
      return { 
        color: 'text-emerald-700', 
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        label: 'Likely Clear'
      };
      
    case 'likely_carrier':
    case 'likely carrier':
      return { 
        color: 'text-amber-700', 
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        label: 'Likely Carrier'
      };
      
    case 'inconclusive':
    case 'pending':
      return { 
        color: 'text-purple-700', 
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        label: 'Inconclusive'
      };
      
    default:
      return { 
        color: 'text-gray-700', 
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200',
        label: 'Unknown'
      };
  }
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
 * Generate a risk assessment based on breed and health markers
 */
export function generateRiskAssessment(breed: string, healthMarkers: Record<string, HealthMarker> = {}) {
  // Default response structure
  const result = {
    hasIssues: false,
    breedName: breed,
    affectedConditions: [] as string[],
    carrierConditions: [] as string[],
    missingTests: [] as string[],
    overallRiskLevel: 'low' as 'low' | 'medium' | 'high'
  };
  
  // Common breed-specific conditions that should be tested
  const breedRecommendedTests: Record<string, string[]> = {
    'newfoundland': ['hip_dysplasia', 'elbow_dysplasia', 'cardiac', 'cystinuria'],
    'labrador retriever': ['exercise_induced_collapse', 'centronuclear_myopathy', 'progressive_retinal_atrophy'],
    'german shepherd': ['degenerative_myelopathy', 'hip_dysplasia', 'elbow_dysplasia'],
    'golden retriever': ['progressive_retinal_atrophy', 'hip_dysplasia', 'elbow_dysplasia'],
    'border collie': ['collie_eye_anomaly', 'neuronal_ceroid_lipofuscinosis']
  };
  
  // Normalized breed name for lookup
  const normalizedBreed = breed.toLowerCase();
  const recommendedTests = breedRecommendedTests[normalizedBreed] || [];
  
  // Analyze health markers
  Object.entries(healthMarkers).forEach(([condition, marker]) => {
    if (marker.status === 'affected') {
      result.affectedConditions.push(formatConditionName(condition));
      result.hasIssues = true;
    } else if (marker.status === 'carrier') {
      result.carrierConditions.push(formatConditionName(condition));
      result.hasIssues = true;
    }
  });
  
  // Check for missing recommended tests
  recommendedTests.forEach(test => {
    const hasTest = Object.keys(healthMarkers).some(key => 
      key.toLowerCase() === test.toLowerCase()
    );
    
    if (!hasTest) {
      result.missingTests.push(formatConditionName(test));
      result.hasIssues = true;
    }
  });
  
  // Determine overall risk level
  if (result.affectedConditions.length > 0) {
    result.overallRiskLevel = 'high';
  } else if (result.carrierConditions.length > 0) {
    result.overallRiskLevel = 'medium';
  }
  
  return result;
}
