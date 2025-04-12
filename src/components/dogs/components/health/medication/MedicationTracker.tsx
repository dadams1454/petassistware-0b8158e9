import React, { useState } from 'react';
import { Medication, MedicationStatusEnum } from '@/types';
import { useMedications } from '@/hooks/useMedications';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/standardized';
import { Pill, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import MedicationItem from './MedicationItem';

export interface MedicationTrackerProps {
  dogId: string;
  medications?: Medication[];
  showAddButton?: boolean;
  onAddMedication?: () => void;
  filter?: string;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  dogId,
  medications: propsMedications,
  showAddButton = true,
  onAddMedication,
  filter: initialFilter = 'all'
}) => {
  const [filter, setFilter] = useState(initialFilter);
  
  // If medications are provided via props, use those
  // Otherwise fetch them using the hook
  const {
    medications: hookMedications,
    isLoading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    logAdministration,
    isSubmitting
  } = useMedications(dogId, !propsMedications);
  
  const medications = propsMedications || hookMedications;
  
  if (isLoading) {
    return (
      <LoadingState 
        message="Loading medications..." 
        showSkeleton
        skeletonVariant="card"
        skeletonCount={3}
      />
    );
  }
  
  if (error) {
    return (
      <ErrorState
        title="Failed to load medications"
        message={error instanceof Error ? error.message : String(error)}
      />
    );
  }
  
  // Filter medications based on the selected filter
  const filteredMedications = medications.filter(med => {
    if (filter === 'all') return true;
    if (filter === 'active' && med.status === MedicationStatusEnum.ACTIVE) return true;
    if (filter === 'overdue' && med.status === MedicationStatusEnum.OVERDUE) return true;
    if (filter === 'upcoming' && med.status === MedicationStatusEnum.UPCOMING) return true;
    if (filter === 'completed' && med.status === MedicationStatusEnum.COMPLETED) return true;
    return false;
  });
  
  const handleAddMedication = () => {
    if (onAddMedication) {
      onAddMedication();
    }
  };
  
  if (medications.length === 0) {
    return (
      <EmptyState 
        title="No Medications"
        description="No medications have been added for this dog yet."
        icon={<Pill className="h-12 w-12 text-muted-foreground" />}
        action={
          showAddButton
            ? { label: "Add Medication", onClick: handleAddMedication }
            : undefined
        }
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter medications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Medications</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {showAddButton && (
          <Button onClick={handleAddMedication} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Medication
          </Button>
        )}
      </div>
      
      {filteredMedications.length === 0 ? (
        <div className="text-center p-4 border rounded-md text-muted-foreground">
          No medications matching the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMedications.map(medication => (
            <MedicationItem
              key={medication.id}
              medication={medication}
              onUpdate={updateMedication}
              onDelete={deleteMedication}
              onLogAdministration={logAdministration}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;
