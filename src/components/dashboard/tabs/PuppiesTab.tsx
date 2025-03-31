
import React from 'react';
import HeatCycleManagement from '../../dogs/components/HeatCycleManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { customSupabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface PuppiesTabProps {
  onRefresh: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  // Fetch all female dogs for heat cycle monitoring
  const { data: femaleDogs, isLoading } = useQuery({
    queryKey: ['femaleDogs'],
    queryFn: async () => {
      const { data, error } = await customSupabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Puppy & Breeding Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Puppy & Breeding Management</CardTitle>
        </CardHeader>
        <CardContent>
          {femaleDogs && femaleDogs.length > 0 ? (
            <div className="space-y-8">
              {femaleDogs.map(dog => (
                <div key={dog.id} className="border-b pb-6 last:border-0">
                  <h3 className="text-lg font-medium mb-4">{dog.name}</h3>
                  <HeatCycleManagement dog={dog} onRefresh={onRefresh} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No female dogs found. Add female dogs to manage heat cycles.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppiesTab;
