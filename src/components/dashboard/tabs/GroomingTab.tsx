
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scissors, ArrowRight } from 'lucide-react';

const GroomingTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-pink-500" />
          <span>Grooming Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-pink-50 dark:bg-pink-900/20 rounded-md border border-pink-200 dark:border-pink-800">
          <h3 className="text-lg font-medium mb-2">Grooming Schedule</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track and schedule grooming activities for all dogs.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/dogs")}
          >
            Manage Grooming <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Today's Grooming</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Grooming appointments today
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Upcoming</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Scheduled in the next 7 days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroomingTab;
