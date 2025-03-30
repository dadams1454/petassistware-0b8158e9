
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SocializationRecord } from './types';
import { socializationCategories } from './socializationCategories';
import { socializationReactions } from './socializationReactions';

interface SocializationListProps {
  experiences: SocializationRecord[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const SocializationList: React.FC<SocializationListProps> = ({ 
  experiences, 
  onDelete,
  isLoading = false
}) => {
  // If there's no experiences yet, show a message
  if (experiences.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No socialization experiences have been recorded yet.
      </div>
    );
  }

  // Helper to get category name
  const getCategoryLabel = (categoryValue: string): string => {
    const category = socializationCategories.find(c => c.value === categoryValue);
    return category?.label || categoryValue;
  };

  // Helper to get reaction with appropriate styling
  const getReactionBadge = (reactionValue: string | null | undefined) => {
    if (!reactionValue) return null;
    
    const reaction = socializationReactions.find(r => r.value === reactionValue);
    if (!reaction) return reactionValue;
    
    // Color coding based on reaction type
    let badgeClasses = "";
    
    switch (reactionValue) {
      case 'curious':
      case 'excited':
      case 'playful':
        badgeClasses = "bg-green-100 text-green-800 hover:bg-green-200";
        break;
      case 'cautious':
      case 'hesitant':
        badgeClasses = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        break;
      case 'fearful':
      case 'avoidant':
        badgeClasses = "bg-red-100 text-red-800 hover:bg-red-200";
        break;
      default:
        badgeClasses = "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
    
    return (
      <Badge variant="outline" className={badgeClasses}>
        {reaction.label}
      </Badge>
    );
  };

  return (
    <div className="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Reaction</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((experience) => (
            <TableRow key={experience.id}>
              <TableCell>
                {typeof experience.experience_date === 'string' 
                  ? format(parseISO(experience.experience_date), 'MMM d, yyyy')
                  : format(experience.experience_date, 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{getCategoryLabel(experience.category)}</TableCell>
              <TableCell className="font-medium">{experience.experience}</TableCell>
              <TableCell>{getReactionBadge(experience.reaction)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{experience.notes || '—'}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(experience.id)}
                  disabled={isLoading}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SocializationList;
