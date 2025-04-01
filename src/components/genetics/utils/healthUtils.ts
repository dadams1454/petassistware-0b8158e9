
import { HealthMarker } from '@/types/genetics';

/**
 * Formats a raw condition name for UI display
 */
export function formatConditionName(condition: string): string {
  // Handle special cases
  if (condition.includes('PRA')) {
    return 'Progressive Retinal Atrophy';
  }
  
  if (condition.includes('vWD')) {
    return 'von Willebrand Disease';
  }
  
  if (condition.includes('DM')) {
    return 'Degenerative Myelopathy';
  }
  
  // Basic formatting: remove underscores, make title case
  return condition
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get a summary of health marker status counts
 */
export function getHealthSummaryData(healthMarkers: Record<string, HealthMarker>) {
  const summary = {
    hasTests: Object.keys(healthMarkers).length > 0,
    clear: [] as string[],
    carriers: [] as string[],
    affected: [] as string[],
    unknown: [] as string[],
    clearCount: 0,
    carrierCount: 0,
    affectedCount: 0,
    unknownCount: 0
  };
  
  // Process all health markers
  Object.entries(healthMarkers).forEach(([condition, marker]) => {
    const formattedName = formatConditionName(condition);
    
    switch(marker.status) {
      case 'clear':
        summary.clear.push(formattedName);
        summary.clearCount++;
        break;
      case 'carrier':
        summary.carriers.push(formattedName);
        summary.carrierCount++;
        break;
      case 'affected':
        summary.affected.push(formattedName);
        summary.affectedCount++;
        break;
      default:
        summary.unknown.push(formattedName);
        summary.unknownCount++;
    }
  });
  
  return summary;
}

/**
 * Get color-coded status text
 */
export function getStatusStyleClasses(status: string): string {
  switch(status.toLowerCase()) {
    case 'clear':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'carrier':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'affected':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

/**
 * Generates a genetic risk assessment for a dog based on its breed and test results
 */
export function generateRiskAssessment(breed: string, healthMarkers: Record<string, HealthMarker>) {
  // This would typically use a database of breed-specific conditions and risks
  // For now, we'll hardcode some common conditions for Newfoundlands
  
  const breedRisks: Record<string, string[]> = {
    'newfoundland': [
      'Cystinuria', 
      'Subvalvular Aortic Stenosis',
      'Dilated Cardiomyopathy',
      'Hip Dysplasia'
    ],
    'labrador_retriever': [
      'Exercise-Induced Collapse',
      'Progressive Retinal Atrophy',
      'Hip Dysplasia'
    ],
    'golden_retriever': [
      'Progressive Retinal Atrophy',
      'Hip Dysplasia',
      'Cancer Predisposition'
    ]
  };
  
  const normalizedBreed = breed.toLowerCase().replace(' ', '_');
  const breedSpecificRisks = breedRisks[normalizedBreed] || [];
  
  // Check which tests have been performed for breed-specific conditions
  const testedConditions = new Set(Object.keys(healthMarkers).map(c => c.toLowerCase()));
  
  const missingTests = breedSpecificRisks.filter(
    risk => !Array.from(testedConditions).some(c => c.toLowerCase().includes(risk.toLowerCase()))
  );
  
  // Find affected conditions
  const affectedConditions = Object.entries(healthMarkers)
    .filter(([_, marker]) => marker.status === 'affected')
    .map(([condition, _]) => formatConditionName(condition));
  
  // Find carrier conditions
  const carrierConditions = Object.entries(healthMarkers)
    .filter(([_, marker]) => marker.status === 'carrier')
    .map(([condition, _]) => formatConditionName(condition));
  
  return {
    breedSpecificRisks,
    missingTests,
    affectedConditions,
    carrierConditions,
    hasIssues: affectedConditions.length > 0 || carrierConditions.length > 0 || missingTests.length > 0
  };
}
