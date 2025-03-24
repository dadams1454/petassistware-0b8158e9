
import { createTestDogs } from './testData/dogGenerator';
import { createTestCustomers } from './testData/customerGenerator';
import { createTestLitter } from './testData/litterGenerator';

/**
 * Creates test data in the database for demonstration purposes
 */
export const generateTestData = async (): Promise<{
  success: boolean;
  message: string;
  dogIds?: string[];
  customerIds?: string[];
}> => {
  try {
    console.log('Starting test data generation...');
    
    // Step 1: Create dogs with health records
    const dogIds = await createTestDogs();
    
    // Step 2: Create customers
    const customerIds = await createTestCustomers();
    
    // Step 3: Create litter and puppies
    await createTestLitter(dogIds);
    
    return {
      success: true,
      message: 'Test data successfully generated!',
      dogIds,
      customerIds
    };
    
  } catch (error) {
    console.error('Error generating test data:', error);
    return {
      success: false,
      message: `Error generating test data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
