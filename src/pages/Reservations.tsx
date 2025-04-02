
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ReservationList } from '@/components/reservations/ReservationList';
import { WaitlistManager } from '@/components/waitlist/WaitlistManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reservations: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <PageHeader 
            title="Reservations & Waitlist"
            subtitle="Manage puppy reservations and waitlist"
            className="mb-4 md:mb-0"
          />
          
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Reservation
          </Button>
        </div>
        
        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservations" className="space-y-4">
            <ReservationList 
              isAddOpen={isAddOpen}
              onAddOpenChange={setIsAddOpen}
            />
          </TabsContent>
          
          <TabsContent value="waitlist" className="space-y-4">
            <WaitlistManager />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Reservations;
