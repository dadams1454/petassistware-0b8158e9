
import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';

interface NoDogsStateProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const NoDogsState: React.FC<NoDogsStateProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="p-8 text-center border rounded-md bg-slate-50 dark:bg-slate-800/50">
      <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
      <CustomButton 
        onClick={onRefresh} 
        className="mt-4"
        disabled={isRefreshing}
      >
        {isRefreshing ? "Refreshing..." : "Refresh Dogs"}
      </CustomButton>
    </div>
  );
};

export default NoDogsState;
