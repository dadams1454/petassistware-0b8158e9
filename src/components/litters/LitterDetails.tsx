
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Litter } from '@/types/litter';
import PageContainer from '@/components/common/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import LitterForm from './LitterForm';
import PuppiesList from './puppies/PuppiesList';
import { WelpingTabContent } from '@/components/welping/WelpingTabContent';
import { GenerateAkcForm } from './actions/GenerateAkcForm';

const LitterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [litter, setLitter] = useState<Litter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchLitter = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('litters')
          .select(`
            *,
            dam:dam_id(*),
            sire:sire_id(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setLitter(data as unknown as Litter);
      } catch (error) {
        console.error('Error fetching litter:', error);
        toast({
          title: 'Error',
          description: 'Failed to load litter details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLitter();
  }, [id, toast]);

  const handleEditLitter = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteLitter = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase.from('litters').delete().eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Litter Deleted',
        description: 'The litter has been successfully deleted.',
      });
      
      navigate('/litters');
    } catch (error) {
      console.error('Error deleting litter:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the litter.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormSuccess = async () => {
    setIsEditDialogOpen(false);
    
    // Refresh litter data
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setLitter(data as unknown as Litter);
      
      toast({
        title: 'Litter Updated',
        description: 'The litter has been successfully updated.',
      });
    } catch (error) {
      console.error('Error refreshing litter:', error);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6 px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!litter) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6 px-4">
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-2">Litter Not Found</h2>
            <p className="mb-4">The litter you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/litters')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Litters
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/litters')} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{litter.litter_name || `Litter of ${litter.birth_date}`}</h1>
              <p className="text-muted-foreground">
                {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <GenerateAkcForm 
              litterId={litter.id} 
              litterName={litter.litter_name}
            />
            
            <Button variant="outline" onClick={handleEditLitter}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Birth Date</h3>
                <p className="font-medium">{litter.birth_date}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Puppies</h3>
                <p className="font-medium">
                  {litter.puppy_count || 0} total 
                  {litter.male_count ? ` (${litter.male_count} males)` : ''}
                  {litter.female_count ? ` (${litter.female_count} females)` : ''}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">AKC Registration</h3>
                <p className="font-medium">
                  {litter.akc_registration_number || 'Not Registered'}
                  {litter.akc_verified && ' (Verified)'}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
              <p>{litter.notes || 'No notes'}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="puppies" className="w-full">
          <TabsList>
            <TabsTrigger value="puppies">Puppies</TabsTrigger>
            <TabsTrigger value="welping">Welping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="puppies" className="mt-6">
            <PuppiesList litterId={litter.id} />
          </TabsContent>
          
          <TabsContent value="welping" className="mt-6">
            <WelpingTabContent litterId={litter.id} />
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <LitterForm 
              initialData={litter}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <h2 className="text-xl font-semibold mb-4">Delete Litter</h2>
            <p className="mb-4">
              Are you sure you want to delete this litter? This action cannot be undone 
              and will also delete all puppies associated with this litter.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteLitter}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default LitterDetails;
