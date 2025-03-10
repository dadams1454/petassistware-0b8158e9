
import React from 'react';
import { Calendar, CircleDollarSign } from 'lucide-react';
import { formatDate } from '../utils/puppyUtils';

interface PuppyBasicInfoProps {
  name: string | null;
  id: string;
  birthDate: string | null;
  salePrice?: number | null;
}

const PuppyBasicInfo: React.FC<PuppyBasicInfoProps> = ({ 
  name, 
  id, 
  birthDate,
  salePrice
}) => {
  return (
    <div>
      <div className="font-medium">
        {name || `Puppy ${id.substring(0, 4)}`}
      </div>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(birthDate)}
      </div>
      {salePrice && (
        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <CircleDollarSign className="h-3.5 w-3.5" />
          ${salePrice}
        </div>
      )}
    </div>
  );
};

export default PuppyBasicInfo;
