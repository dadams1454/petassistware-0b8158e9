
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clipboard, Stethoscope, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WelpingPuppyForm from '@/components/welping/form/WelpingPuppyForm';
import WelpingPuppyList from '@/components/welping/WelpingPuppyList';
import { Puppy } from '@/components/litters/puppies/types';

interface WelpingTabContentProps {
  litterId: string;
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const WelpingTabContent: React.FC<WelpingTabContentProps> = ({ 
  litterId, 
  puppies, 
  onRefresh,
  activeTab,
  setActiveTab
}) => {
  const handlePuppyAdded = async () => {
    await onRefresh();
    // Switch to the list tab after adding a puppy
    setActiveTab('list');
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
          Recorded Puppies ({puppies?.length || 0})
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
            <WelpingPuppyForm 
              litterId={litterId} 
              onSuccess={onRefresh} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="list">
        <WelpingPuppyList 
          puppies={puppies || []} 
          onRefresh={onRefresh} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default WelpingTabContent;
