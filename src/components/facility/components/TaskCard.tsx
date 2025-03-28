
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MoreHorizontal, ClipboardCheck } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
    <Card key={task.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {task.name}
            </CardTitle>
            <Badge className={`font-normal ${getBadgeColor(task.frequency)}`}>
              {getFrequencyLabel(task.frequency, task.custom_days)}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Task actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onComplete(task.id)}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Complete Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-2">
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          
          {task.facility_areas && (
            <div className="text-sm">
              <span className="font-medium">Area:</span> {task.facility_areas.name}
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => onComplete(task.id)}
            >
              <ClipboardCheck className="h-4 w-4" />
              Complete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
