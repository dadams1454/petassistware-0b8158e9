
import React from 'react';
import { Syringe } from 'lucide-react';
import { HealthRecord } from '../../types/healthRecord';
import HealthRecordList from './HealthRecordList';
import EmptyRecordState from './EmptyRecordState';

interface VaccinationsTabContentProps {
  records: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
}

const VaccinationsTabContent: React.FC<VaccinationsTabContentProps> = ({ 
  records, 
  onEdit, 
  onDelete 
}) => {
  if (records.length === 0) {
    return <EmptyRecordState type="vaccination" icon={<Syringe className="mx-auto h-12 w-12 text-muted-foreground mb-2" />} />;
  }

  return (
    <HealthRecordList 
      records={records}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default VaccinationsTabContent;
