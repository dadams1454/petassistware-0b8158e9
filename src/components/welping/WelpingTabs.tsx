
import React from 'react';
import { Clipboard, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import WelpingPuppyForm from './form/WelpingPuppyForm';
import WelpingPuppyList from './WelpingPuppyList';
import { Puppy } from '@/components/litters/puppies/types';
import { useForm } from 'react-hook-form';
import { WelpingPuppyFormData } from './form/hooks/useWelpingPuppyForm';
import { format } from 'date-fns';

interface WelpingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  litterId: string;
  puppies: Puppy[];
  handleRefresh: () => Promise<void>;
  handlePuppyAdded: () => Promise<void>;
}

const WelpingTabs: React.FC<WelpingTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  litterId, 
  puppies, 
  handleRefresh,
  handlePuppyAdded
}) => {
  // Create a reset key that will force the WelpingPuppyForm to remount when a puppy is added
  const [resetKey, setResetKey] = React.useState(0);
  
  // Wrapper for handlePuppyAdded that also increments the reset key
  const handleSuccess = async () => {
    await handlePuppyAdded();
    // Increment reset key to force form remount with fresh values
    setResetKey(prev => prev + 1);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="record" className="flex items-center gap-1">
          <Clipboard className="h-4 w-4" />
          Record New Puppy
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center gap-1">
          <Tag className="h-4 w-4" />
          Recorded Puppies ({puppies.length || 0})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="record">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-green-600" />
              Record New Puppy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Use key to force component to remount with fresh state */}
            <WelpingPuppyForm 
              key={resetKey}
              litterId={litterId} 
              onSuccess={handleSuccess} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="list">
        <WelpingPuppyList 
          puppies={puppies || []} 
          onRefresh={handleRefresh} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default WelpingTabs;
