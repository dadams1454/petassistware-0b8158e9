
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import PottyBreakHistoryList from '../PottyBreakHistoryList';
import { PottyBreakSession } from '@/services/dailyCare/pottyBreak/types';

interface PottyBreakHistoryTabProps {
  sessions: PottyBreakSession[];
  isLoading: boolean;
  onRefresh: () => void;
}

const PottyBreakHistoryTab: React.FC<PottyBreakHistoryTabProps> = ({
  sessions,
  isLoading,
  onRefresh
}) => {
  return (
    <>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Potty Breaks</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <PottyBreakHistoryList 
        sessions={sessions}
        isLoading={isLoading}
        onDelete={onRefresh}
      />
    </>
  );
};

export default PottyBreakHistoryTab;
