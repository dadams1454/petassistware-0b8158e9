
import React from 'react';
import LitterCard from './LitterCard';
import { Litter } from '../puppies/types';

interface LitterSectionProps {
  title: string;
  icon: React.ReactNode;
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter?: (litter: Litter) => void;
}

const LitterSection: React.FC<LitterSectionProps> = ({
  title,
  icon,
  litters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  if (litters.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground ml-2">
          ({litters.length} {litters.length === 1 ? 'litter' : 'litters'})
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {litters.map((litter) => (
          <LitterCard 
            key={litter.id}
            litter={litter}
            onEdit={onEditLitter}
            onDelete={onDeleteLitter}
            onArchive={onArchiveLitter}
            onUnarchive={onUnarchiveLitter}
          />
        ))}
      </div>
    </div>
  );
};

export default LitterSection;
