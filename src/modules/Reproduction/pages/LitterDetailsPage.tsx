
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const LitterDetailsPage: React.FC = () => {
  const { litterId } = useParams<{ litterId: string }>();
  const navigate = useNavigate();
  
  // This is just a placeholder - we'll redirect to the existing litter details page
  
  React.useEffect(() => {
    // In a real implementation we would not redirect, but render the content directly
    navigate(`/litters/${litterId}`);
  }, [litterId, navigate]);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center" 
        onClick={() => navigate('/reproduction/litters')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Litters
      </Button>
      
      <div className="text-center py-12">
        <p>Loading litter details...</p>
      </div>
    </div>
  );
};

export default LitterDetailsPage;
