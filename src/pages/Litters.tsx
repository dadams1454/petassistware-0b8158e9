import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import LitterForm from '@/components/litters/LitterForm';
import LittersList from '@/components/litters/LittersList';
import { Litter } from '@/types/litter';

const Litters: React.FC = () => {
  const { toast } = useToast();
  const [litters, setLitters] = useState<Litter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLitter, setSelectedLitter] = useState<Litter | null>(null);
  
  const loadLitters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*)
        `)
        .order('birth_date', { ascending: false });
      
      if (error) throw error;
      
      setLitters(data as unknown as Litter[]);
    } catch (error) {
      console.error('Error loading litters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load litters. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLitters();
  }, []);

  const handleCreateLitter = () => {
    setSelectedLitter(null);
    setIsDialogOpen(true);
  };

  const handleEditLitter = (litter: Litter) => {
    setSelectedLitter(litter);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedLitter(null);
  };

  const handleLitterFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedLitter(null);
    loadLitters();
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <PageHeader 
            title="Litters"
            subtitle="Manage your litters and puppies"
            className="mb-4 md:mb-0"
          />
          
          <Button onClick={handleCreateLitter} id="new-litter-btn">
            <Plus className="h-4 w-4 mr-1" />
            Add Litter
          </Button>
        </div>
        
        <LittersList 
          litters={litters}
          onEditLitter={handleEditLitter}
          onRefresh={loadLitters}
        />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <LitterForm 
              initialData={selectedLitter}
              onSuccess={handleLitterFormSuccess}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default Litters;
