
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, PlusCircle } from 'lucide-react';

interface TrainingTabProps {
  onRefresh?: () => void;
}

const TrainingTab: React.FC<TrainingTabProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTrainingSession = () => {
    toast({
      title: "Coming Soon",
      description: "Training session management will be available in the next update.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Training Management</CardTitle>
        <Button onClick={handleAddTrainingSession} size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Training Session
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <GraduationCap className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Training Feature Coming Soon</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Track and manage your dogs' training sessions, progress, and achievements.
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainingTab;
