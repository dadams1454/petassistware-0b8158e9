
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [errorRetries, setErrorRetries] = useState(0);
  const navigate = useNavigate();
  
  // Use our custom hook for data fetching
  const {
    dogs,
    dogStatuses,
    isLoading,
    isStatusesLoading,
    dogsError,
    statusesError,
    handleRefresh
  } = useDailyCareData(currentDate);

  // Use our group potty break hook
  const { handleGroupPottyBreak } = useGroupPottyBreak(handleRefresh);
  
  // Auto-retry on error (max 3 times)
  useEffect(() => {
    if ((dogsError || statusesError) && errorRetries < 3) {
      const timer = setTimeout(() => {
        console.log(`Automatic retry ${errorRetries + 1}/3 due to error`);
        handleRefresh(false);
        setErrorRetries(prev => prev + 1);
      }, 3000); // Wait 3 seconds before retry
      
      return () => clearTimeout(timer);
    }
  }, [dogsError, statusesError, errorRetries, handleRefresh]);
  
  const handleNavigateToDogs = () => {
    navigate('/dogs');
  };
  
  const showLoading = isLoading || isRefreshing || isStatusesLoading;
  const hasError = (dogsError || statusesError) && errorRetries >= 3;
  const noDogs = (!dogs || dogs.length === 0) && !showLoading && !hasError;
  
  // If we have errors after retries, show error state
  if (hasError) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>There was a problem loading the care data. This could be due to a network issue or a problem with the database.</p>
          <Button onClick={() => {
            setErrorRetries(0);
            handleRefresh(true);
          }}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
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
