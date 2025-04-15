import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { EmptyState } from '@/components/ui/standardized';
import { useNavigate } from 'react-router-dom';

interface DogData {
  id: string;
  name: string;
  photo_url?: string;
}

const KennelAssignmentsWidget: React.FC = () => {
  const [assignedDogs, setAssignedDogs] = useState<DogData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchAssignedDogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, photo_url')
        .not('group_ids', 'is', null)
        .order('name', { ascending: true });

      if (error) throw error;
      setAssignedDogs(data || []);
    } catch (error) {
      console.error('Error fetching assigned dogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load kennel assignments. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAssignedDogs();
  }, [fetchAssignedDogs]);

  const handleNavigateToKennels = () => {
    navigate('/admin/kennels');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kennel Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>Loading kennel assignments...</p>
        </CardContent>
      </Card>
    );
  }

  if (assignedDogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kennel Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EmptyState
            title="No kennels assigned"
            description="There are no kennels currently assigned to any dogs."
            action={{
              label: "Manage Kennels",
              onClick: () => handleNavigateToKennels(),
              disabled: false
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kennel Assignments</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {assignedDogs.map((dog) => (
            <div key={dog.id} className="flex items-center space-x-4">
              <Avatar>
                {dog.photo_url ? (
                  <AvatarImage src={dog.photo_url} alt={dog.name} />
                ) : (
                  <AvatarFallback><Dog className="h-4 w-4" /></AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{dog.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KennelAssignmentsWidget;
