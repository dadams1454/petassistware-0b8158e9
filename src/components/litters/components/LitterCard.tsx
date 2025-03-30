
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Litter } from '@/types/litter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Archive, Trash, Edit, RotateCcw } from 'lucide-react';

export interface LitterCardProps {
  litter: Litter;
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter?: (litter: Litter) => void;
}

const LitterCard: React.FC<LitterCardProps> = ({ 
  litter, 
  onEditLitter, 
  onDeleteLitter, 
  onArchiveLitter, 
  onUnarchiveLitter 
}) => {
  const isArchived = litter.status === 'archived';
  const litterName = litter.litter_name || `${litter.dam?.name || 'Unknown'} × ${litter.sire?.name || 'Unknown'}`;
  
  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };
  
  const birthDate = formatDate(litter.birth_date);
  const expectedGoHome = formatDate(litter.expected_go_home_date);
  
  // Puppy counts
  const maleCount = litter.male_count || 0;
  const femaleCount = litter.female_count || 0;
  const totalPuppies = litter.puppy_count || (maleCount + femaleCount) || (litter.puppies?.length || 0);
  
  return (
    <Card className={isArchived ? "opacity-70" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{litterName}</CardTitle>
            <CardDescription>
              Born: {birthDate}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditLitter(litter)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Litter
              </DropdownMenuItem>
              
              {isArchived ? (
                onUnarchiveLitter && (
                  <DropdownMenuItem onClick={() => onUnarchiveLitter(litter)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Unarchive Litter
                  </DropdownMenuItem>
                )
              ) : (
                <DropdownMenuItem onClick={() => onArchiveLitter(litter)}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Litter
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDeleteLitter(litter)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Litter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-muted-foreground">Dam:</p>
            <p>{litter.dam?.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sire:</p>
            <p>{litter.sire?.name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Go Home:</p>
            <p>{expectedGoHome}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Puppies:</p>
            <p>{totalPuppies}</p>
          </div>
        </div>
        
        {totalPuppies > 0 && (
          <div className="flex gap-3 text-xs mt-2">
            {maleCount > 0 && (
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {maleCount} Male{maleCount !== 1 && 's'}
              </div>
            )}
            {femaleCount > 0 && (
              <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                {femaleCount} Female{femaleCount !== 1 && 's'}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onEditLitter(litter)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LitterCard;
