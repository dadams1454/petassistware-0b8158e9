
import React from 'react';
import { Edit, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Litter } from '@/types/litter';
import LitterParentCard from './LitterParentCard';
import { Dog as DogType } from '@/types/litter';
import ColorPrediction from './ColorPrediction';

interface LitterHeaderProps {
  litter: Litter;
  sire?: DogType | null;
  dam?: DogType | null;
  onEditClick: () => void;
}

const LitterHeader: React.FC<LitterHeaderProps> = ({ 
  litter, 
  sire, 
  dam, 
  onEditClick 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Litter Details</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEditClick}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Litter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LitterParentCard
          title="Dam (Mother)"
          dog={dam}
          icon={<Dog className="h-5 w-5 text-pink-500" />}
        />
        
        <LitterParentCard
          title="Sire (Father)"
          dog={sire}
          icon={<Dog className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Add Color Prediction Component */}
      {dam?.breed && dam.breed === sire?.breed && (
        <ColorPrediction 
          breed={dam.breed} 
          damColor={dam.color || undefined} 
          sireColor={sire.color || undefined}
        />
      )}
    </div>
  );
};

export default LitterHeader;
