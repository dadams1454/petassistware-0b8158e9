
import React from 'react';
import { Weight, TrendingUp, AlertCircle } from 'lucide-react';
import { WeightUnit } from '@/types/common';

interface PuppyWeightInfoProps {
  birthWeight: string | number | null;
  currentWeight: string | number | null;
  layout?: 'vertical' | 'horizontal';
  displayUnit?: WeightUnit | 'both';
  showTrend?: boolean;
}

const PuppyWeightInfo: React.FC<PuppyWeightInfoProps> = ({ 
  birthWeight, 
  currentWeight,
  layout = 'vertical',
  displayUnit = 'oz',
  showTrend = false
}) => {
  if (!birthWeight && !currentWeight) {
    return <span className="text-sm text-muted-foreground">No weight data</span>;
  }

  const formatWeight = (weight: string | number | null) => {
    if (!weight) return null;
    
    const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight;
    if (isNaN(numWeight)) return weight;
    
    switch (displayUnit) {
      case 'oz':
        return `${numWeight} oz`;
      case 'g':
        const inGrams = Math.round(numWeight * 28.35);
        return `${inGrams} g`;
      case 'lb':
        return `${numWeight} lb`;
      case 'kg':
        return `${numWeight} kg`;
      case 'both':
        const grams = Math.round(numWeight * 28.35);
        return `${numWeight} oz (${grams} g)`;
      default:
        return `${numWeight} oz`;
    }
  };

  // Calculate growth percentage if both weights are available
  const calculateGrowth = () => {
    if (!birthWeight || !currentWeight) return null;
    
    const numBirthWeight = typeof birthWeight === 'string' ? parseFloat(birthWeight) : birthWeight;
    const numCurrentWeight = typeof currentWeight === 'string' ? parseFloat(currentWeight) : currentWeight;
    
    if (isNaN(numBirthWeight) || isNaN(numCurrentWeight) || numBirthWeight === 0) return null;
    
    const growthPercentage = ((numCurrentWeight - numBirthWeight) / numBirthWeight) * 100;
    return {
      percentage: growthPercentage.toFixed(1),
      isPositive: growthPercentage > 0,
      isHealthy: growthPercentage >= 20, // Over 20% growth is generally good
    };
  };

  const growth = showTrend ? calculateGrowth() : null;

  return (
    <div className={`space-y-2 ${layout === 'vertical' ? 'flex-col' : 'flex flex-wrap gap-3'}`}>
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

      {growth && (
        <div className={`text-sm flex items-center gap-1 ${
          growth.isPositive ? (growth.isHealthy ? 'text-green-600' : 'text-amber-600') : 'text-red-600'
        }`}>
          {growth.isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}
          <span>{growth.percentage}% {growth.isPositive ? 'gain' : 'loss'}</span>
        </div>
      )}
    </div>
  );
};

export default PuppyWeightInfo;
