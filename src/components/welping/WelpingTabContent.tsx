
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WelpingPuppyList from './WelpingPuppyList';
import WelpingPuppyForm from './form/WelpingPuppyForm';
import AddWelpingPuppyDialog from './AddWelpingPuppyDialog';
import WelpingDetailsForm from './form/WelpingDetailsForm';
import { Puppy } from '@/types/litter';
import { useQuery } from '@tanstack/react-query';
import { getWelpingRecordForLitter, WelpingRecord } from '@/services/welpingService';

interface WelpingTabContentProps {
  litterId: string;
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const WelpingTabContent: React.FC<WelpingTabContentProps> = ({
  litterId,
  puppies,
  onRefresh,
  activeTab,
  setActiveTab,
}) => {
  const [isAddPuppyOpen, setIsAddPuppyOpen] = useState(false);
  
  const { data: welpingRecord, isLoading: isLoadingRecord, refetch: refetchRecord } = useQuery({
    queryKey: ['welping-record', litterId],
    queryFn: async () => {
      return getWelpingRecordForLitter(litterId);
    },
  });

  const handleWelpingDetailsSuccess = async () => {
    await refetchRecord();
  };

  const handleAddPuppySuccess = async () => {
    setIsAddPuppyOpen(false);
    await onRefresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Whelping Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Whelping Details</TabsTrigger>
            <TabsTrigger value="record">Record Puppy</TabsTrigger>
            <TabsTrigger value="puppies">Puppies ({puppies.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-4">
            <div className="space-y-4">
              <WelpingDetailsForm 
                litterId={litterId}
                initialData={welpingRecord as WelpingRecord}
                onSuccess={handleWelpingDetailsSuccess}
              />
            </div>
          </TabsContent>

          <TabsContent value="record" className="pt-4">
            <div className="space-y-4">
              <WelpingPuppyForm 
                litterId={litterId}
                onSuccess={onRefresh}
              />
            </div>
          </TabsContent>

          <TabsContent value="puppies" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setIsAddPuppyOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Puppy</span>
                </Button>
              </div>

              <WelpingPuppyList 
                puppies={puppies}
                onRefresh={onRefresh}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <AddWelpingPuppyDialog
        litterId={litterId}
        isOpen={isAddPuppyOpen}
        onOpenChange={setIsAddPuppyOpen}
        onSuccess={handleAddPuppySuccess}
      />
    </Card>
  );
};

export default WelpingTabContent;
