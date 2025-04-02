
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDogsData } from '../hooks/useDogsData';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import DogForm from '../components/DogForm';

const DogAddPage = () => {
  const navigate = useNavigate();
  const { addDog, isAdding } = useDogsData();
  
  const handleSubmit = async (dogData: any) => {
    try {
      await addDog(dogData);
      navigate('/dogs');
    } catch (error) {
      console.error('Error adding dog:', error);
    }
  };
  
  const handleCancel = () => {
    navigate('/dogs');
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleCancel} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dogs
        </Button>
        
        <PageHeader
          title="Add New Dog"
          subtitle="Create a new dog profile with all details"
        />
        
        <div className="mt-6 bg-card rounded-lg border p-6">
          <DogForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isAdding}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default DogAddPage;
