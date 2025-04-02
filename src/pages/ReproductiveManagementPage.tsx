
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/standardized';

const ReproductiveManagementPage: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  
  // Fetch dog data to display the dog's name
  const { data: dog, isLoading, error } = useQuery({
    queryKey: ['dog', dogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Navigate to the new reproduction module
  React.useEffect(() => {
    if (dog) {
      navigate(`/reproduction/breeding/${dogId}`);
    }
  }, [dogId, dog, navigate]);

  if (isLoading) {
    return <LoadingState message="Loading reproductive management data..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Error Loading Dog" 
        message="Could not load the reproductive management data for this dog." 
      />
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center" 
        onClick={() => navigate(`/dogs/${dogId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dog Profile
      </Button>
      
      <div className="text-center">
        <p>Redirecting to reproductive management...</p>
      </div>
    </div>
  );
};

export default ReproductiveManagementPage;
