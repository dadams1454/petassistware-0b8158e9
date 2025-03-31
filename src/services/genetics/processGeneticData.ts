
import { DogGenotype, HealthMarker, GeneticTestResult } from '@/types/genetics';

export function processGeneticData(data: any): DogGenotype {
  const { dog, geneticTests } = data;
  
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
    dogId: dog.id
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
          certificateUrl: test.certificate_url
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
  
  return genotype;
}

// Helper function to extract genotype notation from test result
function extractGenotype(result: string): string {
  const match = result?.match(/([A-Za-z])\/([A-Za-z])/);
  return match ? match[0] : '';
}
