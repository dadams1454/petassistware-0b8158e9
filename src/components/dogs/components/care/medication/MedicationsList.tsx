
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useConfirm } from '@/hooks/useConfirm';
import { useUser } from '@/contexts/UserContext';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Check, 
  Clock, 
  Edit, 
  Pill, 
  Plus, 
  Repeat,
  Trash,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { MedicationRecord, MedicationFormData, MedicationFrequency, MedicationStatus, MedicationType } from '@/types/medication';
import { deleteMedicationRecord, recordMedicationAdministration } from '@/services/medicationService';
import MedicationForm from './MedicationForm';

interface MedicationsListProps {
  dogId: string;
  medications: MedicationRecord[];
  onRefresh: () => Promise<void>;
  height?: string;
}

const MedicationsList: React.FC<MedicationsListProps> = ({
  dogId,
  medications,
  onRefresh,
  height = 'h-[400px]'
}) => {
  const { toast } = useToast();
  const { showConfirmation } = useConfirm();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<MedicationRecord | null>(null);
  const [expandedMedicationId, setExpandedMedicationId] = useState<string | null>(null);

  // Group medications by status
  const activeMedications = medications.filter(med => !med.end_date || new Date(med.end_date) >= new Date());
  const completedMedications = medications.filter(med => med.end_date && new Date(med.end_date) < new Date());
  
  // Filter medications based on active tab
  const getMedicationsForTab = () => {
    switch (activeTab) {
      case 'active':
        return activeMedications;
      case 'completed':
        return completedMedications;
      case 'all':
      default:
        return medications;
    }
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditClick = (medication: MedicationRecord) => {
    setSelectedMedication(medication);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (medication: MedicationRecord) => {
    showConfirmation({
      title: 'Delete Medication',
      description: `Are you sure you want to delete ${medication.medication_name}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteMedicationRecord(medication.id);
          toast({
            title: 'Medication Deleted',
            description: `${medication.medication_name} has been removed from the medication list.`
          });
          onRefresh();
        } catch (error) {
          console.error('Error deleting medication:', error);
          toast({
            title: 'Error',
            description: 'Failed to delete medication',
            variant: 'destructive'
          });
        }
      }
    });
  };

  const handleAdministerClick = (medication: MedicationRecord) => {
    showConfirmation({
      title: 'Administer Medication',
      description: `Mark ${medication.medication_name} as administered? This will record it and update the next due date.`,
      confirmLabel: 'Confirm',
      onConfirm: async () => {
        try {
          if (!user) {
            toast({
              title: 'Error',
              description: 'You must be logged in to administer medications',
              variant: 'destructive'
            });
            return;
          }
          
          await recordMedicationAdministration(
            medication.id,
            new Date(),
            'Administered on schedule',
            user.id
          );
          
          toast({
            title: 'Medication Administered',
            description: `${medication.medication_name} has been marked as administered.`
          });
          
          onRefresh();
        } catch (error) {
          console.error('Error administering medication:', error);
          toast({
            title: 'Error',
            description: 'Failed to record medication administration',
            variant: 'destructive'
          });
        }
      }
    });
  };

  const getMedicationTypeLabel = (type: MedicationType) => {
    switch (type) {
      case MedicationType.PREVENTATIVE:
        return 'Preventative';
      case MedicationType.PRESCRIPTION:
        return 'Prescription';
      case MedicationType.SUPPLEMENT:
        return 'Supplement';
      case MedicationType.TREATMENT:
        return 'Treatment';
      case MedicationType.VACCINE:
        return 'Vaccine';
      default:
        return type;
    }
  };

  const getMedicationFrequencyLabel = (frequency: MedicationFrequency) => {
    switch (frequency) {
      case MedicationFrequency.DAILY:
        return 'Daily';
      case MedicationFrequency.TWICE_DAILY:
        return 'Twice Daily';
      case MedicationFrequency.WEEKLY:
        return 'Weekly';
      case MedicationFrequency.BIWEEKLY:
        return 'Biweekly';
      case MedicationFrequency.MONTHLY:
        return 'Monthly';
      case MedicationFrequency.QUARTERLY:
        return 'Quarterly';
      case MedicationFrequency.ANNUALLY:
        return 'Annually';
      case MedicationFrequency.AS_NEEDED:
        return 'As Needed';
      case MedicationFrequency.CUSTOM:
        return 'Custom';
      default:
        return frequency;
    }
  };

  const getMedicationTypeColor = (type: MedicationType) => {
    switch (type) {
      case MedicationType.PREVENTATIVE:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case MedicationType.PRESCRIPTION:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      case MedicationType.SUPPLEMENT:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case MedicationType.TREATMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case MedicationType.VACCINE:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getMedicationStatusColor = (med: MedicationRecord) => {
    const today = new Date();
    const nextDueDate = med.next_due_date ? new Date(med.next_due_date) : null;
    const endDate = med.end_date ? new Date(med.end_date) : null;
    
    if (endDate && endDate < today) {
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
    
    if (nextDueDate && nextDueDate < today) {
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
    }
    
    // If due in next 3 days
    if (nextDueDate) {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      if (nextDueDate <= threeDaysFromNow) {
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      }
    }
    
    return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
  };

  const getMedicationStatus = (med: MedicationRecord) => {
    const today = new Date();
    const nextDueDate = med.next_due_date ? new Date(med.next_due_date) : null;
    const endDate = med.end_date ? new Date(med.end_date) : null;
    
    if (endDate && endDate < today) {
      return 'Completed';
    }
    
    if (nextDueDate && nextDueDate < today) {
      return 'Overdue';
    }
    
    // If due in next 3 days
    if (nextDueDate) {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      if (nextDueDate <= threeDaysFromNow) {
        return 'Due soon';
      }
    }
    
    return 'Active';
  };

  const medications_by_tab = getMedicationsForTab();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Medications</CardTitle>
            <CardDescription>
              {medications.length} medication{medications.length !== 1 ? 's' : ''}
              {activeMedications.length > 0 && ` (${activeMedications.length} active)`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-1" />
            Add Medication
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <ScrollArea className={height}>
            <div className="space-y-4">
              {medications_by_tab.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No medications found
                </div>
              ) : (
                medications_by_tab.map(med => (
                  <Collapsible 
                    key={med.id}
                    open={expandedMedicationId === med.id} 
                    onOpenChange={() => setExpandedMedicationId(expandedMedicationId === med.id ? null : med.id)}
                  >
                    <div className={`border rounded-lg p-4 ${expandedMedicationId === med.id ? 'border-primary' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium text-base mr-2">{med.medication_name}</h3>
                            <Badge variant="outline" className={getMedicationTypeColor(med.medication_type)}>
                              {getMedicationTypeLabel(med.medication_type)}
                            </Badge>
                            <Badge variant="outline" className={`ml-2 ${getMedicationStatusColor(med)}`}>
                              {getMedicationStatus(med)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center mb-1">
                            <Repeat className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {getMedicationFrequencyLabel(med.frequency)}
                            </span>
                            
                            {med.next_due_date && (
                              <>
                                <Calendar className="h-3.5 w-3.5 ml-4 mr-1.5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Next: {format(new Date(med.next_due_date), "MMM d, yyyy")}
                                </span>
                              </>
                            )}
                          </div>
                          
                          {med.dosage && (
                            <div className="flex items-center">
                              <Pill className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {med.dosage} {med.dosage_unit || ''}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2">
                            {expandedMedicationId === med.id ? 'Less' : 'More'}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium">Details</h4>
                              <div className="mt-1 space-y-1 text-sm">
                                <p><span className="font-medium">Started:</span> {format(new Date(med.start_date || med.timestamp), "MMM d, yyyy")}</p>
                                {med.end_date && <p><span className="font-medium">Ends:</span> {format(new Date(med.end_date), "MMM d, yyyy")}</p>}
                                {med.route && <p><span className="font-medium">Route:</span> {med.route}</p>}
                                {med.medication_type === MedicationType.PRESCRIPTION && (
                                  <>
                                    {med.prescription_id && <p><span className="font-medium">Prescription:</span> {med.prescription_id}</p>}
                                    {med.refills_remaining !== undefined && <p><span className="font-medium">Refills:</span> {med.refills_remaining}</p>}
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {med.notes && (
                              <div>
                                <h4 className="text-sm font-medium">Notes</h4>
                                <p className="text-sm mt-1">{med.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAdministerClick(med)}
                              disabled={getMedicationStatus(med) === 'Completed'}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Administer
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditClick(med)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(med)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))
              )}
            </div>
          </ScrollArea>
        </Tabs>
        
        {/* Add Medication Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-md">
            <MedicationForm 
              dogId={dogId}
              onSuccess={() => {
                setAddDialogOpen(false);
                onRefresh();
              }}
              onCancel={() => setAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Medication Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedMedication && (
              <MedicationForm 
                dogId={dogId}
                existingMedication={selectedMedication}
                onSuccess={() => {
                  setEditDialogOpen(false);
                  setSelectedMedication(null);
                  onRefresh();
                }}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setSelectedMedication(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MedicationsList;
