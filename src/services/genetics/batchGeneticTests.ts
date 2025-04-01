
import { supabase } from '@/integrations/supabase/client';
import { GeneticImportResult } from '@/types/genetics';

/**
 * Batch import genetic tests for a dog
 */
export async function batchImportGeneticTests(dogId: string, testData: any[]): Promise<GeneticImportResult> {
  try {
    // Validate input data
    if (!dogId || !testData || !Array.isArray(testData) || testData.length === 0) {
      return {
        success: false,
        dogId,
        importDate: new Date().toISOString(),
        provider: 'manual',
        testsImported: 0,
        errors: ['Invalid input data']
      };
    }

    // Format the test data for insertion
    const formattedTests = testData.map(test => ({
      dog_id: dogId,
      test_type: test.test_name || test.test_type,
      test_date: test.test_date,
      result: test.result,
      lab_name: test.lab || test.lab_name || 'Unknown',
      certificate_url: test.certificate_url,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert the tests into the database
    const { data, error } = await supabase
      .from('dog_genetic_tests')
      .insert(formattedTests);

    if (error) {
      console.error('Error importing genetic tests:', error);
      return {
        success: false,
        dogId,
        importDate: new Date().toISOString(),
        provider: 'manual',
        testsImported: 0,
        errors: [error.message]
      };
    }

    // Log the genetic data import to the audit log
    try {
      await supabase
        .from('genetic_audit_logs')
        .insert({
          dog_id: dogId,
          action: 'import_tests',
          details: {
            count: formattedTests.length,
            method: 'batch_import',
            test_types: formattedTests.map(t => t.test_type)
          }
        });
    } catch (logError) {
      console.warn('Failed to log genetic test import:', logError);
    }

    return {
      success: true,
      dogId,
      importDate: new Date().toISOString(),
      provider: 'manual',
      testsImported: formattedTests.length
    };
  } catch (error) {
    console.error('Unexpected error during genetic test import:', error);
    return {
      success: false,
      dogId,
      importDate: new Date().toISOString(),
      provider: 'manual',
      testsImported: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Import genetic data from Embark file
 * This is a placeholder implementation for API integration
 */
export async function importEmbarkData(dogId: string, fileData: any): Promise<GeneticImportResult> {
  try {
    // In a real implementation, parse the Embark file format
    // For now, simulate a successful import with mock data
    
    const mockTests = [
      {
        test_name: 'Degenerative Myelopathy',
        test_date: new Date().toISOString().split('T')[0],
        result: 'clear',
        lab_name: 'Embark',
      },
      {
        test_name: 'Exercise-Induced Collapse',
        test_date: new Date().toISOString().split('T')[0],
        result: 'carrier',
        lab_name: 'Embark',
      },
      {
        test_name: 'Progressive Retinal Atrophy',
        test_date: new Date().toISOString().split('T')[0],
        result: 'clear',
        lab_name: 'Embark',
      }
    ];
    
    // Use the batch import function
    return await batchImportGeneticTests(dogId, mockTests);
  } catch (error) {
    console.error('Error importing Embark data:', error);
    return {
      success: false,
      dogId,
      importDate: new Date().toISOString(),
      provider: 'embark',
      testsImported: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Import genetic data from Wisdom Panel file
 * This is a placeholder implementation for API integration
 */
export async function importWisdomPanelData(dogId: string, fileData: any): Promise<GeneticImportResult> {
  try {
    // In a real implementation, parse the Wisdom Panel file format
    // For now, simulate a successful import with mock data
    
    const mockTests = [
      {
        test_name: 'MDR1 Medication Sensitivity',
        test_date: new Date().toISOString().split('T')[0],
        result: 'clear',
        lab_name: 'Wisdom Panel',
      },
      {
        test_name: 'Dilated Cardiomyopathy',
        test_date: new Date().toISOString().split('T')[0],
        result: 'clear',
        lab_name: 'Wisdom Panel',
      }
    ];
    
    // Use the batch import function
    return await batchImportGeneticTests(dogId, mockTests);
  } catch (error) {
    console.error('Error importing Wisdom Panel data:', error);
    return {
      success: false,
      dogId,
      importDate: new Date().toISOString(),
      provider: 'wisdom_panel',
      testsImported: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}
