
import React from 'react';
import { format } from 'date-fns';
import { HealthRecord } from '@/types/health';
import { getHealthRecordIcon, getHealthRecordColor, getRecordTypeLabel } from '../utils/healthRecordUtils';
import { useHealthTabContext } from '../../tabs/health/HealthTabContext';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface HealthRecordsListProps {
  records: HealthRecord[];
  onEdit?: (record: HealthRecord) => void;
  onDelete?: (recordId: string) => void;
  recordType?: string;
  emptyMessage?: string;
}

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  records,
  onEdit,
  onDelete,
  recordType,
  emptyMessage = 'No records found'
}) => {
  const { setRecordToEdit, setRecordToDelete } = useHealthTabContext();

  // Filter records by type if provided
  const filteredRecords = recordType 
    ? records.filter(record => record.record_type === recordType)
    : records;

  // Sort records by visit date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const dateA = new Date(a.visit_date || a.date || a.created_at);
    const dateB = new Date(b.visit_date || b.date || b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  if (sortedRecords.length === 0) {
    return <div className="text-center text-muted-foreground py-6">{emptyMessage}</div>;
  }

  const handleEdit = (record: HealthRecord) => {
    if (onEdit) {
      onEdit(record);
    } else if (setRecordToEdit) {
      setRecordToEdit(record);
    }
  };

  const handleDelete = (recordId: string) => {
    if (onDelete) {
      onDelete(recordId);
    } else if (setRecordToDelete) {
      setRecordToDelete(recordId);
    }
  };

  return (
    <div className="space-y-4">
      {sortedRecords.map((record) => (
        <div 
          key={record.id} 
          className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className={`mr-3 ${getHealthRecordColor(record.record_type)}`}>
                {getHealthRecordIcon(record.record_type)}
              </div>
              <div>
                <h4 className="font-medium text-base">{record.title || getRecordTypeLabel(record.record_type)}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(record.visit_date || record.date || record.created_at), 'PPP')}
                  {record.vet_name && ` • ${record.vet_name}`}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => handleEdit(record)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                onClick={() => handleDelete(record.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          
          {record.record_notes || record.description && (
            <div className="mt-2 text-sm">
              {record.record_notes || record.description}
            </div>
          )}
          
          {/* Record-type specific details */}
          {record.record_type === HealthRecordTypeEnum.Vaccination && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {record.vaccine_name && (
                <div className="col-span-2">
                  <span className="font-medium">Vaccine:</span> {record.vaccine_name}
                </div>
              )}
              {record.manufacturer && (
                <div>
                  <span className="font-medium">Manufacturer:</span> {record.manufacturer}
                </div>
              )}
              {record.lot_number && (
                <div>
                  <span className="font-medium">Lot Number:</span> {record.lot_number}
                </div>
              )}
            </div>
          )}
          
          {record.record_type === HealthRecordTypeEnum.Medication && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {record.medication_name && (
                <div className="col-span-2">
                  <span className="font-medium">Medication:</span> {record.medication_name}
                </div>
              )}
              {record.dosage && (
                <div>
                  <span className="font-medium">Dosage:</span> {record.dosage} {record.dosage_unit}
                </div>
              )}
              {record.frequency && (
                <div>
                  <span className="font-medium">Frequency:</span> {record.frequency}
                </div>
              )}
              {record.start_date && (
                <div>
                  <span className="font-medium">Start Date:</span> {format(new Date(record.start_date), 'PP')}
                </div>
              )}
              {record.end_date && (
                <div>
                  <span className="font-medium">End Date:</span> {format(new Date(record.end_date), 'PP')}
                </div>
              )}
            </div>
          )}
          
          {record.record_type === HealthRecordTypeEnum.Surgery && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {record.procedure_name && (
                <div className="col-span-2">
                  <span className="font-medium">Procedure:</span> {record.procedure_name}
                </div>
              )}
              {record.surgeon && (
                <div>
                  <span className="font-medium">Surgeon:</span> {record.surgeon}
                </div>
              )}
              {record.anesthesia_used && (
                <div>
                  <span className="font-medium">Anesthesia:</span> {record.anesthesia_used}
                </div>
              )}
            </div>
          )}
          
          {record.next_due_date && (
            <div className="mt-2 text-sm font-medium">
              Next due: {format(new Date(record.next_due_date), 'PP')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HealthRecordsList;
