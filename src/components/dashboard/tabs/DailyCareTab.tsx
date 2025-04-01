
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const DailyCareTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-500" />
          <span>Daily Care Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-medium mb-2">Care Management Center</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage all aspects of daily care for dogs in your kennel.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/daily-care")}
          >
            Open Care Center <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Today's Logs</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Care activities logged today
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Completed</h4>
            <div className="text-2xl font-bold mb-1">0%</div>
            <p className="text-xs text-muted-foreground">
              Of daily tasks completed
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Pending</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Tasks remaining today
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCareTab;
