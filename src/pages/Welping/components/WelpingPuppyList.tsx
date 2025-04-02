
import React, { useState } from 'react';
import { Puppy } from '@/types/litter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Eye } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WelpingPuppyListProps {
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
}

const WelpingPuppyList: React.FC<WelpingPuppyListProps> = ({ puppies, onRefresh }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleViewPuppy = (puppyId: string) => {
    // Navigate to puppy details view
    navigate(`/puppies/${puppyId}`);
  };
  
  const handleEditPuppy = (puppyId: string) => {
    // Navigate to puppy edit view
    navigate(`/puppies/${puppyId}/edit`);
  };
  
  const handleDeletePuppy = async (puppy: Puppy) => {
    if (window.confirm(`Are you sure you want to delete ${puppy.name || 'this puppy'}?`)) {
      setIsDeleting(true);
      
      try {
        // Get the litter info
        const { data: litterData } = await supabase
          .from('litters')
          .select('male_count, female_count')
          .eq('id', puppy.litter_id)
          .single();
          
        // Delete the puppy
        const { error } = await supabase
          .from('puppies')
          .delete()
          .eq('id', puppy.id);
          
        if (error) throw error;
        
        // Update the litter counts
        if (litterData) {
          const maleCount = litterData.male_count || 0;
          const femaleCount = litterData.female_count || 0;
          
          if (puppy.gender === 'Male' && maleCount > 0) {
            await supabase
              .from('litters')
              .update({ male_count: maleCount - 1 })
              .eq('id', puppy.litter_id);
          } else if (puppy.gender === 'Female' && femaleCount > 0) {
            await supabase
              .from('litters')
              .update({ female_count: femaleCount - 1 })
              .eq('id', puppy.litter_id);
          }
        }
        
        await onRefresh();
        
        toast({
          title: 'Puppy deleted',
          description: `${puppy.name || 'Puppy'} has been deleted.`
        });
      } catch (error) {
        console.error('Error deleting puppy:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete puppy',
          variant: 'destructive'
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  if (puppies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No puppies recorded yet</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Birth Order</TableHead>
            <TableHead>Birth Weight</TableHead>
            <TableHead>Birth Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puppies.map((puppy) => {
            const birthDate = puppy.birth_date ? new Date(puppy.birth_date) : null;
            const ageInDays = birthDate ? differenceInDays(new Date(), birthDate) : null;
            
            return (
              <TableRow key={puppy.id}>
                <TableCell>
                  <div className="font-medium">{puppy.name || `Puppy #${puppy.birth_order || ''}`}</div>
                  {ageInDays !== null && (
                    <div className="text-xs text-muted-foreground">{ageInDays} days old</div>
                  )}
                </TableCell>
                <TableCell>{puppy.gender}</TableCell>
                <TableCell>{puppy.color}</TableCell>
                <TableCell>{puppy.birth_order || 'N/A'}</TableCell>
                <TableCell>{puppy.birth_weight || 'N/A'}</TableCell>
                <TableCell>{puppy.birth_time || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewPuppy(puppy.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPuppy(puppy.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePuppy(puppy)}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default WelpingPuppyList;
