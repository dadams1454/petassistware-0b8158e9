
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeightTracker from './weight/WeightTracker';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PuppyWeightTracker: React.FC = () => {
  const { puppyId } = useParams<{ puppyId: string }>();
  
  const { data: puppy, isLoading } = useQuery({
    queryKey: ['puppy', puppyId],
    queryFn: async () => {
      if (!puppyId) return null;
      
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('id', puppyId)
        .single();
      
      if (error) throw error;
      return data;
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
            Weight Tracker: {puppy.name || 'Unnamed Puppy'}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <WeightTracker puppyId={puppyId} />
    </div>
  );
};

export default PuppyWeightTracker;
