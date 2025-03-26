
import React from 'react';

const DailyCareLoading: React.FC = () => {
  return (
    <div className="flex justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default DailyCareLoading;
