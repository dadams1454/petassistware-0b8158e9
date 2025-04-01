import { supabase } from '@/integrations/supabase/client';
import { DogGenotype, GeneticHealthStatus, GeneticTestResult, TestResult, HealthMarker, HealthTestResult } from '@/types/genetics';

export const generateDogGenotypeFromTests = async (dogId: string, tests: TestResult[]): Promise<DogGenotype> => {
  // Create a base genotype object
  const genotype: DogGenotype = {
    id: 'generated', // For keeping track of generated data
    dogId: dogId,
    name: '', // Will be filled from dog data
    breed: '', // Will be filled from dog data
    baseColor: 'Unknown',
    brownDilution: 'Unknown',
    dilution: 'Unknown',
    agouti: 'Unknown',
    healthMarkers: {},
  };
  
  // Try to get dog basic info
  try {
    const { data } = await supabase
      .from('dogs')
      .select('name, breed')
      .eq('id', dogId)
      .single();
      
    if (data) {
      genotype.name = data.name;
      genotype.breed = data.breed;
    }
  } catch (error) {
    console.error('Error fetching dog details for genotype:', error);
  }
  
  // Process each test and update genotype
  for (const test of tests) {
    // Process color-related tests
    if (test.testType.toLowerCase().includes('color') || 
        test.testType.toLowerCase().includes('coat')) {
      updateColorGenotype(genotype, test);
    } 
    // Process health markers
    else {
      const marker: HealthMarker = {
        status: mapResultToStatus(test.result),
        testDate: test.testDate,
        genotype: test.result,
        labName: test.labName
      };
      
      genotype.healthMarkers[test.testType] = marker;
    }
  }
  
  // Generate health results from markers for easier processing
  const healthResults: HealthTestResult[] = [];
  for (const [condition, marker] of Object.entries(genotype.healthMarkers)) {
    healthResults.push({
      condition,
      result: marker.status,
      testDate: marker.testDate,
      date: marker.testDate,
      labName: marker.labName
    });
  }
  genotype.healthResults = healthResults;
  
  // Process any specific breed-related markers
  processBreedSpecificTraits(genotype);
  
  return genotype;
};

const updateColorGenotype = (genotype: DogGenotype, test: TestResult) => {
  const testType = test.testType.toLowerCase();
  const result = test.result.toLowerCase();
  
  if (testType.includes('base color')) {
    genotype.baseColor = test.result;
  } else if (testType.includes('brown') || testType.includes('chocolate')) {
    genotype.brownDilution = test.result;
  } else if (testType.includes('dilution')) {
    genotype.dilution = test.result;
  } else if (testType.includes('agouti')) {
    genotype.agouti = test.result;
  }
  
  // Add the test to the array of test results for reference
  if (!genotype.testResults) {
    genotype.testResults = [];
  }
  
  genotype.testResults.push({
    testType: test.testType,
    testDate: test.testDate,
    result: test.result,
    labName: test.labName || '',
    testId: test.id
  });
};

const mapResultToStatus = (result: string): GeneticHealthStatus => {
  result = result.toLowerCase();
  
  if (result.includes('clear') || result.includes('normal') || result.includes('negative')) {
    return 'clear';
  } else if (result.includes('carrier') || result.includes('heterozygous')) {
    return 'carrier';
  } else if (result.includes('affected') || result.includes('at risk') || result.includes('positive')) {
    return 'affected';
  } else {
    return 'unknown';
  }
};

const processBreedSpecificTraits = (genotype: DogGenotype) => {
  // Implementation would be breed-specific trait analysis
  // This is a placeholder for breed-specific logic
};
