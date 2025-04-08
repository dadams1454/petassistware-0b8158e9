
import { GeneticHealthStatus } from '@/types/genetics';

/**
 * Format a condition name by replacing underscores with spaces and capitalizing
 */
export function formatConditionName(condition: string): string {
  return condition
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Format a date for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Get the color and background color for a health test result
 */
export function getResultWithColorProps(status: GeneticHealthStatus) {
  switch (status) {
    case 'clear':
      return {
        color: 'text-green-800',
        bgColor: 'bg-green-100',
      };
    case 'carrier':
      return {
        color: 'text-amber-800',
        bgColor: 'bg-amber-100',
      };
    case 'at_risk':
    case 'affected':
      return {
        color: 'text-red-800',
        bgColor: 'bg-red-100',
      };
    case 'unknown':
    default:
      return {
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
      };
  }
}

/**
 * Get a summary of health test results
 */
export function getHealthSummary(healthMarkers: Record<string, { status: string }>) {
  const summary = {
    atRiskCount: 0,
    carrierCount: 0,
    clearCount: 0,
    unknownCount: 0,
    totalTests: Object.keys(healthMarkers || {}).length,
  };

  Object.values(healthMarkers || {}).forEach((marker) => {
    const status = marker.status as GeneticHealthStatus;
    if (status === 'clear') {
      summary.clearCount += 1;
    } else if (status === 'carrier') {
      summary.carrierCount += 1;
    } else if (status === 'at_risk' || status === 'affected') {
      summary.atRiskCount += 1;
    } else {
      summary.unknownCount += 1;
    }
  });

  return summary;
}

/**
 * Calculate a health score from 0-100 based on test results
 */
export function calculateHealthScore(healthMarkers: Record<string, { status: string }>) {
  const summary = getHealthSummary(healthMarkers);
  const maxScore = summary.totalTests * 10;
  
  if (maxScore === 0) return 0;
  
  // Clear tests get full points, carriers get half, at risk gets none
  const score =
    summary.clearCount * 10 +
    summary.carrierCount * 5;
  
  return Math.round((score / maxScore) * 100);
}
