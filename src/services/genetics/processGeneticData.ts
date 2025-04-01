
import { supabase } from '@/integrations/supabase/client';
import { DogGenotype, HealthMarker, GeneticHealthStatus, HealthTestResult, GeneticTestResult, TestResult } from '@/types/genetics';

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
    baseColor: data.base_color || 'unknown',
    brownDilution: data.brown_dilution || 'unknown',
    dilution: data.dilution || 'unknown',
    agouti: data.agouti || 'unknown',
    healthMarkers: {}
  };
  
  // Process health markers
  if (data.health_results) {
    for (const [condition, result] of Object.entries(data.health_results)) {
      dogGenotype.healthMarkers[condition] = {
        status: result.status as GeneticHealthStatus,
        testDate: result.test_date,
        genotype: result.genotype,
        labName: result.lab_name
      };
    }
  }
  
  // Process health test results
  const healthResults: HealthTestResult[] = [];
  if (data.health_results) {
    for (const [condition, result] of Object.entries(data.health_results)) {
      healthResults.push({
        condition,
        result: result.status as GeneticHealthStatus,
        testDate: result.test_date,
        date: result.test_date,
        labName: result.lab_name
      });
    }
  }
  dogGenotype.healthResults = healthResults;
  
  // Process color genetics
  if (data.color_genetics) {
    dogGenotype.baseColor = data.color_genetics.base_color || dogGenotype.baseColor;
    dogGenotype.brownDilution = data.color_genetics.brown_dilution || dogGenotype.brownDilution;
    dogGenotype.dilution = data.color_genetics.dilution || dogGenotype.dilution;
    dogGenotype.agouti = data.color_genetics.agouti || dogGenotype.agouti;
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
  const { data, error } = await supabase
    .from('breed_health_concerns')
    .select('*')
    .eq('breed', breed.toLowerCase());
  
  if (error || !data) {
    return [];
  }
  
  return data;
};
