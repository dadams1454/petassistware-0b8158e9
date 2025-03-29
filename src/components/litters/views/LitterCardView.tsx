import React from 'react';
import { Archive, Clock, ArchiveRestore } from 'lucide-react';
import LitterSection from '../components/LitterSection';
import { Litter } from '@/types/litter';

interface OrganizedLitters {
  active: Litter[];
  other: Litter[];
  archived: Litter[];
}

interface LitterCardViewProps {
  organizedLitters: OrganizedLitters;
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
}

const LitterCardView: React.FC<LitterCardViewProps> = ({
  organizedLitters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  return (
    <div className="space-y-12">
      {/* Active Litters Section */}
      <LitterSection
        title="Active Litters"
        icon={<Clock className="h-5 w-5 text-blue-500" />}
        litters={organizedLitters.active}
        onEditLitter={onEditLitter}
        onDeleteLitter={onDeleteLitter}
        onArchiveLitter={onArchiveLitter}
      />
      
      {/* Other Active Litters (without a dam or with non-female dam) */}
      {organizedLitters.other.length > 0 && (
        <LitterSection
          title="Other Litters"
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          litters={organizedLitters.other}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
        />
      )}
      
      {/* Archived Litters Section */}
      {organizedLitters.archived.length > 0 && (
        <LitterSection
          title="Archived Litters"
          icon={<Archive className="h-5 w-5 text-muted-foreground" />}
          litters={organizedLitters.archived}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
          onUnarchiveLitter={onUnarchiveLitter}
        />
      )}
      
      {/* Show message if no litters in any category */}
      {organizedLitters.active.length === 0 && 
       organizedLitters.other.length === 0 && 
       organizedLitters.archived.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No litters to display</p>
          <p className="text-sm mt-1">Create a new litter to get started</p>
        </div>
      )}
    </div>
  );
};

export default LitterCardView;
