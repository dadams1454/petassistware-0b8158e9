
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Users } from 'lucide-react';

interface DailyCareToolbarProps {
  view: string;
  setView: (view: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const DailyCareToolbar: React.FC<DailyCareToolbarProps> = ({
  view,
  setView,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Daily Care</h2>
      <div className="flex items-center space-x-4">
        <Tabs value={view} onValueChange={setView} className="mr-2">
          <TabsList>
            <TabsTrigger value="table">Time Table</TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default DailyCareToolbar;
