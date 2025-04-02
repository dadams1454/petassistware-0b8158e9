
import { DogGenotype, GeneticImportResult, HealthMarker, GeneticHealthStatus } from '@/types/genetics';
import { saveGeneticTest } from '../geneticsService';

export function processGenericLabData(data: any, dogId: string): GeneticImportResult {
  // Safety check in case colorGenetics is not defined
  const colorData = data.colorGenetics || {};
  
  // Create a DogGenotype object based on the imported data
  const genotype: DogGenotype = {
    id: dogId,
    dog_id: dogId,
    baseColor: colorData.baseColor || 'Unknown',
    brownDilution: colorData.brownDilution || 'Unknown',
    dilution: colorData.dilution || 'Unknown',
    agouti: colorData.agouti || 'Unknown',
    // Add other properties as needed
  };

  // Process health markers
  const healthMarkers: Record<string, HealthMarker> = {};
  
  // Count successfully processed tests
  let testCount = 0;
  const errors: string[] = [];

  // Process health test data if available
  if (data.healthTests && Array.isArray(data.healthTests)) {
    data.healthTests.forEach((test: any) => {
      try {
        if (!test.name || !test.result) {
          errors.push(`Invalid test data: missing name or result for test ${JSON.stringify(test)}`);
          return;
        }

        const status = mapResultToStatus(test.result);
        
        healthMarkers[test.name] = {
          status,
          testDate: test.date || new Date().toISOString(),
          lab: test.lab || 'Unknown',
          source: test.source || 'Generic Import' // Adding source
        };
        
        testCount++;
      } catch (error) {
        errors.push(`Error processing test "${test.name}": ${error}`);
      }
    });
  }
  
  // Add traits data if available
  if (data.traits) {
    genotype.traits = data.traits;
  }

  // Save the genotype data to the database
  try {
    // Save genetic data
    saveGeneticTest({
      dog_id: dogId,
      ...genotype,
      health_markers: healthMarkers
    });
    
    return {
      success: true,
      dogId,
      testsImported: testCount,
      importedTests: testCount,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    return {
      success: false,
      dogId,
      testsImported: 0,
      importedTests: 0,
      errors: [`Failed to save genetic data: ${error}`]
    };
  }
}

// Helper function to map test results to standardized status
function mapResultToStatus(result: string): GeneticHealthStatus {
  const lowerResult = result.toLowerCase();
  
  if (lowerResult.includes('clear') || lowerResult.includes('normal') || lowerResult.includes('negative')) {
    return 'clear';
  }
  
  if (lowerResult.includes('carrier')) {
    return 'carrier';
  }
  
  if (lowerResult.includes('at risk') || lowerResult.includes('at-risk')) {
    return 'at_risk';
  }
  
  if (lowerResult.includes('affected') || lowerResult.includes('positive')) {
    return 'affected';
  }
  
  return 'unknown';
}

// Embark-specific processing
export function processEmbarkData(data: any, dogId: string): GeneticImportResult {
  // Example implementation
  // In a real implementation, this would parse Embark's specific data format
  return {
    success: true,
    dogId,
    testsImported: 0,
    importedTests: 0,
    errors: ['Embark data processing not fully implemented']
  };
}

// Wisdom Panel-specific processing
export function processWisdomPanelData(data: any, dogId: string): GeneticImportResult {
  // Example implementation
  return {
    success: true,
    dogId,
    testsImported: 0,
    importedTests: 0,
    errors: ['Wisdom Panel data processing not fully implemented']
  };
}
