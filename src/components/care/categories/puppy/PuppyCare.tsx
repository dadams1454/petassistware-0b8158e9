
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/standardized';
import { useCareCategories } from '@/contexts/CareCategories/CareCategoriesContext';
import PuppyAgeGroupCard from './components/PuppyAgeGroupCard';
import PuppyCareForm from './components/PuppyCareForm';
import PuppyCareHistory from './components/PuppyCareHistory';

interface PuppyCareProps {
  litter?: {
    id: string;
    name: string;
    birthDate: Date;
  };
  puppies?: {
    id: string;
    name: string;
    birthDate: Date;
    litterSize: number;
  }[];
}

const PuppyCare: React.FC<PuppyCareProps> = ({ litter, puppies = [] }) => {
  const { puppyAgeGroups } = useCareCategories();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(puppyAgeGroups[0]?.id || '');
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleLogCare = (puppyId: string, ageGroupId: string) => {
    setSelectedPuppyId(puppyId);
    setSelectedAgeGroup(ageGroupId);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setActiveTab('history');
  };

  // Calculate puppy age if we have birth date
  const getAgeInDays = (birthDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine appropriate age group based on days
  const getAgeGroup = (days: number) => {
    if (days <= 2) return puppyAgeGroups[0]; // 0-48 hours
    if (days <= 7) return puppyAgeGroups[1]; // 3-7 days
    if (days <= 21) return puppyAgeGroups[2]; // 2-3 weeks
    if (days <= 42) return puppyAgeGroups[3]; // 3-6 weeks
    if (days <= 56) return puppyAgeGroups[4]; // 6-8 weeks
    return puppyAgeGroups[5]; // 8-10 weeks
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Puppy Care"
        description={litter ? `Tracking for ${litter.name}` : "Age-based puppy care tracking"}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="add">Log Care</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puppyAgeGroups.map((ageGroup) => (
              <PuppyAgeGroupCard 
                key={ageGroup.id}
                ageGroup={ageGroup}
                puppies={puppies?.filter(p => {
                  const days = p.birthDate ? getAgeInDays(p.birthDate) : 0;
                  const group = getAgeGroup(days);
                  return group?.id === ageGroup.id;
                })}
                onLogCare={(puppyId) => handleLogCare(puppyId, ageGroup.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Puppy Care</CardTitle>
            </CardHeader>
            <CardContent>
              <PuppyCareForm 
                puppies={puppies}
                ageGroups={puppyAgeGroups}
                defaultAgeGroup={selectedAgeGroup}
                defaultPuppyId={selectedPuppyId}
                onSuccess={handleFormSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <PuppyCareHistory />
        </TabsContent>
      </Tabs>
      
      {/* Puppy Care Form Dialog */}
      {isFormOpen && selectedPuppyId && (
        <PuppyCareForm 
          puppies={puppies}
          ageGroups={puppyAgeGroups}
          defaultAgeGroup={selectedAgeGroup}
          defaultPuppyId={selectedPuppyId}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default PuppyCare;
