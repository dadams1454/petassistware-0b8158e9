
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/common/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import HeatCycleManagement from '@/components/dogs/components/HeatCycleManagement';
import HeatCycleChart from '@/modules/Reproduction/components/HeatCycleChart';
import { HeatCycle } from '@/types/heat-cycles';
import { Dog } from '@/types/dog';

const ReproductiveCyclePage: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  
  // Fetch dog data
  const { data: dog, isLoading: isLoadingDog, error: dogError } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
      
      if (error) throw error;
      return data as Dog;
    },
    enabled: !!dogId
  });
  
  // Fetch heat cycles
  const { data: heatCycles, isLoading: isLoadingCycles, error: cyclesError } = useQuery({
    queryKey: ['heat-cycles', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('heat_cycles')
        .select('*')
        .eq('dog_id', dogId)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as HeatCycle[];
    },
    enabled: !!dogId
  });
  
  // Calculate next heat date based on average cycle length
  const calculateNextHeatDate = () => {
    if (!heatCycles || heatCycles.length < 2) return null;
    
    let totalDays = 0;
    let count = 0;
    
    for (let i = 0; i < heatCycles.length - 1; i++) {
      const current = parseISO(heatCycles[i].start_date);
      const next = parseISO(heatCycles[i + 1].start_date);
      const daysBetween = Math.abs((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysBetween > 0) {
        totalDays += daysBetween;
        count++;
      }
    }
    
    if (count === 0) return null;
    
    const avgDays = Math.round(totalDays / count);
    const lastCycleDate = parseISO(heatCycles[0].start_date);
    return new Date(lastCycleDate.getTime() + avgDays * 24 * 60 * 60 * 1000);
  };
  
  const nextHeatDate = calculateNextHeatDate();
  
  const isLoading = isLoadingDog || isLoadingCycles;
  const error = dogError || cyclesError;
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-20 mr-4" />
            <Skeleton className="h-8 w-2/3" />
          </div>
          <Skeleton className="h-[600px] w-full" />
        </div>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">
          <div className="space-y-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-4"
                onClick={() => navigate(`/dogs/${dogId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Error</h1>
            </div>
            <Card>
              <CardContent className="py-6">
                <div className="text-red-500 text-center">
                  <p>Failed to load reproductive data: {(error as Error).message}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate(`/dogs/${dogId}`)}
                  >
                    Return to Dog Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(`/dogs/${dogId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{dog?.name}'s Reproductive Management</h1>
            <p className="text-muted-foreground">Track and manage heat cycles and breeding events</p>
          </div>
        </div>
        
        <Tabs defaultValue="heat-cycles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="heat-cycles">Heat Cycles</TabsTrigger>
            <TabsTrigger value="analysis">Cycle Analysis</TabsTrigger>
            <TabsTrigger value="breeding-records">Breeding Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="heat-cycles">
            <HeatCycleManagement dogId={dogId || ''} />
          </TabsContent>
          
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Heat Cycle Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Recorded Cycles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{heatCycles?.length || 0}</p>
                      </CardContent>
                    </Card>
                    
                    {heatCycles && heatCycles.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Last Cycle Started</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {format(parseISO(heatCycles[0].start_date), 'MMM d, yyyy')}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {nextHeatDate && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Next Cycle Expected</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{format(nextHeatDate, 'MMM d, yyyy')}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <div className="h-80">
                    <HeatCycleChart 
                      heatCycles={heatCycles || []} 
                      nextHeatDate={nextHeatDate}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="breeding-records">
            <Card>
              <CardHeader>
                <CardTitle>Breeding Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No breeding records found</p>
                  <Button variant="outline" className="mt-4">
                    Record Breeding Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default ReproductiveCyclePage;
