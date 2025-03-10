
import React from 'react';
import { Weight } from 'lucide-react';

interface PuppyWeightInfoProps {
  birthWeight: string | null;
  currentWeight: string | null;
  layout?: 'vertical' | 'horizontal';
}

const PuppyWeightInfo: React.FC<PuppyWeightInfoProps> = ({ 
  birthWeight, 
  currentWeight,
  layout = 'vertical'
}) => {
  if (!birthWeight && !currentWeight) {
    return <span className="text-sm text-muted-foreground">No weight data</span>;
  }

  return (
    <div className={layout === 'vertical' ? 'space-y-1' : 'flex flex-wrap gap-3'}>
      {birthWeight && (
        <div className="text-sm flex items-center gap-1">
          <Weight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Birth:</span> {birthWeight} oz
        </div>
      )}
      {currentWeight && (
        <div className="text-sm flex items-center gap-1">
          <Weight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Current:</span> {currentWeight} oz
        </div>
      )}
    </div>
  );
};

export default PuppyWeightInfo;
