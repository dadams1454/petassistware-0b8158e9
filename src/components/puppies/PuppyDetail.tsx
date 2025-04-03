
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuppyInfoCard from './PuppyInfoCard';
import PuppyProfile from './PuppyProfile';
import WeightTracker from '../litters/puppies/weight/WeightTracker';
import MilestoneTracker from '../litters/puppies/milestones/MilestoneTracker';
import SocializationDashboard from './socialization/SocializationDashboard';
import GrowthMilestoneTracker from './growth/GrowthMilestoneTracker';
import { Puppy } from '@/types/puppy';

interface PuppyDetailProps {
  puppy: Puppy;
  onRefresh?: () => void;
}

const PuppyDetail: React.FC<PuppyDetailProps> = ({ puppy, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <PuppyInfoCard puppy={puppy} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 sm:grid-cols-5 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="socialization">Socialization</TabsTrigger>
          <TabsTrigger value="medical" className="hidden sm:block">Medical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <PuppyProfile puppy={puppy} onRefresh={onRefresh} />
        </TabsContent>
        
        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>{puppy.name}'s Growth Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <WeightTracker 
                puppyId={puppy.id} 
                birthDate={puppy.birth_date}
                onAddSuccess={onRefresh}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <GrowthMilestoneTracker puppyId={puppy.id} />
        </TabsContent>
        
        <TabsContent value="socialization">
          <SocializationDashboard puppyId={puppy.id} />
        </TabsContent>
        
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Medical records feature coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PuppyDetail;
