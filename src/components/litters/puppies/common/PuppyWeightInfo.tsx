
import React from 'react';
import { Weight } from 'lucide-react';

interface PuppyWeightInfoProps {
  birthWeight: string | null;
  currentWeight: string | null;
  layout?: 'vertical' | 'horizontal';
  displayUnit?: 'oz' | 'g' | 'both';
}

const PuppyWeightInfo: React.FC<PuppyWeightInfoProps> = ({ 
  birthWeight, 
  currentWeight,
  layout = 'vertical',
  displayUnit = 'oz'
}) => {
  if (!birthWeight && !currentWeight) {
    return <span className="text-sm text-muted-foreground">No weight data</span>;
  }

  // Function to format weight with correct unit
  const formatWeight = (weight: string | null) => {
    if (!weight) return null;
    
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight)) return weight;
    
    switch (displayUnit) {
      case 'oz':
        return `${numWeight} oz`;
      case 'g':
        // Convert to grams if in oz
        const inGrams = Math.round(numWeight * 28.35);
        return `${inGrams} g`;
      case 'both':
        const grams = Math.round(numWeight * 28.35);
        return `${numWeight} oz (${grams} g)`;
      default:
        return `${numWeight} oz`;
    }
  };

  return (
    <div className={layout === 'vertical' ? 'space-y-1' : 'flex flex-wrap gap-3'}>
      {birthWeight && (
        <div className="text-sm flex items-center gap-1">
          <Weight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Birth:</span> {formatWeight(birthWeight)}
        </div>
      )}
      {currentWeight && (
        <div className="text-sm flex items-center gap-1">
          <Weight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Current:</span> {formatWeight(currentWeight)}
        </div>
      )}
    </div>
  );
};

export default PuppyWeightInfo;
