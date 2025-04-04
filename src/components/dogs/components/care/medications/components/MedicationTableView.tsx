
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Settings } from 'lucide-react';
import { MedicationInfo } from '../types/medicationTypes';
import TimeManager from '../../table/components/TimeManager';
import { MedicationStatus } from '@/types/health';
import { getMedicationStatus, getStatusLabel } from '@/utils/medicationUtils';

interface MedicationTableViewProps {
  medications: MedicationInfo[];
  onAdminister?: (medicationId: string) => void;
  onEdit?: (medicationId: string) => void;
  emptyMessage?: string;
}

const MedicationTableView: React.FC<MedicationTableViewProps> = ({
  medications,
  onAdminister,
  onEdit,
  emptyMessage = "No medications found"
}) => {
  if (!medications.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  
  const handleAdminister = (medicationId: string) => {
    if (onAdminister) {
      onAdminister(medicationId);
    }
  };
  
  const handleEdit = (medicationId: string) => {
    if (onEdit) {
      onEdit(medicationId);
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Last Administered</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell className="font-medium">
                {medication.name}
              </TableCell>
              <TableCell>
                {medication.dosage ? `${medication.dosage} ${medication.dosage}` : 'N/A'}
              </TableCell>
              <TableCell>{medication.frequency}</TableCell>
              <TableCell>
                {medication.lastAdministered ? (
                  <TimeManager 
                    frequency={medication.frequency}
                    lastTime={medication.lastAdministered}
                    showFrequency={false}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">Never</span>
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(medication.status)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(medication.id)}>
                    <Settings className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => handleAdminister(medication.id)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Log
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to render the status badge
const getStatusBadge = (status: any) => {
  let statusInfo;
  
  if (typeof status === 'string') {
    statusInfo = getStatusLabel(status);
  } else if (typeof status === 'object' && status) {
    statusInfo = {
      statusLabel: status.statusLabel || 'Unknown',
      statusColor: status.statusColor || 'bg-gray-100 text-gray-800'
    };
  } else {
    statusInfo = getStatusLabel('unknown');
  }
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.statusColor}`}>
      {statusInfo.statusLabel}
    </span>
  );
};

export default MedicationTableView;
