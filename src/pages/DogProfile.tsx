
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { useDogDetail } from '@/components/dogs/hooks/useDogDetail';
import DogProfileTabs from '@/components/dogs/components/profile/DogProfileTabs';
import { useAuth } from '@/contexts/AuthProvider';
import { DogProfile as DogProfileType } from '@/types/dog';

const DogProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { dog, isLoading, error, refetch } = useDogDetail(id || '');

  // Check localStorage for saved tab on initial load
  useEffect(() => {
    if (id) {
      const savedTab = localStorage.getItem(`lastDogTab_${id}`);
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/dogs/${id}/edit`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading dog profile..." />
      </PageContainer>
    );
  }

  if (error || !dog) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error Loading Dog Profile" 
          message="Could not load the dog profile. Please try again."
          onAction={() => refetch()}
          actionLabel="Retry"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader 
            title={dog.name || 'Unnamed Dog'} 
            subtitle={`${dog.breed || 'Unknown Breed'} • ${dog.gender || 'Unknown Gender'}`}
          />
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Dog
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dog Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <DogProfileTabs 
              currentDog={dog}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              currentUser={user}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default DogProfile;
