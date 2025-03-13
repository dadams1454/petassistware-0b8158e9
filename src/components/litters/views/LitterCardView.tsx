
import React from 'react';
import { Litter } from '../puppies/types';
import LitterSection from '../components/LitterSection';
import { PawPrint, UserRound, ArchiveIcon } from 'lucide-react';

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
    <>
      <LitterSection
        title="Active Litters"
        icon={<UserRound className="h-5 w-5 text-pink-500" />}
        litters={organizedLitters.active}
        onEditLitter={onEditLitter}
        onDeleteLitter={onDeleteLitter}
        onArchiveLitter={onArchiveLitter}
        onUnarchiveLitter={onUnarchiveLitter}
      />
      
      <LitterSection
        title="Other Litters"
        icon={<PawPrint className="h-5 w-5 text-muted-foreground" />}
        litters={organizedLitters.other}
        onEditLitter={onEditLitter}
        onDeleteLitter={onDeleteLitter}
        onArchiveLitter={onArchiveLitter}
        onUnarchiveLitter={onUnarchiveLitter}
      />

      {organizedLitters.archived.length > 0 && (
        <LitterSection
          title="Archived Litters"
          icon={<ArchiveIcon className="h-5 w-5 text-muted-foreground" />}
          litters={organizedLitters.archived}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
          onUnarchiveLitter={onUnarchiveLitter}
        />
      )}
    </>
  );
};

export default LitterCardView;
