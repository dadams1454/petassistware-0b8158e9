
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Litter } from '@/types/litter';
import { GenerateAkcForm } from './actions/GenerateAkcForm';
import PuppiesList from './puppies/PuppiesList';
import WelpingTabContent from '@/components/welping/WelpingTabContent';

interface LitterDetailsProps {
  litterId?: string;
}

const LitterDetails: React.FC<LitterDetailsProps> = ({ litterId: propLitterId }) => {
  const { id: paramLitterId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('puppies');
  
  // Use prop litterId if provided, otherwise use the URL param
  const litterId = propLitterId || paramLitterId;

  const { data: litter, isLoading, error, refetch } = useQuery({
    queryKey: ['litter', litterId],
    queryFn: async () => {
      if (!litterId) throw new Error('Litter ID is required');
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*),
          puppies:puppies(*)
        `)
        .eq('id', litterId)
        .single();

      if (error) throw error;
      return data as unknown as Litter;
    },
    enabled: !!litterId
  });

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading litter details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !litter) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-destructive mb-4">Error loading litter details</p>
            <Button onClick={() => navigate('/litters')}>Back to Litters</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{litter.litter_name || `Litter of ${litter.dam?.name || 'Unknown Dam'}`}</h2>
          <p className="text-muted-foreground">
            Born: {new Date(litter.birth_date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <GenerateAkcForm 
            litterId={litterId} 
            litterName={litter.litter_name}
          />
          <Button 
            variant="outline" 
            onClick={() => navigate(`/litters/${litterId}/edit`)}
          >
            Edit Litter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Dam</h3>
              <div className="bg-muted p-3 rounded-md">
                <p>{litter.dam?.name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{litter.dam?.breed || 'Unknown breed'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Sire</h3>
              <div className="bg-muted p-3 rounded-md">
                <p>{litter.sire?.name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{litter.sire?.breed || 'Unknown breed'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Litter Details</h3>
              <div className="bg-muted p-3 rounded-md">
                <p>Puppies: {litter.puppies?.length || 0}</p>
                <p className="text-sm text-muted-foreground">
                  {litter.male_count || 0} males, {litter.female_count || 0} females
                </p>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="puppies">Puppies</TabsTrigger>
              <TabsTrigger value="welping">Welping Records</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="puppies">
              <PuppiesList 
                puppies={litter.puppies || []} 
                litterId={litterId}
                onRefresh={handleRefresh}
              />
            </TabsContent>
            
            <TabsContent value="welping">
              <WelpingTabContent 
                litterId={litterId}
                puppies={litter.puppies || []}
                onRefresh={handleRefresh}
                activeTab="record"
                setActiveTab={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="p-4 border rounded-md">
                <p className="text-muted-foreground italic">
                  {litter.notes || 'No notes available for this litter.'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LitterDetails;
