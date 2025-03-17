
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
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Recent Potty Breaks</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <PottyBreakHistoryList 
          sessions={sessions}
          isLoading={isLoading}
          onDelete={onRefresh}
        />
      </div>
    </>
  );
};

export default PottyBreakHistoryTab;
