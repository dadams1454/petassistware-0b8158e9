
import { GeneticHealthStatus } from '@/types/genetics';

export const getStatusColor = (status: GeneticHealthStatus) => {
  switch (status) {
    case 'clear':
      return 'bg-green-500';
    case 'carrier':
      return 'bg-yellow-500';
    case 'affected':
      return 'bg-red-500';
    default:
      return 'bg-gray-300';
  }
};

export const getResultWithColorProps = (status: GeneticHealthStatus) => {
  switch (status) {
    case 'clear':
      return { text: 'Clear', color: 'text-green-600', bgColor: 'bg-green-100' };
    case 'carrier':
      return { text: 'Carrier', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    case 'affected':
      return { text: 'Affected', color: 'text-red-600', bgColor: 'bg-red-100' };
    default:
      return { text: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }
};

export const getHealthSummaryData = (healthMarkers: Record<string, any>) => {
  const result = {
    hasTests: false,
    clear: [] as string[],
    carriers: [] as string[],
    affected: [] as string[]
  };
  
  if (!healthMarkers || Object.keys(healthMarkers).length === 0) {
    return result;
  }
  
  result.hasTests = true;
  
  for (const [condition, marker] of Object.entries(healthMarkers)) {
    const formattedCondition = formatConditionName(condition);
    
    if (marker.status === 'clear') {
      result.clear.push(formattedCondition);
    } else if (marker.status === 'carrier') {
      result.carriers.push(formattedCondition);
    } else if (marker.status === 'affected') {
      result.affected.push(formattedCondition);
    }
  }
  
  return result;
};

export const formatConditionName = (condition: string): string => {
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
};

export const formatDate = (dateStr: string | Date): string => {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
