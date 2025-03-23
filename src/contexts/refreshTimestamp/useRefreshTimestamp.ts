
import { useContext } from 'react';
import { RefreshTimestampContext } from './RefreshTimestampProvider';

export const useRefreshTimestamp = () => {
  const context = useContext(RefreshTimestampContext);
  
  if (!context) {
    throw new Error('useRefreshTimestamp must be used within a RefreshTimestampProvider');
  }
  
  return context;
};
