
import React, { useState } from 'react';
import { format, isPast, isFuture } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, MoreVertical, Pill, Check, X, Edit, Trash, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MedicationRecord, MedicationStatus, MedicationType } from '@/types/medication';
import { recordMedicationAdministration, deleteMedicationRecord } from '@/services/medicationService';
import { useUser } from '@/contexts/UserContext';
import MedicationForm from './MedicationForm';
import { useConfirm } from '@/hooks/useConfirm';

interface MedicationsListProps {
  medications: MedicationRecord[];
  dogId: string;
  onRefresh: () => void;
}

const MedicationsListEmpty = () => (
  <Card className="border-dashed border-2 p-8">
    <div className="flex flex-col items-center justify-center text-center py-6">
      <div className="bg-primary/10 p-3 rounded-full">
        <Pill className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No Medications Found</h3>
      <p className="mt-2 text-muted-foreground max-w-sm">
        There are no medications in this category. Add a medication to get started.
      </p>
    </div>
  </Card>
);

const MedicationStatusBadge = ({ dueDate }: { dueDate?: string }) => {
  if (!dueDate) return null;
  
  const dueDateObj = new Date(dueDate);
  const today = new Date();
  
  if (isPast(dueDateObj)) {
    return (
      <Badge variant="destructive" className="ml-2 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        Overdue
      </Badge>
    );
  }
  
  // Due in the next 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  if (dueDateObj <= threeDaysFromNow) {
    return (
      <Badge variant="warning" className="ml-2 flex items-center bg-amber-100 text-amber-800">
        <Clock className="h-3 w-3 mr-1" />
        Due Soon
      </Badge>
    );
  }
  
  // Due in the future
  return (
    <Badge variant="outline" className="ml-2 flex items-center">
      <Calendar className="h-3 w-3 mr-1" />
      Scheduled
    </Badge>
  );
};

const MedicationsList: React.FC<MedicationsListProps> = ({ medications, dogId, onRefresh }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { showConfirmation } = useConfirm();
  const [editMedication, setEditMedication] = useState<MedicationRecord | null>(null);
  
  if (!medications || medications.length === 0) {
    return <MedicationsListEmpty />;
  }
  
  const handleAdminister = async (medication: MedicationRecord) => {
    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await recordMedicationAdministration(
        medication.id,
        new Date(),
        "Medication administered",
        user.id
      );
      
      toast({
        title: "Medication administered",
        description: `${medication.medication_name} has been marked as administered.`
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
  
  const handleDelete = async (medication: MedicationRecord) => {
    showConfirmation({
      title: "Delete Medication",
      description: `Are you sure you want to delete ${medication.medication_name}? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteMedicationRecord(medication.id);
          toast({
            title: "Medication deleted",
            description: `${medication.medication_name} has been deleted successfully.`
          });
          onRefresh();
        } catch (error) {
          console.error("Error deleting medication:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "An error occurred while deleting the medication",
            variant: "destructive"
          });
        }
      }
    });
  };
  
  return (
    <div className="space-y-4">
      {medications.map(medication => {
        const nextDueDate = medication.next_due_date ? new Date(medication.next_due_date) : null;
        const isOverdue = nextDueDate && isPast(nextDueDate);
        const isPreventative = medication.medication_type === MedicationType.PREVENTATIVE;
        
        return (
          <Card 
            key={medication.id} 
            className={`
              ${isOverdue ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800' : ''}
              ${isPreventative ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800' : ''}
            `}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {medication.medication_name}
                    {nextDueDate && <MedicationStatusBadge dueDate={medication.next_due_date} />}
                  </CardTitle>
                  <CardDescription>
                    {medication.medication_type.charAt(0).toUpperCase() + medication.medication_type.slice(1)} • 
                    {medication.frequency.charAt(0).toUpperCase() + medication.frequency.slice(1).replace('_', ' ')}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAdminister(medication)}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Administered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditMedication(medication)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Medication
                    </DropdownMenuItem>
                    <Separator className="my-1" />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(medication)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-2">
                {medication.dosage && (
                  <div>
                    <span className="text-muted-foreground">Dosage:</span>{' '}
                    {medication.dosage} {medication.dosage_unit}
                  </div>
                )}
                
                {medication.route && (
                  <div>
                    <span className="text-muted-foreground">Route:</span>{' '}
                    {medication.route.charAt(0).toUpperCase() + medication.route.slice(1)}
                  </div>
                )}
                
                {nextDueDate && (
                  <div className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                    <span className="text-muted-foreground">Next Due:</span>{' '}
                    {format(nextDueDate, 'MMM d, yyyy')}
                    {isOverdue && <AlertTriangle className="inline-block ml-1 h-3 w-3" />}
                  </div>
                )}
                
                {medication.start_date && (
                  <div>
                    <span className="text-muted-foreground">Started:</span>{' '}
                    {format(new Date(medication.start_date), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
              
              {medication.notes && (
                <div className="mt-3 text-sm">
                  <div className="text-muted-foreground mb-1">Notes:</div>
                  <div className="bg-background/50 p-2 rounded-md text-sm">
                    {medication.notes}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-0">
              <div className="flex w-full justify-between pt-2 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditMedication(medication)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant={isOverdue ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAdminister(medication)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Administer
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
      
      {/* Edit Medication Dialog */}
      {editMedication && (
        <Dialog open={!!editMedication} onOpenChange={(open) => !open && setEditMedication(null)}>
          <DialogContent className="max-w-md">
            <MedicationForm 
              dogId={dogId}
              existingMedication={editMedication}
              onSuccess={() => {
                setEditMedication(null);
                onRefresh();
              }}
              onCancel={() => setEditMedication(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MedicationsList;
