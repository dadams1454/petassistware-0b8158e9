
import React from 'react';
import { useHealthTabContext } from './HealthTabContext';
import HealthRecordDialog from '../../health/HealthRecordDialog';
import WeightEntryDialog from '../../health/WeightEntryDialog';
import HealthIndicatorDialog from '../../health/HealthIndicatorDialog';

const HealthTabDialogs: React.FC = () => {
  const {
    dogId,
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    healthIndicatorDialogOpen,
    setHealthIndicatorDialogOpen,
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
        initialData={null}
      />
      
      <HealthIndicatorDialog
        open={healthIndicatorDialogOpen}
        onOpenChange={setHealthIndicatorDialogOpen}
        dogId={dogId}
      />
    </>
  );
};

export default HealthTabDialogs;
