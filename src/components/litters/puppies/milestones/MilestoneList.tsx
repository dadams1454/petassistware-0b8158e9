
import React from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineBody } from '@/components/ui/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Milestone } from './types';
import { getMilestoneInfo, calculateMilestoneStatus } from './milestoneData';
import { Trash2 } from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
  onDelete: (id: string) => void;
  birthDate?: string | Date | null;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ 
  milestones, 
  onDelete,
  birthDate
}) => {
  if (milestones.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No milestones recorded yet
      </div>
    );
  }

  // Sort by date
  const sortedMilestones = [...milestones].sort((a, b) => {
    const dateA = typeof a.milestone_date === 'string' ? new Date(a.milestone_date) : a.milestone_date;
    const dateB = typeof b.milestone_date === 'string' ? new Date(b.milestone_date) : b.milestone_date;
    return dateA.getTime() - dateB.getTime();
  });

  const birthDateObj = birthDate 
    ? (typeof birthDate === 'string' ? new Date(birthDate) : birthDate) 
    : null;

  return (
    <Timeline>
      {sortedMilestones.map((milestone, index) => {
        const milestoneInfo = getMilestoneInfo(milestone.milestone_type);
        const milestoneDate = typeof milestone.milestone_date === 'string' 
          ? new Date(milestone.milestone_date) 
          : milestone.milestone_date;
        
        // Calculate age in days when milestone was achieved
        let ageInDays: number | null = null;
        if (birthDateObj) {
          ageInDays = differenceInDays(milestoneDate, birthDateObj);
        }
        
        // Determine status badge
        const status = calculateMilestoneStatus(
          birthDateObj,
          milestone.milestone_type,
          milestoneDate
        );
        
        // Set badge color based on status
        let badgeVariant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' = 'default';
        
        switch (status) {
          case 'early':
            badgeVariant = 'success';
            break;
          case 'on-time':
            badgeVariant = 'default';
            break;
          case 'late':
            badgeVariant = 'warning';
            break;
          default:
            badgeVariant = 'outline';
        }
        
        return (
          <TimelineItem key={milestone.id}>
            {index < sortedMilestones.length - 1 && <TimelineConnector />}
            <TimelineHeader>
              <TimelineIcon className="bg-primary" />
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{milestoneInfo.label}</span>
                  <div className="flex items-center gap-2">
                    {status !== 'unknown' && (
                      <Badge variant={badgeVariant}>
                        {status === 'early' && 'Early'}
                        {status === 'on-time' && 'On Time'}
                        {status === 'late' && 'Late'}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(milestone.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(milestoneDate, 'MMM d, yyyy')}
                  {ageInDays !== null && (
                    <> • Day {ageInDays}</>
                  )}
                </span>
              </div>
            </TimelineHeader>
            {milestone.notes && (
              <TimelineBody>
                <p className="text-sm text-muted-foreground">{milestone.notes}</p>
              </TimelineBody>
            )}
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default MilestoneList;
