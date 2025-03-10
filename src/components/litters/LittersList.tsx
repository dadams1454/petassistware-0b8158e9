
import React from 'react';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface LittersListProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onRefresh: () => Promise<any>;
}

const LittersList: React.FC<LittersListProps> = ({ litters, onEditLitter, onRefresh }) => {
  const navigate = useNavigate();
  const [litterToDelete, setLitterToDelete] = React.useState<Litter | null>(null);

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

  if (litters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No litters found</p>
        <Button variant="outline" onClick={() => document.getElementById('new-litter-btn')?.click()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create your first litter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {litters.map((litter) => (
          <Card key={litter.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Born: {format(new Date(litter.birth_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-sm font-medium">
                    {litter.puppy_count || 0} puppies
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dam:</span> 
                    <span className="text-sm text-muted-foreground">{litter.dam?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Sire:</span> 
                    <span className="text-sm text-muted-foreground">{litter.sire?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Puppies:</span> 
                    <span className="text-sm text-muted-foreground">
                      {litter.puppies?.length || 0} registered
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex border-t">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none py-2 h-12"
                  onClick={() => navigate(`/litters/${litter.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <div className="w-px bg-border" />
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none py-2 h-12"
                  onClick={() => onEditLitter(litter)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <div className="w-px bg-border" />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-none py-2 h-12 text-destructive hover:text-destructive"
                      onClick={() => setLitterToDelete(litter)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this litter? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setLitterToDelete(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteLitter}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LittersList;
