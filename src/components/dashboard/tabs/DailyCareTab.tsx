
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import { useDailyCareData } from './hooks/useDailyCareData';
import { useGroupPottyBreak } from './hooks/useGroupPottyBreak';
import DailyCareToolbar from './components/DailyCareToolbar';
import DailyCareLoading from './components/DailyCareLoading';
import DogTimeTableView from './components/DogTimeTableView';
import DogGroupsView from './components/DogGroupsView';
import DogCardView from './components/DogCardView';
import { EmptyState } from '@/components/ui/standardized';
import { Card, CardContent } from '@/components/ui/card';
import { Dog } from 'lucide-react';

interface DailyCareTabProps {
  onRefreshDogs: () => void;
  isRefreshing?: boolean;
  currentDate?: Date;
}

const DailyCareTab: React.FC<DailyCareTabProps> = ({ 
  onRefreshDogs,
  isRefreshing = false,
  currentDate = new Date()
}) => {
  const [view, setView] = useState<string>('table'); // Default to table view
  const navigate = useNavigate();
  
  // Use our custom hook for data fetching
  const {
    dogs,
    dogStatuses,
    isLoading,
    isStatusesLoading,
    refetch,
    handleRefresh
  } = useDailyCareData(currentDate);

  // Use our group potty break hook
  const { handleGroupPottyBreak } = useGroupPottyBreak(refetch);
  
  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };
  
  const showLoading = isLoading || isRefreshing || isStatusesLoading;
  const noDogs = (!dogs || dogs.length === 0) && !showLoading;
  
  return (
    <div className="space-y-6">
      <DailyCareToolbar 
        view={view}
        setView={setView}
        onRefresh={handleRefresh}
        isLoading={showLoading}
      />
      
      {showLoading ? (
        <DailyCareLoading />
      ) : noDogs ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<Dog className="h-12 w-12 text-muted-foreground" />}
              title="No Dogs Found"
              description="Add dogs to your kennel to start tracking their daily care activities."
              action={{
                label: "Add Dogs",
                onClick: handleNavigateToDogs
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <TabsContent value={view} className="w-full">
          {view === 'table' && (
            <DogTimeTableView 
              dogStatuses={dogStatuses}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing || isStatusesLoading}
              currentDate={currentDate}
            />
          )}
          
          {view === 'groups' && (
            <DogGroupsView 
              dogStatuses={dogStatuses}
              onRefresh={handleRefresh}
              onGroupSelected={handleGroupPottyBreak}
            />
          )}
          
          {view === 'cards' && (
            <DogCardView 
              dogs={dogs}
              navigateToDogs={handleNavigateToDogs}
            />
          )}
        </TabsContent>
      )}
    </div>
  );
};

export default DailyCareTab;
