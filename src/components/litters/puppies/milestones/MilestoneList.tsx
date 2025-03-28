import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Milestone, MilestoneOption } from './types';
import { milestoneOptions } from './milestoneData';

interface MilestoneListProps {
  milestones: Milestone[];
  birthDate?: string | Date | null;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ 
  milestones, 
  birthDate, 
  onDelete,
  isLoading = false
}) => {
  // If there's no milestones yet, show a message
  if (milestones.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No developmental milestones have been recorded yet.
      </div>
    );
  }

  // Sort by date, from earliest to latest
  const sortedMilestones = [...milestones].sort((a, b) => {
    const dateA = typeof a.milestone_date === 'string' ? new Date(a.milestone_date) : a.milestone_date;
    const dateB = typeof b.milestone_date === 'string' ? new Date(b.milestone_date) : b.milestone_date;
    return dateA.getTime() - dateB.getTime();
  });

  // Helper to get milestone option details
  const getMilestoneOption = (type: string): MilestoneOption | undefined => {
    return milestoneOptions.find(option => option.value === type);
  };

  // Helper to calculate puppy's age at milestone
  const calculateAge = (milestoneDate: string | Date): number | null => {
    if (!birthDate) return null;

    const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const milestoneDateObj = typeof milestoneDate === 'string' ? new Date(milestoneDate) : milestoneDate;

    // Return age in days
    return differenceInDays(milestoneDateObj, birthDateObj);
  };

  // Helper to determine if milestone was early, on time, or late
  const getMilestoneTimingBadge = (type: string, age: number | null) => {
    if (age === null) return null;

    const option = getMilestoneOption(type);
    if (!option) return null;

    // Check if the milestone occurred within expected range
    if (age <= option.typicalAgeRange.earliestDay) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Early</Badge>;
    } else if (age <= option.typicalAgeRange.averageDay) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">On Track</Badge>;
    } else if (age <= option.typicalAgeRange.latestDay) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Late</Badge>;
    } else {
      return <Badge variant="destructive">Delayed</Badge>;
    }
  };

  return (
    <div className="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead>Milestone</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Development</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMilestones.map((milestone) => {
            const option = getMilestoneOption(milestone.milestone_type);
            const age = calculateAge(milestone.milestone_date);
            
            return (
              <TableRow key={milestone.id}>
                <TableCell className="font-medium">{option?.label || milestone.milestone_type}</TableCell>
                <TableCell>
                  {typeof milestone.milestone_date === 'string' 
                    ? format(new Date(milestone.milestone_date), 'MMM d, yyyy')
                    : format(milestone.milestone_date, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{age !== null ? `${age} days` : '—'}</TableCell>
                <TableCell>
                  {option && age !== null 
                    ? getMilestoneTimingBadge(milestone.milestone_type, age)
                    : '—'
                  }
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{milestone.notes || '—'}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(milestone.id)}
                    disabled={isLoading}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MilestoneList;
