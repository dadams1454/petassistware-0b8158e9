
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import WeightTracker from './weight/WeightTracker';
import MilestoneTracker from './milestones/MilestoneTracker';
import { Puppy } from './types';

const PuppyDetail: React.FC = () => {
  const { puppyId } = useParams<{ puppyId: string }>();
  const [activeTab, setActiveTab] = useState<string>('weight');
  
  const { data: puppy, isLoading, refetch } = useQuery({
    queryKey: ['puppy-detail', puppyId],
    queryFn: async () => {
      if (!puppyId) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*, litter:litters(birth_date)')
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      return data as Puppy & { litter: { birth_date: string } };
    },
    enabled: !!puppyId
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!puppy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Puppy not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {puppy.name || 'Unnamed Puppy'} 
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({puppy.gender || 'Unknown'} • {puppy.color || 'Unknown color'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weight" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="weight">Weight Tracking</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="socialization">Socialization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weight">
              <WeightTracker puppyId={puppyId!} />
            </TabsContent>
            
            <TabsContent value="milestones">
              <MilestoneTracker 
                puppyId={puppyId!} 
                birthDate={puppy.birth_date || puppy.litter?.birth_date}
              />
            </TabsContent>
            
            <TabsContent value="socialization">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    Socialization tracking coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyDetail;
