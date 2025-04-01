
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

const KennelTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-amber-500" />
          <span>Kennel Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
          <h3 className="text-lg font-medium mb-2">Kennel Occupancy</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage kennel assignments, occupancy, and cleaning schedules.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/facility/kennels")}
          >
            Manage Kennels <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Total Kennels</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Kennel units available
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Occupancy</h4>
            <div className="text-2xl font-bold mb-1">0%</div>
            <p className="text-xs text-muted-foreground">
              Kennel occupancy rate
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Maintenance</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Kennels needing maintenance
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KennelTab;
