
import React from 'react';

interface DebugInfoPanelProps {
  debugInfo: string;
  clickCount: number;
  errorCount: number;
  activeCategory: string;
}

const DebugInfoPanel: React.FC<DebugInfoPanelProps> = ({
  debugInfo,
  clickCount,
  errorCount,
  activeCategory
}) => {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2">
      Debug: {debugInfo} | Total clicks: {clickCount} | 
      Errors: {errorCount} | Category: {activeCategory}
    </div>
  );
};

export default DebugInfoPanel;
