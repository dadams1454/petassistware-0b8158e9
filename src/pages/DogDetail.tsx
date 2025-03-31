
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DogDetails from '@/components/dogs/DogDetails';
import BackButton from '@/components/common/BackButton';
import PageContainer from '@/components/common/PageContainer';

const DogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch the specific dog data
  const { data: dog, isLoading, error } = useQuery({
    queryKey: ['dog', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        toast({
          title: 'Error fetching dog details',
          description: error.message,
          variant: 'destructive',
        });
        throw new Error(error.message);
      }
      
      return data;
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !dog) {
    return (
      <PageContainer>
        <div className="container mx-auto py-8">
          <BackButton fallbackPath="/dogs" />
          <div className="p-8 bg-muted rounded-lg text-center mt-6">
            <h2 className="text-xl font-semibold mb-2">Dog not found</h2>
            <p className="text-muted-foreground">The requested dog could not be found or you don't have permission to view it.</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-8">
        <BackButton fallbackPath="/dogs" className="mb-6" />
        <DogDetails dog={dog} isFullPage={true} />
      </div>
    </PageContainer>
  );
};

export default DogDetailPage;
