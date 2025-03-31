
import React from 'react';
import { useHealthTabContext } from './HealthTabContext';
import HealthRecordDialog from '../../../components/health/HealthRecordDialog';
import WeightEntryDialog from '../../../components/health/WeightEntryDialog';

const HealthTabDialogs: React.FC = () => {
  const {
    dogId,
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    selectedRecordType,
    selectedRecord,
    handleSaveRecord,
    handleSaveWeight
  } = useHealthTabContext();

  return (
    <>
      <HealthRecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        dogId={dogId}
        recordType={selectedRecordType}
        recordId={selectedRecord}
        onSave={handleSaveRecord}
      />
      
      <WeightEntryDialog
        open={weightDialogOpen}
        onOpenChange={setWeightDialogOpen}
        dogId={dogId}
        onSave={handleSaveWeight}
      />
    </>
  );
};

export default HealthTabDialogs;
