
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, Pill, Check, Calendar, Trash2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePuppyMedications } from '@/hooks/usePuppyMedications';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import MedicationForm from './MedicationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdministerMedicationForm from './AdministerMedicationForm';
import { Medication } from '@/types/health';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MedicationTrackerProps {
  puppyId: string;
  puppyWeight?: number;
  puppyWeightUnit?: string;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ 
  puppyId, 
  puppyWeight,
  puppyWeightUnit = 'lb'
}) => {
  const { 
    medications, 
    isLoading, 
    addMedication,
    deleteMedication,
    logMedicationAdministration,
    getMedicationStatus,
    calculateDosage
  } = usePuppyMedications(puppyId);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isAdministerDialogOpen, setIsAdministerDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const activeMedications = medications.filter(med => med.is_active);
  const inactiveMedications = medications.filter(med => !med.is_active);
  
  const handleAddMedication = async (formData: any) => {
    try {
      await addMedication({
        puppy_id: puppyId,
        medication_name: formData.medicationName,
        dosage: parseFloat(formData.dosage),
        dosage_unit: formData.dosageUnit,
        frequency: formData.frequency,
        start_date: formData.startDate,
        end_date: formData.endDate,
        administration_route: formData.administrationRoute,
        notes: formData.notes,
        is_active: true
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleDeleteMedication = async () => {
    if (!deleteId) return;
    
    try {
      await deleteMedication(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const handleAdministerMedication = async (formData: any) => {
    if (!selectedMedication) return;
    
    try {
      await logMedicationAdministration({
        medicationId: selectedMedication.id,
        administrationData: {
          administered_at: formData.administeredAt,
          administered_by: formData.administeredBy,
          notes: formData.notes
        }
      });
      setIsAdministerDialogOpen(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error logging medication administration:', error);
    }
  };

  const handleAdminister = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsAdministerDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate weight-adjusted dosages if weight is provided
  const getMedicationWithAdjustedDosage = (medication: Medication) => {
    if (!puppyWeight) return null;
    
    // Simple linear calculation - this is just an estimate
    const adjustedDosage = calculateDosage(
      medication.dosage,
      10, // assuming baseline weight of 10 units
      puppyWeight,
      medication.dosage_unit
    );
    
    return {
      ...medication,
      adjustedDosage,
      weightMultiplier: puppyWeight / 10
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Medication Tracker</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
            </DialogHeader>
            <MedicationForm 
              onSubmit={handleAddMedication}
              puppyWeight={puppyWeight}
              puppyWeightUnit={puppyWeightUnit}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              <Pill className="mr-2 h-4 w-4" />
              Active Medications 
              {activeMedications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeMedications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              Medication History
              {inactiveMedications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {inactiveMedications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeMedications.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Pill className="mx-auto h-10 w-10 opacity-20" />
                <p className="mt-2">No active medications.</p>
                <p className="text-sm">Add medications to track doses and schedule.</p>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                {activeMedications.map((medication) => {
                  const status = getMedicationStatus(medication);
                  const adjustedMed = getMedicationWithAdjustedDosage(medication);
                  
                  return (
                    <div 
                      key={medication.id} 
                      className="p-3 border rounded"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{medication.medication_name}</span>
                            <Badge className={status.statusColor}>
                              {status.statusLabel}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <span>
                                {medication.dosage} {medication.dosage_unit} ({medication.frequency})
                              </span>
                              <span>{medication.administration_route}</span>
                              {adjustedMed && (
                                <span className="text-primary-foreground bg-primary px-2 py-0.5 rounded-sm text-xs">
                                  Weight adjusted: {adjustedMed.adjustedDosage} {medication.dosage_unit}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 mt-1">
                              <span className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                Started: {format(new Date(medication.start_date), 'MMM d, yyyy')}
                              </span>
                              {medication.end_date && (
                                <span>
                                  Ends: {format(new Date(medication.end_date), 'MMM d, yyyy')}
                                </span>
                              )}
                              {medication.last_administered && (
                                <span>
                                  Last given: {format(new Date(medication.last_administered), 'MMM d, yyyy, h:mm a')}
                                </span>
                              )}
                            </div>
                          </div>
                          {medication.notes && (
                            <p className="text-sm mt-1">{medication.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleAdminister(medication)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Administer
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(medication.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {inactiveMedications.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="mx-auto h-10 w-10 opacity-20" />
                <p className="mt-2">No medication history.</p>
                <p className="text-sm">Completed medications will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                {inactiveMedications.map((medication) => (
                  <div 
                    key={medication.id} 
                    className="p-3 border rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{medication.medication_name}</span>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div>
                            {medication.dosage} {medication.dosage_unit} ({medication.frequency})
                          </div>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 mt-1">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {format(new Date(medication.start_date), 'MMM d, yyyy')}
                              {medication.end_date && (
                                <> - {format(new Date(medication.end_date), 'MMM d, yyyy')}</>
                              )}
                            </span>
                          </div>
                        </div>
                        {medication.notes && (
                          <p className="text-sm mt-1">{medication.notes}</p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(medication.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isAdministerDialogOpen} onOpenChange={setIsAdministerDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Administer Medication</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <>
              <div className="mb-4">
                <div className="font-medium">{selectedMedication.medication_name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedMedication.dosage} {selectedMedication.dosage_unit} - {selectedMedication.administration_route}
                </div>
                {puppyWeight && (
                  <div className="mt-2 flex items-center text-sm">
                    <AlertCircle className="mr-1 h-4 w-4 text-blue-500" />
                    <span>
                      Based on current weight ({puppyWeight} {puppyWeightUnit}), 
                      recommended dosage: {calculateDosage(
                        selectedMedication.dosage,
                        10, // baseline weight
                        puppyWeight,
                        selectedMedication.dosage_unit
                      )} {selectedMedication.dosage_unit}
                    </span>
                  </div>
                )}
              </div>
              <AdministerMedicationForm 
                onSubmit={handleAdministerMedication}
                medication={selectedMedication}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMedication}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MedicationTracker;
