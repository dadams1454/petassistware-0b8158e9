
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Puppy } from '@/components/litters/puppies/types';
import { WelpingPuppiesTable } from './WelpingPuppiesTable';
import { EmptyState } from './EmptyState';

interface WelpingPuppiesListProps {
  puppies: Puppy[];
  onAddPuppy: () => void;
}

const WelpingPuppiesList: React.FC<WelpingPuppiesListProps> = ({ puppies, onAddPuppy }) => {
  if (!puppies.length) {
    return (
      <EmptyState
        title="No puppies recorded yet"
        description="Start recording puppies as they are born"
        actionText="Record First Puppy"
        onAction={onAddPuppy}
      />
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="weights">Weight Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="p-4">
            <WelpingPuppiesTable puppies={puppies} />
          </TabsContent>
          
          <TabsContent value="weights" className="p-4">
            {/* Weight chart component will go here */}
            <div className="text-center p-8 text-muted-foreground">
              Weight chart coming soon
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WelpingPuppiesList;
