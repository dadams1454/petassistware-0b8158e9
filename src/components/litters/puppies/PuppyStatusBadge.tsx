
import React from 'react';

interface PuppyStatusBadgeProps {
  status: string | null;
}

const PuppyStatusBadge: React.FC<PuppyStatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${
      status === 'Available' 
        ? 'bg-green-100 text-green-800' 
        : status === 'Reserved' 
        ? 'bg-yellow-100 text-yellow-800'
        : status === 'Sold'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-gray-100 text-gray-800'
    }`}>
      {status || 'Unknown'}
    </span>
  );
};

export default PuppyStatusBadge;
