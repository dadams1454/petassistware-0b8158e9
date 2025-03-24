
import React from 'react';
import { Pill } from 'lucide-react';
import { HealthRecord } from '../../types/healthRecord';
import HealthRecordList from './HealthRecordList';
import EmptyRecordState from './EmptyRecordState';

interface MedicationsTabContentProps {
  records: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
}

const MedicationsTabContent: React.FC<MedicationsTabContentProps> = ({ 
  records, 
  onEdit, 
  onDelete 
}) => {
  if (records.length === 0) {
    return <EmptyRecordState type="medication" icon={<Pill className="mx-auto h-12 w-12 text-muted-foreground mb-2" />} />;
  }

  return (
    <HealthRecordList 
      records={records}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default MedicationsTabContent;
