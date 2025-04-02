
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReservationList from '@/components/reservations/ReservationList';
import DepositsList from '@/components/deposits/DepositsList';
import ContractList from '@/components/contracts/ContractList';
import WaitlistManager from '@/components/waitlist/WaitlistManager';

const Reservations: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Reservations & Contracts</h1>
        
        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservations">
            <ReservationList />
          </TabsContent>
          
          <TabsContent value="waitlist">
            <WaitlistManager />
          </TabsContent>
          
          <TabsContent value="deposits">
            <DepositsList />
          </TabsContent>
          
          <TabsContent value="contracts">
            <ContractList />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Reservations;
