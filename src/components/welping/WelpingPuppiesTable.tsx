
import React, { useState } from 'react';
import { Puppy } from '@/components/litters/puppies/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface WelpingPuppiesTableProps {
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
}

export const WelpingPuppiesTable: React.FC<WelpingPuppiesTableProps> = ({ 
  puppies,
  onRefresh
}) => {
  const [puppyToDelete, setPuppyToDelete] = useState<Puppy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePuppy = async () => {
    if (!puppyToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('puppies')
        .delete()
        .eq('id', puppyToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Puppy Deleted",
        description: `${puppyToDelete.name || 'Puppy'} has been removed from the litter.`,
      });
      
      await onRefresh();
    } catch (error) {
      console.error('Error deleting puppy:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting the puppy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPuppyToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Birth Time</TableHead>
              <TableHead>Birth Weight</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {puppies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No puppies have been recorded yet
                </TableCell>
              </TableRow>
            ) : (
              puppies.map((puppy) => (
                <TableRow key={puppy.id}>
                  <TableCell className="font-medium">{puppy.id.substring(0, 6)}</TableCell>
                  <TableCell>{puppy.name || 'Unnamed'}</TableCell>
                  <TableCell>{puppy.gender || 'Unknown'}</TableCell>
                  <TableCell>{puppy.color || 'Not specified'}</TableCell>
                  <TableCell>{puppy.birth_time || 'Not recorded'}</TableCell>
                  <TableCell>{puppy.birth_weight || 'Not recorded'}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="ghost" size="icon" title="Edit puppy">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => setPuppyToDelete(puppy)}
                      title="Delete puppy"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!puppyToDelete} onOpenChange={(open) => !open && setPuppyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Puppy?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {puppyToDelete?.name || 'this puppy'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePuppy}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
