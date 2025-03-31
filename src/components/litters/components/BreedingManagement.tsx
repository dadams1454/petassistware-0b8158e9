
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { customSupabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import HeatCycleManagement from '../../dogs/components/HeatCycleManagement';
import { Heart } from 'lucide-react';

interface BreedingManagementProps {
  onRefresh?: () => void;
}

interface Dog {
  id: string;
  name: string;
  gender: string;
  // Add other dog properties as needed
}

const BreedingManagement: React.FC<BreedingManagementProps> = ({ onRefresh }) => {
  // Fetch all female dogs for heat cycle monitoring
  const { data: femaleDogs, isLoading } = useQuery({
    queryKey: ['breeding-female-dogs'],
    queryFn: async () => {
      const { data, error } = await customSupabase
        .from('dogs')
        .select('*')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return (data || []) as unknown as Dog[];
    }
  });
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Heat Cycle & Breeding Management
            </CardTitle>
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Heat Cycle & Breeding Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {femaleDogs && femaleDogs.length > 0 ? (
            <div className="space-y-8">
              {femaleDogs.map((dog) => (
                <div key={dog.id} className="border-b pb-6 last:border-0">
                  <h3 className="text-lg font-medium mb-4">{dog.name}</h3>
                  <HeatCycleManagement dog={dog} onRefresh={handleRefresh} />
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

export default BreedingManagement;
