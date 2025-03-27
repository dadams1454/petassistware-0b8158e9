
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlarmClock, 
  Clock, 
  Coffee, 
  FilePen, 
  Info, 
  MoreVertical, 
  Utensils 
} from 'lucide-react';
import { FeedingSchedule } from '@/types/feedingSchedule';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FeedingSchedulesListProps {
  schedules: FeedingSchedule[];
  onRefresh: () => void;
  onLogFeeding: (schedule: FeedingSchedule) => void;
  onEditSchedule?: (schedule: FeedingSchedule) => void;
}

const FeedingSchedulesList: React.FC<FeedingSchedulesListProps> = ({
  schedules,
  onRefresh,
  onLogFeeding,
  onEditSchedule
}) => {
  if (schedules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
          <Coffee className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">No feeding schedules found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Create a feeding schedule to start tracking meals for this dog.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Feeding Schedules</CardTitle>
        <CardDescription>Regular feeding schedules for this dog</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="border rounded-lg p-4 relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-lg">{schedule.food_type}</h3>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onLogFeeding(schedule)}>
                        <Coffee className="h-4 w-4 mr-2" />
                        Log Feeding
                      </DropdownMenuItem>
                      {onEditSchedule && (
                        <DropdownMenuItem onClick={() => onEditSchedule(schedule)}>
                          <FilePen className="h-4 w-4 mr-2" />
                          Edit Schedule
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Badge variant="outline">
                      {schedule.amount} {schedule.unit}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center mt-2">
                    <div className="flex items-center mr-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Scheduled Times:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {schedule.schedule_time.map((time) => (
                        <Badge key={time} variant="secondary">
                          <AlarmClock className="h-3 w-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {schedule.special_instructions && (
                    <>
                      <Separator className="my-2" />
                      <div className="flex items-start mt-2">
                        <Info className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {schedule.special_instructions}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="absolute right-3 bottom-3">
                  <Button
                    size="sm"
                    onClick={() => onLogFeeding(schedule)}
                  >
                    <Coffee className="h-4 w-4 mr-1" />
                    Log Feeding
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FeedingSchedulesList;
