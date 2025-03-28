
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PuppyAgeGroupData, PuppyWithAge } from '@/types/puppyTracking';
import PuppyCard from './PuppyCard';
import { Baby, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PuppyAgeGroupListProps {
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  ageGroups: PuppyAgeGroupData[];
}

const PuppyAgeGroupList: React.FC<PuppyAgeGroupListProps> = ({ 
  puppiesByAgeGroup, 
  ageGroups 
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    Object.entries(puppiesByAgeGroup)
      .find(([_, puppies]) => puppies.length > 0)?.[0] || 'first24hours'
  );

  // Filter age groups to only show those with puppies
  const populatedGroups = ageGroups.filter(group => {
    const groupId = group.id as keyof typeof puppiesByAgeGroup;
    return puppiesByAgeGroup[groupId]?.length > 0;
  });
  
  if (populatedGroups.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center flex-col p-8 text-center">
            <Baby className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Active Puppies</h3>
            <p className="text-muted-foreground">
              Puppy information will appear here when you add puppies to litters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Puppies by Development Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            {populatedGroups.map(group => {
              const groupId = group.id as keyof typeof puppiesByAgeGroup;
              const count = puppiesByAgeGroup[groupId]?.length || 0;
              
              if (count === 0) return null;
              
              return (
                <TabsTrigger 
                  key={group.id} 
                  value={group.id}
                  className="flex flex-col sm:flex-row items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <Baby className="h-4 w-4" />
                  <span className="hidden sm:inline">{group.name}</span>
                  <Badge variant="secondary" className="ml-0 sm:ml-1">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {populatedGroups.map(group => {
            const groupId = group.id as keyof typeof puppiesByAgeGroup;
            const puppiesInGroup = puppiesByAgeGroup[groupId] || [];
            
            return (
              <TabsContent key={group.id} value={group.id}>
                <div className="mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {group.name}
                    <Badge variant="outline" className="ml-2 bg-primary/10">
                      {group.startDay}-{group.endDay} days
                    </Badge>
                  </h3>
                  <p className="text-muted-foreground mt-1">{group.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {puppiesInGroup.map(puppy => (
                    <PuppyCard 
                      key={puppy.id} 
                      puppy={puppy}
                      ageGroup={group}
                    />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PuppyAgeGroupList;
