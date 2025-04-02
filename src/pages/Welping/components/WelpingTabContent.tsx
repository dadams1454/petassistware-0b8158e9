
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
              {/* WelpingDetailsForm will be implemented separately */}
              <p className="text-muted-foreground">Whelping details form will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="record" className="pt-4">
            <div className="space-y-4">
              {/* WelpingPuppyForm will be implemented separately */}
              <p className="text-muted-foreground">Puppy recording form will be displayed here.</p>
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

              {/* PuppyList will be implemented separately */}
              <div className="border rounded-md p-4">
                {puppies.length === 0 ? (
                  <p className="text-center text-muted-foreground">No puppies recorded yet</p>
                ) : (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {puppies.map(puppy => (
                      <div key={puppy.id} className="border rounded-md p-3">
                        <h3 className="font-medium">{puppy.name || `Puppy #${puppy.birth_order || 'Unknown'}`}</h3>
                        <p className="text-sm text-muted-foreground">{puppy.gender}, {puppy.color}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* AddPuppyDialog will be implemented separately */}
      {isAddPuppyOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Puppy</h2>
            <p className="mb-4">Puppy form will be displayed here.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddPuppyOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddPuppyOpen(false)}>Add Puppy</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WelpingTabContent;
