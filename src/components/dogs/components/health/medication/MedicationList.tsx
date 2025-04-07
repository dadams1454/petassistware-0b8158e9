
import React from 'react';
import MedicationItem from './MedicationItem';
import { Medication } from '@/types/health';

interface MedicationListProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  onAdminister?: (medicationId: string, data: any) => void;
  isActive?: boolean;
}

const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  onEdit,
  onDelete,
  onAdminister,
  isActive = true
}) => {
  if (medications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        No {isActive ? 'active' : 'inactive'} medications found.
      </p>
    );
  }

  return (
    <div className="space-y-2 divide-y">
      {medications.map(medication => (
        <MedicationItem
          key={medication.id}
          medication={medication}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdminister={onAdminister}
        />
      ))}
    </div>
  );
};

export default MedicationList;
