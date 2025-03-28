
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, CheckCircle2 } from 'lucide-react';
import { FacilityTask } from '@/types/facility';

interface TaskCardProps {
  task: FacilityTask;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  getBadgeColor: (frequency: string) => string;
  getFrequencyLabel: (frequency: string, customDays: number[] | null) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  getBadgeColor,
  getFrequencyLabel
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{task.name}</h3>
            <Badge className={`mt-2 ${getBadgeColor(task.frequency)}`}>
              {getFrequencyLabel(task.frequency, task.custom_days)}
            </Badge>
            {task.facility_areas && (
              <Badge variant="outline" className="ml-2 mt-2">
                {task.facility_areas.name}
              </Badge>
            )}
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {task.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete(task.id)}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Complete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task.id)}
        >
          <Edit className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          <Trash className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
