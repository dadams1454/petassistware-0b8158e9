
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Plus, Upload, RefreshCw, Download } from 'lucide-react';
import { batchImportGeneticTests } from '@/services/genetics/fetchGeneticData';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../utils/healthUtils';

interface GeneticTestsManagerProps {
  dogId: string;
  dogName?: string;
}

export const GeneticTestsManager: React.FC<GeneticTestsManagerProps> = ({ dogId, dogName }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [batchFileContent, setBatchFileContent] = useState<string>('');

  // Fetch genetic tests from the real database
  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['genetic-tests', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dog_genetic_tests')
        .select('*')
        .eq('dog_id', dogId)
        .order('test_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Mutation for adding/updating a test
  const mutation = useMutation({
    mutationFn: async (testData: any) => {
      if (testData.id) {
        // Update existing test
        const { data, error } = await supabase
          .from('dog_genetic_tests')
          .update(testData)
          .eq('id', testData.id);
        
        if (error) throw error;
        return data;
      } else {
        // Add new test
        const { data, error } = await supabase
          .from('dog_genetic_tests')
          .insert({
            ...testData,
            dog_id: dogId,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['genetic-tests', dogId] });
      setIsAddDialogOpen(false);
      setSelectedTest(null);
      toast({
        title: "Test saved",
        description: "Genetic test has been successfully saved."
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving test",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  });

  // Mutation for batch import
  const batchImportMutation = useMutation({
    mutationFn: async () => {
      // Parse CSV or JSON data
      let testsToImport = [];
      try {
        if (batchFileContent.trim().startsWith('[')) {
          // Assume JSON
          testsToImport = JSON.parse(batchFileContent);
        } else {
          // Assume CSV
          const lines = batchFileContent.split('\n');
          const headers = lines[0].split(',');
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            const test: any = { dog_id: dogId };
            
            headers.forEach((header, index) => {
              test[header.trim()] = values[index]?.trim();
            });
            
            testsToImport.push(test);
          }
        }
        
        return await batchImportGeneticTests(testsToImport);
      } catch (error) {
        throw new Error(`Failed to parse import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genetic-tests', dogId] });
      setIsBatchImportOpen(false);
      setBatchFileContent('');
      toast({
        title: "Import successful",
        description: "Genetic tests have been successfully imported."
      });
    },
    onError: (error) => {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  });

  // Handle test form submission
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const testData: any = {
      test_type: formData.get('test_type') as string,
      test_date: formData.get('test_date') as string,
      result: formData.get('result') as string,
      lab_name: formData.get('lab_name') as string,
      certificate_url: formData.get('certificate_url') as string || null,
    };
    
    if (selectedTest?.id) {
      testData.id = selectedTest.id;
    }
    
    mutation.mutate(testData);
  };

  // Handle file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setBatchFileContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  // Export tests as CSV
  const handleExport = () => {
    if (!tests?.length) return;
    
    // Create CSV header
    const headers = ['test_type', 'test_date', 'result', 'lab_name', 'certificate_url'];
    let csv = headers.join(',') + '\n';
    
    // Add data rows
    tests.forEach(test => {
      const row = headers.map(header => {
        const value = test[header as keyof typeof test] || '';
        // Quote the value if it contains a comma
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csv += row.join(',') + '\n';
    });
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dogName || 'dog'}_genetic_tests.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: "Genetic tests have been exported to CSV."
    });
  };

  return (
    <div className="space-y-4">
      {/* Actions toolbar */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsBatchImportOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Batch Import
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          disabled={!tests?.length}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button 
          size="sm" 
          onClick={() => {
            setSelectedTest(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Test
        </Button>
      </div>
      
      {/* Tests list */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Genetic Tests</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['genetic-tests', dogId] })}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : error || !tests?.length ? (
            <div className="text-center p-4">
              <AlertCircle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
              <p className="text-sm text-gray-600">No genetic tests found for this dog.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {tests.map((test) => (
                  <div 
                    key={test.id} 
                    className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-50 rounded p-2"
                    onClick={() => {
                      setSelectedTest(test);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <div>
                      <div className="font-medium">{test.test_type}</div>
                      <div className="text-sm text-gray-500">
                        {test.lab_name} • {formatDate(test.test_date)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{test.result.split(' ')[0]}</Badge>
                      {test.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Test Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTest ? 'Edit Genetic Test' : 'Add Genetic Test'}</DialogTitle>
            <DialogDescription>
              {selectedTest 
                ? `Edit the genetic test details for ${dogName || 'this dog'}.` 
                : `Add a new genetic test for ${dogName || 'this dog'}.`}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveTest}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test_type" className="text-right">Test Type</Label>
                <div className="col-span-3">
                  <Select 
                    name="test_type" 
                    defaultValue={selectedTest?.test_type || ""}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Color Panel">Color Panel</SelectItem>
                      <SelectItem value="DM (Degenerative Myelopathy)">DM (Degenerative Myelopathy)</SelectItem>
                      <SelectItem value="DCM (Dilated Cardiomyopathy)">DCM (Dilated Cardiomyopathy)</SelectItem>
                      <SelectItem value="Cystinuria">Cystinuria</SelectItem>
                      <SelectItem value="vWD (von Willebrand Disease)">vWD (von Willebrand Disease)</SelectItem>
                      <SelectItem value="PRA (Progressive Retinal Atrophy)">PRA (Progressive Retinal Atrophy)</SelectItem>
                      <SelectItem value="OFA Hips">OFA Hips</SelectItem>
                      <SelectItem value="OFA Elbows">OFA Elbows</SelectItem>
                      <SelectItem value="OFA Heart">OFA Heart</SelectItem>
                      <SelectItem value="OFA Patella">OFA Patella</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="test_date" className="text-right">Test Date</Label>
                <Input
                  id="test_date"
                  name="test_date"
                  type="date"
                  defaultValue={selectedTest?.test_date || new Date().toISOString().split('T')[0]}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="result" className="text-right">Result</Label>
                <Input
                  id="result"
                  name="result"
                  defaultValue={selectedTest?.result || ""}
                  className="col-span-3"
                  placeholder="e.g., Clear (N/N), Carrier (A/N), E/e, B/b"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lab_name" className="text-right">Testing Lab</Label>
                <Input
                  id="lab_name"
                  name="lab_name"
                  defaultValue={selectedTest?.lab_name || ""}
                  className="col-span-3"
                  placeholder="e.g., Animal Genetics, Embark, OFA"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="certificate_url" className="text-right">Certificate URL</Label>
                <Input
                  id="certificate_url"
                  name="certificate_url"
                  type="url"
                  defaultValue={selectedTest?.certificate_url || ""}
                  className="col-span-3"
                  placeholder="https://example.com/certificate"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedTest(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Test'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Batch Import Dialog */}
      <Dialog open={isBatchImportOpen} onOpenChange={setIsBatchImportOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Batch Import Genetic Tests</DialogTitle>
            <DialogDescription>
              Upload a CSV or JSON file with genetic test data to import multiple tests at once.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="import_file">Upload File (CSV or JSON)</Label>
              <Input
                id="import_file"
                type="file"
                accept=".csv,.json"
                onChange={handleFileImport}
              />
              <p className="text-xs text-gray-500">
                CSV should include headers: test_type, test_date, result, lab_name, certificate_url
              </p>
            </div>
            
            {batchFileContent && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="max-h-[200px] overflow-y-auto p-2 border rounded text-xs font-mono">
                  {batchFileContent.split('\n').slice(0, 10).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  {batchFileContent.split('\n').length > 10 && '...'}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsBatchImportOpen(false);
                setBatchFileContent('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => batchImportMutation.mutate()}
              disabled={!batchFileContent || batchImportMutation.isPending}
            >
              {batchImportMutation.isPending ? 'Importing...' : 'Import Tests'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeneticTestsManager;
