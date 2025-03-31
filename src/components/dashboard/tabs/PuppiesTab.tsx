
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { customSupabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PuppiesTabProps {
  onRefresh: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const { data: puppiesData, isLoading } = useQuery({
    queryKey: ['dashboard-puppies'],
    queryFn: async () => {
      const { data, error } = await customSupabase
        .from('puppies')
        .select('id, name, gender, status, litter_id')
        .order('name');
        
      if (error) throw error;
      return (data || []) as unknown as any[];
    }
  });
  
  const handleGoToLitters = () => {
    navigate('/litters');
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Puppy Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const puppyCount = puppiesData?.length || 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Puppy Management</CardTitle>
            <CardDescription>
              Manage puppies and litters
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-0"
            onClick={handleGoToLitters}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Breeding Management
          </Button>
        </CardHeader>
        <CardContent>
          {puppyCount > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Puppies</span>
                <span className="font-semibold">{puppyCount}</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Visit the Litters page to manage breeding cycles, heat monitoring, and puppy tracking.
              </p>
              
              <Button onClick={handleGoToLitters} className="w-full">
                Go to Litters & Breeding
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No active puppies found. Visit the Litters page to manage breeding cycles and add new litters.
              </p>
              <Button onClick={handleGoToLitters}>
                Go to Litters & Breeding
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppiesTab;
