
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, BarChart, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/ui/standardized';
import ActiveWelpingsList from '@/components/welping/dashboard/ActiveWelpingsList';
import WelpingStatsCard from '@/components/welping/dashboard/WelpingStatsCard';
import WelpingPreparationGuide from '@/components/welping/dashboard/WelpingPreparationGuide';

const WelpingDashboard = () => {
  const navigate = useNavigate();
  
  // Fetch active litters with pregnant dams
  const { data: activeLitters, isLoading } = useQuery({
    queryKey: ['welping-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dogs!litters_dam_id_fkey(id, name, breed, gender, photo_url, is_pregnant),
          sire:dogs!litters_sire_id_fkey(id, name, breed, gender, photo_url),
          puppies:puppies!puppies_litter_id_fkey(count)
        `)
        .eq('status', 'active')
        .order('birth_date', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });
  
  // Count of actively pregnant dogs (is_pregnant = true)
  const { data: pregnantDogs } = useQuery({
    queryKey: ['pregnant-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url, gender, is_pregnant, last_heat_date, tie_date')
        .eq('gender', 'Female')
        .eq('is_pregnant', true);
        
      if (error) throw error;
      return data;
    }
  });
  
  const handleStartNewWelping = () => {
    navigate('/welping/new');
  };
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader
          title="Welping Management"
          description="Monitor and manage all active whelping activities"
          action={{
            label: "Start New Welping",
            onClick: handleStartNewWelping,
            icon: <Plus className="h-4 w-4 mr-2" />,
          }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WelpingStatsCard 
            pregnantCount={pregnantDogs?.length || 0} 
            activeWelpingsCount={activeLitters?.filter(litter => 
              litter.dam?.is_pregnant || 
              (litter.birth_date && new Date(litter.birth_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            ).length || 0}
            totalPuppiesCount={activeLitters?.reduce((total, litter) => {
              // Handle the puppies count safely regardless of whether it's an array or object with count property
              const puppyCount = litter.puppies ? 
                (typeof litter.puppies === 'number' ? litter.puppies : 
                Array.isArray(litter.puppies) ? litter.puppies.length : 
                typeof litter.puppies === 'object' && 'count' in litter.puppies ? litter.puppies.count : 0) : 0;
              return total + puppyCount;
            }, 0) || 0}
          />
          
          <WelpingPreparationGuide />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-muted-foreground" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => navigate('/breeding-prep')}
                >
                  Breeding Preparation
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/dogs')}
                >
                  Manage Dogs
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/litters')}
                >
                  Manage Litters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Whelping</TabsTrigger>
            <TabsTrigger value="pregnant">Pregnant Dogs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 pt-4">
            <ActiveWelpingsList 
              litters={activeLitters || []} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="pregnant" className="space-y-4 pt-4">
            <Card>
              <CardContent className="pt-6">
                {!pregnantDogs?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pregnant dogs currently recorded
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pregnantDogs.map(dog => (
                      <Card key={dog.id} className="overflow-hidden">
                        <div className="flex items-center p-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mr-4">
                            {dog.photo_url ? (
                              <img src={dog.photo_url} alt={dog.name} className="h-full w-full object-cover" />
                            ) : (
                              <Dog className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{dog.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {dog.tie_date ? `Bred: ${new Date(dog.tie_date).toLocaleDateString()}` : 'No breeding date'}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 pb-4 pt-2 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/dogs/${dog.id}/reproductive`)}
                          >
                            Manage
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default WelpingDashboard;
