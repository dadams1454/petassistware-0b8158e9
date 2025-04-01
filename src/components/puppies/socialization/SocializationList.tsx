
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { SocializationExperience } from '@/types/puppyTracking';

interface SocializationListProps {
  experiences: SocializationExperience[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    'people': 'People Interactions',
    'animals': 'Animal Interactions',
    'environments': 'New Environments',
    'sounds': 'Sound Exposures',
    'handling': 'Physical Handling',
    'objects': 'Novel Objects',
    'travel': 'Travel Experiences'
  };
  
  return categories[categoryId] || categoryId;
};

const getReactionBadge = (reaction?: string) => {
  if (!reaction) return null;
  
  const variants: Record<string, string> = {
    'very_positive': 'bg-green-100 text-green-800',
    'positive': 'bg-green-50 text-green-600',
    'neutral': 'bg-gray-100 text-gray-800',
    'cautious': 'bg-yellow-100 text-yellow-800',
    'fearful': 'bg-orange-100 text-orange-800',
    'very_fearful': 'bg-red-100 text-red-800'
  };
  
  const labels: Record<string, string> = {
    'very_positive': 'Very Positive',
    'positive': 'Positive',
    'neutral': 'Neutral',
    'cautious': 'Cautious',
    'fearful': 'Fearful',
    'very_fearful': 'Very Fearful'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[reaction] || 'bg-gray-100'}`}>
      {labels[reaction] || reaction}
    </span>
  );
};

const SocializationList: React.FC<SocializationListProps> = ({
  experiences,
  isLoading,
  onDelete
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading socialization records...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-muted-foreground">No socialization experiences recorded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Record new experiences to track your puppy's socialization progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Socialization Experiences</CardTitle>
        <CardDescription>
          Track your puppy's exposure to various experiences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Reaction</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  {format(new Date(experience.experience_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getCategoryName(experience.category_id)}
                  </Badge>
                </TableCell>
                <TableCell>{experience.experience}</TableCell>
                <TableCell>
                  {getReactionBadge(experience.reaction)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(experience.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SocializationList;
