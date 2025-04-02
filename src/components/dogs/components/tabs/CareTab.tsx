
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon, PlusCircle, PawPrint, Coffee, Scissors, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useCareActivities } from '@/hooks/useCareActivities';
import { formatDistanceToNow, format } from 'date-fns';
import { CareActivity } from '@/services/careService';
import { SectionHeader, ActionButton, LoadingState } from '@/components/ui/standardized';
import { CareTabProps } from '../profile/DogProfileTabs';

const activityIcons = {
  potty: <PawPrint className="h-4 w-4" />,
  feeding: <Coffee className="h-4 w-4" />,
  grooming: <Scissors className="h-4 w-4" />,
  training: <Dumbbell className="h-4 w-4" />
};

const CareTab: React.FC<CareTabProps> = ({ dog, isFullPage = false }) => {
  const [activeTab, setActiveTab] = useState<CareActivity['activity_type']>('potty');
  const { 
    activities, 
    lastActivity, 
    recordActivity, 
    isRecording,
    isLoading 
  } = useCareActivities(dog.id, activeTab);

  const handleRecordActivity = () => {
    recordActivity({
      dog_id: dog.id,
      activity_type: activeTab,
      timestamp: new Date().toISOString(),
      notes: `${activeTab} activity recorded for ${dog.name}`
    });
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/10 border-primary/20">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertTitle>Daily care tracking</AlertTitle>
        <AlertDescription>
          Track feeding, medications, exercise, and other care activities for {dog.name}.
        </AlertDescription>
      </Alert>
      
      {!isFullPage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Record care activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <ActionButton 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => handleRecordActivity()} 
                  isLoading={isRecording}
                  loadingText="Recording..."
                  icon={<PlusCircle className="h-4 w-4" />}
                >
                  {`Record ${activeTab}`}
                </ActionButton>
                
                <Button variant="outline" className="justify-start" asChild>
                  <Link to={`/daily-care?dogId=${dog.id}`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    View Care Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Care</CardTitle>
              <CardDescription>Latest care activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingState size="small" message="Loading activities..." />
              ) : activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center text-sm">
                      {activityIcons[activity.activity_type]}
                      <span className="ml-2">
                        {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No recent care activities found.
                </div>
              )}
              
              <Separator className="my-4" />
              
              <Button variant="link" className="p-0" asChild>
                <Link to={`/care?dogId=${dog.id}`}>
                  View all care activities
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {isFullPage && (
        <div className="mt-6 space-y-4">
          <SectionHeader 
            title="Care Activities"
            action={{
              label: isRecording ? "Recording..." : `Record ${activeTab}`,
              onClick: handleRecordActivity
            }}
          />
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CareActivity['activity_type'])}>
            <TabsList>
              <TabsTrigger value="potty">
                <PawPrint className="h-4 w-4 mr-2" />
                Potty Breaks
              </TabsTrigger>
              <TabsTrigger value="feeding">
                <Coffee className="h-4 w-4 mr-2" />
                Feeding
              </TabsTrigger>
              <TabsTrigger value="grooming">
                <Scissors className="h-4 w-4 mr-2" />
                Grooming
              </TabsTrigger>
              <TabsTrigger value="training">
                <Dumbbell className="h-4 w-4 mr-2" />
                Training
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <LoadingState message="Loading care activities..." />
              ) : activities.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No {activeTab} records found.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-4">
                    Last {activeTab}: {lastActivity 
                      ? formatDistanceToNow(new Date(lastActivity.timestamp), { addSuffix: true }) 
                      : 'Never'}
                  </div>
                  
                  <div className="border rounded-md divide-y">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-3 flex justify-between">
                        <span>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</span>
                        {activity.notes && (
                          <span className="text-muted-foreground">{activity.notes}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default CareTab;
