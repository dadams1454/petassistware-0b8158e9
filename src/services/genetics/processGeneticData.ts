import { supabase } from '@/integrations/supabase/client';
import { DogGenotype, HealthMarker, GeneticHealthStatus, HealthTestResult, GeneticTestResult } from '@/types/genetics';

export const processGeneticData = async (dogId: string) => {
  // Get the genetic information for the dog
  const { data, error } = await supabase
    .from('genetic_data')
    .select('*')
    .eq('dog_id', dogId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  // Process genetic data into a DogGenotype
  const dogGenotype: DogGenotype = {
    id: data.id,
    dogId: dogId,
    baseColor: 'unknown',
    brownDilution: 'unknown',
    dilution: 'unknown',
    agouti: 'unknown',
    healthMarkers: {},
    updated_at: data.updated_at || data.created_at
  };
  
  // Process health markers from health_results if it exists
  if (data.health_results && typeof data.health_results === 'object') {
    const healthResults = data.health_results as Record<string, any>;
    
    for (const [condition, result] of Object.entries(healthResults)) {
      if (result && typeof result === 'object' && 'status' in result) {
        dogGenotype.healthMarkers[condition] = {
          status: result.status as GeneticHealthStatus,
          testDate: result.test_date,
          genotype: result.genotype,
          labName: result.lab_name
        };
      }
    }
  }
  
  // Process health test results
  const healthResults: HealthTestResult[] = [];
  if (data.health_results && typeof data.health_results === 'object') {
    const healthResultsData = data.health_results as Record<string, any>;
    
    for (const [condition, result] of Object.entries(healthResultsData)) {
      if (result && typeof result === 'object' && 'status' in result) {
        healthResults.push({
          condition,
          result: result.status as GeneticHealthStatus,
          testDate: result.test_date,
          date: result.test_date,
          labName: result.lab_name
        });
      }
    }
  }
  dogGenotype.healthResults = healthResults;
  
  // Get breed from the dogs table
  const { data: dogData } = await supabase
    .from('dogs')
    .select('breed')
    .eq('id', dogId)
    .single();
    
  if (dogData) {
    dogGenotype.breed = dogData.breed;
  }
  
  // Get test results
  const { data: testData, error: testError } = await supabase
    .from('dog_genetic_tests')
    .select('*')
    .eq('dog_id', dogId);
  
  if (!testError && testData) {
    const testResults: GeneticTestResult[] = testData.map(test => ({
      testType: test.test_type,
      testDate: test.test_date,
      result: test.result,
      labName: test.lab_name,
      testId: test.id
    }));
    dogGenotype.testResults = testResults;
  }
  
  return dogGenotype;
};

export const getBreedHighRiskConditions = async (breed: string) => {
  try {
    // Since the breed_health_concerns table might not exist yet, we'll return mock data
    return [
      { breed: breed.toLowerCase(), condition: 'Hip Dysplasia', risk_level: 'high' },
      { breed: breed.toLowerCase(), condition: 'Elbow Dysplasia', risk_level: 'medium' },
      { breed: breed.toLowerCase(), condition: 'Progressive Retinal Atrophy', risk_level: 'medium' }
    ];
  } catch (error) {
    console.error('Error fetching breed health concerns:', error);
    return [];
  }
};
