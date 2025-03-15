
import React, { useState, useEffect } from 'react';
import { Dog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface DogData {
  id: string;
  name: string;
  breed: string;
  color: string;
  photo_url?: string;
}

interface DogSelectorProps {
  onDogSelected: (dogId: string) => void;
}

const DogSelector: React.FC<DogSelectorProps> = ({ onDogSelected }) => {
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name, breed, color, photo_url')
          .order('name', { ascending: true });

        if (error) throw error;
        setDogs(data || []);
      } catch (error) {
        console.error('Error fetching dogs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dogs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [toast]);

  const handleDogClick = (dogId: string) => {
    onDogSelected(dogId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Select a Dog</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="p-4 flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="space-y-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Select a Dog</CardTitle>
        </CardHeader>
        <CardContent className="px-0 text-center py-8">
          <Dog className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Dogs Found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You need to add a dog before you can log daily care.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.href = '/dogs?action=add'}
          >
            Add Your First Dog
          </Button>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Select a Dog</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-2 max-h-[400px] overflow-y-auto">
        {dogs.map((dog) => (
          <Card 
            key={dog.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleDogClick(dog.id)}
          >
            <div className="p-4 flex items-center space-x-4">
              {dog.photo_url ? (
                <img 
                  src={dog.photo_url} 
                  alt={dog.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dog className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{dog.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dog.breed} • {dog.color}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </div>
  );
};

export default DogSelector;
