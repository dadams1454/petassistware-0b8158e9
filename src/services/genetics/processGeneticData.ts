
import { DogGenotype, GeneticHealthStatus, GeneticTestResult, HealthMarker, TestResult } from '@/types/genetics';

export const processGeneticData = (data: any): DogGenotype | null => {
  if (!data || !data.dog) return null;
  
  const dogData = data.dog;
  const geneticTests = data.geneticTests || [];
  
  // Initialize the genotype structure
  const genotype: DogGenotype = {
    id: data.dog.id,
    name: data.dog.name,
    dogId: data.dog.id,
    color: {
      genotype: '',
      phenotype: dogData.color || 'Unknown'
    },
    baseColor: '',
    brownDilution: '',
    dilution: '',
    agouti: '',
    healthMarkers: {},
    healthResults: [],
    updatedAt: new Date().toISOString(),
    testResults: []
  };
  
  // Process genetic tests
  if (geneticTests && geneticTests.length > 0) {
    // Group tests by type
    const healthTests = geneticTests.filter(test => test.test_type.toLowerCase().includes('health'));
    const colorTests = geneticTests.filter(test => test.test_type.toLowerCase().includes('color'));
    const traitTests = geneticTests.filter(test => !test.test_type.toLowerCase().includes('health') && !test.test_type.toLowerCase().includes('color'));
    
    // Process health markers
    healthTests.forEach(test => {
      const status = mapResultToStatus(test.result);
      genotype.healthMarkers[test.test_type] = {
        status,
        genotype: test.result,
        testDate: test.test_date,
        labName: test.lab_name,
        certificateUrl: test.certificate_url
      };
      
      genotype.healthResults.push({
        condition: test.test_type,
        result: status,
        date: test.test_date,
        lab: test.lab_name
      });
    });
    
    // Process color genetics
    colorTests.forEach(test => {
      const testType = test.test_type.toLowerCase();
      
      if (testType.includes('base color')) {
        genotype.baseColor = test.result;
      } else if (testType.includes('brown')) {
        genotype.brownDilution = test.result;
      } else if (testType.includes('dilution')) {
        genotype.dilution = test.result;
      } else if (testType.includes('agouti')) {
        genotype.agouti = test.result;
      }
    });
    
    // Add all tests to the testResults array
    geneticTests.forEach(test => {
      genotype.testResults.push({
        testId: test.id,
        testType: test.test_type,
        testDate: test.test_date,
        result: test.result,
        labName: test.lab_name,
        certificateUrl: test.certificate_url,
        verified: test.verified,
        importSource: test.import_source || 'manual'
      });
    });
  }
  
  return genotype;
};

// Helper function to map test results to standardized status
export const mapResultToStatus = (result: string): GeneticHealthStatus => {
  const lowerResult = result.toLowerCase();
  
  if (lowerResult.includes('clear') || lowerResult.includes('negative') || lowerResult.includes('normal')) {
    return 'clear';
  } else if (lowerResult.includes('carrier') || lowerResult.includes('heterozygous')) {
    return 'carrier';
  } else if (lowerResult.includes('affected') || lowerResult.includes('positive') || lowerResult.includes('homozygous')) {
    return 'affected';
  } else {
    return 'unknown';
  }
};

// Return breed-specific high-risk genetic conditions
export const getBreedHighRiskConditions = (breed: string): string[] => {
  const breedLower = breed.toLowerCase();
  
  const breedConditions: Record<string, string[]> = {
    'newfoundland': [
      'Dilated Cardiomyopathy (DCM)',
      'Subvalvular Aortic Stenosis (SAS)',
      'Cystinuria',
      'Degenerative Myelopathy (DM)',
      'Hip Dysplasia'
    ],
    'golden_retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Progressive Retinal Atrophy (PRA)',
      'Subvalvular Aortic Stenosis (SAS)',
      'Hemangiosarcoma'
    ],
    'labrador_retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Exercise-Induced Collapse (EIC)',
      'Progressive Retinal Atrophy (PRA)',
      'Centronuclear Myopathy (CNM)'
    ],
    'german_shepherd': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Degenerative Myelopathy (DM)',
      'Exocrine Pancreatic Insufficiency (EPI)',
      'Hemophilia A'
    ]
  };
  
  // Return conditions for the specified breed, or a default message if breed is not found
  return breedConditions[breedLower] || ['No breed-specific conditions recorded'];
};

// Risk assessment based on genetic markers and breed
export const generateRiskAssessment = (breed: string, healthMarkers: Record<string, HealthMarker>) => {
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
