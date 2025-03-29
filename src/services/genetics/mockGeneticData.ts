
import { DogGenotype } from '@/types/genetics';

/**
 * Get mock genetic data for demo purposes
 * This will be replaced by real API calls in production
 */
export function getMockGeneticData(dogId: string): any {
  // Mock data for different dogs (used for demo only)
  const mockData: Record<string, any> = {
    // Dog 1: Bella (female, carrier for DM)
    'dog1': {
      dogId: 'dog1',
      name: 'Bella',
      tests: [
        {
          testId: 'test1',
          testType: 'DM',
          testDate: '2023-03-15',
          result: 'Carrier (A/N)',
          labName: 'Animal Genetics'
        },
        {
          testId: 'test2',
          testType: 'Cystinuria',
          testDate: '2023-03-15',
          result: 'Clear (N/N)',
          labName: 'Animal Genetics'
        },
        {
          testId: 'test3',
          testType: 'DCM',
          testDate: '2023-01-10',
          result: 'Clear (N/N)',
          labName: 'Embark'
        },
        {
          testId: 'test4',
          testType: 'Color Panel',
          testDate: '2023-01-10',
          result: 'E/e, B/b, D/D, a/a',
          labName: 'Embark'
        }
      ]
    },
    
    // Dog 2: Max (male, carrier for DM)
    'dog2': {
      dogId: 'dog2',
      name: 'Max',
      tests: [
        {
          testId: 'test5',
          testType: 'DM',
          testDate: '2023-03-10',
          result: 'Carrier (A/N)',
          labName: 'Animal Genetics'
        },
        {
          testId: 'test6',
          testType: 'vWD',
          testDate: '2023-03-10',
          result: 'Clear (N/N)',
          labName: 'Animal Genetics'
        },
        {
          testId: 'test7',
          testType: 'PRA',
          testDate: '2023-02-20',
          result: 'Clear (N/N)',
          labName: 'Paw Print Genetics'
        },
        {
          testId: 'test8',
          testType: 'Color Panel',
          testDate: '2023-02-20',
          result: 'E/E, B/B, D/d, a/a',
          labName: 'Paw Print Genetics'
        }
      ]
    },
    
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
