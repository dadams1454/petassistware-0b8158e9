
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DogGenotype } from '@/types/genetics';

// Define return type for the hook
interface UseDogGeneticsReturn {
  geneticData: DogGenotype | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Custom hook to fetch and manage a dog's genetic data
 */
export function useDogGenetics(dogId: string): UseDogGeneticsReturn {
  const [geneticData, setGeneticData] = useState<DogGenotype | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // Function to trigger a refresh of the data
  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    // Reset state when dog ID changes
    setLoading(true);
    setError(null);
    setGeneticData(null);
    
    // Skip if no dog ID is provided
    if (!dogId) {
      setLoading(false);
      return;
    }
    
    async function fetchGeneticData() {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate the API response with mock data
        const response = await fetchDogGeneticData(dogId);
        
        // Process raw data into the format we need
        const processedData = processGeneticData(response);
        
        setGeneticData(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching genetic data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setGeneticData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGeneticData();
  }, [dogId, refreshTrigger]);
  
  return { geneticData, loading, error, refresh };
}

/**
 * Helper function to fetch dog genetic data from the API
 * This is a placeholder for the actual API call
 */
async function fetchDogGeneticData(dogId: string): Promise<any> {
  try {
    // Attempt to fetch actual genetic data from Supabase
    const { data: actualData, error: actualError } = await supabase
      .from('dog_genetic_tests')
      .select('*')
      .eq('dog_id', dogId);
    
    if (actualError) throw actualError;
    
    if (actualData && actualData.length > 0) {
      return {
        dogId: dogId,
        tests: actualData
      };
    }
    
    // If no real data, use mock data
    return getMockGeneticData(dogId);
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    // Fallback to mock data
    return getMockGeneticData(dogId);
  }
}

/**
 * Get mock genetic data for demo purposes
 */
function getMockGeneticData(dogId: string): any {
  // Mock data for different dogs (used for demo only)
  const mockData: Record<string, any> = {
    // Default mock data for any dog
    'default': {
      dogId: dogId,
      name: 'Unknown Dog',
      tests: [
        {
          testId: 'color1',
          testType: 'Color Panel',
          testDate: '2023-05-15',
          result: 'E/e, B/b, D/d, a/a',
          labName: 'Generic Lab'
        },
        {
          testId: 'health1',
          testType: 'DM',
          testDate: '2023-05-15',
          result: 'Clear (N/N)',
          labName: 'Generic Lab'
        },
        {
          testId: 'health2',
          testType: 'vWD',
          testDate: '2023-05-15',
          result: 'Clear (N/N)',
          labName: 'Generic Lab'
        }
      ]
    }
  };
  
  // Return mock data if available, otherwise default
  return mockData[dogId] || mockData['default'];
}

/**
 * Helper function to process raw genetic data into the format we need
 */
function processGeneticData(rawData: any): DogGenotype {
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
        testId: test.testId || test.id || `test-${Math.random().toString(36).substr(2, 9)}`,
        testType: test.testType || test.test_type || 'Unknown',
        testDate: test.testDate || test.test_date || new Date().toISOString().split('T')[0],
        result: test.result || 'Unknown',
        labName: test.labName || test.lab_name || 'Unknown Lab'
      });
      
      // Process color panel results
      if (test.testType === 'Color Panel' || test.test_type === 'Color Panel') {
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
          let standardStatus: 'clear' | 'carrier' | 'affected';
          if (status.toLowerCase() === 'clear' || status.toLowerCase() === 'normal') {
            standardStatus = 'clear';
          } else if (status.toLowerCase() === 'carrier') {
            standardStatus = 'carrier';
          } else {
            standardStatus = 'affected';
          }
          
          // Add to health markers
          processedData.healthMarkers[test.testType || test.test_type] = {
            status: standardStatus,
            genotype,
            testDate: test.testDate || test.test_date,
            labName: test.labName || test.lab_name,
            certificateUrl: test.certificateUrl || test.certificate_url
          };
        }
      }
    });
  }
  
  return processedData;
}

export default useDogGenetics;
