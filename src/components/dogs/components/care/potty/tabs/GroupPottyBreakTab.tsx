
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';

interface GroupPottyBreakTabProps {
  dogs: DogCareStatus[];
  onOpenDialog: () => void;
  onGroupSelected: (dogIds: string[]) => void;
}

const GroupPottyBreakTab: React.FC<GroupPottyBreakTabProps> = ({
  dogs,
  onOpenDialog,
  onGroupSelected
}) => {
  const logQuickGroup = (dogIds: string[]) => {
    if (dogIds.length > 0) {
      onGroupSelected(dogIds);
    }
  };

  if (dogs.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No dogs found. Please add dogs to the system first.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Record potty break observations for multiple dogs at once. This is useful when you take
        several dogs out together and want to track their behavior.
      </p>
      
      {/* Card to add custom group */}
      <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors">
        <div className="flex flex-col items-center justify-center text-center p-4">
          <Users className="h-8 w-8 mb-2 text-muted-foreground" />
          <h3 className="font-medium mb-2">Custom Dog Group</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select specific dogs to record potty break observations
          </p>
          <Button 
            onClick={onOpenDialog}
            className="mt-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            Select Dogs & Add Notes
          </Button>
        </div>
      </Card>
      
      {/* Show quick group options if we have enough dogs */}
      {dogs.length >= 4 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Quick Groups</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer" 
              onClick={() => logQuickGroup(dogs.slice(0, 2).map(d => d.dog_id))}>
              <div className="text-center">
                <h4 className="font-medium">First Two Dogs</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {dogs.slice(0, 2).map(d => d.dog_name).join(', ')}
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  <FileText className="h-3 w-3 mr-1" />
                  Add Notes
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => logQuickGroup(dogs.map(d => d.dog_id))}>
              <div className="text-center">
                <h4 className="font-medium">All Dogs</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  All {dogs.length} dogs
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  <FileText className="h-3 w-3 mr-1" />
                  Add Notes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPottyBreakTab;
