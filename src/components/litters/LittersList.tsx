
import React, { useMemo, useState } from 'react';
import { PawPrint, UserRound, Table as TableIcon, Columns } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import LitterSection from './components/LitterSection';
import EmptyLitterState from './components/EmptyLitterState';
import DeleteLitterDialog from './components/DeleteLitterDialog';
import LitterTableView from './components/LitterTableView';

interface LittersListProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onRefresh: () => Promise<any>;
}

const LittersList: React.FC<LittersListProps> = ({ litters, onEditLitter, onRefresh }) => {
  const [litterToDelete, setLitterToDelete] = useState<Litter | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const isDeleteDialogOpen = Boolean(litterToDelete);

  // Organize litters by dam gender
  const organizedLitters = useMemo(() => {
    const femaleLitters = litters.filter(litter => litter.dam?.gender === 'Female');
    const otherLitters = litters.filter(litter => litter.dam?.gender !== 'Female');

    return {
      female: femaleLitters,
      other: otherLitters
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
        />
      ) : (
        <>
          <LitterSection
            title="Female Litters"
            icon={<UserRound className="h-5 w-5 text-pink-500" />}
            litters={organizedLitters.female}
            onEditLitter={onEditLitter}
            onDeleteLitter={setLitterToDelete}
          />
          
          <LitterSection
            title="Other Litters"
            icon={<PawPrint className="h-5 w-5 text-muted-foreground" />}
            litters={organizedLitters.other}
            onEditLitter={onEditLitter}
            onDeleteLitter={setLitterToDelete}
          />
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
