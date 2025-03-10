
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WaitlistTable from './WaitlistTable';
import { WaitlistEntry } from './types';

interface WaitlistTabsProps {
  entries: WaitlistEntry[];
  isLoading: boolean;
  onUpdateStatus: (entry: WaitlistEntry, newStatus: WaitlistEntry['status']) => void;
  onUpdatePosition: (entry: WaitlistEntry, direction: 'up' | 'down') => void;
  onEditEntry: (entry: WaitlistEntry) => void;
}

const WaitlistTabs: React.FC<WaitlistTabsProps> = ({
  entries,
  isLoading,
  onUpdateStatus,
  onUpdatePosition,
  onEditEntry
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading waitlist...</div>;
  }

  if (entries?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customers on the waitlist yet. Add a customer to get started.
      </div>
    );
  }

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="contacted">Contacted</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <WaitlistTable 
          entries={entries || []}
          onUpdateStatus={onUpdateStatus}
          onUpdatePosition={onUpdatePosition}
          onEditEntry={onEditEntry}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <WaitlistTable 
          entries={(entries || []).filter(entry => entry.status === 'pending')}
          onUpdateStatus={onUpdateStatus}
          onUpdatePosition={onUpdatePosition}
          onEditEntry={onEditEntry}
          showPositionControls={false}
        />
      </TabsContent>
      
      <TabsContent value="contacted">
        <WaitlistTable 
          entries={(entries || []).filter(entry => entry.status === 'contacted')}
          onUpdateStatus={onUpdateStatus}
          onUpdatePosition={onUpdatePosition}
          onEditEntry={onEditEntry}
          showPositionControls={false}
        />
      </TabsContent>
      
      <TabsContent value="approved">
        <WaitlistTable 
          entries={(entries || []).filter(entry => entry.status === 'approved')}
          onUpdateStatus={onUpdateStatus}
          onUpdatePosition={onUpdatePosition}
          onEditEntry={onEditEntry}
          showPositionControls={false}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WaitlistTabs;
