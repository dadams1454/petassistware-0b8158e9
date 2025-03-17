
import React from 'react';
import { useDailyCare } from '@/contexts/dailyCare';
import PottyBreakManager from '@/components/dogs/components/care/potty/PottyBreakManager';
import PottyBreakReminderCard from '@/components/dogs/components/care/potty/PottyBreakReminderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PottyBreaksTabProps {
  onRefreshDogs: () => void;
}

const PottyBreaksTab: React.FC<PottyBreaksTabProps> = ({ onRefreshDogs }) => {
  const { dogStatuses, loading } = useDailyCare();
  
  // Handler for potty break reminder button
  const handlePottyBreakButtonClick = () => {
    // Open the potty break dialog or scroll to the potty break section
    const pottyBreakSection = document.getElementById('potty-break-manager');
    if (pottyBreakSection) {
      pottyBreakSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Reminder Card */}
      {dogStatuses && dogStatuses.length > 0 && (
        <PottyBreakReminderCard 
          dogs={dogStatuses}
          onLogPottyBreak={handlePottyBreakButtonClick}
        />
      )}
      
      {/* Potty Break Manager */}
      {dogStatuses && dogStatuses.length > 0 ? (
        <div id="potty-break-manager">
          <PottyBreakManager 
            dogs={dogStatuses}
            onRefresh={onRefreshDogs}
          />
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">No dogs found. Please refresh or add dogs to the system.</p>
            <Button onClick={onRefreshDogs}>Refresh Dogs</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PottyBreaksTab;
