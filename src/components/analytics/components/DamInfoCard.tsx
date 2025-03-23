
import React from 'react';

interface DamInfoCardProps {
  selectedDam: any;
}

const DamInfoCard: React.FC<DamInfoCardProps> = ({ selectedDam }) => {
  if (!selectedDam) return null;
  
  return (
    <div className="mb-4 p-4 bg-muted rounded-lg">
      <h3 className="font-medium">{selectedDam.name}</h3>
      <p className="text-sm text-muted-foreground">
        Breed: {selectedDam.breed} • Color: {selectedDam.color || 'Not specified'} • 
        Total Litters: {selectedDam.litters?.length || 0}
      </p>
    </div>
  );
};

export default DamInfoCard;
