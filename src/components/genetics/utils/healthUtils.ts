
import { DogGenotype, GeneticHealthStatus } from '@/types/genetics';

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
