
import { GeneticHealthStatus, HealthMarker, HealthRisk, HealthSummary, HealthWarning } from '@/types/genetics';

export const formatConditionName = (condition: string): string => {
  // Remove underscores and capitalize first letter of each word
  return condition
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const formatDate = (dateString: string): string => {
  // Format a date string to a readable format
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

export const getResultWithColorProps = (status: GeneticHealthStatus) => {
  switch (status) {
    case 'clear':
      return { color: 'text-green-700', bgColor: 'bg-green-100' };
    case 'carrier':
      return { color: 'text-amber-700', bgColor: 'bg-amber-100' };
    case 'at_risk':
    case 'at risk':
    case 'affected':
      return { color: 'text-red-700', bgColor: 'bg-red-100' };
    case 'unknown':
    default:
      return { color: 'text-gray-700', bgColor: 'bg-gray-100' };
  }
};

export const generateHealthSummary = (healthMarkers: Record<string, HealthMarker>): HealthSummary => {
  let atRiskCount = 0;
  let carrierCount = 0;
  let clearCount = 0;
  let unknownCount = 0;
  
  Object.values(healthMarkers).forEach(marker => {
    switch (marker.status) {
      case 'at_risk':
      case 'at risk':
      case 'affected':
        atRiskCount++;
        break;
      case 'carrier':
        carrierCount++;
        break;
      case 'clear':
        clearCount++;
        break;
      case 'unknown':
      default:
        unknownCount++;
        break;
    }
  });
  
  return {
    atRiskCount,
    carrierCount,
    clearCount,
    unknownCount,
    totalTests: atRiskCount + carrierCount + clearCount + unknownCount
  };
};

export const generateRiskSummary = (healthMarkers: Record<string, HealthMarker>): string => {
  const summary = generateHealthSummary(healthMarkers);
  
  if (summary.atRiskCount === 0 && summary.carrierCount === 0) {
    return "Clear of all tested genetic health conditions";
  } else if (summary.atRiskCount > 0) {
    return `At risk for ${summary.atRiskCount} ${summary.atRiskCount === 1 ? 'condition' : 'conditions'}, carrier for ${summary.carrierCount}`;
  } else {
    return `Carrier for ${summary.carrierCount} ${summary.carrierCount === 1 ? 'condition' : 'conditions'}, not at risk for any tested condition`;
  }
};

export const calculateHealthRisks = (healthMarkers: Record<string, HealthMarker>): HealthRisk[] => {
  const risks: HealthRisk[] = [];
  
  Object.entries(healthMarkers).forEach(([conditionKey, marker]) => {
    if (marker.status === 'at_risk' || marker.status === 'at risk' || marker.status === 'affected') {
      risks.push({
        status: marker.status,
        probability: 1.0,
        condition: marker.name || formatConditionName(conditionKey),
        severity: 'high'
      });
    } else if (marker.status === 'carrier') {
      risks.push({
        status: marker.status,
        probability: 0.5,
        condition: marker.name || formatConditionName(conditionKey),
        severity: 'medium'
      });
    }
  });
  
  // Sort risks by severity
  return risks.sort((a, b) => {
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (a.severity !== 'high' && b.severity === 'high') return 1;
    if (a.severity === 'medium' && b.severity === 'low') return -1;
    if (a.severity === 'low' && b.severity === 'medium') return 1;
    return 0;
  });
};

export const generateHealthWarnings = (healthMarkers: Record<string, HealthMarker>): HealthWarning[] => {
  const warnings: HealthWarning[] = [];
  const summary: HealthSummary = {
    atRiskCount: 0,
    carrierCount: 0,
    clearCount: 0,
    unknownCount: 0,
    totalTests: 0
  };
  
  // Calculate summary stats for percentage calculations
  Object.values(healthMarkers).forEach(marker => {
    summary.totalTests++;
    
    if (marker.status === 'at_risk' || marker.status === 'at risk' || marker.status === 'affected') {
      summary.atRiskCount++;
    } else if (marker.status === 'carrier') {
      summary.carrierCount++;
    } else if (marker.status === 'clear') {
      summary.clearCount++;
    } else {
      summary.unknownCount++;
    }
  });
  
  return warnings;
};

export default {
  formatConditionName,
  generateHealthSummary,
  generateRiskSummary,
  calculateHealthRisks,
  generateHealthWarnings,
  formatDate,
  getResultWithColorProps
};
