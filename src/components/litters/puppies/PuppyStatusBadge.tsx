
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PuppyStatusBadgeProps {
  status: string | null;
}

const PuppyStatusBadge: React.FC<PuppyStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Sold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Retained':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Deceased':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariant()}`}>
      {status || 'Unknown'}
    </div>
  );
};

export default PuppyStatusBadge;
