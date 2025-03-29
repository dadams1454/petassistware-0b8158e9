
import { GeneticHealthMarker } from '@/types/genetics';

/**
 * Get color class for health status indicator
 */
export function getStatusColor(status: string): string {
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
 * Format test result with appropriate color
 * Returns the props needed for creating the element in the component
 */
export function getResultWithColorProps(result: string): { className: string; children?: string } {
  if (result.toLowerCase().includes('clear')) {
    return { className: "text-green-600 font-medium" };
  } else if (result.toLowerCase().includes('carrier')) {
    return { className: "text-yellow-600 font-medium" };
  } else if (result.toLowerCase().includes('affected')) {
    return { className: "text-red-600 font-medium" };
  }
  return { className: "" };
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Capitalize first letter of string
 */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format condition names for display
 */
export function formatConditionName(condition: string): string {
  // Convert common abbreviations
  const abbreviations: Record<string, string> = {
    'DM': 'Degenerative Myelopathy',
    'DCM': 'Dilated Cardiomyopathy',
    'vWD': 'von Willebrand Disease',
    'PRA': 'Progressive Retinal Atrophy'
  };
  
  if (abbreviations[condition]) {
    return abbreviations[condition];
  }
  
  // Otherwise capitalize each word
  return condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get a summary of health markers for compact view
 * Returns the data needed to render the health summary
 */
export function getHealthSummaryData(healthMarkers: Record<string, GeneticHealthMarker> = {}): {
  affected: string[];
  carriers: string[];
  clear: string[];
  hasTests: boolean;
} {
  const carriers: string[] = [];
  const affected: string[] = [];
  const clear: string[] = [];
  
  for (const [condition, data] of Object.entries(healthMarkers)) {
    if (data.status === 'carrier') {
      carriers.push(formatConditionName(condition));
    } else if (data.status === 'affected') {
      affected.push(formatConditionName(condition));
    } else if (data.status === 'clear') {
      clear.push(formatConditionName(condition));
    }
  }
  
  return {
    affected,
    carriers,
    clear,
    hasTests: affected.length > 0 || carriers.length > 0 || clear.length > 0
  };
}
