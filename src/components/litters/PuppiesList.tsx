
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import PuppyForm from './PuppyForm';

interface PuppiesListProps {
  puppies: Puppy[];
  litterId: string;
  onRefresh: () => Promise<any>;
}

const PuppiesList: React.FC<PuppiesListProps> = ({ puppies, litterId, onRefresh }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPuppy, setSelectedPuppy] = useState<Puppy | null>(null);
  const [puppyToDelete, setPuppyToDelete] = useState<Puppy | null>(null);

  const handleEditPuppy = (puppy: Puppy) => {
    setSelectedPuppy(puppy);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    setSelectedPuppy(null);
    await onRefresh();
    toast({
      title: "Success!",
      description: "Puppy updated successfully.",
    });
  };

  const handleDeletePuppy = async () => {
    if (!puppyToDelete) return;
    
    try {
      const { error } = await supabase
        .from('puppies')
        .delete()
        .eq('id', puppyToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "Puppy deleted",
        description: "The puppy has been successfully deleted.",
      });
      
      setPuppyToDelete(null);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting puppy:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the puppy.",
        variant: "destructive",
      });
    }
  };

  if (puppies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No puppies have been added to this litter yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID/Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Microchip #</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puppies.map((puppy) => (
            <TableRow key={puppy.id}>
              <TableCell className="font-medium">
                {puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}
              </TableCell>
              <TableCell>{puppy.gender || 'Unknown'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  puppy.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : puppy.status === 'Reserved' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : puppy.status === 'Sold'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {puppy.status || 'Unknown'}
                </span>
              </TableCell>
              <TableCell>{puppy.microchip_number || 'Not chipped'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPuppy(puppy)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => setPuppyToDelete(puppy)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Puppy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Puppy</DialogTitle>
          </DialogHeader>
          {selectedPuppy && (
            <PuppyForm 
              initialData={selectedPuppy} 
              litterId={litterId}
              onSuccess={handleEditSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!puppyToDelete} onOpenChange={(open) => !open && setPuppyToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this puppy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPuppyToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePuppy}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuppiesList;
