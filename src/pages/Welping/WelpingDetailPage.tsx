
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import { useWelping } from './hooks/useWelping';
import { LitterDetailsCard, WelpingProgressCard } from './components';
import WelpingTabContent from './components/WelpingTabContent';

const WelpingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  
  const { litter, isLoading, error, refetchLitter } = useWelping(id);
  
  const handleBackClick = () => {
    navigate(`/welping`);
  };
  
  const handleRefresh = async () => {
    await refetchLitter();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading whelping details..." />
      </PageContainer>
    );
  }
  
  if (error || !litter) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error" 
          message="Could not load whelping details. The litter may not exist." 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={handleBackClick} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Welping Dashboard
        </Button>
        
        <PageHeader 
          title={litter.litter_name || 'Whelping Session'}
          subtitle={`Birth date: ${new Date(litter.birth_date).toLocaleDateString()}`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <LitterDetailsCard litter={litter} />
            <WelpingProgressCard 
              litter={litter} 
              puppiesCount={litter.puppies?.length || 0} 
            />
          </div>
          
          <div className="md:col-span-2">
            <WelpingTabContent 
              litterId={id || ''} 
              puppies={litter.puppies || []}
              onRefresh={handleRefresh}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WelpingDetailPage;
