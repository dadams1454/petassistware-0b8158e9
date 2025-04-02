
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader, LoadingState, ErrorState } from '@/components/ui/standardized';
import PageContainer from '@/components/common/PageContainer';
import { useWelping } from './hooks/useWelping';
import { WelpingLogTimeline, WelpingLogForm } from './components';

const WelpingLogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { litter, welpingLogs, isLoading, error, addWelpingLog, refetchLogs } = useWelping(id);
  
  const handleBackClick = () => {
    navigate(`/welping/${id}`);
  };
  
  const handleAddLog = async (data: any) => {
    await addWelpingLog(data);
    refetchLogs();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading whelping logs..." />
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
          Back to Whelping Details
        </Button>
        
        <PageHeader 
          title="Whelping Logs"
          subtitle={`Timeline of birthing events for ${litter.litter_name || 'litter'}`}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Event</CardTitle>
              </CardHeader>
              <CardContent>
                <WelpingLogForm 
                  litterId={id || ''}
                  onSave={handleAddLog}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Whelping Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <WelpingLogTimeline 
                  logs={welpingLogs || []}
                  puppies={litter.puppies || []}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WelpingLogPage;
