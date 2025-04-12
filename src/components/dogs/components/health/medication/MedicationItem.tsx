
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Check, Calendar, Clock, Info, AlertTriangle, MoreHorizontal, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Medication, MedicationStatusEnum, MedicationStatusResult, isDetailedStatus } from '@/types';
import { formatDateForDisplay } from '@/utils/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface MedicationItemProps {
  medication: Medication;
  onUpdate: (medication: Medication) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onLogAdministration: (medicationId: string, notes: string) => Promise<void>;
  isSubmitting?: boolean;
}

const MedicationItem: React.FC<MedicationItemProps> = ({
  medication,
  onUpdate,
  onDelete,
  onLogAdministration,
  isSubmitting = false
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAdministerDialog, setShowAdministerDialog] = useState(false);
  const [administrationNotes, setAdministrationNotes] = useState('');
  const [localSubmitting, setLocalSubmitting] = useState(false);
  
  // Helper functions for status display
  const getStatusBadgeVariant = (status: MedicationStatusResult) => {
    const statusStr = typeof status === 'object' ? status.status : status;
    
    switch (statusStr) {
      case MedicationStatusEnum.OVERDUE:
        return 'destructive';
      case MedicationStatusEnum.DUE:
        return 'warning';
      case MedicationStatusEnum.UPCOMING:
        return 'secondary';
      case MedicationStatusEnum.COMPLETED:
        return 'default';
      case MedicationStatusEnum.ACTIVE:
        return 'default';
      default:
        return 'outline';
    }
  };
  
  const getStatusIcon = (status: MedicationStatusResult) => {
    const statusStr = typeof status === 'object' ? status.status : status;
    
    switch (statusStr) {
      case MedicationStatusEnum.OVERDUE:
        return <AlertTriangle className="h-4 w-4" />;
      case MedicationStatusEnum.DUE:
        return <Clock className="h-4 w-4" />;
      case MedicationStatusEnum.UPCOMING:
        return <Calendar className="h-4 w-4" />;
      case MedicationStatusEnum.COMPLETED:
        return <Check className="h-4 w-4" />;
      case MedicationStatusEnum.ACTIVE:
        return <Info className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Convert medication status to display text
  const getStatusDisplay = (status: MedicationStatusResult) => {
    if (isDetailedStatus(status)) {
      return status.message;
    }
    
    switch (status) {
      case MedicationStatusEnum.OVERDUE:
        return 'Overdue';
      case MedicationStatusEnum.DUE:
        return 'Due now';
      case MedicationStatusEnum.UPCOMING:
        return 'Upcoming';
      case MedicationStatusEnum.COMPLETED:
        return 'Completed';
      case MedicationStatusEnum.ACTIVE:
        return 'Active';
      default:
        return 'Unknown';
    }
  };
  
  // Handle deleting a medication
  const handleDelete = async () => {
    try {
      setLocalSubmitting(true);
      await onDelete(medication.id);
      setShowDeleteDialog(false);
      toast({
        title: 'Medication deleted',
        description: 'The medication has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the medication. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalSubmitting(false);
    }
  };
  
  // Handle logging an administration
  const handleLogAdministration = async () => {
    try {
      setLocalSubmitting(true);
      await onLogAdministration(medication.id, administrationNotes);
      setShowAdministerDialog(false);
      setAdministrationNotes('');
      toast({
        title: 'Medication administered',
        description: 'The medication administration has been logged successfully.',
      });
    } catch (error) {
      console.error('Error logging administration:', error);
      toast({
        title: 'Error',
        description: 'Failed to log the medication administration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalSubmitting(false);
    }
  };
  
  // Format the next due date
  const getNextDueText = (status: MedicationStatusResult) => {
    if (isDetailedStatus(status) && status.nextDue) {
      return `Next dose: ${formatDateForDisplay(status.nextDue)}`;
    }
    return '';
  };
  
  return (
    <Card>
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium flex items-center">
          <Pill className="h-4 w-4 mr-2 text-primary" />
          {medication.name || medication.medication_name}
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(medication.status as MedicationStatusEnum)} className="h-6 flex items-center gap-1">
            {getStatusIcon(medication.status as MedicationStatusEnum)}
            {getStatusDisplay(medication.status as MedicationStatusEnum)}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowAdministerDialog(true)}>
                Log Administration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2 pb-3 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-muted-foreground">Dosage:</div>
          <div>{medication.dosage} {medication.dosage_unit}</div>
          
          <div className="text-muted-foreground">Frequency:</div>
          <div>{medication.frequency}</div>
          
          {medication.start_date && (
            <>
              <div className="text-muted-foreground">Start Date:</div>
              <div>{formatDateForDisplay(medication.start_date)}</div>
            </>
          )}
          
          {medication.end_date && (
            <>
              <div className="text-muted-foreground">End Date:</div>
              <div>{formatDateForDisplay(medication.end_date)}</div>
            </>
          )}
        </div>
        
        {(isDetailedStatus(medication.status as MedicationStatusResult) && 
          (medication.status as any).nextDue) && (
          <div className="mt-2 text-xs text-muted-foreground">
            {getNextDueText(medication.status as MedicationStatusResult)}
          </div>
        )}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medication</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this medication?</p>
            <p className="mt-1 text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={localSubmitting || isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={localSubmitting || isSubmitting}
            >
              {(localSubmitting || isSubmitting) ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Administer Medication Dialog */}
      <Dialog open={showAdministerDialog} onOpenChange={setShowAdministerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Medication Administration</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p className="font-medium">{medication.name || medication.medication_name}</p>
              <p className="text-sm text-muted-foreground">
                {medication.dosage} {medication.dosage_unit}, {medication.frequency}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any notes about this administration"
                value={administrationNotes}
                onChange={(e) => setAdministrationNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAdministerDialog(false)}
              disabled={localSubmitting || isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogAdministration}
              disabled={localSubmitting || isSubmitting}
            >
              {(localSubmitting || isSubmitting) ? 'Logging...' : 'Log Administration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MedicationItem;
