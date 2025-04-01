
import { supabase } from '@/integrations/supabase/client';
import { TestResult } from '@/types/genetics';
import { toast } from 'sonner';

export interface GeneticTestBatch {
  dogId: string;
  tests: Omit<TestResult, 'testId'>[];
  source: string;
}

export const batchImportGeneticTests = async (batch: GeneticTestBatch): Promise<{ success: boolean, count: number, errors?: string[] }> => {
  try {
    const { dogId, tests, source } = batch;
    
    if (!tests.length) {
      return { success: false, count: 0, errors: ['No tests provided'] };
    }
    
    // Convert the test array to the format expected by the database
    const testsToInsert = tests.map(test => ({
      dog_id: dogId,
      test_type: test.testType,
      test_date: test.testDate,
      result: test.result,
      lab_name: test.labName || 'Unknown',
      certificate_url: test.certificateUrl,
      verified: false,
      import_source: source || 'manual'
    }));
    
    // Insert all tests in a batch
    const { data, error } = await supabase
      .from('dog_genetic_tests')
      .insert(testsToInsert)
      .select();
    
    if (error) {
      console.error('Error inserting genetic tests:', error);
      return { 
        success: false, 
        count: 0, 
        errors: [error.message] 
      };
    }
    
    // Create a record in the genetic_data table to indicate an import occurred
    const { error: importError } = await supabase
      .from('genetic_data')
      .upsert({
        dog_id: dogId,
        import_source: source,
        imported_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'dog_id' });
    
    if (importError) {
      console.error('Error recording genetic import:', importError);
    }
    
    // Add an audit log entry
    const { error: auditError } = await supabase
      .from('genetic_audit_logs')
      .insert({
        dog_id: dogId,
        action: 'import',
        details: {
          source,
          test_count: testsToInsert.length,
          test_types: testsToInsert.map(t => t.test_type)
        }
      });
    
    if (auditError) {
      console.error('Error recording genetic audit log:', auditError);
    }
    
    return {
      success: true,
      count: testsToInsert.length
    };
  } catch (error) {
    console.error('Unexpected error in batchImportGeneticTests:', error);
    return { 
      success: false, 
      count: 0, 
      errors: [(error as Error).message] 
    };
  }
};

export const importGeneticTestsFromCSV = async (dogId: string, csvText: string): Promise<{ success: boolean, count: number, errors?: string[] }> => {
  try {
    // Parse CSV text
    const rows = csvText.split('\n');
    if (rows.length <= 1) {
      return { success: false, count: 0, errors: ['CSV file is empty or has only headers'] };
    }
    
    // Get headers from first row
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    
    // Required columns
    const requiredColumns = ['test_type', 'result'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return { 
        success: false, 
        count: 0, 
        errors: [`CSV is missing required columns: ${missingColumns.join(', ')}`] 
      };
    }
    
    // Map CSV columns to test objects
    const tests: Omit<TestResult, 'testId'>[] = [];
    const errors: string[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row.trim()) continue; // Skip empty rows
      
      const values = row.split(',').map(v => v.trim());
      
      // Create an object from headers and values
      const rowObj: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowObj[header] = values[index] || '';
      });
      
      // Validate required fields
      if (!rowObj.test_type || !rowObj.result) {
        errors.push(`Row ${i}: Missing required test_type or result`);
        continue;
      }
      
      // Map to test object
      tests.push({
        testType: rowObj.test_type,
        result: rowObj.result,
        testDate: rowObj.test_date || new Date().toISOString().split('T')[0],
        labName: rowObj.lab_name || 'CSV Import',
        certificateUrl: rowObj.certificate_url || null,
        importSource: 'csv'
      });
    }
    
    if (tests.length === 0) {
      return { 
        success: false, 
        count: 0, 
        errors: errors.length ? errors : ['No valid tests found in CSV'] 
      };
    }
    
    // Import the parsed tests
    const result = await batchImportGeneticTests({
      dogId,
      tests,
      source: 'csv'
    });
    
    return {
      ...result,
      errors: [...(result.errors || []), ...errors]
    };
  } catch (error) {
    console.error('Error importing from CSV:', error);
    return { 
      success: false, 
      count: 0, 
      errors: [(error as Error).message] 
    };
  }
};
