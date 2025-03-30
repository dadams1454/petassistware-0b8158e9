import React from 'react';
import { Archive, CirclePlus, Folder } from 'lucide-react';
import { Litter } from '@/types/litter';
import LitterSection from '../components/LitterSection';

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
  // Destructure our organized litters
  const { active, other, archived } = organizedLitters;
  
  // Calculate if we have any litters to display
  const hasActive = active.length > 0;
  const hasOther = other.length > 0;
  const hasArchived = archived.length > 0;
  
  if (!hasActive && !hasOther && !hasArchived) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No litters found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-12">
      {/* Active Dam Litters Section */}
      {hasActive && (
        <LitterSection
          title="Active Dam Litters"
          icon={<CirclePlus className="h-5 w-5 text-green-500" />}
          litters={active}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
        />
      )}
      
      {/* Other Litters Section */}
      {hasOther && (
        <LitterSection
          title="Other Active Litters"
          icon={<Folder className="h-5 w-5 text-blue-500" />}
          litters={other}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
        />
      )}
      
      {/* Archived Litters Section */}
      {hasArchived && (
        <LitterSection
          title="Archived Litters"
          icon={<Archive className="h-5 w-5 text-gray-500" />}
          litters={archived}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
          onUnarchiveLitter={onUnarchiveLitter}
        />
      )}
    </div>
  );
};

export default LitterCardView;
