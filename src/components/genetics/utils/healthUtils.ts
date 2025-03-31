
import { DogGenotype, GeneticHealthStatus, HealthMarker } from '@/types/genetics';

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
 * Get the status color for a genetic health marker
 */
export function getStatusColor(status: GeneticHealthStatus | string): string {
  switch (status) {
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
