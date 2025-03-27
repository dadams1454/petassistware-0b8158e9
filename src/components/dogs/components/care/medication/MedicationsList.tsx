import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Pill, Trash2, Calendar, Edit, Plus } from 'lucide-react';
import { MedicationRecord, MedicationFrequency, MedicationType } from '@/types/medication';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { deleteMedicationRecord, recordMedicationAdministration } from '@/services/medicationService';
import MedicationForm from './MedicationForm';

interface MedicationsListProps {
  medications: MedicationRecord[];
  dogId: string;
  onRefresh: () => void;
  hideAction?: boolean;
}

const MedicationsList: React.FC<MedicationsListProps> = ({
  medications,
  dogId,
  onRefresh,
  hideAction = false
}) => {
  const [selectedMedication, setSelectedMedication] = useState<MedicationRecord | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleEdit = (medication: MedicationRecord) => {
    setSelectedMedication(medication);
    setShowEditDialog(true);
  };

  const handleAddAdministration = (medication: MedicationRecord) => {
    setSelectedMedication(medication);
    setShowLogDialog(true);
  };

  const handleLogMedication = async (medication: MedicationRecord) => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }

    try {
      const now = new Date();
      const administrationData = {
        timestamp: now.toISOString(),
        administered_by: user.id,
        notes: `Administered on ${format(now, 'PPp')}`
      };
      
      await recordMedicationAdministration(medication.id, administrationData);
      
      toast({
        title: "Medication Logged",
        description: `Successfully recorded ${medication.medication_name} administration.`,
        variant: "default"
      });
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error logging medication:", error);
      toast({
        title: "Error",
        description: "Failed to record medication administration.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedMedication) return;

    setIsDeleting(true);
    try {
      await deleteMedicationRecord(selectedMedication.id);
      toast({
        title: "Medication Deleted",
        description: `${selectedMedication.medication_name} has been deleted successfully.`,
        variant: "default"
      });
      setShowDeleteAlert(false);
      setSelectedMedication(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Failed to delete medication.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {medications.map((medication) => (
          <Card key={medication.id} className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Pill className="mr-2 h-4 w-4 text-blue-500" />
                  <span>{medication.medication_name}</span>
                </div>
                <Badge variant="secondary">{medication.medication_type}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Dosage:</span> {medication.dosage} {medication.dosage_unit}
              </div>
              <div>
                <span className="font-medium">Frequency:</span> {medication.frequency}
              </div>
              {medication.next_due_date && (
                <div>
                  <span className="font-medium">Next Due:</span> {format(parseISO(medication.next_due_date), 'MMM d, yyyy')}
                </div>
              )}
              {medication.notes && (
                <div>
                  <span className="font-medium">Notes:</span> {medication.notes}
                </div>
              )}
            </CardContent>
            {!hideAction && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLogMedication(medication)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Log Med
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(medication)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => {
                    setSelectedMedication(medication);
                    setShowDeleteAlert(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setSelectedMedication(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Medication Dialog */}
      <Dialog open={showEditDialog} onOpenChange={() => setShowEditDialog(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>
              Make changes to the selected medication.
            </DialogDescription>
          </DialogHeader>
          {selectedMedication && (
            <MedicationForm
              dogId={dogId}
              existingMedication={selectedMedication}
              onSuccess={() => {
                setShowEditDialog(false);
                setSelectedMedication(null);
                if (onRefresh) {
                  onRefresh();
                }
              }}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedMedication(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Log Medication Dialog */}
      <Dialog open={showLogDialog} onOpenChange={() => setShowLogDialog(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Medication</DialogTitle>
            <DialogDescription>
              Record the administration of the selected medication.
            </DialogDescription>
          </DialogHeader>
          {selectedMedication && (
            <div>
              <p>Are you sure you want to log {selectedMedication.medication_name} as
                administered today?</p>
              <Button onClick={() => handleLogMedication(selectedMedication)}>Log
                Medication</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsList;
