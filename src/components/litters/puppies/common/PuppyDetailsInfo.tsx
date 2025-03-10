
import React from 'react';
import { Palette, CircleDollarSign } from 'lucide-react';
import { renderGenderIcon } from '../utils/puppyUtils';

interface PuppyDetailsInfoProps {
  gender: string | null;
  color: string | null;
  salePrice: number | null;
}

const PuppyDetailsInfo: React.FC<PuppyDetailsInfoProps> = ({ 
  gender, 
  color, 
  salePrice 
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-sm">
        {renderGenderIcon(gender)}
        <span>{gender || 'Unknown'}</span>
      </div>
      
      {color && (
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5" />
          {color}
        </div>
      )}
      
      {salePrice && (
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <CircleDollarSign className="h-3.5 w-3.5" />
          ${salePrice}
        </div>
      )}
    </div>
  );
};

export default PuppyDetailsInfo;
