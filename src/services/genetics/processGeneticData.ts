
import { DogGenotype } from '@/types/genetics';

/**
 * Helper function to process raw genetic data into the format we need
 */
export function processGeneticData(rawData: any): DogGenotype {
  // Initialize the processed data structure
  const processedData: DogGenotype = {
    dogId: rawData.dogId,
    updatedAt: new Date().toISOString(),
    baseColor: 'E/e', // Default values
    brownDilution: 'B/b',
    dilution: 'D/d',
    agouti: 'a/a',
    patterns: [],
    healthMarkers: {},
    testResults: []
  };
  
  // Process test results
  if (rawData.tests && Array.isArray(rawData.tests)) {
    rawData.tests.forEach((test: any) => {
      // Add to test results array
      processedData.testResults.push({
        testId: test.id || `test-${Math.random().toString(36).substring(2, 9)}`,
        testType: test.test_type || 'Unknown',
        testDate: test.test_date || new Date().toISOString().split('T')[0],
        result: test.result || 'Unknown',
        labName: test.lab_name || 'Unknown Lab',
        certificateUrl: test.certificate_url,
        verified: test.verified
      });
      
      // Process color panel results
      if (test.test_type === 'Color Panel') {
        const colorResults = test.result.split(', ');
        colorResults.forEach((result: string) => {
          if (result.startsWith('E')) processedData.baseColor = result;
          if (result.startsWith('B')) processedData.brownDilution = result;
          if (result.startsWith('D')) processedData.dilution = result;
          if (result.startsWith('a')) processedData.agouti = result;
        });
      }
      
      // Process health test results
      else {
        // Extract status and genotype from result string
        const resultMatch = test.result.match(/^(\w+)\s*\(([^)]+)\)$/);
        if (resultMatch) {
          const [, status, genotype] = resultMatch;
          
          // Map status text to our standard format
          let standardStatus: 'clear' | 'carrier' | 'affected' | 'unknown' = 'unknown';
          if (status.toLowerCase() === 'clear' || status.toLowerCase() === 'normal') {
            standardStatus = 'clear';
          } else if (status.toLowerCase() === 'carrier') {
            standardStatus = 'carrier';
          } else if (status.toLowerCase() === 'affected' || status.toLowerCase() === 'positive') {
            standardStatus = 'affected';
          }
          
          // Add to health markers
          processedData.healthMarkers[test.test_type] = {
            status: standardStatus,
            genotype,
            testDate: test.test_date,
            labName: test.lab_name,
            certificateUrl: test.certificate_url
          };
        }
      }
    });
  }
  
  return processedData;
}
