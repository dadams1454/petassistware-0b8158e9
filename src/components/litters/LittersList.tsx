
import React, { useMemo, useState } from 'react';
import { PawPrint, UserRound, Table as TableIcon, Columns, ArchiveIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import LitterSection from './components/LitterSection';
import EmptyLitterState from './components/EmptyLitterState';
import DeleteLitterDialog from './components/DeleteLitterDialog';
import LitterTableView from './components/LitterTableView';
import { Litter } from './puppies/types';

interface LittersListProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onRefresh: () => Promise<any>;
}

const LittersList: React.FC<LittersListProps> = ({ litters, onEditLitter, onRefresh }) => {
  const [litterToDelete, setLitterToDelete] = useState<Litter | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const isDeleteDialogOpen = Boolean(litterToDelete);

  // Organize litters by status and dam gender
  const organizedLitters = useMemo(() => {
    const activeLitters = litters.filter(litter => litter.status !== 'archived' && litter.dam?.gender === 'Female');
    const otherActiveLitters = litters.filter(litter => litter.status !== 'archived' && litter.dam?.gender !== 'Female');
    const archivedLitters = litters.filter(litter => litter.status === 'archived');

    return {
      active: activeLitters,
      other: otherActiveLitters,
      archived: archivedLitters
    };
  }, [litters]);

  const handleDeleteLitter = async () => {
    if (!litterToDelete) return;
    
    try {
      const { error } = await supabase
        .from('litters')
        .delete()
        .eq('id', litterToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Litter deleted",
        description: "The litter has been successfully deleted.",
      });
      
      setLitterToDelete(null);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting litter:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the litter.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveLitter = async (litter: Litter) => {
    try {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'archived' })
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: "Litter archived",
        description: "The litter has been successfully archived.",
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error archiving litter:', error);
      toast({
        title: "Error",
        description: "There was an error archiving the litter.",
        variant: "destructive",
      });
    }
  };

  const handleUnarchiveLitter = async (litter: Litter) => {
    try {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'active' })
        .eq('id', litter.id);
      
      if (error) throw error;
      
      toast({
        title: "Litter unarchived",
        description: "The litter has been successfully unarchived.",
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error unarchiving litter:', error);
      toast({
        title: "Error",
        description: "There was an error unarchiving the litter.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDeleteDialog = () => {
    setLitterToDelete(null);
  };

  if (litters.length === 0) {
    return (
      <EmptyLitterState 
        onCreateLitter={() => document.getElementById('new-litter-btn')?.click()} 
      />
    );
  }

  return (
    <div className="space-y-8">
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
          onDeleteLitter={setLitterToDelete}
          onArchiveLitter={handleArchiveLitter}
          onUnarchiveLitter={handleUnarchiveLitter}
        />
      ) : (
        <>
          <LitterSection
            title="Active Litters"
            icon={<UserRound className="h-5 w-5 text-pink-500" />}
            litters={organizedLitters.active}
            onEditLitter={onEditLitter}
            onDeleteLitter={setLitterToDelete}
            onArchiveLitter={handleArchiveLitter}
            onUnarchiveLitter={handleUnarchiveLitter}
          />
          
          <LitterSection
            title="Other Litters"
            icon={<PawPrint className="h-5 w-5 text-muted-foreground" />}
            litters={organizedLitters.other}
            onEditLitter={onEditLitter}
            onDeleteLitter={setLitterToDelete}
            onArchiveLitter={handleArchiveLitter}
            onUnarchiveLitter={handleUnarchiveLitter}
          />

          {organizedLitters.archived.length > 0 && (
            <LitterSection
              title="Archived Litters"
              icon={<ArchiveIcon className="h-5 w-5 text-muted-foreground" />}
              litters={organizedLitters.archived}
              onEditLitter={onEditLitter}
              onDeleteLitter={setLitterToDelete}
              onArchiveLitter={handleArchiveLitter}
              onUnarchiveLitter={handleUnarchiveLitter}
            />
          )}
        </>
      )}

      <DeleteLitterDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={(open) => !open && setLitterToDelete(null)}
        onConfirm={handleDeleteLitter}
        onCancel={handleCloseDeleteDialog}
      />
    </div>
  );
};

export default LittersList;
