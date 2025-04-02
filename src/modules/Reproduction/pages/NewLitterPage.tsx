
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewLitterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const damId = searchParams.get('damId');
  const sireId = searchParams.get('sireId');
  
  // Here we'll reuse the existing LitterForm component 
  // from src/components/litters/LitterForm.tsx
  
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
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Litter</CardTitle>
        </CardHeader>
        <CardContent>
          {/* This will integrate the existing LitterForm component */}
          <div className="text-center py-8">
            <p>Loading litter form...</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/reproduction/litters')} 
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewLitterPage;
