
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';

const ExerciseTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          <span>Exercise Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-lg font-medium mb-2">Exercise Management</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track and schedule exercise activities for all dogs.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/dogs")}
          >
            Manage Exercise <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Today's Exercise</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Exercise sessions today
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Active Dogs</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Dogs exercised today
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Hours</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Total exercise hours today
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseTab;
