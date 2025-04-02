
import { DogGenotype, HealthMarker, HealthRisk, HealthSummary, GeneticHealthStatus } from '@/types/genetics';

// Format condition name for display (e.g., "progressive_retinal_atrophy" -> "Progressive Retinal Atrophy")
export const formatConditionName = (conditionName: string): string => {
  return conditionName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get color props based on status
export const getResultWithColorProps = (status: string) => {
  switch (status.toLowerCase()) {
    case 'clear':
      return { color: 'text-green-700', bgColor: 'bg-green-100' };
    case 'carrier':
      return { color: 'text-amber-700', bgColor: 'bg-amber-100' };
    case 'at_risk':
    case 'at risk':
      return { color: 'text-red-700', bgColor: 'bg-red-100' };
    default:
      return { color: 'text-gray-700', bgColor: 'bg-gray-100' };
  }
};

// Get color for health status
export const getStatusColor = (status: GeneticHealthStatus): string => {
  switch (status) {
    case 'clear':
      return 'green';
    case 'carrier':
      return 'amber';
    case 'at_risk':
    case 'at risk':
      return 'red';
    default:
      return 'gray';
  }
};

// Format date string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Generate health summary data
export const getHealthSummaryData = (genotype: DogGenotype): HealthSummary => {
  if (!genotype || !genotype.healthMarkers) {
    return {
      clearCount: 0,
      carrierCount: 0,
      atRiskCount: 0,
      totalTests: 0,
      healthScore: 100,
      topRisks: []
    };
  }
  
  let clearCount = 0;
  let carrierCount = 0;
  let atRiskCount = 0;
  let totalTests = Object.keys(genotype.healthMarkers).length;
  
  const risks: HealthRisk[] = [];
  
  Object.entries(genotype.healthMarkers).forEach(([condition, data]) => {
    switch (data.status) {
      case 'clear':
        clearCount++;
        break;
      case 'carrier':
        carrierCount++;
        // Add to risks with medium severity
        risks.push({
          condition,
          status: 'carrier',
          severity: 'medium',
          description: `Carrier for ${formatConditionName(condition)}`
        });
        break;
      case 'at_risk':
      case 'at risk':
        atRiskCount++;
        // Add to risks with high severity
        risks.push({
          condition,
          status: 'at_risk',
          severity: 'high',
          description: `At risk for ${formatConditionName(condition)}`
        });
        break;
    }
  });
  
  // Calculate health score (basic algorithm)
  const healthScore = Math.max(0, 100 - (carrierCount * 5) - (atRiskCount * 15));
  
  // Sort risks by severity (high first, then medium)
  const topRisks = risks.sort((a, b) => {
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (a.severity !== 'high' && b.severity === 'high') return 1;
    return 0;
  });
  
  return {
    clearCount,
    carrierCount,
    atRiskCount,
    totalTests,
    healthScore,
    topRisks: topRisks.slice(0, 3) // Return top 3 risks
  };
};

// Generate risk assessment text
export const generateRiskAssessment = (genotype: DogGenotype): string => {
  if (!genotype || !genotype.healthMarkers) {
    return "No genetic health data available.";
  }
  
  const { atRiskCount, carrierCount, totalTests } = getHealthSummaryData(genotype);
  
  if (atRiskCount === 0 && carrierCount === 0) {
    return "This dog is clear of all tested genetic health conditions.";
  } else if (atRiskCount > 0) {
    return `This dog is at risk for ${atRiskCount} genetic ${atRiskCount === 1 ? 'condition' : 'conditions'} and is a carrier for ${carrierCount} ${carrierCount === 1 ? 'condition' : 'conditions'}.`;
  } else {
    return `This dog is a carrier for ${carrierCount} genetic ${carrierCount === 1 ? 'condition' : 'conditions'} but is not at risk for any tested conditions.`;
  }
};
