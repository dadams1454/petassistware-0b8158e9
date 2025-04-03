
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuppyInfoCard from './PuppyInfoCard';
import PuppyProfile from './PuppyProfile';
import WeightTracker from '../litters/puppies/weight/WeightTracker';
import MilestoneTracker from '../litters/puppies/milestones/MilestoneTracker';
import SocializationDashboard from './socialization/SocializationDashboard';
import GrowthMilestoneTracker from './growth/GrowthMilestoneTracker';
import VaccinationReminders from './vaccinations/VaccinationReminders';
import HealthCertificateManager from './health/HealthCertificateManager';
import MedicationTracker from './health/MedicationTracker';
import { Puppy } from '@/types/puppy';

interface PuppyDetailProps {
  puppy: Puppy;
  onRefresh?: () => void;
}

const PuppyDetail: React.FC<PuppyDetailProps> = ({ puppy, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const parseWeight = () => {
    if (puppy.current_weight) {
      const weight = parseFloat(puppy.current_weight);
      return isNaN(weight) ? undefined : weight;
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      <PuppyInfoCard puppy={puppy} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 sm:grid-cols-6 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="socialization">Socialization</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="health" className="hidden sm:block">Health</TabsTrigger>
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
          <div className="space-y-6">
            <VaccinationReminders puppyId={puppy.id} puppyName={puppy.name} />
            <MedicationTracker 
              puppyId={puppy.id} 
              puppyWeight={parseWeight()} 
              puppyWeightUnit={puppy.weight_unit || 'lb'} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="health">
          <div className="space-y-6">
            <HealthCertificateManager puppyId={puppy.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PuppyDetail;
