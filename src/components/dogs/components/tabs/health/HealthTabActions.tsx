
import React from 'react';
import { Plus, Activity } from 'lucide-react';
import { ActionButton } from '@/components/ui/standardized';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecordTypeEnum } from '@/types/health';

const HealthTabActions: React.FC = () => {
  const {
    handleAddRecord,
    setWeightDialogOpen
  } = useHealthTabContext();

  return (
    <div className="flex gap-2">
      <ActionButton 
        variant="outline" 
        onClick={() => setWeightDialogOpen(true)}
      >
        <Activity className="h-4 w-4 mr-2" />
        Add Weight
      </ActionButton>
      
      <ActionButton onClick={() => handleAddRecord(HealthRecordTypeEnum.Examination)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Record
      </ActionButton>
    </div>
  );
};

export default HealthTabActions;
