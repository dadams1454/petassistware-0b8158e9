
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna, Upload, Plus, Trash, FileUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { batchImportGeneticTests } from '@/services/genetics/batchGeneticTests';
import { GeneticImportDialog } from './GeneticImportDialog';
import { GeneticImportResult } from '@/types/genetics';

interface GeneticTestsManagerProps {
  dogId: string;
  dogName?: string;
  onDataChanged?: () => void;
}

export const GeneticTestsManager: React.FC<GeneticTestsManagerProps> = ({
  dogId,
  dogName,
  onDataChanged
}) => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [existingTests, setExistingTests] = useState<any[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  // Load existing tests when component mounts
  useEffect(() => {
    if (dogId) {
      fetchExistingTests();
    }
  }, [dogId]);

  const fetchExistingTests = async () => {
    try {
      setIsLoadingExisting(true);
      const { data, error } = await fetch(`/api/genetics/fetch-tests?dogId=${dogId}`)
        .then(res => res.json());
      
      if (error) throw new Error(error.message);
      
      setExistingTests(data || []);
    } catch (error) {
      console.error('Error fetching existing tests:', error);
      toast.error('Failed to load existing genetic tests');
    } finally {
      setIsLoadingExisting(false);
    }
  };

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

  // Handle import completion
  const handleImportComplete = (result: GeneticImportResult) => {
    if (result.success) {
      // Refresh the list of existing tests
      fetchExistingTests();
      
      // Notify parent component of data change
      if (onDataChanged) {
        onDataChanged();
      }
    }
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
        fetchExistingTests();
        
        // Notify parent component of data change
        if (onDataChanged) {
          onDataChanged();
        }
      } else {
        throw new Error(result.errors?.[0] || 'Failed to import genetic tests');
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
          <Button onClick={() => setIsImportDialogOpen(true)} variant="outline" size="sm">
            <FileUp className="mr-1 h-4 w-4" />
            Import from Provider
          </Button>
          <Button onClick={fetchExistingTests} variant="ghost" size="sm" disabled={isLoadingExisting}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoadingExisting ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {existingTests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Existing Test Results</h3>
            <div className="space-y-2">
              {existingTests.map((test) => (
                <div key={test.id} className="border p-3 rounded-md bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{test.test_type}</h4>
                      <div className="text-xs text-muted-foreground">
                        <span>Result: <span className={
                          test.result.toLowerCase().includes('clear') ? 'text-green-600' :
                          test.result.toLowerCase().includes('carrier') ? 'text-amber-600' :
                          test.result.toLowerCase().includes('affected') ? 'text-red-600' : ''
                        }>{test.result}</span></span>
                        <span className="mx-2">•</span>
                        <span>Date: {new Date(test.test_date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>Lab: {test.lab_name}</span>
                      </div>
                    </div>
                    {test.verified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {testResults.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">New Test Results</h3>
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
          !existingTests.length && (
            <div className="text-center py-8 text-muted-foreground">
              <Dna className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p>No genetic tests added yet.</p>
              <p className="text-sm mt-1">Click "Add Test" to start recording genetic test results.</p>
            </div>
          )
        )}

        <GeneticImportDialog 
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          dogId={dogId}
          onImportComplete={handleImportComplete}
        />
      </CardContent>
    </Card>
  );
};

export default GeneticTestsManager;
