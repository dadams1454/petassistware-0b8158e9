
import React from 'react';
import HealthRecordDialog from '../../profile/records/HealthRecordDialog';
import WeightEntryDialog from '../../health/WeightEntryDialog';
import { useHealthTabContext } from './HealthTabContext';

const HealthTabDialogs: React.FC = () => {
  const {
    dogId,
    recordDialogOpen,
    setRecordDialogOpen,
    weightDialogOpen,
    setWeightDialogOpen,
    selectedRecord,
    healthRecords,
    handleSaveRecord,
    handleSaveWeight
  } = useHealthTabContext();

  return (
    <>
      {recordDialogOpen && (
        <HealthRecordDialog
          open={recordDialogOpen}
          onOpenChange={setRecordDialogOpen}
          dogId={dogId}
          record={selectedRecord ? healthRecords.find(r => r.id === selectedRecord) || null : null}
          onSave={handleSaveRecord}
        />
      )}
      
      {weightDialogOpen && (
        <WeightEntryDialog
          dogId={dogId}
          onClose={() => setWeightDialogOpen(false)}
          onSave={handleSaveWeight}
        />
      )}
    </>
  );
};

export default HealthTabDialogs;
