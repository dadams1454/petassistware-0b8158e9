
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DogCareStatus } from '@/types/dailyCare';
import { Dog, Clock } from 'lucide-react';
import { DailyCareProvider } from '@/contexts/dailyCare';
import DogTimeTable from '@/components/dogs/components/care/table/DogTimeTable';
import { useRefresh } from '@/contexts/RefreshContext';

interface DogLetOutTabProps {
  onRefreshDogs: () => void;
  dogStatuses?: DogCareStatus[];
}

const DogLetOutTab: React.FC<DogLetOutTabProps> = ({ 
  onRefreshDogs,
  dogStatuses = []
}) => {
  const navigate = useNavigate();
  const { currentDate } = useRefresh();

  return (
    <DailyCareProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dog Let Out Tracker</h2>
            <p className="text-muted-foreground">
              Schedule and track when dogs go outside
            </p>
          </div>
        </div>
        
        {dogStatuses && dogStatuses.length > 0 ? (
          <DogTimeTable 
            dogsStatus={dogStatuses} 
            onRefresh={onRefreshDogs}
            isRefreshing={false}
            currentDate={currentDate}
            initialCategory="dogletout"
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Dog className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Dogs Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Add dogs to your kennel to start tracking when they are let outside.
              </p>
              <Button onClick={() => navigate("/dogs")}>Go to Dogs</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DailyCareProvider>
  );
};

export default DogLetOutTab;
