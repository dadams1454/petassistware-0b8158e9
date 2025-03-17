
import React from 'react';

const TimeTableFooter: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Click on a cell to mark a potty break with an X. The X will remain visible throughout the day.
      </p>
    </div>
  );
};

export default TimeTableFooter;
