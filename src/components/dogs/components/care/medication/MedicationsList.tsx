
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreVertical, CheckCircle, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { MedicationRecord } from '@/types/medication';
import { deleteMedicationRecord, recordMedicationAdministration } from '@/services/medicationService';

interface MedicationsListProps {
  medications: MedicationRecord[];
  onRefresh: () => void;
  onEdit: (id: string) => void;
  dogId?: string; // Added dogId as an optional prop
}

const MedicationsList: React.FC<MedicationsListProps> = ({ 
  medications, 
  onRefresh, 
  onEdit,
  dogId 
}) => {
  const { toast } = useToast();
  const { user } = useUser();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string>('');

  const handleDeleteMedication = async (id: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    setDeletingId(id);
    
    try {
      await deleteMedicationRecord(id);
      toast({
        title: "Medication deleted",
        description: "The medication has been successfully removed."
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while deleting the medication",
        variant: "destructive"
      });
    } finally {
      setDeletingId('');
      setShowDeleteDialog(false);
    }
  };

  const handleAddAdministration = async (medicationId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const administrationData = {
        timestamp: new Date().toISOString(),
        administered_by: user.id,
        notes: "Administered manually via medication list"
      };
      
      await recordMedicationAdministration(medicationId, administrationData);
      
      toast({
        title: "Medication administered",
        description: "The medication has been marked as administered."
      });
      onRefresh();
    } catch (error) {
      console.error("Error administering medication:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while recording administration",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      {medications.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>{medication.medication_name}</TableCell>
                <TableCell>
                  {medication.dosage} {medication.dosage_unit}
                </TableCell>
                <TableCell>{medication.frequency}</TableCell>
                <TableCell>
                  {medication.next_due_date ? format(new Date(medication.next_due_date), 'MMM d, yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddAdministration(medication.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Administered
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(medication.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setShowDeleteDialog(true);
                          setDeletingId(medication.id);
                        }}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4">No medications found.</div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete this medication?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteMedication(deletingId)}
              disabled={!deletingId}
            >
              {!deletingId ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MedicationsList;
