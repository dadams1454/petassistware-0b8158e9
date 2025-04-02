import { DogGenotype, HealthMarker, HealthWarning } from '@/types/genetics';

// Add these missing utility functions at the top of the file
export const formatConditionName = (condition: string): string => {
  // Convert snake_case or camelCase to Title Case with spaces
  return condition
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
};

export const getResultWithColorProps = (status: string) => {
  switch (status.toLowerCase()) {
    case 'clear':
      return { 
        color: 'text-green-700',
        bgColor: 'bg-green-100'
      };
    case 'carrier':
      return {
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100'  
      };
    case 'at_risk':
    case 'affected':
      return {
        color: 'text-red-700',
        bgColor: 'bg-red-100'
      };
    default:
      return {
        color: 'text-gray-700',
        bgColor: 'bg-gray-100'
      };
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateString;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'clear':
      return '#4ade80'; // green
    case 'carrier':
      return '#facc15'; // yellow
    case 'at_risk':
    case 'affected':
      return '#f87171'; // red
    default:
      return '#e5e7eb'; // gray
  }
};

export const generateRiskAssessment = (breed: string, healthMarkers: Record<string, HealthMarker>) => {
  const affectedConditions: string[] = [];
  const carrierConditions: string[] = [];
  const missingTests: string[] = [];
  
  // Get recommended tests for the breed
  const recommendedTests = getRecommendedTestsForBreed(breed);
  
  // Analyze existing health markers
  Object.entries(healthMarkers).forEach(([condition, marker]) => {
    if (marker.status === 'at_risk' || marker.status === 'affected') {
      affectedConditions.push(condition);
    } else if (marker.status === 'carrier') {
      carrierConditions.push(condition);
    }
  });
  
  // Check for missing recommended tests
  recommendedTests.forEach(test => {
    if (!healthMarkers[test]) {
      missingTests.push(test);
    }
  });
  
  return {
    affectedConditions,
    carrierConditions,
    missingTests,
    hasIssues: affectedConditions.length > 0 || carrierConditions.length > 0 || missingTests.length > 0
  };
};

export const getRecommendedTestsForBreed = (breed: string): string[] => {
  // Map of breeds to recommended tests
  const breedTestMap: Record<string, string[]> = {
    'Newfoundland': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Cardiac Disease',
      'Cystinuria',
      'Degenerative Myelopathy',
    ],
    'Labrador Retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Exercise-Induced Collapse',
      'Progressive Retinal Atrophy',
      'Centronuclear Myopathy',
    ],
    'Golden Retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Progressive Retinal Atrophy',
      'Ichthyosis',
      'Muscular Dystrophy',
    ],
    'German Shepherd': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Degenerative Myelopathy',
      'Hemophilia A',
      'von Willebrand Disease',
    ],
    'Bulldog': [
      'Hip Dysplasia',
      'Tracheal Hypoplasia',
      'Patellar Luxation',
      'Congenital Heart Disease',
      'Cystine Urolithiasis',
    ],
    // Add more breeds as needed
  };
  
  // Return the recommended tests for the breed, or an empty array if the breed is not in our map
  return breedTestMap[breed] || [];
};

export const getHealthSummaryData = (healthMarkers: Record<string, HealthMarker> = {}) => {
  const clear: string[] = [];
  const carriers: string[] = [];
  const affected: string[] = [];
  
  Object.entries(healthMarkers).forEach(([condition, marker]) => {
    // Convert status to string for comparison
    const status = marker.status.toString();
    
    if (status === 'clear') {
      clear.push(condition);
    } else if (status === 'carrier') {
      carriers.push(condition);
    } else if (status === 'at_risk' || status === 'affected') {
      affected.push(condition);
    }
  });
  
  return {
    clear,
    carriers,
    affected,
    hasTests: clear.length > 0 || carriers.length > 0 || affected.length > 0
  };
};

export const getBreedHealthRisks = (breed: string) => {
  const breedRisks: Record<string, string[]> = {
    'Newfoundland': [
      'Dilated Cardiomyopathy (DCM)',
      'Subvalvular Aortic Stenosis (SAS)',
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Cystinuria'
    ],
    'Labrador Retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Progressive Retinal Atrophy (PRA)',
      'Exercise-Induced Collapse (EIC)',
      'Centronuclear Myopathy (CNM)'
    ],
    'Golden Retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Progressive Retinal Atrophy (PRA)',
      'Subvalvular Aortic Stenosis (SAS)',
      'Ichthyosis'
    ],
    // Add more breeds as needed
  };
  
  return breedRisks[breed] || [];
};

export const getTestingRecommendationsByAge = (ageInMonths: number, breed: string) => {
  // Base recommendations by age
  const ageBasedRecommendations: Record<string, string[]> = {
    '0-2': ['Initial Vet Checkup', 'Microchipping'],
    '2-4': ['First Vaccinations', 'Parasite Check'],
    '4-6': ['Booster Vaccinations', 'Initial Growth Assessment'],
    '6-12': ['Spay/Neuter Discussion', 'Preliminary Health Screening'],
    '12-24': ['Hip and Elbow Preliminary Evaluation', 'Eye Examination', 'Heart Evaluation']
  };
  
  // Get age category
  let ageCategory = '12-24';
  if (ageInMonths < 2) ageCategory = '0-2';
  else if (ageInMonths < 4) ageCategory = '2-4';
  else if (ageInMonths < 6) ageCategory = '4-6';
  else if (ageInMonths < 12) ageCategory = '6-12';
  
  // Combine with breed-specific recommendations
  const breedSpecificTests = getRecommendedTestsForBreed(breed);
  
  // For young puppies, don't recommend all genetic tests yet
  const filteredBreedTests = ageInMonths < 6 
    ? breedSpecificTests.filter(test => test.toLowerCase().includes('screening') || test.toLowerCase().includes('early'))
    : breedSpecificTests;
  
  return {
    ageCategory,
    generalRecommendations: ageBasedRecommendations[ageCategory] || [],
    breedSpecificRecommendations: filteredBreedTests
  };
};

export const analyzeCOITrends = (historicalCOI: {generation: number, coi: number}[], currentCOI: number) => {
  // Sort by generation
  const sortedData = [...historicalCOI].sort((a, b) => a.generation - b.generation);
  
  // Calculate trend
  let trend = 'stable';
  if (sortedData.length > 1) {
    const firstCOI = sortedData[0].coi;
    const lastCOI = sortedData[sortedData.length - 1].coi;
    
    if (lastCOI > firstCOI * 1.1) { // 10% increase
      trend = 'increasing';
    } else if (lastCOI < firstCOI * 0.9) { // 10% decrease
      trend = 'decreasing';
    }
  }
  
  // Risk level
  let riskLevel = 'low';
  if (currentCOI > 0.125) {
    riskLevel = 'high';
  } else if (currentCOI > 0.0625) {
    riskLevel = 'medium';
  }
  
  return { trend, riskLevel };
};

export const formatGeneticTestResults = (testResults: any[]) => {
  return testResults.map(result => {
    const formattedResult = {
      ...result,
      formattedDate: result.test_date 
        ? new Date(result.test_date).toLocaleDateString() 
        : 'N/A',
      statusClass: getStatusClass(result.result)
    };
    return formattedResult;
  });
};

export const getStatusClass = (status: string) => {
  if (status === 'clear') return 'bg-green-100 text-green-800 border-green-300';
  if (status === 'carrier') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (status === 'affected' || status === 'at_risk') return 'bg-red-100 text-red-800 border-red-300';
  return 'bg-gray-100 text-gray-800 border-gray-300'; // unknown or other
};
