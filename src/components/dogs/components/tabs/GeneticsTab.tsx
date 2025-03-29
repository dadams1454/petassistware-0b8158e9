
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDogGenetics } from '@/hooks/useDogGenetics';
import { DogGenotypeCard } from '@/components/genetics/DogGenotypeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Edit, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateForDisplay } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";

export interface GeneticsTabProps {
  dogId: string;
  dogName?: string;
}

interface GeneticTest {
  testId: string;
  testType: string;
  testDate: string;
  result: string;
  labName: string;
  certificateUrl?: string;
}

const GeneticsTab: React.FC<GeneticsTabProps> = ({ dogId, dogName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const { geneticData, loading, error, refresh } = useDogGenetics(dogId);
  
  const navigateToPairingTool = () => {
    navigate('/genetics/pairing');
  };

  const handleAddTest = (test: GeneticTest) => {
    // In a real implementation, this would call an API to save the test
    console.log('Adding test:', test);
    toast({
      title: "Test added",
      description: `${test.testType} test has been added successfully.`,
    });
    refresh();
    setShowAddTestModal(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <DogGenotypeCard dogId={dogId} showHealthTests showColorTraits />
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Genetic Tests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : error || !geneticData ? (
                <div className="text-center p-4">
                  <AlertCircle className="mx-auto h-8 w-8 text-orange-500 mb-2" />
                  <p className="text-sm text-gray-600">No genetic tests recorded for this dog.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowAddTestModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Test Results
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {geneticData.testResults.map((test, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{test.testType}</div>
                          <div className="text-sm text-gray-500">
                            {test.labName} • {formatDateForDisplay(test.testDate)}
                          </div>
                        </div>
                        <Badge variant="outline">{test.result.split(' ')[0]}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAddTestModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Test Results
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Breeding Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Analyze genetic compatibility with potential mates to predict offspring traits
              and assess health risks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={navigateToPairingTool}>
                Find Compatible Matches
              </Button>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Genetic Information
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Test Modal */}
      <AddTestModal 
        open={showAddTestModal} 
        onClose={() => setShowAddTestModal(false)} 
        onSave={handleAddTest}
        dogId={dogId}
        dogName={dogName}
      />
    </div>
  );
};

interface AddTestModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (test: GeneticTest) => void;
  dogId: string;
  dogName?: string;
}

const AddTestModal: React.FC<AddTestModalProps> = ({ open, onClose, onSave, dogId, dogName }) => {
  const [testType, setTestType] = useState('');
  const [result, setResult] = useState('');
  const [labName, setLabName] = useState('');
  const [testDate, setTestDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTest: GeneticTest = {
      testId: `test_${Date.now()}`,
      testType,
      result,
      labName,
      testDate
    };
    
    onSave(newTest);
    resetForm();
  };

  const resetForm = () => {
    setTestType('');
    setResult('');
    setLabName('');
    setTestDate(new Date().toISOString().split('T')[0]);
  };

  // Common test types for dogs
  const testTypes = [
    'Color Panel',
    'DM (Degenerative Myelopathy)',
    'DCM (Dilated Cardiomyopathy)',
    'Cystinuria',
    'vWD (von Willebrand Disease)',
    'PRA (Progressive Retinal Atrophy)',
    'OFA Hips',
    'OFA Elbows',
    'OFA Heart',
    'OFA Patella'
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Genetic Test</DialogTitle>
            <DialogDescription>
              Add genetic test results for {dogName || "this dog"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testType" className="text-right">
                Test Type
              </Label>
              <div className="col-span-3">
                <select
                  id="testType"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a test type...</option>
                  {testTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="Other">Other...</option>
                </select>
                {testType === 'Other' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom test type"
                    onChange={(e) => setTestType(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="result" className="text-right">
                Result
              </Label>
              <Input
                id="result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Clear (N/N), Carrier (A/N), E/e, B/b"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lab" className="text-right">
                Testing Lab
              </Label>
              <Input
                id="lab"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Animal Genetics, Embark, OFA"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testDate" className="text-right">
                Test Date
              </Label>
              <Input
                id="testDate"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Test</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GeneticsTab;
