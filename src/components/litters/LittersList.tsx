
import React, { useMemo } from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { Eye, Edit, Trash2, PlusCircle, PawPrint, UserRound } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

interface LittersListProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onRefresh: () => Promise<any>;
}

const LittersList: React.FC<LittersListProps> = ({ litters, onEditLitter, onRefresh }) => {
  const navigate = useNavigate();
  const [litterToDelete, setLitterToDelete] = React.useState<Litter | null>(null);

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

  const renderLitterSection = (sectionLitters: Litter[], title: string, icon: React.ReactNode) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-lg font-semibold">{title} ({sectionLitters.length})</h2>
      </div>
      
      <div className="space-y-4">
        {sectionLitters.map((litter) => {
          // Calculate litter age in weeks
          const birthDate = new Date(litter.birth_date);
          const ageInWeeks = differenceInWeeks(new Date(), birthDate);
          
          // Count available puppies and get unique colors
          const availablePuppies = (litter.puppies || []).filter(p => p.status === 'Available');
          const colors = [...new Set((litter.puppies || []).map(p => p.color).filter(Boolean))];
          
          return (
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
                    <Badge variant="outline" className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-sm font-medium">
                      {ageInWeeks} weeks old
                    </Badge>
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
                      <span className="text-sm font-medium">Total Puppies:</span> 
                      <span className="text-sm text-muted-foreground">
                        {litter.puppies?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Available:</span> 
                      <span className="text-sm font-medium text-green-600">
                        {availablePuppies.length} puppies
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Colors:</span> 
                      <div className="flex flex-wrap justify-end gap-1">
                        {colors.length > 0 ? (
                          colors.map((color, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </div>
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
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {organizedLitters.female.length > 0 && (
        renderLitterSection(organizedLitters.female, "Female Litters", <UserRound className="h-5 w-5 text-pink-500" />)
      )}
      
      {organizedLitters.other.length > 0 && (
        renderLitterSection(organizedLitters.other, "Other Litters", <PawPrint className="h-5 w-5 text-muted-foreground" />)
      )}
    </div>
  );
};

export default LittersList;
