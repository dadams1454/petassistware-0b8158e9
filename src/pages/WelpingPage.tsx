import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, Clipboard, Paw, Stethoscope, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/layouts/MainLayout';
import WelpingPuppyForm from '@/components/welping/form/WelpingPuppyForm';
import WelpingPuppyList from '@/components/welping/WelpingPuppyList';
import { Litter } from '@/components/litters/puppies/types';

const WelpingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('record');

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['welping-litter', id],
    queryFn: async () => {
      if (!id) throw new Error('Litter ID is required');
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, color, photo_url),
          sire:dogs!litters_sire_id_fkey(id, name, breed, color, photo_url),
          puppies!puppies_litter_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Litter;
    }
  });

  const handlePuppyAdded = async () => {
    await refetch();
    // Optionally switch to the list tab after adding a puppy
    setActiveTab('list');
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

  const puppyCount = litter.puppies?.length || 0;
  const birthDate = new Date(litter.birth_date);

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/litters/${id}`)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Paw className="h-7 w-7 text-pink-500" />
              Welping Session
            </h1>
            <p className="text-muted-foreground">
              Record puppies for {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Litter Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Parents</h3>
                    <div className="flex justify-between">
                      <span className="text-sm">Dam:</span>
                      <span className="text-sm font-medium">{litter.dam?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sire:</span>
                      <span className="text-sm font-medium">{litter.sire?.name || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Litter Details</h3>
                    {litter.litter_name && (
                      <div className="flex justify-between">
                        <span className="text-sm">Name:</span>
                        <span className="text-sm font-medium">{litter.litter_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">Birth Date:</span>
                      <span className="text-sm font-medium">{format(birthDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Puppies Recorded:</span>
                      <Badge variant="outline" className="text-xs">
                        {puppyCount} {puppyCount === 1 ? 'puppy' : 'puppies'}
                      </Badge>
                    </div>
                    {litter.akc_registration_number && (
                      <div className="flex justify-between">
                        <span className="text-sm">AKC Registration:</span>
                        <span className="text-sm font-medium">{litter.akc_registration_number}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/litters/${id}`)}
                    >
                      View Full Litter Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="record" className="flex items-center gap-1">
                  <Clipboard className="h-4 w-4" />
                  Record New Puppy
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Recorded Puppies ({puppyCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="record">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      Record New Puppy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WelpingPuppyForm 
                      litterId={id || ''} 
                      onSuccess={handlePuppyAdded} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="list">
                <WelpingPuppyList 
                  puppies={litter.puppies || []} 
                  onRefresh={refetch} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelpingPage;
