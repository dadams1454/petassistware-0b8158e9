
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import WeightTracker from './weight/WeightTracker';
import MilestoneTracker from './milestones/MilestoneTracker';
import SocializationTracker from './socialization/SocializationTracker';
import { Puppy } from './types';
import PostpartumCareList from '@/components/welping/PostpartumCareList';
import PostpartumCareForm from '@/components/welping/PostpartumCareForm';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { enhancedPuppyData } from '@/services/welpingService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, differenceInDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PuppyDetail: React.FC = () => {
  const { puppyId } = useParams<{ puppyId: string }>();
  const [activeTab, setActiveTab] = useState<string>('weight');
  const [isAddingCare, setIsAddingCare] = useState(false);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['puppy-enhanced-detail', puppyId],
    queryFn: async () => {
      if (!puppyId) return null;
      return enhancedPuppyData(puppyId);
    },
    enabled: !!puppyId
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.puppy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Puppy not found
          </div>
        </CardContent>
      </Card>
    );
  }

  const { puppy, postpartumCare, birthDetails } = data;
  const birthDate = new Date(puppy.birth_date || puppy.litter?.birth_date);
  const ageInDays = differenceInDays(new Date(), birthDate);

  const handleCareSaved = async () => {
    setIsAddingCare(false);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="md:flex md:items-center md:justify-between p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={puppy.photo_url || undefined} alt={puppy.name || 'Puppy'} />
              <AvatarFallback className="bg-primary/10 text-xl">
                {puppy.name ? puppy.name.charAt(0) : 'P'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {puppy.name || 'Unnamed Puppy'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-primary/10">
                  {puppy.gender || 'Unknown gender'}
                </Badge>
                <Badge variant="outline" className="bg-secondary/10">
                  {puppy.color || 'Unknown color'}
                </Badge>
                <Badge variant="outline" className="bg-muted">
                  {ageInDays} days old
                </Badge>
                <Badge variant={puppy.status === 'Available' ? 'default' : 'secondary'}>
                  {puppy.status || 'Unknown status'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {birthDetails && (
          <CardContent className="px-6 pb-6 pt-0">
            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Birth Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Birth Date:</span>{' '}
                  <span className="font-medium">{format(birthDate, 'MMM d, yyyy')}</span>
                </div>
                {puppy.birth_time && (
                  <div>
                    <span className="text-muted-foreground">Birth Time:</span>{' '}
                    <span className="font-medium">{puppy.birth_time}</span>
                  </div>
                )}
                {puppy.birth_weight && (
                  <div>
                    <span className="text-muted-foreground">Birth Weight:</span>{' '}
                    <span className="font-medium">{puppy.birth_weight} oz</span>
                  </div>
                )}
                {birthDetails.description && (
                  <div className="col-span-full">
                    <span className="text-muted-foreground">Birth Notes:</span>{' '}
                    <span>{birthDetails.description}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
        
        <CardContent className="px-6 pb-6 pt-0">
          <Tabs defaultValue="weight" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="socialization">Socialization</TabsTrigger>
              <TabsTrigger value="postpartum">Postpartum Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weight" className="mt-4">
              <WeightTracker puppyId={puppyId!} />
            </TabsContent>
            
            <TabsContent value="milestones" className="mt-4">
              <MilestoneTracker 
                puppyId={puppyId!} 
                birthDate={puppy.birth_date || puppy.litter?.birth_date}
              />
            </TabsContent>
            
            <TabsContent value="socialization" className="mt-4">
              <SocializationTracker puppyId={puppyId!} />
            </TabsContent>
            
            <TabsContent value="postpartum" className="mt-4">
              <div className="space-y-4">
                {!isAddingCare ? (
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setIsAddingCare(true)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Care Record</span>
                    </Button>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Record Postpartum Care</CardTitle>
                      <CardDescription>
                        Document care activities for this puppy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PostpartumCareForm 
                        puppyId={puppyId!}
                        onSuccess={handleCareSaved}
                        onCancel={() => setIsAddingCare(false)}
                      />
                    </CardContent>
                  </Card>
                )}
                
                {ageInDays > 14 && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Puppy Age Notice</AlertTitle>
                    <AlertDescription>
                      This puppy is now {ageInDays} days old. Postpartum care is typically most critical in the first 14 days.
                    </AlertDescription>
                  </Alert>
                )}
                
                <PostpartumCareList careRecords={postpartumCare} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppyDetail;
