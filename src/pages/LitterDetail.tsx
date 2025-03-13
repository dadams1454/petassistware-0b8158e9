
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/layouts/MainLayout';
import LitterForm from '@/components/litters/LitterForm';
import LitterHeader from '@/components/litters/detail/LitterHeader';
import LitterInfo from '@/components/litters/detail/LitterInfo';
import LitterTabs from '@/components/litters/detail/LitterTabs';
import { Award, Calendar, Check, FileCheck } from 'lucide-react';

const LitterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['litter', id],
    queryFn: async () => {
      if (!id) throw new Error('Litter ID is required');
      
      // Expanded query to get complete dam and sire information
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, color, photo_url, litter_number, gender, registration_number, microchip_number),
          sire:dogs!litters_sire_id_fkey(id, name, breed, color, photo_url, gender, registration_number, microchip_number),
          puppies!puppies_litter_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('Fetched detailed litter data:', data);
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
        <LitterHeader 
          litter={litter} 
          sire={litter.sire}
          dam={litter.dam}
          onEditClick={() => setIsEditDialogOpen(true)} 
        />

        {/* AKC Compliance Status Card */}
        {litter.akc_registration_number && (
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-purple-800">AKC Registration</h3>
                    <p className="text-sm text-purple-700">{litter.akc_registration_number}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 flex items-center gap-1">
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>Registered</span>
                  </Badge>
                  {litter.akc_registration_date && (
                    <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(litter.akc_registration_date).toLocaleDateString()}</span>
                    </Badge>
                  )}
                  {litter.akc_verified && (
                    <Badge variant="outline" className="bg-white border-green-200 text-green-700 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LitterInfo litter={litter} />
          <div className="lg:col-span-2">
            <LitterTabs 
              litterId={litter.id} 
              litterName={litter.litter_name} 
              dogBreed={litter.sire?.breed || litter.dam?.breed}
              puppies={litter.puppies || []}
            />
          </div>
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
    </MainLayout>
  );
};

export default LitterDetail;
