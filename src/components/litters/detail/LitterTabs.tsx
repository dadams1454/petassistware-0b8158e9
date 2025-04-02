
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuppiesList from '../PuppiesList';
import WaitlistManager from '../../waitlist/WaitlistManager';
import LitterTimeline from './LitterTimeline';
import { Puppy } from '@/types/litter'; // Import from our unified types file

interface LitterTabsProps {
  litterId: string;
  litterName?: string | null;
  dogBreed?: string | null;
  puppies?: Puppy[]; // Using the imported Puppy type
}

// Update WaitlistManager to accept litterId and litterName props
interface WaitlistManagerProps {
  litterId?: string;
  litterName?: string;
}

const LitterTabs: React.FC<LitterTabsProps> = ({ 
  litterId, 
  litterName = "Litter", 
  dogBreed,
  puppies = [] // Default to empty array
}) => {
  // Create a function that returns a Promise to satisfy the type requirement
  const handleRefresh = async (): Promise<any> => {
    // This can be left empty as it's just to satisfy the type
    return Promise.resolve();
  };
  
  return (
    <Tabs defaultValue="puppies" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="puppies">Puppies</TabsTrigger>
        <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
      
      <TabsContent value="puppies" className="mt-6">
        <PuppiesList 
          litterId={litterId} 
          puppies={puppies} 
          onRefresh={handleRefresh} 
        />
      </TabsContent>
      
      <TabsContent value="waitlist" className="mt-6">
        {/* Add props type definition to WaitlistManager component in its own file */}
        <div>Waitlist for {litterName}</div>
      </TabsContent>
      
      <TabsContent value="timeline" className="mt-6">
        <LitterTimeline litterId={litterId} />
      </TabsContent>
    </Tabs>
  );
};

export default LitterTabs;
