
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardCard from '@/components/dashboard/DashboardCard';
import PuppiesList from '@/components/litters/PuppiesList';
import PuppyForm from '@/components/litters/PuppyForm';

interface LitterTabsProps {
  litter: Litter;
  onRefresh: () => Promise<any>;
}

const LitterTabs: React.FC<LitterTabsProps> = ({ litter, onRefresh }) => {
  const [isAddPuppyDialogOpen, setIsAddPuppyDialogOpen] = useState(false);

  const handleAddPuppySuccess = async () => {
    setIsAddPuppyDialogOpen(false);
    await onRefresh();
    // Note: Toast is handled in the parent component
  };

  return (
    <DashboardCard className="lg:col-span-2">
      <Tabs defaultValue="puppies">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="puppies">Puppies</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <Button 
            onClick={() => setIsAddPuppyDialogOpen(true)}
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Puppy
          </Button>
        </div>

        <TabsContent value="puppies" className="mt-0">
          <PuppiesList 
            puppies={litter.puppies || []} 
            litterId={litter.id}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="health" className="mt-0">
          <div className="py-8 text-center text-muted-foreground">
            <p>Health records for this litter will appear here.</p>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <div className="py-8 text-center text-muted-foreground">
            <p>Events related to this litter will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Puppy Dialog */}
      <Dialog open={isAddPuppyDialogOpen} onOpenChange={setIsAddPuppyDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Puppy</DialogTitle>
          </DialogHeader>
          <PuppyForm 
            litterId={litter.id} 
            onSuccess={handleAddPuppySuccess} 
          />
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};

export default LitterTabs;
