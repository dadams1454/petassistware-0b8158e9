
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';

interface FacilityTabProps {
  onRefreshData?: () => void;
  dogStatuses?: DogCareStatus[];
}

const FacilityTab: React.FC<FacilityTabProps> = ({ 
  onRefreshData,
  dogStatuses = []
}) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-slate-500" />
          <span>Facility Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-slate-50 dark:bg-slate-900/20 rounded-md border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-medium mb-2">Facility Manager</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage kennels, equipment, inventory, and maintenance tasks.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/facility")}
          >
            Open Facility Manager <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Maintenance</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Pending maintenance tasks
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Daily Tasks</h4>
            <div className="text-2xl font-bold mb-1">0%</div>
            <p className="text-xs text-muted-foreground">
              Daily tasks completed
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Inventory</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Low stock items
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilityTab;
