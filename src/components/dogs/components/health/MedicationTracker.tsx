
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Medication } from '@/types/health';
import MedicationList from './medication/MedicationList';
import EmptyMedicationState from './medication/EmptyMedicationState';
import { useMedicationTracking } from './hooks/useMedicationTracking';

interface MedicationTrackerProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  onAdminister?: (medicationId: string, data: any) => void;
  className?: string;
  filter?: string;
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  medications = [],
  onEdit,
  onDelete,
  onAdminister,
  className,
  filter
}) => {
  const { toast } = useToast();
  const { 
    filteredMedications,
    activeMedications, 
    inactiveMedications, 
    handleAdminister 
  } = useMedicationTracking(medications, filter, onAdminister, toast);

  if (filteredMedications.length === 0) {
    return <EmptyMedicationState className={className} />;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Medications</CardTitle>
      </CardHeader>
      <CardContent>
        {activeMedications.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Active Medications</h3>
            <MedicationList
              medications={activeMedications}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdminister={handleAdminister}
              isActive={true}
            />
          </div>
        )}
        
        {inactiveMedications.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Inactive Medications</h3>
            <div className="text-gray-500">
              <MedicationList
                medications={inactiveMedications}
                onEdit={onEdit}
                onDelete={onDelete}
                onAdminister={handleAdminister}
                isActive={false}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
