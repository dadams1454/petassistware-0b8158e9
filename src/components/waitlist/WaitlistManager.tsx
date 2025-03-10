
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWaitlistEntries } from './hooks/useWaitlistEntries';
import WaitlistEntryDialog from './WaitlistEntryDialog';
import WaitlistTabs from './WaitlistTabs';
import { WaitlistManagerProps } from './types';

const WaitlistManager: React.FC<WaitlistManagerProps> = ({ litterId, litterName }) => {
  const {
    waitlistEntries,
    isLoading,
    selectedEntry,
    isDialogOpen,
    handleUpdateStatus,
    handleUpdatePosition,
    handleEditEntry,
    handleAddCustomer,
    handleDialogClose,
    handleSuccess
  } = useWaitlistEntries(litterId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Waitlist for {litterName}</CardTitle>
        <Button onClick={handleAddCustomer}>Add Customer to Waitlist</Button>
      </CardHeader>
      <CardContent>
        <WaitlistTabs
          entries={waitlistEntries || []}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePosition={handleUpdatePosition}
          onEditEntry={handleEditEntry}
        />
      </CardContent>
      
      <WaitlistEntryDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        litterId={litterId}
        entry={selectedEntry}
        onSuccess={handleSuccess}
      />
    </Card>
  );
};

export default WaitlistManager;
