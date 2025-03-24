
import React from 'react';
import { Stethoscope } from 'lucide-react';
import { HealthRecord } from '../../types/healthRecord';
import HealthRecordList from './HealthRecordList';
import EmptyRecordState from './EmptyRecordState';

interface ExaminationsTabContentProps {
  records: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
}

const ExaminationsTabContent: React.FC<ExaminationsTabContentProps> = ({ 
  records, 
  onEdit, 
  onDelete 
}) => {
  if (records.length === 0) {
    return <EmptyRecordState type="examination" icon={<Stethoscope className="mx-auto h-12 w-12 text-muted-foreground mb-2" />} />;
  }

  return (
    <HealthRecordList 
      records={records}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ExaminationsTabContent;
