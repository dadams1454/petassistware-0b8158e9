
import React, { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Medication, MedicationStatusEnum } from '@/types/health';
import { useMedication } from '@/hooks/useMedication';
import { MedicationFrequencyConstants, getStatusLabel, getMedicationStatus } from '@/utils/medicationUtils';
import AdministerMedicationForm from '@/components/puppies/health/AdministerMedicationForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MedicationTrackerProps {
  dogId?: string;
  showDoses?: boolean;
  limit?: number;
  filter?: 'all' | 'upcoming' | 'overdue' | 'active';
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ 
  dogId, 
  showDoses = true,
  limit = 5,
  filter = 'all'
}) => {
  const { medications, isLoading, error, addMedication, updateMedication } = useMedication(dogId);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isAdministerDialogOpen, setIsAdministerDialogOpen] = useState(false);
  
  const addMedicationLog = async (administrationData: any) => {
    if (!selectedMedication) return;
    
    try {
      // Update medication with last_administered date
      const updatedMedication = {
        ...selectedMedication,
        last_administered: administrationData.administeredAt
      };
      
      await updateMedication(selectedMedication.id, updatedMedication);
      
      // Here you would also add the log to a separate table if needed
      
      return true;
    } catch (error) {
      console.error('Error logging medication administration:', error);
      return false;
    }
  };
  
  const filteredMedications = React.useMemo(() => {
    if (!medications) return [];
    
    let filtered = [...medications];
    
    if (filter === 'active') {
      filtered = filtered.filter(med => med.active);
    } else if (filter === 'upcoming') {
      filtered = filtered.filter(med => {
        const status = getMedicationStatus(
          med.start_date, 
          med.end_date, 
          med.last_administered, 
          med.frequency
        );
        return status.status === MedicationStatusEnum.ACTIVE && 
               status.daysOverdue === null && 
               status.daysUntilDue !== null && 
               status.daysUntilDue <= 7;
      });
    } else if (filter === 'overdue') {
      filtered = filtered.filter(med => {
        const status = getMedicationStatus(
          med.start_date, 
          med.end_date, 
          med.last_administered, 
          med.frequency
        );
        return status.status === MedicationStatusEnum.ACTIVE && status.daysOverdue !== null;
      });
    }
    
    return filtered.slice(0, limit);
  }, [medications, filter, limit]);
  
  // Calculate next due date based on last administration and frequency
  const getNextDueDate = (medication: Medication) => {
    const today = new Date();
    const lastAdministered = medication.last_administered 
      ? new Date(medication.last_administered) 
      : null;
      
    if (!lastAdministered || !medication.frequency) return today;
    
    const nextDueDate = new Date(lastAdministered);
    
    // Simple frequency handling
    const frequencyStr = medication.frequency || 'monthly';
    
    switch (frequencyStr.toLowerCase()) {
      case MedicationFrequencyConstants.DAILY.toLowerCase():
      case MedicationFrequencyConstants.ONCE_DAILY.toLowerCase():
        nextDueDate.setDate(today.getDate() + 1);
        break;
      case MedicationFrequencyConstants.TWICE_DAILY.toLowerCase():
        nextDueDate.setDate(today.getDate() + 1); // Simplified for now
        break;
      case MedicationFrequencyConstants.WEEKLY.toLowerCase():
        nextDueDate.setDate(today.getDate() + 7);
        break;
      case MedicationFrequencyConstants.BIWEEKLY.toLowerCase():
        nextDueDate.setDate(today.getDate() + 14);
        break;
      case MedicationFrequencyConstants.MONTHLY.toLowerCase():
        nextDueDate.setMonth(today.getMonth() + 1);
        break;
      case MedicationFrequencyConstants.QUARTERLY.toLowerCase():
        nextDueDate.setMonth(today.getMonth() + 3);
        break;
      case MedicationFrequencyConstants.ANNUALLY.toLowerCase():
        nextDueDate.setFullYear(today.getFullYear() + 1);
        break;
      default:
        // For as needed, or unknown frequencies
        nextDueDate.setDate(today.getDate() + 30); // Default to monthly
    }
    
    return nextDueDate;
  };
  
  const handleAdminister = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsAdministerDialogOpen(true);
  };
  
  const handleSubmitAdministration = async (formData: any) => {
    if (!selectedMedication) return;
    
    try {
      const administrationData = {
        medicationId: formData.medicationId,
        dogId: formData.dogId,
        administeredAt: formData.administeredAt,
        administeredBy: formData.administeredBy,
        notes: formData.notes
      };
      
      await addMedicationLog(administrationData);
      setIsAdministerDialogOpen(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error recording administration:', error);
    }
  };
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading medications...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading medications</div>;
  }
  
  if (!filteredMedications.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No {filter !== 'all' ? filter : ''} medications found.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredMedications.map((medication) => {
        const status = getMedicationStatus(
          medication.start_date,
          medication.end_date,
          medication.last_administered,
          medication.frequency,
          !medication.active
        );
        const { statusLabel, statusColor } = getStatusLabel(status.status);
        const nextDue = status.nextDue ? new Date(status.nextDue) : getNextDueDate(medication);
        const daysUntil = nextDue ? differenceInDays(nextDue, new Date()) : null;
        
        return (
          <div 
            key={medication.id} 
            className="p-4 border rounded-md bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{medication.name || medication.medication_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {medication.dosage} {medication.dosage_unit}, {medication.frequency}
                </p>
              </div>
              <Badge className={statusColor}>{statusLabel}</Badge>
            </div>
            
            {status.status === MedicationStatusEnum.ACTIVE && (
              <>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div>
                    <p className="font-medium">Next Due:</p>
                    <p>{nextDue ? format(nextDue, 'MMM d, yyyy') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Last Administered:</p>
                    <p>
                      {medication.last_administered 
                        ? format(new Date(medication.last_administered), 'MMM d, yyyy') 
                        : 'Never'}
                    </p>
                  </div>
                  {daysUntil !== null && (
                    <div className={daysUntil < 0 ? 'text-red-500' : daysUntil === 0 ? 'text-amber-500' : ''}>
                      <p className="font-medium">Status:</p>
                      <p>
                        {daysUntil < 0 
                          ? `Overdue by ${Math.abs(daysUntil)} days` 
                          : daysUntil === 0 
                            ? 'Due today' 
                            : `Due in ${daysUntil} days`}
                      </p>
                    </div>
                  )}
                </div>
                {showDoses && (
                  <div className="mt-4">
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => handleAdminister(medication)}
                    >
                      Record Administration
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
      
      <Dialog open={isAdministerDialogOpen} onOpenChange={setIsAdministerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Medication Administration</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <AdministerMedicationForm 
              medication={selectedMedication}
              onSubmit={handleSubmitAdministration}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationTracker;
