
import React, { useMemo, useState } from 'react';
import { Columns, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyLitterState from './components/EmptyLitterState';
import DeleteLitterDialog from './components/DeleteLitterDialog';
import LitterTableView from './components/LitterTableView';
import LitterCardView from './views/LitterCardView';
import { Litter } from '@/types/litter'; // Make sure we're using the same type throughout
import useLitterActions from './hooks/useLitterActions';

interface LittersListProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onRefresh: () => Promise<any>;
}

// Define OrganizedLitters interface using the imported Litter type
interface OrganizedLitters {
  active: Litter[];
  other: Litter[];
  archived: Litter[];
}

const LittersList: React.FC<LittersListProps> = ({ litters, onEditLitter, onRefresh }) => {
  const [litterToDelete, setLitterToDelete] = useState<Litter | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const isDeleteDialogOpen = Boolean(litterToDelete);
  
  const { 
    handleDeleteLitter,
    handleArchiveLitter,
    handleUnarchiveLitter
  } = useLitterActions(onRefresh, setLitterToDelete);

  // Organize litters by status and dam gender
  const organizedLitters: OrganizedLitters = useMemo(() => {
    const activeLitters = litters.filter(litter => litter.status !== 'archived' && litter.dam?.gender === 'Female');
    const otherActiveLitters = litters.filter(litter => litter.status !== 'archived' && litter.dam?.gender !== 'Female');
    const archivedLitters = litters.filter(litter => litter.status === 'archived');

    return {
      active: activeLitters,
      other: otherActiveLitters,
      archived: archivedLitters
    };
  }, [litters]);

  if (litters.length === 0) {
    return (
      <EmptyLitterState 
        onCreateLitter={() => document.getElementById('new-litter-btn')?.click()} 
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="bg-muted rounded-lg p-1 inline-flex">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-md px-3"
            onClick={() => setViewMode('cards')}
          >
            <Columns className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-md px-3"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <LitterTableView 
          litters={litters} 
          onEditLitter={onEditLitter} 
          onDeleteLitter={(litter) => setLitterToDelete(litter)}
          onArchiveLitter={handleArchiveLitter}
          onUnarchiveLitter={handleUnarchiveLitter}
        />
      ) : (
        <LitterCardView 
          organizedLitters={organizedLitters}
          onEditLitter={onEditLitter}
          onDeleteLitter={(litter) => setLitterToDelete(litter)}
          onArchiveLitter={handleArchiveLitter}
          onUnarchiveLitter={handleUnarchiveLitter}
        />
      )}

      <DeleteLitterDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={(open) => !open && setLitterToDelete(null)}
        onConfirm={handleDeleteLitter}
        onCancel={() => setLitterToDelete(null)}
      />
    </div>
  );
};

export default LittersList;
