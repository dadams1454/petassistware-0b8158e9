
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Plus, RefreshCw } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { EmptyState, SkeletonLoader } from '@/components/ui/standardized';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { fetchDogMedications } from '@/services/medicationService';
import { MedicationRecord } from '@/types/medication';
import MedicationForm from '@/components/dogs/components/care/medication/MedicationForm';
import MedicationsList from '@/components/dogs/components/care/medication/MedicationsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface MedicationsTabProps {
  dogStatuses: DogCareStatus[];
  onRefreshDogs: () => void;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [editingMedicationId, setEditingMedicationId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Add a small delay to create a nicer loading transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch all medication records
  const { data: medicationRecords, isLoading } = useQuery({
    queryKey: ['medicationRecords', refreshTrigger],
    queryFn: async () => {
      if (!dogStatuses || dogStatuses.length === 0) return [];
      
      const dogIds = dogStatuses.map(dog => dog.dog_id);
      try {
        // Fetch medications for each dog and combine
        const medicationsPromises = dogIds.map(dogId => fetchDogMedications(dogId));
        const medicationsByDog = await Promise.all(medicationsPromises);
        return medicationsByDog.flat();
      } catch (error) {
        console.error('Error fetching medication records:', error);
        return [];
      }
    },
    enabled: Array.isArray(dogStatuses) && dogStatuses.length > 0
  });

  // Check if dogStatuses is actually an array
  const hasDogs = Array.isArray(dogStatuses) && dogStatuses.length > 0;
  const hasMedications = Array.isArray(medicationRecords) && medicationRecords.length > 0;
  
  // Handler functions must return Promise<void> to match expected type
  const handleRefresh = async (): Promise<void> => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleMedicationAdded = async (): Promise<void> => {
    setShowAddMedication(false);
    handleRefresh();
    toast({
      title: "Medication Added",
      description: "New medication record has been successfully added."
    });
  };

  const handleMedicationDeleted = async (): Promise<void> => {
    handleRefresh();
    toast({
      title: "Medication Deleted",
      description: "The medication record has been successfully deleted."
    });
  };

  const handleOpenAddMedication = (dogId: string) => {
    setSelectedDogId(dogId);
    setEditingMedicationId(null);
    setShowAddMedication(true);
  };
  
  const handleEditMedication = (medicationId: string) => {
    setEditingMedicationId(medicationId);
    setShowAddMedication(true);
  };

  return (
    <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Medications</h2>
        <p className="text-muted-foreground mb-4">Track and manage medications for your dogs</p>
      </div>
      
      {isLoading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : !hasDogs ? (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Pill className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Dogs Found</h3>
              <p className="text-muted-foreground mb-4">Add dogs to start tracking medications</p>
              <Button onClick={onRefreshDogs} variant="outline">Refresh Dogs</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Medication list card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-blue-500" />
                  <span>Medication List</span>
                </div>
                <Button size="sm" onClick={() => handleOpenAddMedication(dogStatuses[0].dog_id)} className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Medication
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasMedications ? (
                <EmptyState
                  title="No Medication Records"
                  description="Add medication records to see them here"
                  action={{
                    label: "Add Medication",
                    onClick: () => handleOpenAddMedication(dogStatuses[0].dog_id)
                  }}
                />
              ) : (
                <MedicationsList 
                  medications={medicationRecords || []}
                  onRefresh={handleRefresh}
                  onEdit={handleEditMedication}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Add Medication Dialog */}
      <Dialog open={showAddMedication} onOpenChange={setShowAddMedication}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMedicationId ? 'Edit Medication' : 'Add New Medication'}
            </DialogTitle>
            <DialogDescription>
              {editingMedicationId 
                ? 'Edit the medication details below.'
                : 'Add a new medication record for a dog.'}
            </DialogDescription>
          </DialogHeader>
          {selectedDogId && (
            <MedicationForm 
              dogId={selectedDogId}
              existingMedication={
                editingMedicationId 
                  ? medicationRecords?.find(med => med.id === editingMedicationId) 
                  : undefined
              }
              onSuccess={handleMedicationAdded}
              onCancel={() => setShowAddMedication(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsTab;
