
import React, { useState, useEffect } from 'react';
import { Grid, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CareLogForm from './CareLogForm';
import CareLogsList from './CareLogsList';

interface DailyCareLogsProps {
  dogId: string;
}

const DailyCareLogs: React.FC<DailyCareLogsProps> = ({ dogId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('logs');

  const handleLogAdded = () => {
    // Switch to logs tab after adding a new log
    setActiveTab('logs');
  };

  const handleLogDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefreshClick = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Care</h2>
        <Button variant="ghost" size="sm" onClick={handleRefreshClick}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">
            <Grid className="h-4 w-4 mr-2" />
            Care Logs
          </TabsTrigger>
          <TabsTrigger value="add">
            Add New Log
          </TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="mt-4">
          <CareLogsList 
            dogId={dogId} 
            key={`logs-${refreshTrigger}`} 
            onLogDeleted={handleLogDeleted}
          />
        </TabsContent>
        <TabsContent value="add" className="mt-4">
          <CareLogForm dogId={dogId} onSuccess={handleLogAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyCareLogs;
