
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Heart, 
  XCircle 
} from 'lucide-react';

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
      case 'Kept':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Deceased':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      case 'Reserved':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'Sold':
        return <DollarSign className="h-3.5 w-3.5 mr-1" />;
      case 'Retained':
      case 'Kept':
        return <Heart className="h-3.5 w-3.5 mr-1" />;
      case 'Deceased':
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariant()}`}>
      {getStatusIcon()}
      {status || 'Unknown'}
    </div>
  );
};

export default PuppyStatusBadge;
