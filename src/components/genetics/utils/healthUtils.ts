
import { HealthMarker } from '@/types/genetics';
import { getBreedHighRiskConditions } from '@/services/genetics/processGeneticData';

export interface RiskAssessment {
  hasIssues: boolean;
  affectedConditions: string[];
  carrierConditions: string[];
  missingTests: string[];
  breedHighRiskConditions: string[];
}

export const generateRiskAssessment = (breed: string, healthMarkers: Record<string, HealthMarker>): RiskAssessment => {
  const breedHighRiskConditions = getBreedHighRiskConditions(breed);
  
  const affectedConditions: string[] = [];
  const carrierConditions: string[] = [];
  const missingTests: string[] = [];
  
  // Find affected and carrier conditions
  Object.entries(healthMarkers).forEach(([condition, marker]) => {
    if (marker.status === 'affected') {
      affectedConditions.push(condition);
    } else if (marker.status === 'carrier') {
      carrierConditions.push(condition);
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
};

export const getHealthRiskLevel = (condition: string, status: string): 'high' | 'medium' | 'low' => {
  if (status === 'affected') {
    return 'high';
  }
  
  if (status === 'carrier') {
    // Some carrier conditions are more concerning than others
    const highRiskCarriers = [
      'degenerative myelopathy',
      'von willebrand',
      'dilated cardiomyopathy',
      'exercise-induced collapse'
    ];
    
    if (highRiskCarriers.some(c => condition.toLowerCase().includes(c))) {
      return 'medium';
    }
    
    return 'low';
  }
  
  return 'low';
};

export const getHealthAlertMessage = (condition: string, status: string): string => {
  if (status === 'affected') {
    return `Dog is affected by ${condition}. Consult with veterinarian for management strategies.`;
  }
  
  if (status === 'carrier') {
    return `Dog is a carrier for ${condition}. Consider this in breeding decisions.`;
  }
  
  return '';
};

export const getBreedingRecommendation = (dogCondition: string, dogStatus: string): string => {
  if (dogStatus === 'affected') {
    return `Do not breed with dogs that are carriers or affected by ${dogCondition}.`;
  }
  
  if (dogStatus === 'carrier') {
    return `Only breed with dogs that have tested clear for ${dogCondition} to avoid producing affected puppies.`;
  }
  
  return '';
};
