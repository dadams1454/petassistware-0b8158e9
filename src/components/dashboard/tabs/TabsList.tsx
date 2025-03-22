
import React, { useState } from 'react';
import { Tabs, TabsList as ShadTabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PottyBreaksTab from './PottyBreaksTab';
import ExerciseTab from './ExerciseTab';
import MedicationsTab from './MedicationsTab';
import GroomingTab from './GroomingTab';
import DailyCareTab from './DailyCareTab';
import { DogCareStatus } from '@/types/dailyCare';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock } from 'lucide-react';

interface TabsListProps {
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  dogStatuses?: DogCareStatus[] | null;
}

const TabsList: React.FC<TabsListProps> = ({ 
  isLoading = false, 
  onRefresh,
  isRefreshing = false,
  dogStatuses = null
}) => {
  const [activeTab, setActiveTab] = useState('daily-care');
  
  const handleRefreshDogs = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b bg-muted/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Tabs defaultValue="daily-care" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ShadTabsList className="w-full">
            <TabsTrigger value="daily-care">Daily Care</TabsTrigger>
            <TabsTrigger value="potty-breaks">Potty Breaks</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="grooming">Grooming</TabsTrigger>
          </ShadTabsList>
        </Tabs>
        
        {onRefresh && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-slate-500 flex items-center mt-2 sm:mt-0">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="whitespace-nowrap">Auto-refresh with dashboard</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This content refreshes automatically with the dashboard.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      
      <CardContent className="px-2 py-2 sm:p-6">
        <Tabs value={activeTab}>
          <TabsContent value="daily-care" className="mt-0">
            <DailyCareTab 
              onRefreshDogs={handleRefreshDogs}
              isRefreshing={isRefreshing}
            />
          </TabsContent>
          
          <TabsContent value="potty-breaks" className="mt-0">
            <PottyBreaksTab 
              onRefreshDogs={handleRefreshDogs}
            />
          </TabsContent>
          
          <TabsContent value="exercise" className="mt-0">
            <ExerciseTab 
              dogStatuses={dogStatuses}
              onRefreshDogs={handleRefreshDogs}
            />
          </TabsContent>
          
          <TabsContent value="medications" className="mt-0">
            <MedicationsTab 
              dogStatuses={dogStatuses}
              onRefreshDogs={handleRefreshDogs}
            />
          </TabsContent>
          
          <TabsContent value="grooming" className="mt-0">
            <GroomingTab 
              dogStatuses={dogStatuses}
              onRefreshDogs={handleRefreshDogs}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TabsList;
