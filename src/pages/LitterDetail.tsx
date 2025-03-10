
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/layouts/MainLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LitterForm from '@/components/litters/LitterForm';
import PuppiesList from '@/components/litters/PuppiesList';
import PuppyForm from '@/components/litters/PuppyForm';
import { toast } from '@/components/ui/use-toast';

const LitterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddPuppyDialogOpen, setIsAddPuppyDialogOpen] = useState(false);

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['litter', id],
    queryFn: async () => {
      if (!id) throw new Error('Litter ID is required');
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(id, name, breed, photo_url),
          sire:sire_id(id, name, breed, photo_url),
          puppies(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    await refetch();
    toast({
      title: "Success!",
      description: "Litter updated successfully.",
    });
  };

  const handleAddPuppySuccess = async () => {
    setIsAddPuppyDialogOpen(false);
    await refetch();
    toast({
      title: "Success!",
      description: "Puppy added successfully.",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <p>Loading litter details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !litter) {
    console.error("Error loading litter:", error);
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <Button variant="outline" onClick={() => navigate('/litters')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Litters
          </Button>
          <div className="mt-6 text-center text-red-500">
            <p>Error loading litter details. The litter may not exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/litters')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex-1">
            Litter: {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
          </h1>
          <Button 
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Litter
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard className="lg:col-span-1" title="Litter Information">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                  <p>{format(new Date(litter.birth_date), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Puppy Count</p>
                  <p>{litter.puppy_count || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Dam (Mother)</p>
                <p>{litter.dam?.name || 'Unknown'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Sire (Father)</p>
                <p>{litter.sire?.name || 'Unknown'}</p>
              </div>

              {litter.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-line">{litter.notes}</p>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard className="lg:col-span-2">
            <Tabs defaultValue="puppies">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="puppies">Puppies</TabsTrigger>
                  <TabsTrigger value="health">Health Records</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>

                <Button 
                  onClick={() => setIsAddPuppyDialogOpen(true)}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Puppy
                </Button>
              </div>

              <TabsContent value="puppies" className="mt-0">
                <PuppiesList 
                  puppies={litter.puppies || []} 
                  litterId={litter.id}
                  onRefresh={refetch}
                />
              </TabsContent>

              <TabsContent value="health" className="mt-0">
                <div className="py-8 text-center text-muted-foreground">
                  <p>Health records for this litter will appear here.</p>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="py-8 text-center text-muted-foreground">
                  <p>Events related to this litter will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </DashboardCard>
        </div>
      </div>

      {/* Edit Litter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Litter</DialogTitle>
          </DialogHeader>
          <LitterForm 
            initialData={litter} 
            onSuccess={handleEditSuccess} 
          />
        </DialogContent>
      </Dialog>

      {/* Add Puppy Dialog */}
      <Dialog open={isAddPuppyDialogOpen} onOpenChange={setIsAddPuppyDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Puppy</DialogTitle>
          </DialogHeader>
          <PuppyForm 
            litterId={litter.id} 
            onSuccess={handleAddPuppySuccess} 
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LitterDetail;
