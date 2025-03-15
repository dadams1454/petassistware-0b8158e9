
import React from 'react';
import DailyCareLogs from '../care/DailyCareLogs';

interface DailyCareTabProps {
  dogId: string;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ dogId }) => {
  return (
    <div className="space-y-6">
      <DailyCareLogs dogId={dogId} />
    </div>
  );
};

export default DailyCareTab;
