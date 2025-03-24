
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { HealthRecord } from '../../types/healthRecord';
import HealthRecordList from './HealthRecordList';
import EmptyRecordState from './EmptyRecordState';

interface AllRecordsTabContentProps {
  records: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
}

const AllRecordsTabContent: React.FC<AllRecordsTabContentProps> = ({ 
  records, 
  onEdit, 
  onDelete 
}) => {
  if (records.length === 0) {
    return <EmptyRecordState type="health" />;
  }

  return (
    <HealthRecordList 
      records={records}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default AllRecordsTabContent;
