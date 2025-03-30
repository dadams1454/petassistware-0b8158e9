
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SendCommunication from '@/components/communications/SendCommunication';
import FollowUpManager from '@/components/communications/FollowUpManager';

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('send');

  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Communications"
          subtitle="Manage customer communications and follow-ups"
          className="mb-6"
        />
        
        <Tabs defaultValue="send" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px] mb-6">
            <TabsTrigger value="send">Send Message</TabsTrigger>
            <TabsTrigger value="follow-ups">Follow Ups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="mt-0">
            <SendCommunication />
          </TabsContent>
          
          <TabsContent value="follow-ups" className="mt-0">
            <FollowUpManager />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Communications;
