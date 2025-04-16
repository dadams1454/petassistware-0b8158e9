
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pill, PencilIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicationStatusEnum, isDetailedStatus, getStatusString } from '@/types/medication-status';
import { getStatusLabel, ExtendedMedicationStatusEnum } from '@/utils/medicationUtils';
import MedicationStatus from './MedicationStatus';
import { Medication } from '@/types/health';

interface MedicationTableViewProps {
  medications: Medication[];
  onAdminister?: (medication: Medication) => void;
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  showActions?: boolean;
}

const MedicationTableView: React.FC<MedicationTableViewProps> = ({
  medications,
  onAdminister,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No medications found.
      </div>
    );
  }

  const handleAdminister = (medication: Medication) => {
    if (onAdminister) {
      onAdminister(medication);
    }
  };

  const handleEdit = (medication: Medication) => {
    if (onEdit) {
      onEdit(medication);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Helper function to format date
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => {
            const status = medication.status || ExtendedMedicationStatusEnum.UNKNOWN;
            const statusStr = typeof status === 'string' ? status : getStatusString(status);
            const isDueOrOverdue = statusStr === MedicationStatusEnum.DUE || statusStr === MedicationStatusEnum.OVERDUE;
            
            return (
              <TableRow key={medication.id}>
                <TableCell className="font-medium">{medication.name}</TableCell>
                <TableCell>
                  {medication.dosage ? `${medication.dosage} ${medication.dosage_unit || ''}` : 'N/A'}
                </TableCell>
                <TableCell>{medication.frequency || 'N/A'}</TableCell>
                <TableCell>{formatDate(medication.start_date)}</TableCell>
                <TableCell>{formatDate(medication.end_date)}</TableCell>
                <TableCell>
                  <MedicationStatus status={status} />
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {isDueOrOverdue && onAdminister && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdminister(medication)}
                          title="Administer"
                        >
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(medication)}
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(medication.id)}
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicationTableView;
