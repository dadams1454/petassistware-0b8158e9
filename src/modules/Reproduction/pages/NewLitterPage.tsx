
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LitterForm from '@/components/litters/LitterForm';
import { Litter } from '@/types';

const NewLitterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const damId = searchParams.get('damId');
  const sireId = searchParams.get('sireId');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSuccess = () => {
    navigate('/reproduction/litters');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center" 
        onClick={() => navigate('/reproduction/litters')}
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Litters
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Litter</CardTitle>
        </CardHeader>
        <CardContent>
          <LitterForm 
            initialData={damId ? { dam_id: damId, sire_id: sireId || undefined } as Partial<Litter> : undefined}
            onSuccess={handleSuccess}
            onCancel={() => navigate('/reproduction/litters')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewLitterPage;
