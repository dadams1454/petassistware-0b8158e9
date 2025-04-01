
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileUp, 
  Upload, 
  FileSpreadsheet, 
  PlusCircle, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { useGeneticDataImport } from '@/hooks/useGeneticDataImport';
import { TestResult } from '@/types/genetics';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GeneticImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  onImportComplete?: () => void;
}

// Need to extend TestResult interface for the UI fields
interface ManualTestEntry extends Omit<TestResult, 'testId'> {
  importSource: string;
}

export const GeneticImportDialog: React.FC<GeneticImportDialogProps> = ({ 
  open, 
  onOpenChange, 
  dogId,
  onImportComplete 
}) => {
  const [activeTab, setActiveTab] = useState<string>('csv');
  const [csvData, setCsvData] = useState<string>('');
  const [manualTests, setManualTests] = useState<ManualTestEntry[]>([
    { testType: '', result: '', testDate: new Date().toISOString().split('T')[0], labName: '', importSource: 'manual' }
  ]);
  const [importResult, setImportResult] = useState<{success?: boolean; errors?: string[]}>({});
  
  const { isImporting, importFromCSV, importManualTests } = useGeneticDataImport(dogId);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };
  
  const handleCSVUpload = async () => {
    const result = await importFromCSV(csvData);
    setImportResult(result || {});
    
    if (result?.success && onImportComplete) {
      onImportComplete();
    }
  };
  
  const handleManualImport = async () => {
    // Filter out empty tests
    const validTests = manualTests.filter(test => test.testType && test.result);
    
    if (validTests.length === 0) {
      setImportResult({
        success: false,
        errors: ['Please provide at least one valid test with type and result']
      });
      return;
    }
    
    const result = await importManualTests(validTests);
    setImportResult(result || {});
    
    if (result?.success && onImportComplete) {
      onImportComplete();
    }
  };
  
  const handleAddTest = () => {
    setManualTests([
      ...manualTests,
      { testType: '', result: '', testDate: new Date().toISOString().split('T')[0], labName: '', importSource: 'manual' }
    ]);
  };
  
  const handleRemoveTest = (index: number) => {
    setManualTests(manualTests.filter((_, i) => i !== index));
  };
  
  const handleTestChange = (index: number, field: keyof ManualTestEntry, value: string) => {
    const updatedTests = [...manualTests];
    updatedTests[index] = {
      ...updatedTests[index],
      [field]: value
    };
    setManualTests(updatedTests);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset form state when dialog closes
      setCsvData('');
      setManualTests([{ testType: '', result: '', testDate: new Date().toISOString().split('T')[0], labName: '', importSource: 'manual' }]);
      setImportResult({});
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Genetic Test Results</DialogTitle>
          <DialogDescription>
            Upload genetic test results from a CSV file or enter them manually.
          </DialogDescription>
        </DialogHeader>
        
        {importResult.errors && importResult.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {importResult.errors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV Import
            </TabsTrigger>
            <TabsTrigger value="manual">
              <PlusCircle className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="py-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <div className="flex flex-col items-center">
                  <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-semibold mb-1">Upload CSV File</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    CSV should have columns: test_type, result, test_date, lab_name
                  </p>
                  
                  <div>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </div>
                      <input 
                        id="csv-upload" 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {csvData && (
                    <div className="mt-2 text-xs text-green-600">
                      File loaded! Ready to import.
                    </div>
                  )}
                </div>
              </div>
              
              {csvData && (
                <div className="border p-3 rounded-md overflow-auto max-h-[200px]">
                  <h3 className="text-sm font-semibold mb-2">CSV Preview:</h3>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{csvData}</pre>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="py-4">
            <div className="space-y-4">
              {manualTests.map((test, index) => (
                <div key={index} className="p-3 border rounded-md relative">
                  <button 
                    type="button"
                    onClick={() => handleRemoveTest(index)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold" htmlFor={`test-type-${index}`}>
                        Test Type*
                      </label>
                      <input
                        id={`test-type-${index}`}
                        type="text"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        value={test.testType}
                        onChange={(e) => handleTestChange(index, 'testType', e.target.value)}
                        placeholder="e.g., Hip Dysplasia"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold" htmlFor={`test-result-${index}`}>
                        Result*
                      </label>
                      <input
                        id={`test-result-${index}`}
                        type="text"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        value={test.result}
                        onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                        placeholder="e.g., Clear, Carrier, Affected"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold" htmlFor={`test-date-${index}`}>
                        Test Date
                      </label>
                      <input
                        id={`test-date-${index}`}
                        type="date"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        value={test.testDate}
                        onChange={(e) => handleTestChange(index, 'testDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold" htmlFor={`lab-name-${index}`}>
                        Lab Name
                      </label>
                      <input
                        id={`lab-name-${index}`}
                        type="text"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        value={test.labName || ''}
                        onChange={(e) => handleTestChange(index, 'labName', e.target.value)}
                        placeholder="e.g., Embark, OFA"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTest}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Test
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={activeTab === 'csv' ? handleCSVUpload : handleManualImport}
            disabled={isImporting || (activeTab === 'csv' && !csvData)}
          >
            {isImporting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Importing...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
