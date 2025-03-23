
import React, { memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/MainLayout';
import CommunicationTemplates from '@/components/communications/CommunicationTemplates';
import CommunicationHistory from '@/components/communications/CommunicationHistory';
import SendCommunication from '@/components/communications/SendCommunication';
import FollowUpManager from '@/components/communications/FollowUpManager';

const FollowUpTab = memo(() => <FollowUpManager />);
FollowUpTab.displayName = 'FollowUpTab';

const TemplatesTab = memo(() => <CommunicationTemplates />);
TemplatesTab.displayName = 'TemplatesTab';

const HistoryTab = memo(() => <CommunicationHistory />);
HistoryTab.displayName = 'HistoryTab';

const SendTab = memo(() => <SendCommunication />);
SendTab.displayName = 'SendTab';

const Communications = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Customer Communications</h1>
        
        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="send">Send Communication</TabsTrigger>
            <TabsTrigger value="followup">Follow-Ups</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Communication History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <SendTab />
          </TabsContent>
          
          <TabsContent value="followup" className="space-y-4">
            <FollowUpTab />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <TemplatesTab />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Communications;
