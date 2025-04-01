
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Baby, ArrowRight } from 'lucide-react';

const PuppiesTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-cyan-500" />
          <span>Puppy Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-cyan-50 dark:bg-cyan-900/20 rounded-md border border-cyan-200 dark:border-cyan-800">
          <h3 className="text-lg font-medium mb-2">Puppy Tracking</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Monitor growth, development, and care for puppies.
          </p>
          <Button
            variant="outline"
            className="bg-white dark:bg-background"
            onClick={() => navigate("/litters")}
          >
            Manage Puppies <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Active Litters</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Currently active litters
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Total Puppies</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Puppies in active litters
            </p>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="text-sm font-medium mb-2">Available</h4>
            <div className="text-2xl font-bold mb-1">0</div>
            <p className="text-xs text-muted-foreground">
              Puppies available for sale
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppiesTab;
