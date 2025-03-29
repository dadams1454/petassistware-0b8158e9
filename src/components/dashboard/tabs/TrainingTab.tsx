
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, PlusCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import { useNavigate } from 'react-router-dom';

interface TrainingTabProps {
  onRefresh: () => void;
}

const TrainingTab: React.FC<TrainingTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
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
      <CardContent>
        <EmptyState
          icon={<GraduationCap className="h-12 w-12 text-muted-foreground" />}
          title="Training Feature Coming Soon"
          description="Track and manage your dogs' training sessions, progress, and achievements."
          action={{
            label: "Learn More",
            onClick: () => toast({
              title: "Training Module",
              description: "The training module will be available in the next update."
            })
          }}
        />
      </CardContent>
    </Card>
  );
};

export default TrainingTab;
