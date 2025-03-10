
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuppiesList from '../PuppiesList';
import WaitlistManager from '../../waitlist/WaitlistManager';

interface LitterTabsProps {
  litterId: string;
  litterName?: string | null;
  dogBreed?: string;
}

const LitterTabs: React.FC<LitterTabsProps> = ({ 
  litterId, 
  litterName = "Litter", 
  dogBreed
}) => {
  return (
    <Tabs defaultValue="puppies" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="puppies">Puppies</TabsTrigger>
        <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
      
      <TabsContent value="puppies" className="mt-6">
        <PuppiesList litterId={litterId} dogBreed={dogBreed} />
      </TabsContent>
      
      <TabsContent value="waitlist" className="mt-6">
        <WaitlistManager litterId={litterId} litterName={litterName || "Litter"} />
      </TabsContent>
      
      <TabsContent value="timeline" className="mt-6">
        <div className="text-center py-12 text-muted-foreground">
          Timeline feature coming soon
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default LitterTabs;
