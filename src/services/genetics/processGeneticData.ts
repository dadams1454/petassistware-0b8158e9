
import { DogGenotype, HealthMarker, GeneticTestResult } from '@/types/genetics';

export function processGeneticData(data: any): DogGenotype {
  const { dog, geneticTests, coiData } = data;
  
  // Initialize the genotype object
  const genotype: DogGenotype = {
    id: dog.id,
    name: dog.name,
    color: {
      genotype: '',
      phenotype: dog.color || 'Unknown'
    },
    healthMarkers: {},
    healthResults: [],
    // Default color genetics for Newfoundlands
    baseColor: 'E/E',  // Black-based (eumelanin)
    brownDilution: 'B/B', // No brown dilution
    dilution: 'D/D',  // No dilution
    agouti: 'a/a',  // Recessive black
    patterns: [],
    dogId: dog.id,
    updatedAt: new Date().toISOString()
  };
  
  // Process genetic test results
  if (geneticTests && geneticTests.length > 0) {
    for (const test of geneticTests) {
      if (test.test_type === 'Color Panel') {
        // Process color-related tests
        if (test.result && test.result.includes('B locus')) {
          genotype.brownDilution = extractGenotype(test.result);
        } else if (test.result && test.result.includes('D locus')) {
          genotype.dilution = extractGenotype(test.result);
        } else if (test.result && test.result.includes('E locus')) {
          genotype.baseColor = extractGenotype(test.result);
        } else if (test.result && test.result.includes('A locus')) {
          genotype.agouti = extractGenotype(test.result);
        }
      } else {
        // Process health-related tests
        const resultMatch = test.result?.match(/^(clear|carrier|affected)/i);
        const status = resultMatch 
          ? resultMatch[1].toLowerCase() as 'clear' | 'carrier' | 'affected' | 'unknown'
          : 'unknown';
        
        genotype.healthMarkers[test.test_type] = {
          status,
          genotype: extractGenotype(test.result) || 'unknown',
          testDate: test.test_date,
          labName: test.lab_name,
          certificateUrl: test.certificate_url,
          breedSpecificRisk: calculateBreedRisk(test.test_type, dog.breed, status)
        };
        
        genotype.healthResults.push({
          condition: test.test_type,
          result: status,
          date: test.test_date,
          lab: test.lab_name
        });
      }
    }
  }
  
  // Add raw test results for reference
  genotype.testResults = geneticTests?.map(test => ({
    testId: test.id,
    testType: test.test_type,
    testDate: test.test_date,
    result: test.result,
    labName: test.lab_name,
    certificateUrl: test.certificate_url,
    verified: test.verified || false
  }));
  
  return genotype;
}

// Helper function to extract genotype notation from test result
function extractGenotype(result: string): string {
  const match = result?.match(/([A-Za-z])\/([A-Za-z])/);
  return match ? match[0] : '';
}

// Helper function to calculate breed-specific risk
function calculateBreedRisk(
  condition: string, 
  breed: string,
  status: 'clear' | 'carrier' | 'affected' | 'unknown'
): number {
  // In a real application, this would pull from a database of breed-specific risk factors
  // For now, returning mock values
  if (status === 'affected') return 90;
  if (status === 'carrier') return 40;
  return 5; // Low risk for clear results
}

// Utility function to identify high-risk genetic conditions by breed
export function getBreedHighRiskConditions(breed: string): string[] {
  breed = breed.toLowerCase();
  
  // Key genetic conditions by breed
  const breedConditions: Record<string, string[]> = {
    'newfoundland': [
      'Cystinuria',
      'Subvalvular Aortic Stenosis',
      'Dilated Cardiomyopathy',
      'Progressive Retinal Atrophy',
    ],
    'golden_retriever': [
      'Hip Dysplasia',
      'Elbow Dysplasia',
      'Progressive Retinal Atrophy',
      'Cancer Predisposition',
    ],
    'labrador_retriever': [
      'Exercise-Induced Collapse',
      'Progressive Retinal Atrophy',
      'Hip Dysplasia',
      'Elbow Dysplasia',
    ],
    // Add more breeds as needed
  };
  
  // Default to returning some common conditions if breed not found
  return breedConditions[breed] || [
    'Progressive Retinal Atrophy',
    'Hip Dysplasia',
    'Degenerative Myelopathy',
  ];
}
