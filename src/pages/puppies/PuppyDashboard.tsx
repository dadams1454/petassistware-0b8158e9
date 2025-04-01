
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/common/PageContainer';
import { Button } from '@/components/ui/button';
import { ChartBar, ChartLine, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePuppyDetail } from '@/hooks/usePuppyDetail';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import PuppyGrowthDashboard from '@/components/puppies/growth/PuppyGrowthDashboard';
import VaccinationDashboard from '@/components/puppies/vaccination/VaccinationDashboard';

const PuppyDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('growth');
  
  const puppyId = id || '';
  
  const { puppy, isLoading, error } = usePuppyDetail(puppyId);
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading puppy dashboard..." />
      </PageContainer>
    );
  }
  
  if (error || !puppy) {
    return (
      <PageContainer>
        <ErrorState 
          title="Error Loading Puppy Data" 
          message="Could not load the puppy information. Please try again."
          action={{
            label: "Back to Litter",
            onClick: () => navigate(-1)
          }}
        />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {puppy.name || `Puppy #${puppy.birth_order || ''}`}
            </h1>
            <p className="text-muted-foreground">
              Growth and health tracking dashboard - {puppy.ageInDays} days old
            </p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(`/litters/${puppy.litter_id}`)}>
            Back to Litter
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="growth" className="flex items-center">
              <ChartLine className="h-4 w-4 mr-2" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="vaccinations" className="flex items-center">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Vaccinations
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center">
              <ChartBar className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth" className="pt-4">
            <PuppyGrowthDashboard puppyId={puppyId} />
          </TabsContent>
          
          <TabsContent value="vaccinations" className="pt-4">
            <VaccinationDashboard puppyId={puppyId} />
          </TabsContent>
          
          <TabsContent value="overview" className="pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Puppy Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive overview of puppy details will be shown here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PuppyDashboard;
