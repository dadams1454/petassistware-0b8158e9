
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna, Upload, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { batchImportGeneticTests } from '@/services/genetics/batchGeneticTests';

interface GeneticTestsManagerProps {
  dogId: string;
  dogName?: string;
}

export const GeneticTestsManager: React.FC<GeneticTestsManagerProps> = ({
  dogId,
  dogName
}) => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Add a test result to the list
  const addTestResult = () => {
    setTestResults([
      ...testResults,
      {
        id: `temp-${Date.now()}`,
        test_name: '',
        test_date: new Date().toISOString().split('T')[0],
        result: 'unknown',
        lab: '',
        notes: ''
      }
    ]);
  };

  // Remove a test result from the list
  const removeTestResult = (index: number) => {
    const newTests = [...testResults];
    newTests.splice(index, 1);
    setTestResults(newTests);
  };

  // Update a test result field
  const updateTestResult = (index: number, field: string, value: string) => {
    const newTests = [...testResults];
    newTests[index] = { ...newTests[index], [field]: value };
    setTestResults(newTests);
  };

  // Import from file (CSV, etc)
  const handleImportFromFile = () => {
    toast.info('File import functionality is not implemented yet');
  };

  // Save all pending test results
  const saveTestResults = async () => {
    if (testResults.length === 0) {
      toast.warning('No test results to save');
      return;
    }

    try {
      setLoading(true);

      // Format test data for import
      const formattedTests = testResults.map(test => ({
        dog_id: dogId,
        test_name: test.test_name,
        test_date: test.test_date,
        result: test.result,
        lab_name: test.lab,
        notes: test.notes
      }));

      // Use the batch import function
      const result = await batchImportGeneticTests(dogId, formattedTests);

      if (result.success) {
        toast.success(`Successfully imported ${testResults.length} genetic tests`);
        setTestResults([]);
      } else {
        throw new Error(result.error?.message || 'Failed to import genetic tests');
      }
    } catch (error) {
      console.error('Error saving genetic tests:', error);
      toast.error('Failed to save genetic test results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Dna className="mr-2 h-5 w-5" />
          Genetic Tests
          {dogName && <span className="text-sm text-muted-foreground ml-2">for {dogName}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button onClick={addTestResult} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Test
          </Button>
          <Button onClick={handleImportFromFile} variant="outline" size="sm">
            <Upload className="mr-1 h-4 w-4" />
            Import from File
          </Button>
        </div>

        {testResults.length > 0 ? (
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div key={test.id} className="border p-3 rounded-md">
                <div className="flex justify-between mb-2">
                  <h4 className="text-sm font-medium">Test {index + 1}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTestResult(index)}
                    className="h-6 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs">Test Name</label>
                    <input
                      type="text"
                      value={test.test_name}
                      onChange={(e) => updateTestResult(index, 'test_name', e.target.value)}
                      className="w-full p-2 text-sm rounded border mt-1"
                      placeholder="e.g., PRA, DM, vWD"
                    />
                  </div>

                  <div>
                    <label className="text-xs">Test Date</label>
                    <input
                      type="date"
                      value={test.test_date}
                      onChange={(e) => updateTestResult(index, 'test_date', e.target.value)}
                      className="w-full p-2 text-sm rounded border mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs">Result</label>
                    <select
                      value={test.result}
                      onChange={(e) => updateTestResult(index, 'result', e.target.value)}
                      className="w-full p-2 text-sm rounded border mt-1"
                    >
                      <option value="clear">Clear</option>
                      <option value="carrier">Carrier</option>
                      <option value="affected">Affected</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs">Testing Lab</label>
                    <input
                      type="text"
                      value={test.lab}
                      onChange={(e) => updateTestResult(index, 'lab', e.target.value)}
                      className="w-full p-2 text-sm rounded border mt-1"
                      placeholder="e.g., Embark, Wisdom Panel"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs">Notes</label>
                    <textarea
                      value={test.notes}
                      onChange={(e) => updateTestResult(index, 'notes', e.target.value)}
                      className="w-full p-2 text-sm rounded border mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button onClick={saveTestResults} disabled={loading}>
                {loading ? 'Saving...' : 'Save All Tests'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Dna className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No genetic tests added yet.</p>
            <p className="text-sm mt-1">Click "Add Test" to start recording genetic test results.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneticTestsManager;
