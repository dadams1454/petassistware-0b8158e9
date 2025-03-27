
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PuppyAgeGroup } from '@/types/careCategories';
import PuppyAgeGroupCard from './components/PuppyAgeGroupCard';
import PuppyCareForm from './components/PuppyCareForm';
import PuppyCareHistory from './components/PuppyCareHistory';

const PuppyCare: React.FC = () => {
  const [activeTab, setActiveTab] = useState('care');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  
  // Define the puppy age groups
  const ageGroups: PuppyAgeGroup[] = [
    {
      id: 'first-48',
      name: 'First 48 Hours',
      range: '0-48 hours',
      description: 'Critical first 48 hours after birth',
      tasks: [
        { id: 'weight', name: 'Weight Check', description: 'Monitor weight every 8-12 hours', required: true, frequency: 'Every 8-12 hours' },
        { id: 'temp', name: 'Temperature', description: 'Check temperature', required: true, frequency: 'Every 12 hours' },
        { id: 'nursing', name: 'Nursing', description: 'Monitor nursing/feeding', required: true, frequency: 'Every 2-3 hours' }
      ]
    },
    {
      id: 'first-week',
      name: 'First Week',
      range: '3-7 days',
      description: 'First week of life',
      tasks: [
        { id: 'weight', name: 'Weight Check', description: 'Monitor weight daily', required: true, frequency: 'Daily' },
        { id: 'temp', name: 'Temperature', description: 'Check temperature', required: false, frequency: 'Daily if needed' },
        { id: 'cleaning', name: 'Nesting Box Cleaning', description: 'Clean bedding', required: true, frequency: 'Daily' }
      ]
    },
    {
      id: 'week-2-3',
      name: 'Weeks 2-3',
      range: '8-21 days',
      description: 'Starting to explore',
      tasks: [
        { id: 'weight', name: 'Weight Check', description: 'Monitor weight', required: true, frequency: 'Every other day' },
        { id: 'health', name: 'Health Check', description: 'General health assessment', required: true, frequency: 'Every 2-3 days' },
        { id: 'weaning-prep', name: 'Weaning Preparation', description: 'Begin introducing solid foods', required: false }
      ]
    },
    {
      id: 'week-3-6',
      name: 'Weeks 3-6',
      range: '22-42 days',
      description: 'Socialization period begins',
      tasks: [
        { id: 'feeding', name: 'Feeding', description: 'Monitor food intake as weaning progresses', required: true, frequency: '3-4 times daily' },
        { id: 'play', name: 'Play/Socialization', description: 'Provide play and socialization', required: true, frequency: 'Daily' },
        { id: 'deworming', name: 'Deworming', description: 'Deworming schedule', required: true, frequency: 'As scheduled' }
      ]
    },
    {
      id: 'week-6-8',
      name: 'Weeks 6-8',
      range: '43-56 days',
      description: 'Preparing for new homes',
      tasks: [
        { id: 'exercise', name: 'Exercise', description: 'Structured exercise sessions', required: true, frequency: 'Multiple times daily' },
        { id: 'training', name: 'Basic Training', description: 'Start basic commands', required: true, frequency: 'Daily sessions' },
        { id: 'vet', name: 'Veterinary Check', description: 'Pre-home vet examination', required: true }
      ]
    },
    {
      id: 'week-8-10',
      name: 'Weeks 8-10',
      range: '57-70 days',
      description: 'Transition to new homes',
      tasks: [
        { id: 'independence', name: 'Independence', description: 'Foster independence', required: true, frequency: 'Daily activities' },
        { id: 'preparation', name: 'Going Home Prep', description: 'Prepare for transition to new home', required: true },
        { id: 'final-check', name: 'Final Check', description: 'Final health and behavior assessment', required: true }
      ]
    }
  ];
  
  const handleAgeGroupSelect = (ageGroupId: string) => {
    setSelectedAgeGroup(ageGroupId);
    setActiveTab('add');
  };
  
  const handleCareSuccess = () => {
    setActiveTab('history');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Puppy Care</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="care">Age Groups</TabsTrigger>
            <TabsTrigger value="add">Add Care Record</TabsTrigger>
            <TabsTrigger value="history">Care History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="care" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ageGroups.map((ageGroup) => (
                <PuppyAgeGroupCard 
                  key={ageGroup.id}
                  ageGroup={ageGroup}
                  onSelect={() => handleAgeGroupSelect(ageGroup.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="mt-4">
            <PuppyCareForm 
              ageGroups={ageGroups}
              defaultAgeGroup={selectedAgeGroup}
              onSuccess={handleCareSuccess}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <PuppyCareHistory />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PuppyCare;
