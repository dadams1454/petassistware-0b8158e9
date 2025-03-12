
import React from 'react';
import LitterCard from './LitterCard';

interface LitterSectionProps {
  title: string;
  icon: React.ReactNode;
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
}

const LitterSection: React.FC<LitterSectionProps> = ({
  title,
  icon,
  litters,
  onEditLitter,
  onDeleteLitter
}) => {
  if (litters.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-lg font-semibold">{title} ({litters.length})</h2>
      </div>
      
      <div className="space-y-4">
        {litters.map((litter) => (
          <LitterCard
            key={litter.id}
            litter={litter}
            onEdit={onEditLitter}
            onDelete={onDeleteLitter}
          />
        ))}
      </div>
    </div>
  );
};

export default LitterSection;
