
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { MoreHorizontal, FileText, Syringe, Stethoscope, Pill, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HealthRecord } from '@/types/health';
import { useHealthTabContext } from '../../tabs/health/HealthTabContext';

interface HealthRecordsListProps {
  records: HealthRecord[];
  recordType: string;
  emptyMessage?: string;
}

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  records,
  recordType,
  emptyMessage = "No records found."
}) => {
  const { setRecordToEdit, setRecordToDelete } = useHealthTabContext();
  
  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>;
  }
  
  // Sort records by date, newest first
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
  );
  
  // Function to get type-specific icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-4 w-4 mr-2" />;
      case 'examination':
        return <Stethoscope className="h-4 w-4 mr-2" />;
      case 'medication':
        return <Pill className="h-4 w-4 mr-2" />;
      case 'surgery':
        return <Scissors className="h-4 w-4 mr-2" />;
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };
  
  const handleEditRecord = (record: HealthRecord) => {
    setRecordToEdit(record);
  };
  
  const handleDeleteRecord = (recordId: string) => {
    setRecordToDelete(recordId);
  };
  
  return (
    <div className="space-y-4">
      {sortedRecords.map((record) => (
        <Card key={record.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getTypeIcon(recordType)}
                  <h3 className="font-medium">{record.title}</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    {format(new Date(record.visit_date), 'MMM d, yyyy')}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Vaccination specific fields */}
              {recordType === 'vaccination' && record.vaccine_name && (
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Vaccine:</span> {record.vaccine_name}
                  </p>
                  {record.manufacturer && (
                    <p className="text-sm">
                      <span className="font-medium">Manufacturer:</span> {record.manufacturer}
                    </p>
                  )}
                  {record.lot_number && (
                    <p className="text-sm">
                      <span className="font-medium">Lot:</span> {record.lot_number}
                    </p>
                  )}
                </div>
              )}
              
              {/* Examination specific fields */}
              {recordType === 'examination' && (
                <div className="mt-2">
                  {record.examination_type && (
                    <p className="text-sm">
                      <span className="font-medium">Exam type:</span> {record.examination_type}
                    </p>
                  )}
                  {record.findings && (
                    <p className="text-sm">
                      <span className="font-medium">Findings:</span> {record.findings}
                    </p>
                  )}
                </div>
              )}
              
              {/* Medication specific fields */}
              {recordType === 'medication' && (
                <div className="mt-2">
                  {record.medication_name && (
                    <p className="text-sm">
                      <span className="font-medium">Medication:</span> {record.medication_name}
                    </p>
                  )}
                  {record.dosage && (
                    <p className="text-sm">
                      <span className="font-medium">Dosage:</span> {record.dosage} {record.dosage_unit || ''}
                    </p>
                  )}
                  {record.frequency && (
                    <p className="text-sm">
                      <span className="font-medium">Frequency:</span> {record.frequency}
                    </p>
                  )}
                </div>
              )}
              
              {/* Common fields */}
              <div className="mt-2">
                {record.vet_name && (
                  <p className="text-sm">
                    <span className="font-medium">Veterinarian:</span> {record.vet_name}
                  </p>
                )}
                {record.next_due_date && (
                  <p className="text-sm text-orange-600">
                    <span className="font-medium">Next due:</span> {format(new Date(record.next_due_date), 'MMM d, yyyy')}
                  </p>
                )}
                {record.record_notes && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">{record.record_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HealthRecordsList;
